---
layout: default
title: API Documentation
nav_order: 2
---

# API Documentation

The complete API documentation for phenopackets-js can be found here:

<div class="fs-6">
<a href="{{ site.baseurl }}/api/" class="btn btn-primary btn-lg">View API Documentation →</a>
</div>

## Core Classes

The main classes you'll work with include:

- `Phenopacket` - The main container for phenotypic information
- `Individual` - Information about the subject
- `Disease` - Disease/disorder information
- `PhenotypicFeature` - Individual phenotype observations
- `Measurement` - Quantitative measurements
- `MetaData` - Version and provenance information

## Example Usage

```javascript
const { Phenopacket, Individual, PhenotypicFeature } = require('@berntpopp/phenopackets-js');

// Create a new phenopacket
const phenopacket = new Phenopacket();
phenopacket.setId('example-id');

// Add subject information
const individual = new Individual();
individual.setId('patient-1');
individual.setSex(1); // FEMALE
phenopacket.setSubject(individual);

// Add a phenotypic feature
const feature = new PhenotypicFeature();
feature.setType({
  id: 'HP:0001250',
  label: 'Seizure',
});
phenopacket.addPhenotypicFeatures(feature);
```

For complete API documentation including all available classes, methods, and their parameters, please visit the [API Documentation]({{ site.baseurl }}/api/).
