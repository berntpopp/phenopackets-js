# Testing Guide for phenopackets-js

This document provides detailed examples for writing tests for the phenopackets-js library.

## Jest Testing Framework

This project uses Jest as its testing framework. Jest provides a comprehensive set of tools for writing, running, and reporting on tests.

## Test File Organization

All test files should be placed in the `tests/` directory and should follow the naming convention `*.test.js`.

## Example Tests

Below are examples of common testing patterns for the phenopackets-js library:

### 1. Testing Class Creation and Property Access

```javascript
// Example test for creating a class and accessing properties
const pps = require('../index');

describe('OntologyClass', () => {
  it('should create an OntologyClass and set/get properties', () => {
    // Create a new instance
    const ontologyClass = new pps.v2.core.OntologyClass();
    
    // Set properties
    ontologyClass.setId('HP:0000118');
    ontologyClass.setLabel('Phenotypic abnormality');
    
    // Verify properties
    expect(ontologyClass.getId()).toBe('HP:0000118');
    expect(ontologyClass.getLabel()).toBe('Phenotypic abnormality');
  });
});
```

### 2. Testing Nested Objects

```javascript
// Example test for nested objects
const pps = require('../index');

describe('Phenopacket with nested objects', () => {
  it('should create a Phenopacket with nested Individual', () => {
    // Create the parent object
    const phenopacket = new pps.v2.Phenopacket();
    phenopacket.setId('phenopacket-1');
    
    // Create the nested object
    const individual = new pps.v2.core.Individual();
    individual.setId('patient-1');
    individual.setSex(pps.v2.core.Sex.FEMALE);
    
    // Set the nested object
    phenopacket.setSubject(individual);
    
    // Verify nested object
    expect(phenopacket.getSubject().getId()).toBe('patient-1');
    expect(phenopacket.getSubject().getSex()).toBe(pps.v2.core.Sex.FEMALE);
  });
});
```

### 3. Testing Binary Serialization

```javascript
// Example test for binary serialization/deserialization
const pps = require('../index');

describe('Phenopacket serialization', () => {
  it('should serialize and deserialize a Phenopacket correctly', () => {
    // Create and populate a phenopacket
    const original = new pps.v2.Phenopacket();
    original.setId('test-serialization');
    
    // Create an individual
    const individual = new pps.v2.core.Individual();
    individual.setId('subject-1');
    original.setSubject(individual);
    
    // Serialize to binary
    const binaryData = original.serializeBinary();
    expect(binaryData).toBeInstanceOf(Uint8Array);
    
    // Deserialize from binary
    const deserialized = pps.v2.Phenopacket.deserializeBinary(binaryData);
    
    // Verify deserialized object
    expect(deserialized.getId()).toBe('test-serialization');
    expect(deserialized.getSubject().getId()).toBe('subject-1');
  });
});
```

### 4. Testing Object Conversion

```javascript
// Example test for toObject conversion
const pps = require('../index');

describe('Phenopacket toObject', () => {
  it('should convert a Phenopacket to a plain JavaScript object', () => {
    // Create and populate a phenopacket
    const phenopacket = new pps.v2.Phenopacket();
    phenopacket.setId('test-to-object');
    
    // Create an individual with a sex
    const individual = new pps.v2.core.Individual();
    individual.setId('subject-1');
    individual.setSex(pps.v2.core.Sex.MALE);
    phenopacket.setSubject(individual);
    
    // Convert to object
    const obj = phenopacket.toObject();
    
    // Verify object structure
    expect(obj.id).toBe('test-to-object');
    expect(obj.subject.id).toBe('subject-1');
    expect(obj.subject.sex).toBe(pps.v2.core.Sex.MALE); // Note: enums are numbers in objects
  });
});
```

### 5. Testing Arrays and Repeated Fields

