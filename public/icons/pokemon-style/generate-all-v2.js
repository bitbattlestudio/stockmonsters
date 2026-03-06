#!/usr/bin/env node
/**
 * Generate all 25 Pokemon-style icons using PixelLab v2 REST API
 *
 * Usage: node generate-all-v2.js
 */

const fs = require('fs');
const https = require('https');

const API_TOKEN = '8b1e6ec2-e5c0-4ceb-b569-efdd55a1169e';
const API_URL = 'https://api.pixellab.ai/v2/generate-image-v2';

// Icon descriptions matching the original batch
const ICONS = [
  // Batch 1 - Critical
  { name: 'health-heart', description: 'glowing red crystal heart gem' },
  { name: 'hunger-apple', description: 'golden apple with bite mark' },
  { name: 'happiness', description: 'yellow spirit orb with happy face' },
  { name: 'trending-up', description: 'green crystal arrow pointing up' },
  { name: 'trending-down', description: 'red crystal arrow pointing down' },

  // Batch 2 - Health & Stats
  { name: 'sad', description: 'blue spirit orb with sad face' },
  { name: 'star', description: 'golden five-pointed star' },
  { name: 'rocket', description: 'rocket ship with flames' },
  { name: 'chart', description: 'crystal bar chart' },
  { name: 'diamond', description: 'brilliant cut diamond' },

  // Batch 3 - UI Actions
  { name: 'swap', description: 'curved arrows in circle' },
  { name: 'checkmark', description: 'green check mark in circle' },
  { name: 'x-mark', description: 'red X mark' },
  { name: 'warning', description: 'yellow triangle with exclamation mark' },
  { name: 'bell', description: 'golden notification bell' },

  // Batch 4 - Misc
  { name: 'backpack', description: 'leather adventurer backpack' },
  { name: 'celebration', description: 'confetti and sparkles' },
  { name: 'link', description: 'blue chain link' },
  { name: 'target', description: 'red and white bullseye target' },
  { name: 'wizard', description: 'wizard with hat and staff' },

  // Batch 5 - Remaining
  { name: 'sparkle', description: 'magical twinkle star' },
  { name: 'balance', description: 'golden balance scales' },
  { name: 'vote', description: 'ballot box' },
  { name: 'bank', description: 'bank building with pillars' },
  { name: 'health-check', description: 'clipboard with checkmarks' },
];

async function generateIcon(icon) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      description: icon.description,
      image_size: { width: 256, height: 256 },
      no_background: true,
    });

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    console.log(`\n🎨 Generating ${icon.name}...`);
    const startTime = Date.now();

    const req = https.request(API_URL, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

        if (res.statusCode !== 200) {
          console.error(`❌ Failed ${icon.name}: HTTP ${res.statusCode}`);
          console.error(data.substring(0, 200));
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        try {
          const result = JSON.parse(data);
          if (result.images && result.images[0] && result.images[0].base64) {
            const base64Data = result.images[0].base64;
            const buffer = Buffer.from(base64Data, 'base64');
            const filename = `${icon.name}.png`;

            fs.writeFileSync(filename, buffer);
            const sizeMB = (buffer.length / 1024).toFixed(1);
            console.log(`✅ ${icon.name} (${sizeMB}KB in ${elapsed}s)`);
            resolve({ name: icon.name, size: buffer.length, cost: result.usage?.usd || 0 });
          } else {
            console.error(`❌ No image data for ${icon.name}`);
            reject(new Error('No image data'));
          }
        } catch (err) {
          console.error(`❌ Parse error for ${icon.name}:`, err.message);
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ Network error for ${icon.name}:`, err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('🚀 Starting icon generation...');
  console.log(`📦 Generating ${ICONS.length} icons\n`);

  const results = [];
  let totalCost = 0;

  for (const icon of ICONS) {
    try {
      const result = await generateIcon(icon);
      results.push(result);
      totalCost += result.cost;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`Failed to generate ${icon.name}:`, err.message);
      results.push({ name: icon.name, error: err.message });
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Success: ${results.filter(r => !r.error).length}`);
  console.log(`❌ Failed: ${results.filter(r => r.error).length}`);
  console.log(`💰 Total cost: $${totalCost.toFixed(3)}`);
  console.log('='.repeat(50));

  if (results.filter(r => r.error).length > 0) {
    console.log('\n⚠️  Failed icons:');
    results.filter(r => r.error).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
