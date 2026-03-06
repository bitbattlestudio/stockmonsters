// lib/sigils/pixellab.ts
// PixelLab MCP Integration
// Note: In Claude Code, MCP tools are accessed directly via JSON-RPC
// This file provides helper functions for the generation workflow

const PIXELLAB_MCP_URL = 'https://api.pixellab.ai/mcp';

export interface PixelLabResult {
  object_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  download_url?: string;
  image_data?: string; // base64
  error?: string;
}

export interface CreateMapObjectParams {
  description: string;
  width?: number;
  height?: number;
  view?: string;
  outline?: string;
  shading?: string;
  detail?: string;
}

/**
 * Create a map object via PixelLab MCP (for use in API routes)
 * Requires PIXELLAB_API_KEY environment variable
 */
export async function createMapObject(
  params: CreateMapObjectParams
): Promise<{ object_id: string }> {
  const apiKey = process.env.PIXELLAB_API_KEY;
  if (!apiKey) {
    throw new Error('PIXELLAB_API_KEY environment variable not set');
  }

  const response = await fetch(PIXELLAB_MCP_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'create_map_object',
        arguments: {
          description: params.description,
          width: params.width || 64,
          height: params.height || 64,
          view: params.view || 'high top-down',
          outline: params.outline || 'single color outline',
          shading: params.shading || 'medium shading',
          detail: params.detail || 'medium detail',
        },
      },
      id: Date.now(),
    }),
  });

  const data = await response.text();

  // Parse SSE response
  const lines = data.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const json = JSON.parse(line.slice(6));
      if (json.result?.content?.[0]?.text) {
        // Extract object_id from text
        const match = json.result.content[0].text.match(
          /Object ID[:\s]*`?([a-f0-9-]+)`?/i
        );
        if (match) {
          return { object_id: match[1] };
        }
      }
    }
  }

  throw new Error('Failed to parse PixelLab response');
}

/**
 * Get map object status via PixelLab MCP
 */
export async function getMapObject(objectId: string): Promise<PixelLabResult> {
  const apiKey = process.env.PIXELLAB_API_KEY;
  if (!apiKey) {
    throw new Error('PIXELLAB_API_KEY environment variable not set');
  }

  const response = await fetch(PIXELLAB_MCP_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: 'get_map_object',
        arguments: {
          object_id: objectId,
        },
      },
      id: Date.now(),
    }),
  });

  const data = await response.text();

  // Parse SSE response
  const lines = data.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const json = JSON.parse(line.slice(6));
      if (json.result?.content) {
        const content = json.result.content;

        // Check for image data
        const imageContent = content.find(
          (c: { type: string }) => c.type === 'image'
        );
        const textContent = content.find(
          (c: { type: string }) => c.type === 'text'
        );

        if (imageContent) {
          // Extract download URL from text
          const urlMatch = textContent?.text?.match(
            /URL:\s*(https:\/\/[^\s\n]+)/
          );

          return {
            object_id: objectId,
            status: 'completed',
            download_url: urlMatch
              ? urlMatch[1]
              : `https://api.pixellab.ai/mcp/map-objects/${objectId}/download`,
            image_data: imageContent.data,
          };
        }

        // Check if still processing
        if (textContent?.text?.includes('Processing')) {
          return {
            object_id: objectId,
            status: 'processing',
          };
        }

        // Check for error
        if (json.result.isError) {
          return {
            object_id: objectId,
            status: 'failed',
            error: textContent?.text || 'Unknown error',
          };
        }
      }
    }
  }

  return {
    object_id: objectId,
    status: 'pending',
  };
}

/**
 * Generate a sigil and wait for completion
 */
export async function generateWithPixelLab(prompt: string): Promise<string> {
  // Start generation
  const result = await createMapObject({
    description: prompt,
    width: 64,
    height: 64,
    view: 'high top-down',
    outline: 'single color outline',
    shading: 'medium shading',
    detail: 'medium detail',
  });

  const objectId = result.object_id;
  console.log(`Started generation: ${objectId}`);

  // Poll for completion (typically 30-90 seconds)
  let status: PixelLabResult;
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes with 5s intervals

  do {
    await sleep(5000); // Wait 5 seconds between checks
    status = await getMapObject(objectId);
    attempts++;
    console.log(`Status: ${status.status} (attempt ${attempts}/${maxAttempts})`);
  } while (
    (status.status === 'pending' || status.status === 'processing') &&
    attempts < maxAttempts
  );

  if (status.status === 'completed' && status.download_url) {
    return status.download_url;
  }

  throw new Error(`Generation failed: ${status.error || 'timeout'}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get the download URL for a completed object
 */
export function getDownloadUrl(objectId: string): string {
  return `https://api.pixellab.ai/mcp/map-objects/${objectId}/download`;
}
