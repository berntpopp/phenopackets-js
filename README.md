# Phenopackets-JS

[![npm package](https://img.shields.io/npm/v/@berntpopp/phenopackets-js/latest.svg)](https://www.npmjs.com/package/@berntpopp/phenopackets-js)
[![CI](https://github.com/berntpopp/phenopackets-js/actions/workflows/ci.yml/badge.svg)](https://github.com/berntpopp/phenopackets-js/actions/workflows/ci.yml)
[![Release Package](https://github.com/berntpopp/phenopackets-js/actions/workflows/release.yml/badge.svg)](https://github.com/berntpopp/phenopackets-js/actions/workflows/release.yml)
[![Documentation](https://github.com/berntpopp/phenopackets-js/actions/workflows/docs.yml/badge.svg)](https://berntpopp.github.io/phenopackets-js/)

A JavaScript library for working with GA4GH Phenopackets, generated from the official [phenopacket-schema](https://github.com/phenopackets/phenopacket-schema) protobuf definitions.

## Quick Start

```bash
npm install @berntpopp/phenopackets-js
```

```javascript
const pps = require('@berntpopp/phenopackets-js');

// Create a phenopacket
const phenopacket = new pps.v2.Phenopacket();
phenopacket.setId('example-1');

// Add metadata (required)
const metaData = new pps.v2.core.MetaData();
metaData.setCreated(pps.jsonUtils.dateToTimestamp(new Date()));
metaData.setCreatedBy('example-creator');
phenopacket.setMetaData(metaData);
```

## Documentation

Full documentation, including guides and API reference, is available at:
**[https://berntpopp.github.io/phenopackets-js/](https://berntpopp.github.io/phenopackets-js/)**

- [Installation Guide](https://berntpopp.github.io/phenopackets-js/guide/installation.html)
- [Basic Usage](https://berntpopp.github.io/phenopackets-js/guide/basic-usage.html)
- [API Reference](https://berntpopp.github.io/phenopackets-js/api/)
- [Development Guide](https://berntpopp.github.io/phenopackets-js/guide/development.html)

## License

- **Library**: MIT License. See the [LICENSE](LICENSE) file.
- **Schema**: BSD 3-Clause License by GA4GH. Copyright (c) 2018-2024, Global Alliance for Genomics and Health.
