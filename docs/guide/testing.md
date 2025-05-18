---
layout: default
title: Testing Strategy
parent: Guides
nav_order: 5
---

# Testing Strategy

This guide explains how to test your code when using phenopackets-js.

## Unit Testing

We recommend using Jest for testing your phenopackets-js implementation. Here's an example:

```javascript
const { Phenopacket, Individual } = require('@berntpopp/phenopackets-js');

describe('Phenopacket Creation', () => {
  test('should create a valid phenopacket with an individual', () => {
    // Create a new phenopacket
    const phenopacket = new Phenopacket();
    phenopacket.setId('test-id');

    // Create and set an individual
    const individual = new Individual();
    individual.setId('patient-1');
    individual.setSex(1); // FEMALE
    phenopacket.setSubject(individual);

    // Assertions
    expect(phenopacket.getId()).toBe('test-id');
    expect(phenopacket.getSubject().getId()).toBe('patient-1');
    expect(phenopacket.getSubject().getSex()).toBe(1);
  });
});
```

## Test Data

It's recommended to create test fixtures for common phenopacket structures:

```javascript
// test/fixtures/phenopackets.js
const createBasicPhenopacket = () => {
  const phenopacket = new Phenopacket();
  phenopacket.setId('test-id');
  // Add more default data
  return phenopacket;
};

module.exports = {
  createBasicPhenopacket,
};
```

## Integration Testing

When testing integration with other systems:

1. Use mock data for external services
2. Test JSON serialization/deserialization
3. Validate against the official phenopacket schema
4. Test error handling and edge cases

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch
```
