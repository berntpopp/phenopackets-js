---
layout: home
title: Home
nav_order: 1
---

Welcome to the official documentation for `phenopackets-js`, a JavaScript library for creating and reading GA4GH Phenopackets. This library is generated from the official [phenopacket-schema protobuf definitions](https://github.com/phenopackets/phenopacket-schema).

## Quick Start

### Installation

```bash
npm install @berntpopp/phenopackets-js
```

### Basic Example

```javascript
const { Phenopacket, Individual } = require('@berntpopp/phenopackets-js');

// Create a new phenopacket
const phenopacket = new Phenopacket();
phenopacket.setId('example-id');

// Add an individual
const individual = new Individual();
individual.setId('patient-1');
individual.setSex(1); // FEMALE
phenopacket.setSubject(individual);
```

## Documentation

### Guides

- [Installation]({{ site.baseurl }}/guide/installation) - How to install the package
- [Basic Usage]({{ site.baseurl }}/guide/basic-usage) - A quick example to get you started
- [Development Guide]({{ site.baseurl }}/guide/development) - Information for developers
- [Working with Proto Files]({{ site.baseurl }}/guide/proto-workflow) - Understanding proto files
- [Using JSON Utilities]({{ site.baseurl }}/guide/json-utilities) - Working with JSON
- [Testing Strategy]({{ site.baseurl }}/guide/testing) - Testing your implementation
- [Contributing]({{ site.baseurl }}/guide/contributing) - How to contribute

### API Reference

Detailed [API Documentation]({{ site.baseurl }}/api/) for all generated classes and utilities.

## About Phenopackets

The Phenopacket Schema represents an open standard for sharing disease and phenotype information to improve our ability to understand, diagnose, and treat both rare and common diseases. Learn more at [phenopackets.org](https://phenopackets.org/) and the [GA4GH Phenopacket Schema repository](https://github.com/phenopackets/phenopacket-schema).

## License

This library is licensed under the MIT License. The underlying Phenopacket Schema is licensed under BSD-3-Clause by GA4GH.
