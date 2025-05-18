---
layout: default
title: Basic Usage
parent: Guides
nav_order: 2
---

## Basic Usage

Here's a quick example of how to create and use phenopacket objects with this library:

```javascript
const pps = require('@berntpopp/phenopackets-js');

// Create a V2 Phenopacket
const phenopacket = new pps.v2.Phenopacket();
phenopacket.setId('my-phenopacket-1');

// Create and set the subject (Individual)
const subject = new pps.v2.core.Individual();
subject.setId('patient-alpha');
subject.setSex(pps.v2.core.Sex.FEMALE);

// Add a phenotypic feature
const feature = new pps.v2.core.PhenotypicFeature();
const featureType = new pps.v2.core.OntologyClass();
featureType.setId('HP:0001250');
featureType.setLabel('Seizure');
feature.setType(featureType);
phenopacket.addPhenotypicFeatures(feature);

// Add MetaData (required)
const metaData = new pps.v2.core.MetaData();
const createdTs = pps.jsonUtils.dateToTimestamp(new Date());
metaData.setCreated(createdTs);
metaData.setCreatedBy('example-creator');
metaData.setPhenopacketSchemaVersion('2.0.0');
phenopacket.setMetaData(metaData);

// Convert to JSON
console.log(pps.jsonUtils.phenopacketToJSON(phenopacket, { pretty: true }));
```

## Working with JSON

You can convert phenopackets to and from JSON:

```javascript
// Convert to JSON
const jsonString = pps.jsonUtils.phenopacketToJSON(phenopacket, { pretty: true });

// Parse from JSON
const parsedPhenopacket = pps.jsonUtils.jsonToPhenopacket(jsonString, {
  Phenopacket: pps.v2.Phenopacket,
  Individual: pps.v2.core.Individual,
  PhenotypicFeature: pps.v2.core.PhenotypicFeature,
  OntologyClass: pps.v2.core.OntologyClass,
  MetaData: pps.v2.core.MetaData,
});
```

## Using Timestamps

The library uses Google's Protocol Buffer Timestamp for date/time fields:

```javascript
const { dateToTimestamp } = pps.jsonUtils;

// Convert JavaScript Date to Timestamp
const timestamp = dateToTimestamp(new Date());
metaData.setCreated(timestamp);

// Or create timestamp manually
const ts = new pps.google.protobuf.Timestamp();
ts.setSeconds(Math.floor(Date.now() / 1000));
ts.setNanos(0);
```

For more detailed examples and API documentation, see the [API Reference](../api/).
