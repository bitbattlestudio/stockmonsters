'use client';

const CLOB_API_URL = 'https://clob.polymarket.com';
const POLYGON_CHAIN_ID = 137;

export interface ClobCredentials {
  apiKey: string;
  secret: string;
  passphrase: string;
}

/**
 * Base64 encode/decode utilities for browser
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * EIP-712 Domain for CLOB Auth
 */
const CLOB_AUTH_DOMAIN = {
  name: 'ClobAuthDomain',
  version: '1',
  chainId: POLYGON_CHAIN_ID,
};

/**
 * EIP-712 Types for CLOB Auth
 */
const CLOB_AUTH_TYPES = {
  ClobAuth: [
    { name: 'address', type: 'address' },
    { name: 'timestamp', type: 'string' },
    { name: 'nonce', type: 'uint256' },
    { name: 'message', type: 'string' },
  ],
};

/**
 * Create CLOB API credentials using EIP-712 typed data signing
 */
export async function createClobCredentials(
  signTypedData: (params: {
    domain: typeof CLOB_AUTH_DOMAIN;
    types: typeof CLOB_AUTH_TYPES;
    primaryType: string;
    message: Record<string, unknown>;
  }) => Promise<string>,
  address: string
): Promise<ClobCredentials | null> {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = 0; // Use 0 for initial key creation

    // Normalize address to checksum format
    const normalizedAddress = address;

    // Build EIP-712 message
    const message = {
      address: normalizedAddress,
      timestamp: timestamp.toString(),
      nonce: BigInt(nonce),
      message: 'This message attests that I control the given wallet',
    };

    console.log('Requesting EIP-712 signature for CLOB auth...');
    console.log('Address:', normalizedAddress);
    console.log('Timestamp:', timestamp);
    console.log('Nonce:', nonce);

    const signature = await signTypedData({
      domain: CLOB_AUTH_DOMAIN,
      types: CLOB_AUTH_TYPES,
      primaryType: 'ClobAuth',
      message,
    });

    console.log('Got EIP-712 signature:', signature);

    // Send L1 auth request with headers
    const credResponse = await fetch(`${CLOB_API_URL}/auth/api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'POLY_ADDRESS': normalizedAddress,
        'POLY_SIGNATURE': signature,
        'POLY_TIMESTAMP': timestamp.toString(),
        'POLY_NONCE': nonce.toString(),
      },
    });

    if (!credResponse.ok) {
      const errorText = await credResponse.text();
      console.error('Failed to create API key:', credResponse.status, errorText);

      // Try deriving existing key instead
      console.log('Trying to derive existing API key...');
      const deriveResponse = await fetch(`${CLOB_API_URL}/auth/derive-api-key`, {
        method: 'GET',
        headers: {
          'POLY_ADDRESS': normalizedAddress,
          'POLY_SIGNATURE': signature,
          'POLY_TIMESTAMP': timestamp.toString(),
          'POLY_NONCE': nonce.toString(),
        },
      });

      if (!deriveResponse.ok) {
        console.error('Derive also failed:', await deriveResponse.text());
        return null;
      }

      const derivedCreds = await deriveResponse.json();
      console.log('Got derived credentials:', derivedCreds);
      return {
        apiKey: derivedCreds.apiKey || derivedCreds.api_key,
        secret: derivedCreds.secret || derivedCreds.api_secret,
        passphrase: derivedCreds.passphrase || derivedCreds.api_passphrase || '',
      };
    }

    const credentials = await credResponse.json();
    console.log('Got CLOB credentials:', credentials);

    return {
      apiKey: credentials.apiKey || credentials.api_key,
      secret: credentials.secret || credentials.api_secret,
      passphrase: credentials.passphrase || credentials.api_passphrase || '',
    };
  } catch (error) {
    console.error('Error creating CLOB credentials:', error);
    return null;
  }
}

/**
 * Generate HMAC-SHA256 signature for API requests (browser-compatible)
 */
export async function signRequest(
  secret: string,
  timestamp: string,
  method: string,
  path: string,
  body: string = ''
): Promise<string> {
  const message = timestamp + method + path + body;
  const encoder = new TextEncoder();

  // Import the secret key
  const keyData = base64ToArrayBuffer(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign the message
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );

  return arrayBufferToBase64(signature);
}

/**
 * Get authentication headers for CLOB API requests
 */
export async function getAuthHeaders(
  credentials: ClobCredentials,
  method: string,
  path: string,
  body: string = ''
): Promise<Record<string, string>> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = await signRequest(credentials.secret, timestamp, method, path, body);

  return {
    'POLY_API_KEY': credentials.apiKey,
    'POLY_SIGNATURE': signature,
    'POLY_TIMESTAMP': timestamp,
    'POLY_PASSPHRASE': credentials.passphrase,
  };
}

/**
 * Store credentials in session storage
 */
export function storeClobCredentials(credentials: ClobCredentials): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('clob-credentials', JSON.stringify(credentials));
  }
}

/**
 * Get stored credentials (validates they exist and are complete)
 */
export function getStoredClobCredentials(): ClobCredentials | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem('clob-credentials');
  if (!stored) return null;

  try {
    const creds = JSON.parse(stored);
    // Validate credentials are complete
    if (creds && creds.apiKey && creds.secret) {
      return creds;
    }
    // Invalid credentials, clear them
    sessionStorage.removeItem('clob-credentials');
    return null;
  } catch {
    sessionStorage.removeItem('clob-credentials');
    return null;
  }
}

/**
 * Clear stored credentials
 */
export function clearClobCredentials(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('clob-credentials');
  }
}