```javascript
// Example test for repeated fields
const pps = require('../index');

describe('Phenopacket with repeated fields', () => {
  it('should handle adding multiple phenotypic features', () => {
    // Create the phenopacket
    const phenopacket = new pps.v2.Phenopacket();
    
    // Create first feature
    const feature1 = new pps.v2.core.PhenotypicFeature();
    const type1 = new pps.v2.core.OntologyClass();
    type1.setId('HP:0000252');
    type1.setLabel('Microcephaly');
    feature1.setType(type1);
    
    // Create second feature
    const feature2 = new pps.v2.core.PhenotypicFeature();
    const type2 = new pps.v2.core.OntologyClass();
    type2.setId('HP:0001250');
    type2.setLabel('Seizure');
    feature2.setType(type2);
    
    // Add features to the phenopacket
    phenopacket.addPhenotypicFeatures(feature1);
    phenopacket.addPhenotypicFeatures(feature2);
    
    // Verify features
    const features = phenopacket.getPhenotypicFeaturesList();
    expect(features.length).toBe(2);
    expect(features[0].getType().getId()).toBe('HP:0000252');
    expect(features[1].getType().getId()).toBe('HP:0001250');
    
    // Test setFoo(List) method
    const newFeatures = [feature2, feature1]; // Reversed order
    phenopacket.setPhenotypicFeaturesList(newFeatures);
    
    const updatedFeatures = phenopacket.getPhenotypicFeaturesList();
    expect(updatedFeatures.length).toBe(2);
    expect(updatedFeatures[0].getType().getId()).toBe('HP:0001250'); // Order should be reversed
    expect(updatedFeatures[1].getType().getId()).toBe('HP:0000252');
  });
});
```

### 6. Testing for Error Handling

```javascript
// Example test for error handling
const pps = require('../index');

describe('Error handling', () => {
  it('should throw an error when trying to set invalid values', () => {
    const individual = new pps.v2.core.Individual();
    
    // Test setting an invalid enum value
    expect(() => {
      individual.setSex(999); // Invalid sex enum value
    }).toThrow();
    
    // Test with undefined value
    expect(() => {
      individual.setSex(undefined);
    }).toThrow();
  });
});
```

## Debug Utilities

For classes with complex structures, it can be helpful to create debug utilities that examine the actual API:

```javascript
// Example debug utility
function inspectObject(obj) {
  if (!obj) return 'null or undefined';
  
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
    .filter(name => name.startsWith('set') || name.startsWith('get'));
  
  console.log('Available methods:', methods);
  return methods;
}

// Usage in a test
it('should have the expected API', () => {
  const individual = new pps.v2.core.Individual();
  const methods = inspectObject(individual);
  
  // Verify key methods exist
  expect(methods).toContain('getId');
  expect(methods).toContain('setId');
  expect(methods).toContain('getSex');
  expect(methods).toContain('setSex');
});
```

## Common Issues and Solutions

### 1. Method Name Mismatch

Protocol Buffer generated classes often have specific method names that may not match expectations.

```javascript
// INCORRECT:
allele.setState(literalSequenceExpression);

// CORRECT: (check actual method using inspectObject)
allele.setLiteralSequenceExpression(literalSequenceExpression);
```

### 2. Setting Nested Objects

Always ensure you're setting complete objects, not just partial data.

```javascript
// INCORRECT:
phenopacket.setSubject({ id: 'patient-1' });

// CORRECT:
const individual = new pps.v2.core.Individual();
individual.setId('patient-1');
phenopacket.setSubject(individual);
```

### 3. Enum Values

Use the proper enum constants, not string or numeric literals.

```javascript
// INCORRECT:
individual.setSex(1); // Magic number

// CORRECT:
individual.setSex(pps.v2.core.Sex.MALE);
```

## Resources

For more information on Jest testing:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest API](https://jestjs.io/docs/api)

For Protocol Buffer (Protobuf.js) details:
- [Protocol Buffers JavaScript](https://github.com/protocolbuffers/protobuf-javascript)
