# SPRITE STATE SPECIFICATION
## Mandatory for ALL Stock Sprites - PixelLab Generation

---

## THRESHOLDS (% Change)

| State | Name | % Range | Arrows | Arrow Color |
|-------|------|---------|--------|-------------|
| 1 | CRASHING | ≤ -5% | 6 DOWN (▼) | RED #EF4444 |
| 2 | DOWN | -1% to -5% | 3 DOWN (▼) | RED #EF4444 |
| 3 | NEUTRAL | -1% to +1% | NONE | N/A |
| 4 | UP | +1% to +5% | 3 UP (▲) | GREEN #10B981 |
| 5 | MOONING | ≥ +5% | 6 UP (▲) | GREEN #10B981 |

---

## ARROW REFERENCE

**CRITICAL: Look at stock_TSLA_4.png - copy that EXACT arrow style for ALL sprites.**

The TSLA arrows are:
- Bright green (#10B981)
- Small triangle/arrow shapes (▲)
- Floating at different heights around the creature
- 4-5 arrows scattered on left and right sides
- They look like they're floating UPWARD

For DOWN states, use the SAME style but:
- Red color (#EF4444)
- Pointing DOWN (▼)
- Visually "falling"

---

## ARROW INSTRUCTIONS (Copy EXACTLY into each prompt)

### STATE 1 - CRASHING (≤ -5%):
```
ARROWS: Include exactly 6 bright RED downward-pointing arrow triangles (▼) around the creature. Color: #EF4444. Scatter them at varying heights on left and right sides - put 3 on the left, 3 on the right. Arrows point DOWN and appear to be falling. Use the SAME arrow size and style as the TSLA sprite but RED and pointing DOWN. The arrows are MANDATORY and must be clearly visible.
```

### STATE 2 - DOWN (-1% to -5%):
```
ARROWS: Include exactly 3 bright RED downward-pointing arrow triangles (▼) around the creature. Color: #EF4444. Place 1-2 on left, 1-2 on right at different heights. Arrows point DOWN and appear to be falling. Use the SAME arrow size and style as the TSLA sprite but RED and pointing DOWN. The arrows are MANDATORY and must be clearly visible.
```

### STATE 3 - NEUTRAL (-1% to +1%):
```
ARROWS: Do NOT include any arrows. No up arrows, no down arrows. Zero arrows. The creature floats calmly with no directional indicators.
```

### STATE 4 - UP (+1% to +5%):
```
ARROWS: Include exactly 3 bright GREEN upward-pointing arrow triangles (▲) around the creature. Color: #10B981. Place 1-2 on left, 1-2 on right at different heights. Arrows point UP and appear to be rising. Use the EXACT same arrow size, style, and color as stock_TSLA_4.png. The arrows are MANDATORY and must be clearly visible.
```

### STATE 5 - MOONING (≥ +5%):
```
ARROWS: Include exactly 6 bright GREEN upward-pointing arrow triangles (▲) around the creature. Color: #10B981. Scatter them at varying heights on left and right sides - put 3 on the left, 3 on the right. Arrows point UP and appear to be shooting upward. Use the EXACT same arrow style as stock_TSLA_4.png. Add golden sparkles around the creature. The arrows are MANDATORY and must be clearly visible.
```

---

## CREATURE MOOD BY STATE

| State | Eyes | Mouth | Body | Colors | Extras |
|-------|------|-------|------|--------|--------|
| 1 CRASHING | Scared, tears | Open frown | Drooping, shaking | Desaturated, dark | Cracked ground, dark atmosphere |
| 2 DOWN | Worried, concerned | Small frown | Slightly droopy | Slightly muted | Dim atmosphere |
| 3 NEUTRAL | Calm dots | Neutral/slight smile | Relaxed, balanced | Normal, standard | Peaceful, stable |
| 4 UP | Happy, bright | Small smile | Perky, energetic | Bright, vibrant | Small sparkles |
| 5 MOONING | Huge, excited | Big smile | Bouncing, celebrating | Vivid, glowing | Golden sparkles, radiant glow |

---

## CREATURE DEFINITIONS

### TSLA - Battery Creature ✅ (REFERENCE - already complete)
```
A cute living battery creature. Red cylindrical body with green charge indicator. Lightning bolt symbol on chest like a badge. Small arm-nubs on sides. Electric sparks showing energy and life. Tiny electric car nearby.
```

### AMZN - Box Creature
```
A cute living cardboard box creature. Tan/brown cardboard body (#D4A574). Box flaps on top act as little arm-nubs that can express emotion. The Amazon smile-arrow on the front IS its smiling mouth. Two big friendly dot eyes above the smile. Tiny tape roll buddy nearby.
```

### PLTR - Eye Orb Creature
```
A cute living crystal ball creature with an all-seeing eye. Spherical purple/blue glass orb body (#8B5CF6, #6366F1). ONE large friendly eye in the center IS its entire face - the eye shows emotion through its pupil and eyelid. Small ethereal tentacle wisps flowing from the bottom like a jellyfish. Mystical purple/blue glow around it. Tiny floating data runes nearby.
```

### NFLX - Popcorn Creature
```
A cute living popcorn bucket creature. Red and white vertically striped bucket body (#E50914 Netflix red, white stripes). Overflowing yellow popcorn kernels on top that look like fun messy hair. Two big cute dot eyes on the bucket. Happy mouth. Small arm-nubs on the sides of the bucket. Tiny remote control buddy nearby.
```

### AMD - Crystal Creature
```
A cute living red crystal gem creature. Faceted geometric red diamond/crystal body (#ED1C24 AMD red). Multiple sharp crystal points with the largest in center. Two glowing white dot eyes peer out from within the crystal. Small crystal shard pieces orbit around it. Inner fire/energy glow pulsing inside. Tiny circuit board or microchip nearby.
```

---

## MASTER PROMPT TEMPLATE

Use this EXACT template for every sprite. Fill in the bracketed sections.

```
Create a 64x64 pixel art sprite scene.

=== CREATURE ===
[PASTE CREATURE DEFINITION FROM ABOVE]

=== CREATURE STATE ===
Expression: [STATE EXPRESSION - scared/worried/calm/happy/ecstatic]
Eyes: [STATE EYES from mood table]
Mouth: [STATE MOUTH from mood table]
Body language: [STATE BODY from mood table]
Floating height: [Lower for down states, higher for up states]

=== ENVIRONMENT ===
- Small dark platform underneath
- [CREATURE'S SPECIFIC PROP] nearby
- [STATE ATMOSPHERE from mood table]
- Colors are [STATE COLORS - desaturated for down, normal for neutral, vibrant for up]

=== ARROWS (CRITICAL - DO NOT SKIP) ===
[PASTE THE EXACT ARROW INSTRUCTION FOR THIS STATE FROM ABOVE]

=== STYLE ===
- Pokemon/Tamagotchi creature aesthetic - this is a LIVING creature, not just an object
- The creature has personality, emotion, and life
- Clean pixel art, 12-15 colors maximum
- Transparent background
- 64x64 pixels exactly

=== FINAL CHECK ===
Before saving, verify:
1. The arrows are present (unless State 3)
2. Arrow count matches the state (6/3/0/3/6)
3. Arrow color is correct (RED for down, GREEN for up)
4. Arrow style matches TSLA reference sprite
5. Creature expression matches the state
```

---

## COMPLETE EXAMPLE PROMPTS

### AMZN STATE 1 (CRASHING):
```
Create a 64x64 pixel art sprite scene.

=== CREATURE ===
A cute living cardboard box creature. Tan/brown cardboard body (#D4A574). Box flaps on top act as little arm-nubs that can express emotion. The Amazon smile-arrow on the front IS its smiling mouth - but now it's a FROWN because the stock is crashing. Two big worried dot eyes above the frown, with tears. Tiny crumpled tape roll nearby.

=== CREATURE STATE ===
Expression: Scared, panicked
Eyes: Wide with tears, eyebrows up in fear
Mouth: The smile-arrow is now inverted/frowning
Body language: Shaking, drooping, deflated
Floating height: Low, barely above ground

=== ENVIRONMENT ===
- Small dark cracked platform underneath
- Crumpled tape and fallen tape roll nearby
- Dark, stormy, worried atmosphere
- Colors are desaturated and muted

=== ARROWS (CRITICAL - DO NOT SKIP) ===
ARROWS: Include exactly 6 bright RED downward-pointing arrow triangles (▼) around the creature. Color: #EF4444. Scatter them at varying heights on left and right sides - put 3 on the left, 3 on the right. Arrows point DOWN and appear to be falling. Use the SAME arrow size and style as the TSLA sprite but RED and pointing DOWN. The arrows are MANDATORY and must be clearly visible.

=== STYLE ===
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors maximum
- Transparent background
- 64x64 pixels exactly
```

### AMZN STATE 4 (UP):
```
Create a 64x64 pixel art sprite scene.

=== CREATURE ===
A cute living cardboard box creature. Tan/brown cardboard body (#D4A574). Box flaps on top act as little arm-nubs raised happily. The Amazon smile-arrow on the front IS its smiling mouth - big happy smile! Two big cheerful dot eyes above the smile. Tiny tape roll buddy nearby.

=== CREATURE STATE ===
Expression: Happy, cheerful
Eyes: Bright, happy curved eyes
Mouth: The smile-arrow is a big grin
Body language: Perky, energetic, arms/flaps raised
Floating height: Normal-high, bouncy

=== ENVIRONMENT ===
- Small dark platform underneath
- Happy tape roll buddy nearby
- Cheerful atmosphere
- Colors are bright and vibrant
- Small sparkles

=== ARROWS (CRITICAL - DO NOT SKIP) ===
ARROWS: Include exactly 3 bright GREEN upward-pointing arrow triangles (▲) around the creature. Color: #10B981. Place 1-2 on left, 1-2 on right at different heights. Arrows point UP and appear to be rising. Use the EXACT same arrow size, style, and color as stock_TSLA_4.png. The arrows are MANDATORY and must be clearly visible.

=== STYLE ===
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors maximum
- Transparent background
- 64x64 pixels exactly
```

---

## GENERATION ORDER

Generate in this exact order:

### Round 1: AMZN (5 sprites)
1. AMZN state 1 → stock_AMZN_1.png
2. AMZN state 2 → stock_AMZN_2.png
3. AMZN state 3 → stock_AMZN_3.png
4. AMZN state 4 → stock_AMZN_4.png
5. AMZN state 5 → stock_AMZN_5.png

### Round 2: PLTR (5 sprites)
6. PLTR state 1 → stock_PLTR_1.png
7. PLTR state 2 → stock_PLTR_2.png
8. PLTR state 3 → stock_PLTR_3.png
9. PLTR state 4 → stock_PLTR_4.png
10. PLTR state 5 → stock_PLTR_5.png

### Round 3: NFLX (5 sprites)
11. NFLX state 1 → stock_NFLX_1.png
12. NFLX state 2 → stock_NFLX_2.png
13. NFLX state 3 → stock_NFLX_3.png
14. NFLX state 4 → stock_NFLX_4.png
15. NFLX state 5 → stock_NFLX_5.png

### Round 4: AMD (5 sprites)
16. AMD state 1 → stock_AMD_1.png
17. AMD state 2 → stock_AMD_2.png
18. AMD state 3 → stock_AMD_3.png
19. AMD state 4 → stock_AMD_4.png
20. AMD state 5 → stock_AMD_5.png

Save all to: `public/sprites/generated/`

---

## VERIFICATION CHECKLIST

After EACH sprite, verify before saving:

- [ ] Creature matches the stock definition (box for AMZN, orb for PLTR, etc.)
- [ ] Creature looks ALIVE (eyes, expression, appendages)
- [ ] Expression matches state (scared → calm → happy)
- [ ] Correct number of arrows: State 1=6, State 2=3, State 3=0, State 4=3, State 5=6
- [ ] Correct arrow color: States 1&2=RED (#EF4444), States 4&5=GREEN (#10B981)
- [ ] Correct arrow direction: States 1&2=DOWN (▼), States 4&5=UP (▲)
- [ ] Arrow style matches TSLA reference
- [ ] Colors match state (desaturated ↔ vibrant)
- [ ] Transparent background
- [ ] Saved to correct path: public/sprites/generated/stock_[TICKER]_[STATE].png

---

## AFTER COMPLETION

Report:
```
✅ Generation complete:
- AMZN: 5 states (1-5) with correct arrows
- PLTR: 5 states (1-5) with correct arrows
- NFLX: 5 states (1-5) with correct arrows
- AMD: 5 states (1-5) with correct arrows
- Total: 20 sprites
- All arrows verified against TSLA reference
```

Then run:
```
ls -la public/sprites/generated/stock_*.png | wc -l
```

Should show: 25 (20 new + 5 existing TSLA)

---

## START NOW

Begin with AMZN state 1 (CRASHING - 6 red down arrows, scared expression).

Use PixelLab MCP create_map_object with the exact prompt from the example above.

Show me the result before moving to state 2.
