# Pokemon-Style Icons

This folder contains detailed Pokemon/Sugimori-style icons to replace the pixel art icons.

## Status

✅ **ALL 25 ICONS COMPLETE!** 🎉
✅ **Component ready** (StockIcon with automatic fallback)
✅ **Ready for production use**

### V2 API Generation (Completed Successfully)

Used v2 REST API endpoint instead of broken MCP download:
- Endpoint: `https://api.pixellab.ai/v2/generate-image-v2`
- Script: `generate-all-v2.js`
- **Results:**
  - ✅ 25/25 icons generated successfully
  - ❌ 0 failures
  - 💰 Total cost: $2.375
  - 📏 All icons: 256x256 PNG with transparency
  - ⏱️ Total time: ~30 minutes

## How It Works

The `StockIcon` component:
1. Tries to load from `/icons/pokemon-style/{name}.png`
2. Falls back to `/icons/{name}.png` (pixel art) if not found
3. Automatically handles errors

This means you can drop in icons one by one without breaking the app!

## Dropping In New Icons

When the PixelLab download API works or you get icons manually:

```bash
# Download all icons (when API works)
./download_all.sh

# Or drop in icons manually:
cp ~/Downloads/health-heart.png ./health-heart.png
cp ~/Downloads/trending-up.png ./trending-up.png
# ... etc

# The app will automatically use them!
```

## Icon List (25 icons)

### Batch 1 - Critical (5)
- ✅ health-heart.png (red crystal heart)
- ✅ hunger-apple.png (golden apple with bite)
- ✅ happiness.png (yellow spirit orb, happy face)
- ✅ trending-up.png (green crystal arrow up)
- ✅ trending-down.png (red crystal arrow down)

### Batch 2 - Health & Stats (5)
- ✅ sad.png (blue spirit orb, sad face)
- ✅ star.png (golden 5-pointed star)
- ✅ rocket.png (rocket ship with flames)
- ✅ chart.png (crystal bar chart)
- ✅ diamond.png (brilliant cut diamond)

### Batch 3 - UI Actions (5)
- ✅ swap.png (curved arrows circle)
- ✅ checkmark.png (green check in circle)
- ✅ x-mark.png (red X)
- ✅ warning.png (yellow triangle with !)
- ✅ bell.png (golden notification bell)

### Batch 4 - Misc (5)
- ✅ backpack.png (leather adventurer bag)
- ✅ celebration.png (confetti and sparkles)
- ✅ link.png (blue chain link)
- ✅ target.png (red and white bullseye)
- ✅ wizard.png (wizard with hat and staff)

### Batch 5 - Remaining (5)
- ✅ sparkle.png (magical twinkle star)
- ✅ balance.png (golden scales)
- ✅ vote.png (ballot box)
- ✅ bank.png (bank building with pillars)
- ✅ health-check.png (clipboard with checkmarks)

## Object IDs (for retrieval when API works)

All object IDs are stored in `download_all.sh`.

To retry download:
```bash
./download_all.sh
```

## Testing

To test the system with a single icon:

1. Manually save any icon as `health-heart.png` in this folder
2. Reload the app
3. The Portfolio Health section should show the new icon
4. Other icons will still use pixel art fallback

## Style Guide

Icons should match the Pokemon/Sugimori official art style:
- Clean black outlines
- Soft cel-shading
- Vibrant colors
- Detailed but simple
- Transparent background
- 256x256px (scales down smoothly)

## Migration Status

- [x] Component created (StockIcon)
- [x] Fallback system working
- [ ] Icons downloaded (blocked by API)
- [ ] Visual consistency verified
- [ ] All components updated to use StockIcon
