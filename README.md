# Phenopackets-JS

A JavaScript/TypeScript library for creating and reading GA4GH Phenopackets, generated from the official phenopacket-schema protobuf definitions.

This library provides the necessary JavaScript classes that correspond to the Phenopacket Schema, enabling developers to work with Phenopacket data in Node.js and browser environments.

## Installation

```bash
npm install phenopackets-js
```

### Once Published

## Usage

### Basic Usage Examples

```javascript
// const pps = require('phenopackets-js');
//
// const individual = new pps.Individual();
// individual.setId('test-subject-1');
// // ... and so on
```

## Development

### Prerequisites

* Node.js
* NPM or Yarn
* Protocol Buffer Compiler (`protoc`) - Make sure it's installed and available in your PATH
* Git (for managing proto file sources)

### Repository Setup

### Automated Setup (No Git Submodules)

This repository now uses a simpler approach that avoids Git submodules. The proto files are downloaded directly from GitHub releases, which prevents common Git submodule issues:

1. Clone this repository:

   ```bash
   git clone https://github.com/berntpopp/phenopackets-js.git
   cd phenopackets-js
   ```

2. Choose the appropriate setup script for your operating system:

   #### For Linux/macOS

   ```bash
   bash ./scripts/download-protos.sh
   npm install
   ```

   #### For Windows

   ```cmd
   scripts\download-protos.bat
   ```

   These scripts will:
   * Download phenopacket-schema and VRS proto files directly from GitHub releases
   * Extract the files to the correct locations
   * Install Node.js dependencies
   * Check if protoc is installed

   The `protos/` directory is excluded from Git in the `.gitignore` file, so these files remain local to your development environment.

### Manual Setup

Alternatively, you can perform the setup steps manually:

1. Clone this repository:

   ```bash
   git clone https://github.com/berntpopp/phenopackets-js.git
   cd phenopackets-js
   ```

2. Download and extract phenopacket-schema release:

   ```bash
   mkdir -p protos/phenopacket-schema-source/src
   curl -L https://github.com/phenopackets/phenopacket-schema/archive/refs/tags/v2.0.0.zip -o phenopacket-schema.zip
   unzip phenopacket-schema.zip
   cp -r phenopacket-schema-2.0.0/src/* protos/phenopacket-schema-source/src/
   ```

3. Download and extract VRS protobuf release:

   ```bash
   mkdir -p protos/vrs-protobuf
   curl -L https://github.com/ga4gh/vrs-protobuf/archive/refs/tags/v1.2.1.zip -o vrs-protobuf.zip
   unzip vrs-protobuf.zip
   cp -r vrs-protobuf-1.2.1/* protos/vrs-protobuf/
   ```

4. Create the link from phenopacket-schema to VRS:

   ```bash
   mkdir -p protos/phenopacket-schema-source/src/vrs-protobuf
   cp -r protos/vrs-protobuf/* protos/phenopacket-schema-source/src/vrs-protobuf/
   ```

5. Install Node.js dependencies:

   ```bash
   npm install
   ```

### Installing Protocol Buffer Compiler

#### On Windows

