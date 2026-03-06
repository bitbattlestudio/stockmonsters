# SIGILS Sprite Generation Guide
## Automated Asset Pipeline for Claude Code

---

## Overview

This document provides explicit instructions for Claude Code to generate all 84 sprite frames needed for Sigils using AI image generation. The goal is production-quality pixel art that matches the Pokemon GBA aesthetic.

---

## Option 1: PixelLab.ai (Recommended)

### Setup

```bash
# Install the PixelLab SDK (if available) or use REST API
npm install pixellab-sdk  # hypothetical

# Or use fetch directly
# API Base: https://api.pixellab.ai/v1
```

### API Configuration

```typescript
// lib/sprites/pixellab-client.ts

const PIXELLAB_API_KEY = process.env.PIXELLAB_API_KEY;
const PIXELLAB_BASE_URL = 'https://api.pixellab.ai/v1';

interface PixelLabRequest {
  prompt: string;
  negative_prompt?: string;
  width: number;
  height: number;
  style?: string;
  num_frames?: number;
  animation_type?: 'idle' | 'walk' | 'attack';
  seed?: number;
  reference_image?: string;
}

interface PixelLabResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  images: string[];  // Base64 encoded PNGs
  sprite_sheet?: string;  // Combined sprite sheet
}

export async function generateSprite(request: PixelLabRequest): Promise<PixelLabResponse> {
  const response = await fetch(`${PIXELLAB_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PIXELLAB_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...request,
      output_format: 'png',
      background: 'transparent',
    }),
  });

  if (!response.ok) {
    throw new Error(`PixelLab API error: ${response.status}`);
  }

  return response.json();
}
```

### Master Prompt Template

Use this exact template for consistency across all sprites:

```
BASE PROMPT TEMPLATE:
"64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style, {CREATURE_DESCRIPTION}, {EVOLUTION_DETAILS}, idle animation pose, transparent background, clean pixel edges, limited color palette, cute but detailed, side view facing right"

