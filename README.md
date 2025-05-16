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

### Automated Setup

The easiest way to set up the repository is to use the provided setup script, which automates all the necessary steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/berntpopp/phenopackets-js.git
   cd phenopackets-js
   ```

2. Run the setup script:

   ```bash
   # On Linux/macOS:
   bash ./scripts/setup-repo.sh
   
   # On Windows (with Git Bash):
   bash ./scripts/setup-repo.sh
   ```

   This script will:
   * Add the phenopacket-schema repository as a Git submodule
   * Initialize and update all nested submodules (including VRS protobuf)
   * Install Node.js dependencies
   * Check if protoc is installed

### Manual Setup

Alternatively, you can perform the setup steps manually:

1. Clone this repository:

   ```bash
   git clone https://github.com/berntpopp/phenopackets-js.git
   cd phenopackets-js
   ```

2. Add the phenopacket-schema repository as a Git submodule:

   ```bash
   git submodule add https://github.com/phenopackets/phenopacket-schema.git protos/phenopacket-schema-source
   ```

3. Initialize and update the VRS protobuf submodule within phenopacket-schema:

   ```bash
   cd protos/phenopacket-schema-source
   git submodule init
   git submodule update
   cd ../..  # Return to repository root
   ```

4. Install Node.js dependencies:

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
                            │   ├── ... (other core protos)
                            └── phenopackets.proto
```

### Generating JavaScript Code from Proto Files

The `generate-protos.sh` script handles compiling the `.proto` files into JavaScript classes. It:

1. Compiles VRS proto files first (from the submodule)
2. Compiles VRSatile proto files (which depend on VRS)
3. Compiles both v1 and v2 phenopacket schemas to JavaScript
4. Places the generated files in the `lib/` directory

Run the generation script:

```bash
npm run generate-protos
```

On Windows, you may need to run it with bash explicitly:

```bash
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

## Contributing

### Contribution Guidelines

To be defined.

## License

To be defined, matching the main schema repo (e.g., Apache 2.0 or BSD 3-Clause).
