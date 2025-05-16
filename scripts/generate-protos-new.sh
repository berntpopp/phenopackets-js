#!/bin/bash

# Script to generate JavaScript code from .proto files for phenopackets-js
# Handles proper compilation of V1, V2, VRS, and VRSatile proto files

set -e  # Exit on error

# Base directory where .proto files are rooted
PROTO_SRC_DIR="protos/phenopacket-schema-source/src/main/proto"

# Common proto path for all phenopackets related protos
COMMON_PROTO_PATH="$PROTO_SRC_DIR"

# Output directory for generated JavaScript files
OUT_DIR="lib"

# Setup directories
echo "Setting up directories..."
mkdir -p $OUT_DIR
mkdir -p $OUT_DIR/google/protobuf
mkdir -p $OUT_DIR/phenopackets/schema/v1
mkdir -p $OUT_DIR/phenopackets/schema/v2/core
mkdir -p $OUT_DIR/phenopackets/vrs/v1  
mkdir -p $OUT_DIR/phenopackets/vrsatile/v1

# Clean up any previous generated files
echo "Cleaning previous generated files..."
rm -rf $OUT_DIR/phenopackets
rm -rf $OUT_DIR/google/protobuf
mkdir -p $OUT_DIR/phenopackets/schema/v1
mkdir -p $OUT_DIR/phenopackets/schema/v2/core
mkdir -p $OUT_DIR/phenopackets/vrs/v1
mkdir -p $OUT_DIR/phenopackets/vrsatile/v1

echo "Generating JavaScript code from proto definitions..."

# Compile VRS schema (must be first)
echo "Compiling VRS schema..."
protoc \
  --proto_path="$COMMON_PROTO_PATH" \
  --js_out=import_style=commonjs,binary:"$OUT_DIR" \
  "$COMMON_PROTO_PATH/phenopackets/vrs/v1/vrs.proto"

# Compile VRSatile schema (depends on VRS)
echo "Compiling VRSatile schema..."
protoc \
  --proto_path="$COMMON_PROTO_PATH" \
  --js_out=import_style=commonjs,binary:"$OUT_DIR" \
  "$COMMON_PROTO_PATH/phenopackets/vrsatile/v1/vrsatile.proto"

# Compile V1 schema
echo "Compiling V1 schema..."
protoc \
  --proto_path="$COMMON_PROTO_PATH" \
  --js_out=import_style=commonjs,binary:"$OUT_DIR" \
  "$COMMON_PROTO_PATH/phenopackets/schema/v1/base.proto" \
  "$COMMON_PROTO_PATH/phenopackets/schema/v1/interpretation.proto" \
  "$COMMON_PROTO_PATH/phenopackets/schema/v1/phenopackets.proto"

# Compile V2 core schema
echo "Compiling V2 core schema..."
V2_CORE_PROTO_FILES=$(find "$PROTO_SRC_DIR/phenopackets/schema/v2/core" -name "*.proto" -type f 2>/dev/null)
protoc \
  --proto_path="$COMMON_PROTO_PATH" \
  --js_out=import_style=commonjs,binary:"$OUT_DIR" \
  $V2_CORE_PROTO_FILES

# Compile V2 phenopackets.proto (depends on core)
echo "Compiling V2 phenopackets.proto..."
protoc \
  --proto_path="$COMMON_PROTO_PATH" \
  --js_out=import_style=commonjs,binary:"$OUT_DIR" \
  "$COMMON_PROTO_PATH/phenopackets/schema/v2/phenopackets.proto"

# Compile timestamp.proto (used by several schemas)
TIMESTAMP_PROTO="$PROTO_SRC_DIR/google/protobuf/timestamp.proto"
if [ -f "$TIMESTAMP_PROTO" ]; then
  echo "Compiling timestamp.proto..."
  protoc \
    --proto_path="$COMMON_PROTO_PATH" \
    --js_out=import_style=commonjs,binary:"$OUT_DIR" \
    "$TIMESTAMP_PROTO"
fi

# Verify generated files
echo "Verifying generated files..."
GENERATED_COUNT=$(find "$OUT_DIR" -type f -name "*.js" | wc -l)
echo "Generated $GENERATED_COUNT JavaScript files"

if [ "$GENERATED_COUNT" -eq 0 ]; then
  echo "❌ ERROR: No JavaScript files were generated!"
  exit 1
fi

# Show summary of generated files
echo "✅ Successfully generated JavaScript code from proto definitions"
echo "V1 files:"
ls -la "$OUT_DIR/phenopackets/schema/v1/" 2>/dev/null || echo "No V1 files generated"

echo "V2 files:"
ls -la "$OUT_DIR/phenopackets/schema/v2/core/" 2>/dev/null || echo "No V2 core files generated"
ls -la "$OUT_DIR/phenopackets/schema/v2/" 2>/dev/null || echo "No V2 files generated"

echo "VRS files:"
ls -la "$OUT_DIR/phenopackets/vrs/v1/" 2>/dev/null || echo "No VRS files generated"

echo "VRSatile files:"
ls -la "$OUT_DIR/phenopackets/vrsatile/v1/" 2>/dev/null || echo "No VRSatile files generated"

echo "Make sure to update index.js to export the generated classes"
