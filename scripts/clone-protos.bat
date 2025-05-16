@echo off
echo Setting up phenopacket-schema and dependencies using Git clone...

:: Clean up any existing protos directory
if exist "protos" (
  echo Removing existing protos directory...
  rmdir /s /q protos
)

:: Create protos directory
mkdir protos

:: Clone phenopacket-schema with recursive flag to automatically get submodules
echo Cloning phenopacket-schema repository with submodules...
git clone --recursive https://github.com/phenopackets/phenopacket-schema.git protos\phenopacket-schema-source

:: Create the expected directory structure for the generate-protos.sh script
echo Setting up directory structure for proto generation...
mkdir protos\phenopacket-schema-source\src\vrs-protobuf 2>nul

:: Check if VRS submodule was properly cloned
if exist "protos\phenopacket-schema-source\src\vrs-protobuf\schema" (
  echo VRS protobuf directory exists - directory structure is correct
) else (
  echo VRS protobuf directory not found in the expected location
  
  :: Check if it's in a different location
  if exist "protos\phenopacket-schema-source\external\vrs-protobuf" (
    echo Found VRS protobuf in external directory - creating link
    xcopy /E /Y protos\phenopacket-schema-source\external\vrs-protobuf\* protos\phenopacket-schema-source\src\vrs-protobuf\
  ) else (
    echo Manually cloning VRS protobuf repository...
    git clone https://github.com/ga4gh/vrs-protobuf.git protos\vrs-protobuf
    xcopy /E /Y protos\vrs-protobuf\* protos\phenopacket-schema-source\src\vrs-protobuf\
  )
)

echo.
echo Setup complete! Proto files are now available for generation.
echo Run 'npm run generate-protos' to generate the JavaScript classes.