NEGATIVE PROMPT (always include):
"blurry, anti-aliased, smooth gradients, realistic, 3D, complex background, too many colors, messy pixels, asymmetrical"
```

---

## Creature Prompts by Category

### 1. Politics - Eagle/Phoenix Creature

```typescript
const POLITICS_PROMPTS = {
  evolution1: {
    name: 'Pollster',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style, 
      small cute eagle chick creature, round fluffy body, tiny wings folded,
      big curious eyes, small yellow beak, downy gray-blue feathers,
      standing pose with slight head tilt, idle animation,
      transparent background, clean pixel edges, limited color palette`,
    colors: ['#4A5568', '#718096', '#A0AEC0', '#E2E8F0'],  // Gray-blue tones
  },
  evolution2: {
    name: 'Caucus',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      medium eagle creature, proud stance, wings partially spread,
      sharp focused eyes, curved beak, blue-gray feathers with white chest,
      small badge or emblem on chest, dignified pose,
      idle animation with subtle wing movement,
      transparent background, clean pixel edges`,
    colors: ['#2B6CB0', '#4299E1', '#90CDF4', '#EBF8FF'],  // Blue tones
  },
  evolution3: {
    name: 'Senator',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      majestic bald eagle creature, fully spread impressive wings,
      golden crown on head, piercing noble eyes, powerful curved beak,
      red white and blue patriotic color scheme, golden talons,
      regal commanding presence, glowing aura effect,
      idle animation with majestic wing beats,
      transparent background, clean pixel edges`,
    colors: ['#9B2C2C', '#E53E3E', '#F6E05E', '#FFFFFF'],  // Red/gold/white
  },
};
```

### 2. Crypto - Crystal Entity Creature

```typescript
const CRYPTO_PROMPTS = {
  evolution1: {
    name: 'Hashling',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      small cute crystal slime creature, blob-like body made of translucent crystal,
      one large eye in center, tiny sparkles around it,
      orange and gold color scheme like Bitcoin,
      jiggly bouncy idle animation,
      transparent background, clean pixel edges, glowing core`,
    colors: ['#C05621', '#DD6B20', '#ED8936', '#FEEBC8'],  // Orange/gold
  },
  evolution2: {
    name: 'Blockbit',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      medium crystalline creature, geometric body made of connected blocks,
      multiple small eyes or nodes, hexagonal patterns,
      orange crystal formations growing from body,
      floating cube particles around it,
      idle animation with rotating/pulsing crystals,
      transparent background, clean pixel edges`,
    colors: ['#B7791F', '#D69E2E', '#ECC94B', '#FAF089'],  // Gold tones
  },
  evolution3: {
    name: 'Chainlord',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      large majestic crystal dragon creature, body made of interconnected
      geometric crystal formations, multiple glowing nodes,
      golden crown of crystals, radiating light energy,
      chain-link patterns in design, floating crystal shards orbit around it,
      powerful commanding presence with ethereal glow,
      idle animation with pulsing energy and orbiting crystals,
      transparent background, clean pixel edges`,
    colors: ['#744210', '#975A16', '#D69E2E', '#FFFAF0'],  // Deep gold
  },
};
```

### 3. Sports - Swift Fox Creature

```typescript
const SPORTS_PROMPTS = {
  evolution1: {
    name: 'Rookie',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      small cute fox pup creature, fluffy orange fur, big eager eyes,
      small paws in playful stance, fluffy tail,
      wearing tiny sweatband on head,
      energetic bouncy idle animation,
      transparent background, clean pixel edges`,
    colors: ['#C53030', '#E53E3E', '#FC8181', '#FFF5F5'],  // Red tones
  },
  evolution2: {
    name: 'Varsity',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      athletic fox creature, sleek muscular build, confident stance,
      wearing jersey number, speed lines effect around it,
      focused determined eyes, aerodynamic ears,
      dynamic running-ready pose,
      idle animation with anticipation bouncing,
      transparent background, clean pixel edges`,
    colors: ['#9B2C2C', '#C53030', '#F6E05E', '#FFFAF0'],  // Red/yellow team colors
  },
  evolution3: {
    name: 'MVP',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      champion fox creature, powerful athletic build,
      golden star badge on chest, championship trophy nearby,
      glowing speed aura, confident winning smile,
      muscular but sleek, motion blur speed lines,
      victory pose with raised paw,
      idle animation with triumphant energy,
      transparent background, clean pixel edges`,
    colors: ['#744210', '#D69E2E', '#F6E05E', '#FFFFF0'],  // Gold champion colors
  },
};
```

### 4. Macro - Vault Turtle Creature

```typescript
const MACRO_PROMPTS = {
  evolution1: {
    name: 'Yield',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      small cute turtle creature, shell has single coin embedded in it,
      green and gold color scheme, curious beady eyes,
      tiny legs, carrying small coin on back,
      slow gentle idle animation,
      transparent background, clean pixel edges`,
    colors: ['#276749', '#38A169', '#68D391', '#F0FFF4'],  // Green money
  },
  evolution2: {
    name: 'Dividend',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      medium turtle creature, shell decorated with stack of coins pattern,
      gold trim around shell edges, wise patient eyes,
      small vault door design on shell, sturdy legs,
      stable grounded pose,
      idle animation with subtle shell gleam,
      transparent background, clean pixel edges`,
    colors: ['#22543D', '#276749', '#48BB78', '#C6F6D5'],  // Deep green
  },
  evolution3: {
    name: 'Reserve',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      large majestic turtle creature, shell is ornate golden vault,
      treasure overflowing from shell, gems and gold coins,
      wise ancient eyes, crown of gold coins on head,
      massive sturdy legs, bank vault design elements,
      commanding wealthy presence,
      idle animation with coins sparkling,
      transparent background, clean pixel edges`,
    colors: ['#744210', '#B7791F', '#ECC94B', '#FFFFF0'],  // Gold vault
  },
};
```

### 5. Tech - Robot Cube Creature

```typescript
const TECH_PROMPTS = {
  evolution1: {
    name: 'Byte',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      small cute robot cube creature, simple boxy body,
      single screen face with pixel eyes, tiny antenna,
      silver and blue color scheme, small arm stubs,
      floating slightly above ground,
      idle animation with blinking screen face,
      transparent background, clean pixel edges`,
    colors: ['#4A5568', '#718096', '#A0AEC0', '#EDF2F7'],  // Silver/gray
  },
  evolution2: {
    name: 'Megabyte',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      medium robot creature, more complex geometric body,
      screen face with more detailed expression, multiple antennae,
      articulated arms with tool attachments,
      glowing circuit patterns on body,
      hovering with small thruster jets,
      idle animation with scanning movements,
      transparent background, clean pixel edges`,
    colors: ['#2B6CB0', '#4299E1', '#90CDF4', '#EBF8FF'],  // Tech blue
  },
  evolution3: {
    name: 'Quantum',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      advanced robot creature, sleek futuristic design,
      holographic display face, multiple floating components,
      quantum energy core visible in chest, energy wings,
      data streams flowing around it, glowing eyes,
      powerful technological presence,
      idle animation with holographic effects and floating parts,
      transparent background, clean pixel edges`,
    colors: ['#553C9A', '#805AD5', '#B794F4', '#FAF5FF'],  // Purple tech
  },
};
```

### 6. Space - Cosmic Moth Creature

```typescript
const SPACE_PROMPTS = {
  evolution1: {
    name: 'Orbit',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      small cute moth creature, fuzzy round body,
      small wings with single star pattern, big curious eyes,
      feathery antennae, soft purple and blue colors,
      gentle floating idle animation,
      tiny sparkle dust particles,
      transparent background, clean pixel edges`,
    colors: ['#2D3748', '#4A5568', '#805AD5', '#E9D8FD'],  // Space purple
  },
  evolution2: {
    name: 'Nova',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      medium cosmic moth creature, larger elegant wings,
      constellation patterns on wings, glowing antennae,
      ethereal flowing body, star dust trail,
      multiple eyes like stars, crescent moon markings,
      graceful floating pose,
      idle animation with twinkling wing patterns,
      transparent background, clean pixel edges`,
    colors: ['#1A365D', '#2B6CB0', '#4299E1', '#BEE3F8'],  // Deep space blue
  },
  evolution3: {
    name: 'Cosmos',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      majestic celestial moth creature, massive galaxy-patterned wings,
      nebula swirls in wing patterns, crown of stars,
      multiple ethereal eyes, trailing cosmic dust,
      body contains visible stars and galaxies,
      powerful cosmic presence, rings like Saturn around it,
      idle animation with swirling galaxy effects,
      transparent background, clean pixel edges`,
    colors: ['#1A202C', '#2D3748', '#6B46C1', '#FAF5FF'],  // Cosmic
  },
};
```

### 7. Geo - Wise Owl Creature

```typescript
const GEO_PROMPTS = {
  evolution1: {
    name: 'Scout',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      small cute owl chick creature, round fluffy body,
      big wide curious eyes, tiny ear tufts,
      brown and cream feathers, small wings at sides,
      sitting pose with head tilt,
      idle animation with blinking and head turning,
      transparent background, clean pixel edges`,
    colors: ['#744210', '#975A16', '#D69E2E', '#FFFFF0'],  // Earth brown
  },
  evolution2: {
    name: 'Atlas',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      medium owl creature, dignified scholarly appearance,
      globe pattern on chest feathers, map markings on wings,
      wise focused eyes, prominent ear tufts,
      holding small scroll or compass,
      standing on small pedestal,
      idle animation with subtle wing adjustments,
      transparent background, clean pixel edges`,
    colors: ['#22543D', '#276749', '#68D391', '#F0FFF4'],  // Earth green
  },
  evolution3: {
    name: 'Sovereign',
    prompt: `64x64 pixel art sprite, Pokemon GBA FireRed/LeafGreen style,
      majestic great owl creature, impressive wingspan,
      golden crown with gem, royal cape of feathers,
      full globe Earth visible on chest, glowing wise eyes,
      scepter in talons, regal commanding presence,
      world map patterns across feathers,
      idle animation with majestic slow wing beats,
      transparent background, clean pixel edges`,
    colors: ['#744210', '#B7791F', '#ECC94B', '#2B6CB0'],  // Royal earth
  },
};
```

---

## Generation Script

```typescript
// scripts/generate-sprites.ts

