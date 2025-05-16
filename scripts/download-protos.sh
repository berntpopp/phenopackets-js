#!/bin/bash

# Script to download phenopacket-schema and VRS proto files directly without Git submodules
# This avoids Git submodule issues while still providing the necessary proto files

set -e # Exit on error

# Define versions and URLs
PHENOPACKET_SCHEMA_VERSION="2.0.0"
PHENOPACKET_SCHEMA_URL="https://github.com/phenopackets/phenopacket-schema/archive/refs/tags/v${PHENOPACKET_SCHEMA_VERSION}.zip"
VRS_VERSION="1.2.1"
VRS_URL="https://github.com/ga4gh/vrs-protobuf/archive/refs/tags/v${VRS_VERSION}.zip"

# Create directories
mkdir -p tmp
mkdir -p protos/phenopacket-schema-source/src
mkdir -p protos/vrs-protobuf

echo "Downloading phenopacket-schema v${PHENOPACKET_SCHEMA_VERSION}..."
curl -L -o tmp/phenopacket-schema.zip ${PHENOPACKET_SCHEMA_URL}

echo "Downloading VRS protobuf v${VRS_VERSION}..."
curl -L -o tmp/vrs-protobuf.zip ${VRS_URL}

echo "Extracting phenopacket-schema..."
unzip -q -o tmp/phenopacket-schema.zip -d tmp/
cp -r tmp/phenopacket-schema-${PHENOPACKET_SCHEMA_VERSION}/src/* protos/phenopacket-schema-source/src/

echo "Extracting VRS protobuf..."
unzip -q -o tmp/vrs-protobuf.zip -d tmp/
cp -r tmp/vrs-protobuf-${VRS_VERSION}/* protos/vrs-protobuf/

# Create the link from phenopacket-schema to VRS
# This mimics the submodule structure expected by the generate-protos.sh script
mkdir -p protos/phenopacket-schema-source/src/vrs-protobuf
cp -r protos/vrs-protobuf/* protos/phenopacket-schema-source/src/vrs-protobuf/

echo "Cleaning up temporary files..."
rm -rf tmp

echo "Proto files downloaded successfully!"
echo "Run 'bash scripts/generate-protos.sh' to generate the JavaScript classes."
