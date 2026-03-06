#!/bin/bash
# Download all sprites with error handling

declare -A sprites=(
  ["META_bad"]="bb29c119-b6b0-452a-ac87-8282717524e9"
  ["META_good"]="f0e6cd43-d565-42e3-9d45-45be26079a61"
  ["META_neutral"]="b155b59b-06a8-46f9-be9f-1770ffac247e"
  ["TSLA_bad"]="15d56016-472e-4c45-9b69-254589d1bc8a"
  ["TSLA_good"]="7b34e24c-7e18-4a38-8410-77ccdbde272d"
  ["AMZN_bad"]="d15d1eb5-52cd-482f-b2f3-892ac793aa69"
  ["AMZN_good"]="68fca95f-ad49-4cb6-9737-2e72cdf92e79"
  ["NFLX_bad"]="31425b27-59df-45a8-8a80-070b57934af1"
  ["NFLX_good"]="8323aef7-a110-4c06-84bb-cdf61e7ce6e6"
  ["NVDA_bad"]="2f7bdefd-d967-4db3-9616-b6cfc55cc2b7"
  ["NVDA_good"]="be3a2866-2680-4a7c-84cc-587cfec9fc5a"
  ["PLTR_bad"]="fe80e08e-3f4a-4831-b74c-88a1f57e0562"
  ["PLTR_good"]="03306209-6485-4144-b0f4-14b656871c37"
  ["AMD_bad"]="c01d2fef-b007-4471-9115-71b4ebbf21c3"
  ["AMD_good"]="71d102a2-958a-4d6b-a71d-8c23026f6164"
)

for name in "${!sprites[@]}"; do
  id="${sprites[$name]}"
  echo "Downloading $name..."
  if curl --fail -s -o "${name}.zip" "https://api.pixellab.ai/mcp/characters/${id}/download"; then
    echo "✓ Downloaded $name"
  else
    echo "✗ Failed to download $name (might not be ready yet)"
  fi
done
