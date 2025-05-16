#!/bin/bash

# Script to clone the phenopacket-schema and related repos directly
# This approach is more reliable than downloading ZIP files

set -e # Exit on error

echo "Setting up phenopacket-schema and dependencies using Git clone..."

# Clean up any existing protos directory
if [ -d "protos" ]; then
  echo "Removing existing protos directory..."
  rm -rf protos
fi

# Create protos directory
mkdir -p protos

# Clone phenopacket-schema with recursive flag to automatically get submodules
echo "Cloning phenopacket-schema repository with submodules..."
git clone --recursive https://github.com/phenopackets/phenopacket-schema.git protos/phenopacket-schema-source

# Create the expected directory structure for the generate-protos.sh script
echo "Setting up directory structure for proto generation..."
mkdir -p protos/phenopacket-schema-source/src/vrs-protobuf

# Check if VRS submodule was properly cloned
if [ -d "protos/phenopacket-schema-source/src/vrs-protobuf" ]; then
  echo "VRS protobuf directory exists - directory structure is correct"
else
  echo "VRS protobuf directory not found in the expected location"
  
  # Check if it's in a different location
  if [ -d "protos/phenopacket-schema-source/external/vrs-protobuf" ]; then
    echo "Found VRS protobuf in external directory - creating link"
    cp -r protos/phenopacket-schema-source/external/vrs-protobuf/* protos/phenopacket-schema-source/src/vrs-protobuf/
  else
    echo "Manually cloning VRS protobuf repository..."
    git clone https://github.com/ga4gh/vrs-protobuf.git protos/vrs-protobuf
    cp -r protos/vrs-protobuf/* protos/phenopacket-schema-source/src/vrs-protobuf/
  fi
fi

echo "Setup complete! Proto files are now available for generation."
echo "Run 'npm run generate-protos' to generate the JavaScript classes."
