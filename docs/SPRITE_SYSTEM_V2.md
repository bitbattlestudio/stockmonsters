# SPRITE SYSTEM V2
## Base Creatures + Arrow Overlays

---

## OVERVIEW

**OLD (broken):** 5 sprites per stock with arrows baked in → arrows inconsistent

**NEW (better):** 3 base sprites per stock + 4 shared arrow overlays → arrows always perfect

---

## STRUCTURE

```
public/sprites/
├── base/                          # Creature images (NO arrows)
│   ├── stock_TSLA_sad.png         # Sad/worried expression
│   ├── stock_TSLA_neutral.png     # Calm expression
│   ├── stock_TSLA_happy.png       # Happy/excited expression
│   ├── stock_AMZN_sad.png
│   ├── stock_AMZN_neutral.png
│   ├── stock_AMZN_happy.png
│   └── ... (3 per stock)
│
└── overlays/                      # Arrow images (shared across ALL stocks)
    ├── arrows_down_3.png          # 3 red down arrows
    ├── arrows_down_6.png          # 6 red down arrows
    ├── arrows_up_3.png            # 3 green up arrows
    └── arrows_up_6.png            # 6 green up arrows
```

---

## PART 1: ARROW OVERLAYS (Generate once, use everywhere)

Generate these 4 images. They will be used for ALL stocks.

### arrows_up_3.png
```
Create a 64x64 pixel art image with ONLY arrows on a transparent background.

CONTENT:
- Exactly 3 bright green upward-pointing arrow triangles (▲)
- Arrow color: #10B981 (bright green)
- Arrows scattered around the edges - NOT in the center (leave center empty for creature)
- Position: 1 arrow on left side, 1 on right side, 1 at top
- Each arrow is about 8-10 pixels tall
- Arrows should look like they're floating/rising upward

CRITICAL:
- NO creature, NO platform, NO other elements
- ONLY the 3 green arrows
- Transparent background
- The CENTER of the image must be EMPTY (that's where the creature goes)
```

### arrows_up_6.png
```
Create a 64x64 pixel art image with ONLY arrows on a transparent background.

CONTENT:
- Exactly 6 bright green upward-pointing arrow triangles (▲)
- Arrow color: #10B981 (bright green)
- Arrows scattered around the edges - NOT in the center (leave center empty for creature)
- Position: 3 arrows on left side at different heights, 3 arrows on right side at different heights
- Each arrow is about 8-10 pixels tall
- Arrows should look like they're shooting upward
- Add small golden sparkle dots between some arrows

CRITICAL:
- NO creature, NO platform, NO other elements
- ONLY the 6 green arrows and sparkles
- Transparent background
- The CENTER of the image must be EMPTY (that's where the creature goes)
```

### arrows_down_3.png
```
Create a 64x64 pixel art image with ONLY arrows on a transparent background.

CONTENT:
- Exactly 3 bright red downward-pointing arrow triangles (▼)
- Arrow color: #EF4444 (bright red)
- Arrows scattered around the edges - NOT in the center (leave center empty for creature)
- Position: 1 arrow on left side, 1 on right side, 1 at bottom
- Each arrow is about 8-10 pixels tall
- Arrows should look like they're falling downward

CRITICAL:
- NO creature, NO platform, NO other elements
- ONLY the 3 red arrows
- Transparent background
- The CENTER of the image must be EMPTY (that's where the creature goes)
```

### arrows_down_6.png
```
Create a 64x64 pixel art image with ONLY arrows on a transparent background.

CONTENT:
- Exactly 6 bright red downward-pointing arrow triangles (▼)
- Arrow color: #EF4444 (bright red)
- Arrows scattered around the edges - NOT in the center (leave center empty for creature)
- Position: 3 arrows on left side at different heights, 3 arrows on right side at different heights
- Each arrow is about 8-10 pixels tall
- Arrows should look like they're crashing downward

CRITICAL:
- NO creature, NO platform, NO other elements
- ONLY the 6 red arrows
- Transparent background
- The CENTER of the image must be EMPTY (that's where the creature goes)
```