1. Download the appropriate protoc release for Windows from [GitHub releases](https://github.com/protocolbuffers/protobuf/releases) (e.g., `protoc-X.X.X-win64.zip`)
2. Extract the contents to a directory (e.g., `C:\protoc`)
3. Add the bin directory to your PATH: `C:\protoc\bin`
4. Verify installation by running `protoc --version`

#### On Ubuntu/Debian

```bash
sudo apt update
sudo apt install protobuf-compiler
```

Verify installation with `protoc --version`

#### On macOS

```bash
brew install protobuf
```

Verify installation with `protoc --version`

### Proto Sources

The Protocol Buffer (`.proto`) files are the source of truth for the data structures. They are managed in the `protos/` directory using a Git submodule pointing to the [official phenopacket-schema repository](https://github.com/phenopackets/phenopacket-schema).

The directory structure should look like this:

```text
protos/
└── phenopacket-schema-source/
    └── src/
        └── main/
            └── proto/
                └── phenopackets/
                    └── schema/
                        ├── v1/
                        │   ├── base.proto
                        │   ├── interpretation.proto
                        │   └── phenopackets.proto
                        └── v2/
                            ├── core/
                            │   ├── base.proto
                            │   ├── biosample.proto
                            │   └── ... (other core protos)
                            └── phenopackets.proto
```

## Complete Workflow

Here's the complete workflow for using this repository with proto files that are stored locally but excluded from Git.

### Initial Setup

1. Clone the repository
2. Clone the required proto files
3. Generate JavaScript code
4. Use the library

```bash
# Clone the repository
git clone https://github.com/berntpopp/phenopackets-js.git
cd phenopackets-js

# Set up all dependencies with a single command
npm run setup
```

This will:

* Clone the phenopacket-schema repository (with all submodules)
* Set up the proper directory structure
* Generate all JavaScript files from the proto definitions

The `protos/` directory is excluded from Git in the `.gitignore` file, so these files remain local to your development environment.

### Separate Steps

If needed, you can run the steps individually:

```bash
# 1. Clone proto repositories
npm run download-protos

# 2. Generate JavaScript code
npm run generate-protos
```

### Updating Proto Files

When you need to update to newer versions of the proto files, simply delete the protos directory and run the setup again:

```bash
# Remove existing proto files
rm -rf protos

# On Windows:
rmdir /s /q protos

# Then run the setup again
npm run setup
```

Alternatively, you can use Git commands in the protos directory to pull the latest changes:

```bash
cd protos/phenopacket-schema-source
git pull --recurse-submodules
cd ../..
npm run generate-protos
```

### Generating JavaScript Code

The `generate-protos.sh` script handles compiling the `.proto` files into JavaScript classes. It:

1. Compiles VRS proto files first
2. Compiles VRSatile proto files (which depend on VRS)
3. Compiles both v1 and v2 phenopacket schemas to JavaScript
4. Places the generated files in the `lib/` directory

Run the generation script:

```bash
# Using npm script (recommended)
npm run generate-protos

# Or directly with bash
bash ./scripts/generate-protos.sh
```

#### What Gets Generated

The script generates JavaScript code for the following components:

* **V1 Phenopackets**: Base, Interpretation, and Phenopackets classes
* **V2 Phenopackets**: Core classes (Base, Biosample, Disease, etc.) and the main Phenopackets class
* **VRS**: Variation classes from the GA4GH VRS standard
* **VRSatile**: Extension classes that build on VRS

### Library Structure

After generation, the JavaScript code is organized as follows in the `lib/` directory:

```text
lib/
├── phenopackets/
│   ├── schema/
│   │   ├── v1/
│   │   │   ├── base_pb.js
│   │   │   ├── interpretation_pb.js
│   │   │   └── phenopackets_pb.js
│   │   └── v2/
│   │       ├── core/
│   │       │   ├── base_pb.js
│   │       │   ├── biosample_pb.js
│   │       │   └── ... (other core classes)
│   │       └── phenopackets_pb.js
│   └── vrsatile/
│       └── v1/
│           └── vrsatile_pb.js
└── schema/
    └── vrs_pb.js
```

### Using the Generated Code

The library exports all generated classes through the main `index.js` file, organized by version and category:

```javascript
const pps = require('phenopackets-js');

// Using v1 classes
const individualV1 = new pps.v1.Individual();
individualV1.setId('subject-1');

// Using v2 classes
const individualV2 = new pps.v2.core.Individual();
individualV2.setId('subject-2');
individualV2.setDateOfBirth("2000-01-01");

// Using VRS classes
const allele = new pps.vrs.Allele();

// Create a complete phenopacket
const phenopacket = new pps.v2.Phenopacket();
phenopacket.setId('phenopacket-1');
phenopacket.setSubject(individualV2);
```

## Testing

phenopackets-js includes a comprehensive test suite using Jest. The tests verify the functionality of the generated JavaScript classes and ensure that they can be properly serialized and deserialized.

### Running Tests

#### Basic Test Commands

To run all tests:

```bash
npm test
```

To run tests in watch mode (useful during development):

```bash
npm run test:watch
```

#### Advanced Testing Commands

Run a specific test file:

```bash
npx jest tests/exports.test.js
```

Run tests matching a specific name pattern:

```bash
npx jest -t "should create a Phenopacket"
```

Run tests with verbose output:

```bash
npx jest --verbose
```

Run tests without code coverage (faster):

```bash
npx jest --no-coverage
```

### Test Structure

The test suite includes:

* **exports.test.js**: Verifies that all the expected classes are properly exported from the library
* **phenopacketV1.test.js**: Tests the functionality of the v1 Phenopacket classes
* **phenopacketV2.test.js**: Tests the functionality of the v2 Phenopacket classes
* **vrs.test.js**: Tests the functionality of the VRS classes
* **vrsatile.test.js**: Tests the functionality of the VRSatile classes
* **json-utils.test.js**: Tests for JSON serialization/deserialization utilities

### Test Coverage

Test coverage reports are automatically generated when running `npm test`. The coverage report shows the percentage of code that is covered by tests across statements, branches, functions, and lines.

A detailed HTML coverage report is generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in a browser to view it.

Current baseline coverage is approximately 37% across the codebase, with higher coverage for critical components.

### Adding New Tests

When adding new features or fixing bugs, please include appropriate tests. Each test file should:

1. Test basic class instantiation
2. Test setting and getting values
3. Test serialization/deserialization
4. Test conversion to JavaScript objects

### Testing Guidelines for Protocol Buffer Classes

Protocol Buffer generated classes have some specific testing considerations:

1. **API Reference**: Always check the actual generated API methods using `Object.getOwnPropertyNames(Object.getPrototypeOf(instance))` as the method names may not match what you expect. The debug scripts in this repository can help with this.

2. **Nested Objects**: When setting nested objects, make sure to create complete object hierarchies. Protobuf requires all nested objects to be properly instantiated.

3. **Enums**: Use the enum values exported from the appropriate namespace, not hardcoded numbers or strings.

4. **Binary Serialization**: Always test both serialization and deserialization to ensure round-trip compatibility.

### Debugging Tests

If you encounter issues with tests, try these debugging strategies:

1. **View Generated API**: The repository includes debug scripts (`debug-vrs.js` and `debug-vrsatile.js`) that show the actual API methods available on the generated classes.

2. **Inspect Test Output**: Use `console.log` or run tests with the `--verbose` flag to get more information.

3. **Isolate the Issue**: Run only the specific test that's failing using the `-t` flag.

4. **Check Method Names**: Most failures are due to incorrect method names. The Protocol Buffer compiler generates specific getter and setter method names that may not match expectations.

### Future: Golden File Testing

A planned enhancement is to implement "golden file" tests that compare serialization output with known-good Phenopacket JSON files from other language implementations. This will ensure cross-language compatibility.

To prepare for this:

1. Place reference JSON files in a `tests/golden` directory
2. Implement utility functions in `json-utils.js` for accurate comparison
3. Add tests that verify both directions: JSON → Object → JSON and Object → JSON → Object

## Contributing

### Contribution Guidelines

To be defined.

## License

To be defined, matching the main schema repo (e.g., Apache 2.0 or BSD 3-Clause).
