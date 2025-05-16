@echo off
echo Setting up phenopackets-js proto files without Git submodules...

:: Create temporary directory for downloads
mkdir tmp 2>nul
mkdir protos\phenopacket-schema-source\src 2>nul
mkdir protos\vrs-protobuf 2>nul

:: Define versions
set PHENOPACKET_SCHEMA_VERSION=2.0.0
set VRS_VERSION=1.2.1

echo.
echo Step 1: Downloading phenopacket-schema v%PHENOPACKET_SCHEMA_VERSION%...
curl -L -o tmp\phenopacket-schema.zip https://github.com/phenopackets/phenopacket-schema/archive/refs/tags/v%PHENOPACKET_SCHEMA_VERSION%.zip

echo.
echo Step 2: Downloading VRS protobuf v%VRS_VERSION%...
curl -L -o tmp\vrs-protobuf.zip https://github.com/ga4gh/vrs-protobuf/archive/refs/tags/v%VRS_VERSION%.zip

echo.
echo Step 3: Extracting phenopacket-schema...
powershell -command "Expand-Archive -Path tmp\phenopacket-schema.zip -DestinationPath tmp -Force"
xcopy /E /I /Y "tmp\phenopacket-schema-%PHENOPACKET_SCHEMA_VERSION%\src" "protos\phenopacket-schema-source\src"

echo.
echo Step 4: Extracting VRS protobuf...
powershell -command "Expand-Archive -Path tmp\vrs-protobuf.zip -DestinationPath tmp -Force"
xcopy /E /I /Y "tmp\vrs-protobuf-%VRS_VERSION%" "protos\vrs-protobuf"

echo.
echo Step 5: Creating link from phenopacket-schema to VRS...
mkdir protos\phenopacket-schema-source\src\vrs-protobuf 2>nul
xcopy /E /I /Y "protos\vrs-protobuf" "protos\phenopacket-schema-source\src\vrs-protobuf"

echo.
echo Step 6: Installing Node.js dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo Warning: npm install returned an error
)

echo.
echo Step 7: Checking for protoc compiler...
where protoc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Warning: Protocol Buffer Compiler (protoc) is not installed or not in PATH
  echo Please install protoc before running the generate-protos.sh script
  echo See the README.md for installation instructions
) else (
  protoc --version
  echo Found Protocol Buffer Compiler
)

echo.
echo Cleaning up temporary files...
rmdir /S /Q tmp

echo.
echo Setup complete!
echo You can now run: bash ./scripts/generate-protos.sh