---

## PART 2: BASE CREATURE SPRITES (3 per stock, NO arrows)

For each stock, generate 3 versions of the creature:
- **sad** = worried, droopy, muted colors (for DOWN stocks)
- **neutral** = calm, balanced (for FLAT stocks)
- **happy** = excited, vibrant, sparkly (for UP stocks)

**CRITICAL: Do NOT include any arrows in these images. Just the creature.**

---

### TSLA - Battery Creature

**TSLA_sad.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living battery creature looking SAD and WORRIED
- Red cylindrical body, but colors are MUTED and DESATURATED
- Charge indicator shows LOW (red/orange, nearly empty)
- Lightning bolt symbol on chest is DIMMED
- Two big worried dot eyes (eyebrows angled down, concerned look)
- Small frown mouth
- Small droopy arm-nubs at sides
- Body posture is SLUMPED, DEFLATED
- Floating LOW, barely above ground with shadow beneath

ENVIRONMENT:
- Small dark cracked platform underneath
- Tiny broken/tipped over electric car nearby
- Dim, worried atmosphere
- No sparkles

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the sad creature.
```

**TSLA_neutral.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living battery creature with CALM expression
- Red cylindrical body, normal colors
- Charge indicator shows MEDIUM (yellow/green)
- Lightning bolt symbol on chest glows softly
- Two calm dot eyes (neutral expression)
- Slight smile or neutral mouth
- Relaxed arm-nubs at sides
- Normal floating height with shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny electric car nearby
- Calm, balanced atmosphere

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the neutral creature.
```

**TSLA_happy.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living battery creature looking HAPPY and EXCITED
- Red cylindrical body, VIBRANT and BRIGHT colors
- Charge indicator shows FULL (bright green)
- Lightning bolt symbol on chest GLOWS brightly
- Two big happy dot eyes (curved up happily, maybe sparkle in eyes)
- Big smile mouth
- Arm-nubs raised up excitedly
- Body posture is BOUNCY, ENERGETIC
- Floating HIGH with energy, shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny happy electric car nearby
- Bright, energetic atmosphere
- Small sparkles around the creature

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the happy creature.
```

---

### AMZN - Box Creature

**AMZN_sad.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living cardboard box creature looking SAD
- Tan/brown cardboard body (#D4A574), colors MUTED
- Box flaps on top DROOPING down sadly like droopy ears
- The Amazon smile-arrow on front is now a FROWN (curved down)
- Two big sad dot eyes with worry lines, maybe a tear
- Body is SLUMPED, DEFLATED looking
- Floating LOW with shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny crumpled/torn tape nearby
- Dim, sad atmosphere

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the sad creature.
```

