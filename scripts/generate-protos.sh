#!/bin/bash

# Script to generate JavaScript code from .proto files

# Adjust this path if you use a submodule or place protos elsewhere
# Assumes the official phenopacket-schema is submoduled into 'protos/phenopacket-schema-source'
# and that its 'src/main/proto' directory contains 'phenopackets' and 'google' (if needed)
# Also assumes the vrs-protobuf schemas are correctly located relative to the main phenopacket .proto files.
# The main phenopacket schema seems to use relative paths like `import "phenopackets/vrs/v1/vrs.proto";`
# so the key is to have a PROTOC_GEN_DIR that contains the `phenopackets` and `google` top-level directories.

# Base directory where .proto files for phenopackets, vrs, vrsatile, and google/protobuf are rooted.
# If using a submodule:
PROTO_SRC_DIR="protos/phenopacket-schema-source/src/main/proto"

# Check for VRS-protobuf - either as a submodule or direct clone
VRS_PROTO_DIR="protos/phenopacket-schema-source/src/vrs-protobuf"
DIRECT_VRS_DIR="protos/vrs-protobuf"

if [ -d "$VRS_PROTO_DIR" ]; then
  echo "VRS protobuf found at $VRS_PROTO_DIR"
elif [ -d "$DIRECT_VRS_DIR" ]; then
  echo "Direct VRS protobuf found at $DIRECT_VRS_DIR"
  
  # Create the directory if it doesn't exist
  mkdir -p "$VRS_PROTO_DIR" 2>/dev/null
  
  # On Windows, we may have used a direct clone instead of a submodule
  echo "Using directly cloned VRS repository..."
  
  # If using Windows, try to create symlink or copy files
  if [ -f "/c/Windows/System32/cmd.exe" ] || [ -f "C:/Windows/System32/cmd.exe" ]; then
    echo "Windows detected. Ensuring VRS files are properly linked..."
    # For Windows: If symlink failed in setup script, copy the files
    cp -r "$DIRECT_VRS_DIR"/* "$VRS_PROTO_DIR/" 2>/dev/null
  else
    # For Unix systems: create a symlink
    ln -sf "../../$DIRECT_VRS_DIR" "$VRS_PROTO_DIR" 2>/dev/null || \
    cp -r "$DIRECT_VRS_DIR"/* "$VRS_PROTO_DIR/" 2>/dev/null
  fi
else
  echo "VRS protobuf not found at $VRS_PROTO_DIR or $DIRECT_VRS_DIR"
  echo "Checking if we need to initialize submodules..."
  
  # Try to initialize and update submodules if they exist
  if [ -f "protos/phenopacket-schema-source/.gitmodules" ]; then
    echo "Found .gitmodules file. Initializing submodules..."
    (cd protos/phenopacket-schema-source && git submodule init && git submodule update)
    
    if [ -d "$VRS_PROTO_DIR" ]; then
      echo "Successfully initialized VRS protobuf submodule"
    else
      echo "Failed to initialize VRS protobuf submodule"
    fi
  else
    echo "No .gitmodules file found in phenopacket-schema-source"
  fi
fi

# Enable verbose logging
set -x

# Output directory for generated JavaScript
OUT_DIR="lib"

echo "Removing old generated files from $OUT_DIR..."
rm -rf "$OUT_DIR/phenopackets"
rm -rf "$OUT_DIR/google/protobuf" # Only if timestamp.proto is generated into here
# Add other specific rm -rf commands if your output structure is more nested

echo "Creating output directory structure..."
mkdir -p "$OUT_DIR"
mkdir -p "$OUT_DIR/google/protobuf" # For timestamp if not handled by grpc-tools include
mkdir -p "$OUT_DIR/phenopackets/schema/v2/core"
mkdir -p "$OUT_DIR/phenopackets/vrs"
mkdir -p "$OUT_DIR/phenopackets/vrsatile"


echo "Generating JavaScript files from .proto definitions..."

# Note: Ensure protoc can find google/protobuf/timestamp.proto.
# grpc-tools usually bundles this. If not, you might need to copy it into your PROTO_SRC_DIR/google/protobuf
# or add another -I flag pointing to where protoc can find it.

# The paths to .proto files should be relative to one of the --proto_path directories.
# For VRS, phenopacket-schema uses a submodule `vrs-protobuf` and paths like:
# `import "phenopackets/vrs/v1/vrs.proto";`
# The main `src/main/proto` dir in phenopacket-schema *contains* `phenopackets/vrs/v1/vrs.proto`
# because it's effectively `src/main/proto/phenopackets/vrs-protobuf/schema/vrs.proto` copied to `src/main/proto/phenopackets/vrs/v1/vrs.proto`
# The pom.xml shows `src/main/proto` as the source directory.
# The vrs.proto file itself uses `option java_package = "org.ga4gh.vrs.v1";` so output goes to org/ga4gh/vrs/v1

# Therefore, if $PROTO_SRC_DIR points to `phenopacket-schema/src/main/proto`, then
# the specific files are found under phenopackets/schema/v2 etc.

# If google/protobuf/timestamp.proto is not found, you might need to:
# 1. Copy it from protoc installation or googleapis/protobuf repo to $PROTO_SRC_DIR/google/protobuf/timestamp.proto
# 2. Or, find the include path for protoc that contains it (e.g. for grpc-tools it's often bundled)

echo "Finding proto files that we can compile..."
find "$PROTO_SRC_DIR/phenopackets" -name "*.proto" -type f

# We need to exclude files that have dependencies on VRS and VRSATILE
# since those dependencies are missing

# First compile v1 proto files
echo "Generating JavaScript files from v1 proto definitions..."
protoc \
  --proto_path="$PROTO_SRC_DIR" \
  --js_out=import_style=commonjs,binary:"$OUT_DIR" \
  "$PROTO_SRC_DIR/phenopackets/schema/v1/base.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v1/interpretation.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v1/phenopackets.proto"

# Check if v1 files were generated
echo "Checking v1 generated files:"
find "$OUT_DIR/phenopackets/schema/v1" -name "*.js" -type f 2>/dev/null || echo "No v1 files were generated!"

# Then compile v2 proto files (excluding interpretation.proto which has dependencies on VRS/VRSATILE)
echo "Generating JavaScript files from v2 core proto definitions (excluding interpretation.proto)..."

# Check that the v2 proto files exist before trying to compile them
echo "Verifying v2 proto files exist:"
for FILE in \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/base.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/biosample.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/disease.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/genome.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/individual.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/measurement.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/medical_action.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/meta_data.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/pedigree.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/core/phenotypic_feature.proto" \
  "$PROTO_SRC_DIR/phenopackets/schema/v2/phenopackets.proto"
do
  if [ -f "$FILE" ]; then
    echo "Found: $FILE"
  else
    echo "MISSING: $FILE"
  fi
done

# Now attempt to compile all v2 files together if VRS submodule is available
if [ -d "$VRS_PROTO_DIR/schema" ]; then
  echo "Compiling all v2 proto files including VRS dependencies..."
  
  # First compile the VRS proto file (this is the base dependency)
  echo "Compiling VRS proto file..."
  mkdir -p "$OUT_DIR/phenopackets/vrs/v1"
  mkdir -p "$OUT_DIR/phenopackets/vrsatile/v1"
  
  # Compile VRS first
  protoc \
    --proto_path="$PROTO_SRC_DIR" \
    --proto_path="$VRS_PROTO_DIR" \
    --js_out=import_style=commonjs,binary:"$OUT_DIR" \
    "$VRS_PROTO_DIR/schema/vrs.proto"
  
  # Compile VRSatile second
  echo "Compiling VRSatile proto file..."
  protoc \
    --proto_path="$PROTO_SRC_DIR" \
    --proto_path="$VRS_PROTO_DIR" \
    --js_out=import_style=commonjs,binary:"$OUT_DIR" \
    "$PROTO_SRC_DIR/phenopackets/vrsatile/v1/vrsatile.proto"
  
  # Now compile the phenopackets v2 files
  echo "Compiling phenopackets v2 files..."
  protoc \
    --proto_path="$PROTO_SRC_DIR" \
    --proto_path="$VRS_PROTO_DIR" \
    --js_out=import_style=commonjs,binary:"$OUT_DIR" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/"*.proto \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/phenopackets.proto"
  
  # Check if compilation succeeded
  if [ $? -eq 0 ]; then
    echo "Successfully compiled all v2 proto files"
  else
    echo "Failed to compile all v2 proto files together, falling back to individual compilation"
    
    # Fallback approach: compile files individually
    echo "Compiling v2 files individually..."
    
    # Compile base.proto (this has no dependencies and should always work)
    protoc \
      --proto_path="$PROTO_SRC_DIR" \
      --proto_path="$VRS_PROTO_DIR" \
      --js_out=import_style=commonjs,binary:"$OUT_DIR" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/base.proto"
    
    # Try to compile each other core proto individually
    for PROTO_FILE in \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/biosample.proto" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/disease.proto" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/genome.proto" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/individual.proto" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/interpretation.proto" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/measurement.proto" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/medical_action.proto" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/meta_data.proto" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/pedigree.proto" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/core/phenotypic_feature.proto"
    do
      echo "Compiling $PROTO_FILE"
      protoc \
        --proto_path="$PROTO_SRC_DIR" \
        --proto_path="$VRS_PROTO_DIR" \
        --js_out=import_style=commonjs,binary:"$OUT_DIR" \
        "$PROTO_FILE" || echo "Failed to compile $PROTO_FILE"
    done
    
    # Try to compile phenopackets.proto 
    echo "Attempting to compile phenopackets.proto"
    protoc \
      --proto_path="$PROTO_SRC_DIR" \
      --proto_path="$VRS_PROTO_DIR" \
      --js_out=import_style=commonjs,binary:"$OUT_DIR" \
      "$PROTO_SRC_DIR/phenopackets/schema/v2/phenopackets.proto" || echo "Failed to compile phenopackets.proto"
  fi
else
  # VRS submodule not available, compile files that don't depend on VRS
  echo "VRS submodule not available, compiling v2 files individually without VRS dependencies..."
  
  # Compile base.proto (this has no dependencies and should always work)
  protoc --proto_path="$PROTO_SRC_DIR" --js_out=import_style=commonjs,binary:"$OUT_DIR" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/base.proto"
  
  # Try to compile each other core proto individually
  for PROTO_FILE in \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/biosample.proto" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/disease.proto" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/genome.proto" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/individual.proto" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/measurement.proto" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/medical_action.proto" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/meta_data.proto" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/pedigree.proto" \
    "$PROTO_SRC_DIR/phenopackets/schema/v2/core/phenotypic_feature.proto"
  do
    echo "Compiling $PROTO_FILE"
    protoc --proto_path="$PROTO_SRC_DIR" --js_out=import_style=commonjs,binary:"$OUT_DIR" "$PROTO_FILE" || echo "Failed to compile $PROTO_FILE"
  done
  
  echo "Skipping interpretation.proto and phenopackets.proto since they depend on VRS"
fi

# If you also want TypeScript definitions using ts-protoc-gen:
# Make sure ts-protoc-gen is installed (npm install --save-dev ts-protoc-gen)
# PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts"
# protoc \
#   --plugin="protoc-gen-ts=${PROTOC_GEN_TS_PATH}" \
#   --proto_path="$PROTO_SRC_DIR" \
#   --js_out=import_style=commonjs,binary:"$OUT_DIR" \
#   --ts_out="$OUT_DIR" \
#   "$PROTO_SRC_DIR/google/protobuf/timestamp.proto" \
#   "$PROTO_SRC_DIR/phenopackets/schema/v2/core/"*.proto \
#   "$PROTO_SRC_DIR/phenopackets/schema/v2/phenopackets.proto" \
#   "$PROTO_SRC_DIR/phenopackets/vrs/v1/vrs.proto" \
#   "$PROTO_SRC_DIR/phenopackets/vrsatile/v1/vrsatile.proto"


echo "Checking generated files:"
find "$OUT_DIR" -type f -name "*.js" | sort

GENERATED_COUNT=$(find "$OUT_DIR" -type f -name "*.js" | wc -l)
echo "Found $GENERATED_COUNT generated JavaScript files"

if [ "$GENERATED_COUNT" -eq 0 ]; then
  echo "ERROR: No JavaScript files were generated! Something went wrong."
  echo "Check the protoc output above for errors."
  exit 1
else
  echo "SUCCESS: Generated $GENERATED_COUNT JavaScript files in $OUT_DIR directory"
  
  # Show which proto files were compiled successfully
  echo "V1 generated files:"
  ls -la "$OUT_DIR/phenopackets/schema/v1/" 2>/dev/null || echo "No v1 files generated"
  
  echo "V2 generated files:"
  ls -la "$OUT_DIR/phenopackets/schema/v2/core/" 2>/dev/null || echo "No v2 core files generated"
  ls -la "$OUT_DIR/phenopackets/schema/v2/" 2>/dev/null || echo "No v2 files generated"
  
  # Check if we have interpretation.proto and phenopackets.proto in v2
  if [ -f "$OUT_DIR/phenopackets/schema/v2/core/interpretation_pb.js" ]; then
    echo "✅ Successfully generated interpretation_pb.js"
  else
    echo "❌ Failed to generate interpretation_pb.js"
  fi
  
  if [ -f "$OUT_DIR/phenopackets/schema/v2/phenopackets_pb.js" ]; then
    echo "✅ Successfully generated phenopackets_pb.js"
  else
    echo "❌ Failed to generate phenopackets_pb.js"
  fi
  
  echo "Make sure to update lib/index.js to export the generated classes."
  echo "Current directory: $(pwd)"
  echo "Output directory full path: $(realpath $OUT_DIR)"
fi
