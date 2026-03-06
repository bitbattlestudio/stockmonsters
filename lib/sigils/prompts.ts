// lib/sigils/prompts.ts

export const BASE_TEMPLATES: Record<string, string> = {
  'apple-fruit': `
    A cute Apple Inc. logo character in a floating habitat.
    - Apple silhouette with BITE taken out of right side (like the Apple logo)
    - Single leaf on top, tilted right
    - Subtle friendly face - two small dot eyes
    - Clean, sleek, premium tech feel
    - Floating with small oval shadow beneath
  `,

  battery: `
    A cute electric battery character in a floating habitat.
    - Cylindrical battery shape (like AA or Powerwall)
    - Charge indicator on front
    - Subtle friendly face - two small dot eyes
    - Sleek, electric/modern feel
    - Small lightning bolt symbol on chest
    - Floating with small shadow beneath
  `,

  'cardboard-box': `
    A cute cardboard delivery box character in a floating habitat.
    - Classic brown cardboard box shape
    - Box flaps slightly open on top
    - Small smile curve on front (like Amazon's arrow-smile)
    - Subtle friendly face - two small dot eyes above the smile
    - Floating with small shadow beneath
  `,

  'magnifying-glass': `
    A cute magnifying glass character in a floating habitat.
    - Round glass lens with subtle reflection
    - Colorful handle (primary color)
    - Subtle friendly face - two small dot eyes inside the lens
    - Small sparkle on glass showing it's "searching"
    - Floating with small shadow beneath
  `,

  'green-crystal': `
    A cute geometric crystal/gem character in a floating habitat.
    - Faceted crystal shape, glowing with inner energy
    - Multiple crystal points, largest in center
    - Subtle friendly face - two small glowing dot eyes
    - Inner glow suggesting power
    - Floating with small shadow beneath
  `,

  'red-crystal': `
    A cute geometric crystal/gem character in a floating habitat.
    - Faceted crystal shape, glowing with inner red energy
    - Multiple crystal points, largest in center
    - Subtle friendly face - two small glowing dot eyes
    - Inner red glow suggesting power
    - Floating with small shadow beneath
  `,

  'window-screen': `
    A cute computer monitor/window character in a floating habitat.
    - Rectangular screen with 4-pane window grid displayed (like Windows logo)
    - Sleek modern monitor shape
    - Subtle friendly face - two small dot eyes on screen
    - Small stand at bottom
    - Floating with small shadow beneath
  `,

  'vr-goggles': `
    A cute VR headset character in a floating habitat.
    - Modern VR goggles shape (like Meta Quest)
    - Sleek white/gray body
    - Glowing blue lenses
    - Subtle friendly expression through the lens glow
    - Floating with small shadow beneath
  `,

  'tv-screen': `
    A cute flat-screen TV character in a floating habitat.
    - Modern flat panel TV shape
    - Glowing screen with subtle play button visible
    - Sleek black bezel/frame
    - Subtle friendly face - two small dot eyes on screen
    - Small legs/stand at bottom
    - Floating with small shadow beneath
  `,

  'coffee-cup': `
    A cute coffee cup character in a floating habitat.
    - Classic takeaway coffee cup with lid
    - Cardboard sleeve in the middle
    - Small steam wisps rising from top
    - Subtle friendly face - two small dot eyes
    - Floating with small shadow beneath
  `,

  sneaker: `
    A cute athletic sneaker character in a floating habitat.
    - Modern running shoe shape, side profile
    - Sleek design with visible swoosh/stripe
    - Subtle friendly face - two small dot eyes on the side
    - Small motion lines suggesting speed
    - Floating with small shadow beneath
  `,

  'credit-card': `
    A cute credit card character in a floating habitat.
    - Rectangular card shape with rounded corners
    - Chip visible on front
    - Subtle friendly face - two small dot eyes
    - Small payment wave symbol nearby
    - Floating with small shadow beneath
  `,

  'bank-building': `
    A cute bank/financial building character in a floating habitat.
    - Classic bank facade with columns
    - Triangular roof/pediment on top
    - Subtle friendly face - two small dot eyes (windows)
    - Small steps at entrance
    - Floating with small shadow beneath
  `,

  'gold-coin': `
    A cute golden coin character in a floating habitat.
    - Circular coin shape with shiny metallic surface
    - Currency symbol or pattern on front
    - Subtle friendly face - two small dot eyes
    - Gleaming edge highlight
    - Floating with small shadow beneath
  `,

  'blue-coin': `
    A cute blue coin character in a floating habitat.
    - Circular coin shape with modern tech feel
    - Subtle circuit pattern on surface
    - Subtle friendly face - two small dot eyes
    - Blue glow effect
    - Floating with small shadow beneath
  `,

  diamond: `
    A cute diamond/gem character in a floating habitat.
    - Classic diamond shape (top-down or angled view)
    - Faceted surfaces with light refraction
    - Subtle friendly face - two small glowing dot eyes
    - Ethereal glow effect
    - Floating with small shadow beneath
  `,

  'pill-capsule': `
    A cute medicine capsule character in a floating habitat.
    - Two-tone pill capsule shape (horizontal or vertical)
    - Smooth, clean medical feel
    - Subtle friendly face - two small dot eyes
    - Small plus sign or heart nearby
    - Floating with small shadow beneath
  `,

  'oil-barrel': `
    A cute oil barrel character in a floating habitat.
    - Classic oil drum shape with ridges
    - Industrial but friendly
    - Subtle friendly face - two small dot eyes
    - Small oil drop nearby
    - Floating with small shadow beneath
  `,

  'lightning-bolt': `
    A cute lightning bolt character in a floating habitat.
    - Classic zigzag lightning bolt shape
    - Glowing electric energy
    - Subtle friendly face - two small dot eyes
    - Electric sparkles around it
    - Floating with small shadow beneath
  `,

  castle: `
    A cute fairytale castle character in a floating habitat.
    - Classic Disney-style castle silhouette
    - Multiple towers with pointed spires
    - Subtle friendly face - two small dot eyes (windows)
    - Magical sparkles around it
    - Floating with small shadow beneath
  `,

  fries: `
    A cute french fries character in a floating habitat.
    - Classic red fry container/box
    - Golden fries sticking out the top
    - Subtle friendly face - two small dot eyes on the container
    - Cheerful fast food vibe
    - Floating with small shadow beneath
  `,

  'soda-cup': `
    A cute soda cup character in a floating habitat.
    - Classic fountain drink cup with lid and straw
    - Condensation droplets on outside
    - Subtle friendly face - two small dot eyes
    - Refreshing, bubbly vibe
    - Floating with small shadow beneath
  `,

  rocket: `
    A cute rocket ship character in a floating habitat.
    - Classic rocket shape with pointed nose cone
    - Fins at the base
    - Subtle friendly face - two small dot eyes (windows)
    - Small flame/thrust at bottom
    - Floating with small shadow beneath
  `,

  globe: `
    A cute Earth globe character in a floating habitat.
    - Spherical globe showing continents and oceans
    - Slight tilt on axis
    - Subtle friendly face - two small dot eyes
    - Small stand or floating freely
    - Floating with small shadow beneath
  `,

  'crystal-ball': `
    A cute crystal ball character in a floating habitat.
    - Magical glass orb with swirling mist inside
    - Ornate golden stand/base
    - Subtle friendly face - two small glowing dot eyes peering through mist
    - Mystical purple/blue glow
    - Floating with small shadow beneath
  `,

  trophy: `
    A cute trophy cup character in a floating habitat.
    - Classic golden trophy cup shape
    - Two handles on sides
    - Subtle friendly face - two small dot eyes on the cup
    - Shiny, champion vibe
    - Floating with small shadow beneath
  `,

  'ballot-box': `
    A cute ballot box character in a floating habitat.
    - Rectangular box with slot on top
    - Red, white, and blue accents
    - Subtle friendly face - two small dot eyes
    - Small ballot paper nearby
    - Floating with small shadow beneath
  `,

  'shopping-bag': `
    A cute shopping bag character in a floating habitat.
    - Classic retail paper bag shape
    - Handles on top
    - Subtle friendly face - two small dot eyes
    - Small tag or receipt nearby
    - Floating with small shadow beneath
  `,

  'chart-generic': `
    A cute chart/graph character in a floating habitat.
    - Rectangular frame showing upward trending line
    - Clean, modern data visualization look
    - Subtle friendly face - two small dot eyes
    - Small data points visible
    - Floating with small shadow beneath
  `,

  cloud: `
    A cute cloud character in a floating habitat.
    - Fluffy white cloud shape
    - Modern tech/data cloud feel
    - Subtle friendly face - two small dot eyes
    - Small data nodes or sparkles nearby
    - Floating with small shadow beneath
  `,

  'paint-palette': `
    A cute paint palette character in a floating habitat.
    - Classic artist's palette shape with thumb hole
    - Multiple colorful paint blobs on surface
    - Subtle friendly face - two small dot eyes
    - Small paintbrush nearby
    - Floating with small shadow beneath
  `,

  gear: `
    A cute mechanical gear character in a floating habitat.
    - Classic cog/gear wheel shape with teeth
    - Metallic industrial feel
    - Subtle friendly face - two small dot eyes in center
    - Small sparks or motion lines
    - Floating with small shadow beneath
  `,
};
