# Sprite Generation Tracker

## Queued Generations - 2026-03-02

### AAPL (Apple) - 4 sprites
- ✅ State 3: Already exists (stock_AAPL_3.png)
- 🔄 State 1 (Crashing): `790ef3c7-ffb6-4128-8d5d-9400ba5ab106` - Very sad/defeated
- 🔄 State 2 (Down): `a15dd6a3-9fdb-4f37-b037-19ad1e146d4c` - Slightly sad/concerned
- 🔄 State 4 (Up): `7f9f2d63-0514-4f5c-a36c-d4a2f4fc8aab` - Happy/energetic
- 🔄 State 5 (Mooning): `e927eb22-cbdc-45e4-8267-29598ec6dce2` - Extremely happy/celebrating

### META (Facebook) - 4 sprites
- ✅ State 1: Already exists (stock_META_1.png)
- 🔄 State 2 (Down): `fea2e490-e115-4aaf-8b0c-cffd1c789974` - Slightly sad/concerned
- 🔄 State 3 (Neutral): `f64dc785-9584-426c-8180-0a30de650001` - Neutral/calm
- 🔄 State 4 (Up): `6ab5a7ee-cb8d-4cce-b395-00bac6e07d70` - Happy/energetic
- 🔄 State 5 (Mooning): `e20e5f00-1be4-4fc4-bc84-9f8663d8ef67` - Extremely happy/celebrating

### TSLA (Tesla) - 4 sprites
- ✅ State 4: Already exists (stock_TSLA_4.png)
- 🔄 State 1 (Crashing): `9bc7c597-0da2-4b7f-ac12-cc3853b73756` - Very sad/defeated
- 🔄 State 2 (Down): `f6dad8f2-5a7b-414c-8908-25fdfad5926e` - Slightly sad/concerned
- 🔄 State 3 (Neutral): `38cdc2d3-d725-4e35-bfd9-594b40b3d77f` - Neutral/calm
- 🔄 State 5 (Mooning): `71bca975-1494-4f3d-b1f1-b48fc43f3eda` - Extremely happy/celebrating

## State Definitions
- **State 1**: <= -10% (crashing/very sad)
- **State 2**: -2% to -10% (down/concerned)
- **State 3**: -2% to +2% (neutral)
- **State 4**: +2% to +10% (up/happy)
- **State 5**: >= +10% (mooning/celebrating)

## Generation Settings
- Size: 64×64px
- Directions: 4 (south, west, east, north)
- View: high top-down
- Shading: medium
- Outline: single color black
- Detail: medium
- Proportions: chibi

## Download Paths
All sprites should be saved to:
`/Users/bobby/Documents/Swish/sigils/public/sprites/generated/stock_{TICKER}_{STATE}.png`

We'll use the south-facing direction for the main sprite.
