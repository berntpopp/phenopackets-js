---
layout: default
title: JSON Utilities
parent: Guides
nav_order: 4
---

# Working with JSON

The phenopackets-js library provides utilities for converting between Protocol Buffer messages and JSON format. This is particularly useful when you need to:

- Save phenopackets to files
- Send phenopackets over HTTP/REST APIs
- Parse existing JSON phenopackets

## Converting to JSON

```javascript
const { Phenopacket } = require('@berntpopp/phenopackets-js');

// Create a phenopacket
const phenopacket = new Phenopacket();
phenopacket.setId('example-id');

// Convert to JSON string
const jsonString = phenopacket.toObject();
console.log(JSON.stringify(jsonString, null, 2));
```

## Parsing from JSON

```javascript
const { Phenopacket } = require('@berntpopp/phenopackets-js');

// Your JSON phenopacket data
const jsonData = {
  id: 'example-id',
  // ... other phenopacket fields
};

// Create a new phenopacket from JSON
const phenopacket = new Phenopacket();
phenopacket.fromObject(jsonData);
```

## Best Practices

1. Always validate your JSON data structure before parsing
2. Use try-catch blocks when parsing JSON to handle potential errors
3. Consider using JSON Schema validation for your phenopacket JSON data
4. Remember that Protocol Buffer field names use snake_case in JSON format
