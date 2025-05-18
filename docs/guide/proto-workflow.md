---
layout: default
title: Proto Workflow
parent: Guides
nav_order: 4
---

## Proto Workflow

This guide explains how Protocol Buffer (`.proto`) files are managed and used to generate the JavaScript library.

## Proto Sources

The `.proto` files are sourced from:

- [phenopacket-schema](https://github.com/phenopackets/phenopacket-schema)
- [ga4gh/vrs-protobuf](https://github.com/ga4gh/vrs-protobuf)

The expected local structure after running the download script is:

```text
protos/
├── phenopacket-schema-source/
│   └── src/
│       └── main/
│           └── proto/
│               └── phenopackets/
│                   ├── schema/
│                   ├── vrs/
│                   └── vrsatile/
└── vrs-protobuf/
```

## Generating JavaScript Code

The `scripts/generate-protos.sh` script uses `protoc` to convert proto definitions into JavaScript classes:

```bash
npm run generate-protos
```

The process:

1. VRS `.proto` files are compiled
2. VRSATILE `.proto` files are compiled
3. Phenopacket Schema v1 and v2 `.proto` files are compiled
4. Generated files are placed in `lib/`

## Generated Code Structure

The generated code maintains a package structure similar to the protos:

```text
lib/
├── phenopackets/
│   └── schema/
│       ├── v1/
│       └── v2/
├── vrs/
└── vrsatile/
```

## Updating Proto Files

When new versions are released:

1. Delete the local protos:

```bash
rm -rf protos/
```

2. Re-run the download script:

```bash
npm run download-protos
```

3. Re-generate JavaScript code:

```bash
npm run generate-protos
```

4. Review changes in `lib/`
5. Update `index.js` if needed
6. Run tests:

```bash
npm test
```

## Working with Generated Code

The generated code provides:

- Classes for each message type
- Enums as static values
- Getter/setter methods for all fields
- Methods for serialization/deserialization

Example usage:

```javascript
const { v2 } = require('@berntpopp/phenopackets-js');

// Create a new message
const individual = new v2.core.Individual();
individual.setId('example-id');
individual.setSex(v2.core.Sex.FEMALE);

// Get values
console.log(individual.getId()); // 'example-id'
console.log(individual.getSex()); // 1 (enum value for FEMALE)
```

For more details about using the generated code, see the [Basic Usage](./basic-usage.md) guide.