import fs from 'fs';
import path from 'path';
import { generateSprite } from '../lib/sprites/pixellab-client';

const ALL_PROMPTS = {
  politics: POLITICS_PROMPTS,
  crypto: CRYPTO_PROMPTS,
  sports: SPORTS_PROMPTS,
  macro: MACRO_PROMPTS,
  tech: TECH_PROMPTS,
  space: SPACE_PROMPTS,
  geo: GEO_PROMPTS,
};

const NEGATIVE_PROMPT = 'blurry, anti-aliased, smooth gradients, realistic, 3D, complex background, too many colors, messy pixels, asymmetrical, watermark, signature';

async function generateAllSprites() {
  const outputDir = path.join(process.cwd(), 'public', 'sprites');
  
  for (const [category, prompts] of Object.entries(ALL_PROMPTS)) {
    console.log(`\n=== Generating ${category} sprites ===`);
    
    const categoryDir = path.join(outputDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    for (const [evolutionKey, config] of Object.entries(prompts)) {
      const evolutionNum = evolutionKey.replace('evolution', '');
      console.log(`  Generating ${config.name} (Evolution ${evolutionNum})...`);
      
      try {
        // Generate 4-frame idle animation
        const result = await generateSprite({
          prompt: config.prompt,
          negative_prompt: NEGATIVE_PROMPT,
          width: 64,
          height: 64,
          num_frames: 4,
          animation_type: 'idle',
          seed: parseInt(evolutionNum) * 1000 + Object.keys(ALL_PROMPTS).indexOf(category), // Consistent seed
        });
        
        // Wait for completion
        let status = result;
        while (status.status === 'pending' || status.status === 'processing') {
          await new Promise(resolve => setTimeout(resolve, 2000));
          status = await checkStatus(result.id);
        }
        
        if (status.status === 'completed') {
          // Save individual frames
          for (let frame = 0; frame < status.images.length; frame++) {
            const framePath = path.join(
              categoryDir,
              `evolution_${evolutionNum}_frame_${frame}.png`
            );
            const imageBuffer = Buffer.from(status.images[frame], 'base64');
            fs.writeFileSync(framePath, imageBuffer);
            console.log(`    Saved frame ${frame}: ${framePath}`);
          }
          
          // Save sprite sheet if available
          if (status.sprite_sheet) {
            const sheetPath = path.join(
              categoryDir,
              `evolution_${evolutionNum}_sheet.png`
            );
            const sheetBuffer = Buffer.from(status.sprite_sheet, 'base64');
            fs.writeFileSync(sheetPath, sheetBuffer);
            console.log(`    Saved sprite sheet: ${sheetPath}`);
          }
        } else {
          console.error(`    Failed to generate ${config.name}`);
        }
        
        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`    Error generating ${config.name}:`, error);
      }
    }
  }
  
  console.log('\n=== Sprite generation complete! ===');
  console.log(`Total sprites generated: ${7 * 3 * 4} frames`);
}

