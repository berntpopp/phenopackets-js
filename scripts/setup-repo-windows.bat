@echo off
echo Setting up phenopackets-js repository for Windows...

:: Check if we're in the right directory
if not exist "package.json" (
  echo Error: This script must be run from the root of the phenopackets-js repository
  exit /b 1
)

:: Check for Git
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  echo Error: Git is required but not found in PATH
  exit /b 1
)

echo.
echo Step 1: Adding phenopacket-schema repository as a submodule if needed...
if not exist "protos\phenopacket-schema-source" (
  git submodule add https://github.com/phenopackets/phenopacket-schema.git protos/phenopacket-schema-source
  if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to add phenopacket-schema submodule
    exit /b 1
  )
) else (
  echo phenopacket-schema submodule already exists
)

echo.
echo Step 2: Configuring core.longpaths for Windows...
:: Enable long paths in Git (necessary for Windows)
git config --global core.longpaths true
echo Configured Git to handle long paths

echo.
echo Step 3: Directly cloning VRS protobuf repo instead of using the submodule...
if not exist "protos\vrs-protobuf" (
  echo Cloning VRS protobuf repository directly...
  mkdir protos\vrs-protobuf 2>nul
  git clone https://github.com/ga4gh/vrs-protobuf.git protos/vrs-protobuf
  if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to clone VRS protobuf repository
    exit /b 1
  )
) else (
  echo VRS protobuf repository already exists
)

echo.
echo Step 4: Creating symlink to VRS protobuf for compatibility...
:: Create a symlink so the generate-protos script can find the VRS files
if not exist "protos\phenopacket-schema-source\src\vrs-protobuf" (
  mklink /D "protos\phenopacket-schema-source\src\vrs-protobuf" "..\..\..\..\vrs-protobuf"
  if %ERRORLEVEL% NEQ 0 (
    echo Warning: Failed to create symlink. Admin rights may be required.
    echo Falling back to copying files...
    mkdir "protos\phenopacket-schema-source\src\vrs-protobuf" 2>nul
    xcopy /E /I /Y "protos\vrs-protobuf" "protos\phenopacket-schema-source\src\vrs-protobuf"
  )
)

echo.
echo Step 5: Installing Node.js dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo Warning: npm install returned an error
)

echo.
echo Step 6: Checking for protoc compiler...
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
echo Setup complete!
echo You can now run the command: bash ./scripts/generate-protos.sh
echo.