**AMZN_neutral.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living cardboard box creature with CALM expression
- Tan/brown cardboard body (#D4A574), normal colors
- Box flaps on top relaxed, slightly open
- Small neutral smile (the Amazon arrow-smile, subtle)
- Two calm dot eyes
- Relaxed posture
- Normal floating height with shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny tape roll nearby
- Calm atmosphere

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the neutral creature.
```

**AMZN_happy.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living cardboard box creature looking HAPPY and EXCITED
- Tan/brown cardboard body (#D4A574), BRIGHT vibrant colors
- Box flaps on top RAISED UP like happy arms/ears
- Big Amazon smile-arrow grin on front
- Two big happy dot eyes (curved up, sparkling)
- Body looks PLUMP, FULL, ENERGETIC
- Floating HIGH with bouncy energy, shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny happy tape roll buddy nearby
- Bright, cheerful atmosphere
- Small sparkles

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the happy creature.
```

---

### PLTR - Eye Orb Creature

**PLTR_sad.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living crystal ball creature with all-seeing eye, looking WORRIED
- Purple/blue glass orb body (#8B5CF6), colors MUTED and DIM
- ONE large eye in center IS its face - the eye looks WORRIED (eyelid half-closed, pupil small)
- Small ethereal tentacle wisps at bottom, DROOPING sadly
- Glow is DIM and flickering
- Floating LOW with shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny cracked rune nearby
- Dim, worried atmosphere

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the sad creature.
```

**PLTR_neutral.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living crystal ball creature with all-seeing eye, CALM expression
- Purple/blue glass orb body (#8B5CF6), normal colors
- ONE large eye in center IS its face - the eye looks CALM (relaxed, neutral pupil)
- Small ethereal tentacle wisps at bottom, gently flowing
- Soft ambient glow
- Normal floating height with shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny floating rune nearby
- Calm, mystical atmosphere

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the neutral creature.
```

**PLTR_happy.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living crystal ball creature with all-seeing eye, looking EXCITED
- Purple/blue glass orb body (#8B5CF6), BRIGHT and GLOWING
- ONE large eye in center IS its face - the eye looks HAPPY (wide open, sparkling pupil, maybe curved like a smile)
- Small ethereal tentacle wisps at bottom, flowing UPWARD with energy
- BRIGHT purple/blue glow pulsing
- Floating HIGH with energy, shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny glowing happy runes nearby
- Bright, magical atmosphere
- Small sparkles

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the happy creature.
```

---

### NFLX - Popcorn Creature

**NFLX_sad.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living popcorn bucket creature looking SAD
- Red and white striped bucket body (#E50914), colors MUTED
- Popcorn kernels on top look WILTED, DROOPY, some falling out
- Two big sad dot eyes on the bucket (worried, maybe teary)
- Small frown mouth
- Small arm-nubs DROOPING at sides
- Body looks DEFLATED
- Floating LOW with shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny dropped/broken remote nearby
- Spilled popcorn kernels on ground
- Dim, sad atmosphere

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the sad creature.
```

**NFLX_neutral.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living popcorn bucket creature with CALM expression
- Red and white striped bucket body (#E50914), normal colors
- Popcorn kernels on top look normal, fluffy
- Two calm dot eyes on the bucket
- Slight smile mouth
- Relaxed arm-nubs at sides
- Normal floating height with shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny remote nearby
- Calm atmosphere

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the neutral creature.
```

**NFLX_happy.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living popcorn bucket creature looking HAPPY and EXCITED
- Red and white striped bucket body (#E50914), BRIGHT vibrant colors
- Popcorn kernels on top OVERFLOWING, POPPING with joy
- Two big happy dot eyes on the bucket (curved up, sparkling)
- Big smile mouth
- Arm-nubs RAISED excitedly
- Body looks FULL, ENERGETIC
- Floating HIGH with bouncy energy, shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny happy remote buddy nearby
- Bright, fun atmosphere
- Small sparkles and popping kernels

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the happy creature.
```

---

### AMD - Crystal Creature

**AMD_sad.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living red crystal gem creature looking SAD
- Faceted red crystal body (#ED1C24), colors MUTED and DULL
- Crystal points look CRACKED, less sharp
- Two dim white dot eyes inside, looking worried
- Small orbiting crystal shards moving slowly, drooping
- Inner glow is DIM, flickering
- Floating LOW with shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny cracked circuit board nearby
- Dim, worried atmosphere

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the sad creature.
```

**AMD_neutral.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living red crystal gem creature with CALM expression
- Faceted red crystal body (#ED1C24), normal colors
- Sharp crystal points
- Two calm white dot eyes inside
- Small orbiting crystal shards floating gently
- Soft inner glow
- Normal floating height with shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny circuit board nearby
- Calm atmosphere

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the neutral creature.
```

**AMD_happy.png:**
```
Create a 64x64 pixel art sprite scene.

CHARACTER:
- A cute living red crystal gem creature looking POWERFUL and EXCITED
- Faceted red crystal body (#ED1C24), BRIGHT and GLOWING
- Sharp crystal points GLEAMING
- Two bright white dot eyes inside, looking happy/excited
- Small orbiting crystal shards spinning FAST with energy
- STRONG inner fire glow pulsing
- Floating HIGH with power, shadow beneath

ENVIRONMENT:
- Small dark platform underneath
- Tiny glowing circuit board nearby
- Powerful, energetic atmosphere
- Small sparkles and energy particles

STYLE:
- Pokemon/Tamagotchi creature aesthetic
- Clean pixel art, 12-15 colors max
- Transparent background
- 64x64 pixels

CRITICAL: Do NOT include any arrows. Just the happy creature.
```

---

## PART 3: REACT COMPONENT

```tsx
// components/SigilImage.tsx

interface SigilImageProps {
  ticker: string;
  percentChange: number;
  size?: number;
}

export function SigilImage({ ticker, percentChange, size = 64 }: SigilImageProps) {
  // Determine creature mood based on direction (not magnitude)
  const getMood = (): 'sad' | 'neutral' | 'happy' => {
    if (percentChange <= -1) return 'sad';
    if (percentChange >= 1) return 'happy';
    return 'neutral';
  };

  // Determine arrow overlay based on magnitude
  const getArrowOverlay = (): string | null => {
    if (percentChange <= -5) return '/sprites/overlays/arrows_down_6.png';
    if (percentChange <= -1) return '/sprites/overlays/arrows_down_3.png';
    if (percentChange >= 5) return '/sprites/overlays/arrows_up_6.png';
    if (percentChange >= 1) return '/sprites/overlays/arrows_up_3.png';
    return null; // neutral, no arrows
  };

  const mood = getMood();
  const arrowOverlay = getArrowOverlay();
  const baseSprite = `/sprites/base/stock_${ticker.toUpperCase()}_${mood}.png`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Base creature */}
      <img
        src={baseSprite}
        alt={`${ticker} ${mood}`}
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Arrow overlay */}
      {arrowOverlay && (
        <img
          src={arrowOverlay}
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ imageRendering: 'pixelated' }}
        />
      )}
    </div>
  );
}
```

---

## PART 4: LOGIC SUMMARY

| % Change | Mood (Base) | Arrows (Overlay) |
|----------|-------------|------------------|
| ≤ -5% | sad | arrows_down_6.png |
| -5% to -1% | sad | arrows_down_3.png |
| -1% to +1% | neutral | none |
| +1% to +5% | happy | arrows_up_3.png |
| ≥ +5% | happy | arrows_up_6.png |

---

## GENERATION ORDER

### Step 1: Generate Arrow Overlays (4 total)
1. arrows_up_3.png
2. arrows_up_6.png
3. arrows_down_3.png
4. arrows_down_6.png

Save to: `public/sprites/overlays/`

### Step 2: Generate Base Creatures (3 per stock)

**TSLA:**
1. stock_TSLA_sad.png
2. stock_TSLA_neutral.png
3. stock_TSLA_happy.png

**AMZN:**
4. stock_AMZN_sad.png
5. stock_AMZN_neutral.png
6. stock_AMZN_happy.png

**PLTR:**
7. stock_PLTR_sad.png
8. stock_PLTR_neutral.png
9. stock_PLTR_happy.png

**NFLX:**
10. stock_NFLX_sad.png
11. stock_NFLX_neutral.png
12. stock_NFLX_happy.png

**AMD:**
13. stock_AMD_sad.png
14. stock_AMD_neutral.png
15. stock_AMD_happy.png

Save to: `public/sprites/base/`

### Step 3: Update SigilImage Component
Replace current component with the one above.

---

## TOTAL SPRITES

- 4 arrow overlays (shared)
- 15 base creatures (3 per stock × 5 stocks)
- **19 total** (down from 25)

---

## VERIFICATION

After generation:
```bash
ls public/sprites/overlays/
# Should show: arrows_down_3.png, arrows_down_6.png, arrows_up_3.png, arrows_up_6.png

ls public/sprites/base/
# Should show: 15 files (stock_*_sad.png, stock_*_neutral.png, stock_*_happy.png)
```

---

## START NOW

1. First generate the 4 arrow overlays - these are the MOST important since they're shared
2. Show me arrows_up_3.png result before continuing
3. Then generate base creatures starting with TSLA_sad.png