// Run the script
generateAllSprites().catch(console.error);
```

---

## Option 2: Leonardo.ai (Alternative)

If PixelLab is unavailable or results are unsatisfactory:

### Leonardo.ai Setup

```typescript
// lib/sprites/leonardo-client.ts

const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
const LEONARDO_BASE_URL = 'https://cloud.leonardo.ai/api/rest/v1';

// Use the "Pixel Art" model or fine-tuned model
const PIXEL_ART_MODEL_ID = 'YOUR_MODEL_ID';

export async function generateWithLeonardo(prompt: string): Promise<string[]> {
  // Create generation
  const createResponse = await fetch(`${LEONARDO_BASE_URL}/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LEONARDO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      modelId: PIXEL_ART_MODEL_ID,
      width: 64,
      height: 64,
      num_images: 4,  // Generate 4 frames
      guidance_scale: 7,
      negative_prompt: 'blurry, realistic, 3D, complex background',
    }),
  });
  
  const { sdGenerationJob } = await createResponse.json();
  
  // Poll for completion
  let images: string[] = [];
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const statusResponse = await fetch(
      `${LEONARDO_BASE_URL}/generations/${sdGenerationJob.generationId}`,
      { headers: { 'Authorization': `Bearer ${LEONARDO_API_KEY}` } }
    );
    
    const { generations_by_pk } = await statusResponse.json();
    
    if (generations_by_pk.status === 'COMPLETE') {
      images = generations_by_pk.generated_images.map((img: any) => img.url);
      break;
    }
  }
  
  return images;
}
```

---

## Option 3: Stable Diffusion + LoRA (Self-Hosted)

For complete control, run locally with a Pokemon LoRA:

```bash
# Install dependencies
pip install diffusers transformers accelerate

# Download Pokemon LoRA (from civitai.com or huggingface)
# Search for "Pokemon pixel art LoRA" or "GBA sprite LoRA"
```

```python
# scripts/generate_sprites_sd.py

from diffusers import StableDiffusionPipeline
import torch

# Load model with LoRA
pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16
)
pipe = pipe.to("cuda")

# Load Pokemon LoRA weights
pipe.load_lora_weights("path/to/pokemon_pixel_lora.safetensors")

def generate_sprite(prompt, output_path, num_frames=4):
    images = pipe(
        prompt=prompt,
        negative_prompt="blurry, realistic, 3D, complex background",
        num_images_per_prompt=num_frames,
        width=64,
        height=64,
        num_inference_steps=30,
        guidance_scale=7.5,
    ).images
    
    for i, img in enumerate(images):
        img.save(f"{output_path}_frame_{i}.png")

# Generate all sprites
for category, prompts in ALL_PROMPTS.items():
    for evo_key, config in prompts.items():
        generate_sprite(
            config['prompt'],
            f"public/sprites/{category}/evolution_{evo_key[-1]}"
        )
```

---

## Post-Processing Pipeline

After generation, run these cleanup steps:

```typescript
// scripts/process-sprites.ts

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SPRITES_DIR = 'public/sprites';

async function processAllSprites() {
  const categories = fs.readdirSync(SPRITES_DIR);
  
  for (const category of categories) {
    const categoryPath = path.join(SPRITES_DIR, category);
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.png'));
    
    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      
      // 1. Ensure exact 64x64 size
      // 2. Ensure transparency
      // 3. Optimize file size
      // 4. Ensure pixel-perfect edges (no anti-aliasing)
      
      await sharp(filePath)
        .resize(64, 64, {
          kernel: sharp.kernel.nearest,  // No interpolation
          fit: 'fill',
        })
        .png({
          compressionLevel: 9,
          adaptiveFiltering: false,
        })
        .toFile(filePath.replace('.png', '_processed.png'));
      
      // Replace original
      fs.renameSync(
        filePath.replace('.png', '_processed.png'),
        filePath
      );
      
      console.log(`Processed: ${filePath}`);
    }
  }
}

// Create sprite sheets for each evolution
async function createSpriteSheets() {
  const categories = fs.readdirSync(SPRITES_DIR);
  
  for (const category of categories) {
    const categoryPath = path.join(SPRITES_DIR, category);
    
    for (let evo = 1; evo <= 3; evo++) {
      const frames = [0, 1, 2, 3].map(f => 
        path.join(categoryPath, `evolution_${evo}_frame_${f}.png`)
      );
      
      // Combine into horizontal sprite sheet (256x64)
      const frameBuffers = await Promise.all(
        frames.map(f => sharp(f).toBuffer())
      );
      
      await sharp({
        create: {
          width: 256,
          height: 64,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite(
          frameBuffers.map((buffer, i) => ({
            input: buffer,
            left: i * 64,
            top: 0,
          }))
        )
        .png()
        .toFile(path.join(categoryPath, `evolution_${evo}_sheet.png`));
      
      console.log(`Created sprite sheet: ${category}/evolution_${evo}_sheet.png`);
    }
  }
}

processAllSprites()
  .then(createSpriteSheets)
  .catch(console.error);
```

---

## Fallback: Placeholder SVGs

If AI generation fails, use these enhanced SVG placeholders:

```typescript
// lib/sprites/placeholders.ts

export function generatePlaceholderSVG(
  category: string,
  evolution: number,
  colors: { primary: string; secondary: string; accent: string }
): string {
  // Returns SVG string based on category and evolution
  // These are the same SVGs from our prototype but can be
  // dynamically colored
  
  const svgTemplates = {
    politics: generateEagleSVG,
    crypto: generateCrystalSVG,
    sports: generateFoxSVG,
    macro: generateTurtleSVG,
    tech: generateRobotSVG,
    space: generateMothSVG,
    geo: generateOwlSVG,
  };
  
  return svgTemplates[category](evolution, colors);
}

function generateEagleSVG(evolution: number, colors: any): string {
  // Implementation from prototype
  return `<svg>...</svg>`;
}

// ... other generators
```

---

## Quality Checklist

Before using generated sprites, verify:

- [ ] Exactly 64x64 pixels
- [ ] Transparent background
- [ ] No anti-aliasing (crisp pixel edges)
- [ ] Consistent style across all sprites
- [ ] Clear silhouette at small sizes
- [ ] Color palette matches category theme
- [ ] Animation frames flow smoothly
- [ ] Each evolution looks distinctly different
- [ ] Level 3 clearly most impressive

---

## File Structure After Generation

```
public/
└── sprites/
    ├── politics/
    │   ├── evolution_1_frame_0.png
    │   ├── evolution_1_frame_1.png
    │   ├── evolution_1_frame_2.png
    │   ├── evolution_1_frame_3.png
    │   ├── evolution_1_sheet.png
    │   ├── evolution_2_frame_0.png
    │   ├── ... (same pattern)
    │   └── evolution_3_sheet.png
    ├── crypto/
    │   └── ... (same structure)
    ├── sports/
    ├── macro/
    ├── tech/
    ├── space/
    └── geo/
```

---

## Usage in Components

```typescript
// components/sigil/SigilSprite.tsx

import { useState, useEffect } from 'react';

interface SigilSpriteProps {
  category: string;
  evolution: number;
  size?: number;
  animated?: boolean;
}

export function SigilSprite({
  category,
  evolution,
  size = 64,
  animated = true,
}: SigilSpriteProps) {
  const [frame, setFrame] = useState(0);
  const [useSheet, setUseSheet] = useState(true);
  
  useEffect(() => {
    if (!animated) return;
    
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 150);
    
    return () => clearInterval(interval);
  }, [animated]);
  
  if (useSheet) {
    // Use sprite sheet with background-position
    return (
      <div
        style={{
          width: size,
          height: size,
          backgroundImage: `url(/sprites/${category}/evolution_${evolution + 1}_sheet.png)`,
          backgroundPosition: `-${frame * 64}px 0`,
          backgroundSize: '256px 64px',
          imageRendering: 'pixelated',
        }}
      />
    );
  }
  
  // Fallback to individual frames
  return (
    <img
      src={`/sprites/${category}/evolution_${evolution + 1}_frame_${frame}.png`}
      alt={`${category} evolution ${evolution + 1}`}
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
```

---

## Claude Code Instructions

When implementing sprite generation, Claude Code should:

1. **First, check if PixelLab API is available**
   - Test with a simple generation request
   - If unavailable, fall back to Leonardo.ai or manual prompts

2. **Generate sprites in batches**
   - Process one category at a time
   - Wait between requests to avoid rate limiting
   - Save progress to resume if interrupted

3. **Verify each sprite after generation**
   - Check file exists and is valid PNG
   - Verify dimensions are 64x64
   - Log any failures for manual review

4. **Run post-processing**
   - Ensure all sprites are optimized
   - Create sprite sheets for performance
   - Generate preview grid for review

5. **If AI generation fails completely**
   - Use the enhanced SVG placeholders
   - Log which sprites need manual creation
   - Suggest commissioning from artist

---

*Document Version: 1.0*
*For use with: SIGILS_BUILD_SPEC.md*
