#!/bin/bash

# Script to set up the phenopackets-js repository with all required submodules
# This script will:
# 1. Clone the phenopacket-schema repository as a submodule
# 2. Initialize and update the VRS protobuf submodule within phenopacket-schema
# 3. Run npm install to install dependencies

set -e # Exit on error

echo "Setting up phenopackets-js repository..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || ! grep -q "phenopackets-js" "package.json"; then
  echo "Error: This script must be run from the root of the phenopackets-js repository"
  exit 1
fi

# Step 1: Add phenopacket-schema as a submodule if it doesn't exist
if [ ! -d "protos/phenopacket-schema-source" ]; then
  echo "Adding phenopacket-schema repository as a submodule..."
  git submodule add https://github.com/phenopackets/phenopacket-schema.git protos/phenopacket-schema-source
else
  echo "phenopacket-schema submodule already exists"
fi

# Step 2: Initialize and update all submodules
echo "Initializing and updating all submodules..."
git submodule update --init --recursive

# Step 3: Specifically check and update the VRS protobuf submodule
if [ ! -d "protos/phenopacket-schema-source/src/vrs-protobuf" ]; then
  echo "Initializing VRS protobuf submodule..."
  (cd protos/phenopacket-schema-source && git submodule init && git submodule update)
  
  if [ ! -d "protos/phenopacket-schema-source/src/vrs-protobuf" ]; then
    echo "Error: Failed to initialize VRS protobuf submodule"
    exit 1
  fi
else
  echo "VRS protobuf submodule already exists"
fi

# Step 4: Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Step 5: Check if protoc is installed
if ! command -v protoc &> /dev/null; then
  echo "Warning: Protocol Buffer Compiler (protoc) is not installed or not in PATH"
  echo "Please install protoc before running the generate-protos.sh script"
  echo "See the README.md for installation instructions"
else
  PROTOC_VERSION=$(protoc --version)
  echo "Found Protocol Buffer Compiler: $PROTOC_VERSION"
fi

echo "Setup complete!"
echo "You can now run 'npm run generate-protos' to generate JavaScript code from the .proto files"
