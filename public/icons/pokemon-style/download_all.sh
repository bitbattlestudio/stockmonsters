#!/bin/bash
# Download all Pokemon-style icons

cd "$(dirname "$0")"

echo "Downloading all Pokemon-style icons..."

# Batch 1 - Critical
curl --fail -o health-heart.png "https://api.pixellab.ai/mcp/map-objects/5f280c59-89a5-4ebb-92e2-f33d1391c530/download" && echo "✓ health-heart"
curl --fail -o hunger-apple.png "https://api.pixellab.ai/mcp/map-objects/15761971-c0de-4c58-af53-ddc7a1e8ac2e/download" && echo "✓ hunger-apple"
curl --fail -o happiness.png "https://api.pixellab.ai/mcp/map-objects/f455778f-e1c3-4e38-bfa1-60897c276b2b/download" && echo "✓ happiness"
curl --fail -o trending-up.png "https://api.pixellab.ai/mcp/map-objects/cebc8538-2c31-459b-9e20-7108d82b6f9b/download" && echo "✓ trending-up"
curl --fail -o trending-down.png "https://api.pixellab.ai/mcp/map-objects/798597e5-b7b6-41db-8f6d-371ad855329e/download" && echo "✓ trending-down"

# Batch 2
curl --fail -o sad.png "https://api.pixellab.ai/mcp/map-objects/7b85113b-7125-46db-bb1f-0c2a70b76387/download" && echo "✓ sad"
curl --fail -o star.png "https://api.pixellab.ai/mcp/map-objects/38d74e1b-f63a-4a0b-bde7-82f3ca3975a7/download" && echo "✓ star"
curl --fail -o rocket.png "https://api.pixellab.ai/mcp/map-objects/b74fa2fb-ef22-4bda-9a07-ebc78e0b9183/download" && echo "✓ rocket"
curl --fail -o chart.png "https://api.pixellab.ai/mcp/map-objects/8e01d8ee-9f70-4ec6-8d59-5796b8146944/download" && echo "✓ chart"
curl --fail -o diamond.png "https://api.pixellab.ai/mcp/map-objects/e9f039ad-7a3b-4b85-9955-dd57db42870a/download" && echo "✓ diamond"

# Batch 3
curl --fail -o swap.png "https://api.pixellab.ai/mcp/map-objects/e23d954c-83e5-4506-bca2-aea6c63bd8cc/download" && echo "✓ swap"
curl --fail -o checkmark.png "https://api.pixellab.ai/mcp/map-objects/775b8ee5-fce3-4fd6-9cb5-d72cfbdc5961/download" && echo "✓ checkmark"
curl --fail -o x-mark.png "https://api.pixellab.ai/mcp/map-objects/778b77a6-1014-42a9-abe3-e0de99a9de44/download" && echo "✓ x-mark"
curl --fail -o warning.png "https://api.pixellab.ai/mcp/map-objects/b12b7aee-0404-4581-a48d-e2d4233d9078/download" && echo "✓ warning"
curl --fail -o bell.png "https://api.pixellab.ai/mcp/map-objects/4c87698d-c9a0-4202-a59e-7520daa36e97/download" && echo "✓ bell"

# Batch 4
curl --fail -o backpack.png "https://api.pixellab.ai/mcp/map-objects/578564a5-5d4b-4188-8688-9e97c3a930c7/download" && echo "✓ backpack"
curl --fail -o celebration.png "https://api.pixellab.ai/mcp/map-objects/d399ca7f-ef95-4780-b758-6020485326a8/download" && echo "✓ celebration"
curl --fail -o link.png "https://api.pixellab.ai/mcp/map-objects/a6226faf-6402-4fc8-b474-94121a44d195/download" && echo "✓ link"
curl --fail -o target.png "https://api.pixellab.ai/mcp/map-objects/1501f0a1-a1ed-4562-b2c5-c9c547d18305/download" && echo "✓ target"
curl --fail -o wizard.png "https://api.pixellab.ai/mcp/map-objects/51cee72e-a421-4e27-9473-f12248177214/download" && echo "✓ wizard"

# Batch 5
curl --fail -o sparkle.png "https://api.pixellab.ai/mcp/map-objects/de665169-b214-4656-a202-f67b393f6180/download" && echo "✓ sparkle"
curl --fail -o balance.png "https://api.pixellab.ai/mcp/map-objects/990cbd15-4d11-4d6a-9e45-8a6105c16790/download" && echo "✓ balance"
curl --fail -o vote.png "https://api.pixellab.ai/mcp/map-objects/2324d4fd-f9ec-43ba-9e6e-0d0864ad162a/download" && echo "✓ vote"
curl --fail -o bank.png "https://api.pixellab.ai/mcp/map-objects/ac5f2b2a-38fd-4f9f-8318-94c2fb14e7c9/download" && echo "✓ bank"
curl --fail -o health-check.png "https://api.pixellab.ai/mcp/map-objects/455ef579-c465-4040-88cd-ae7dfc1ccdd1/download" && echo "✓ health-check"

echo ""
echo "Download complete! Check for any failures above."
ls -lh *.png | wc -l
echo "icons downloaded."
