---
layout: default
title: Examples
parent: Guides
nav_order: 3
---

This guide provides practical examples of using the phenopackets-js library for various common scenarios.

## Creating a Complete Phenopacket

Here's an example of creating a comprehensive phenopacket with subject information, phenotypes, and disease:

```javascript
const pps = require('@berntpopp/phenopackets-js');

// Create a phenopacket
const phenopacket = new pps.v2.Phenopacket();
phenopacket.setId('example-phenopacket-1');

// 1. Add required metadata
const metaData = new pps.v2.core.MetaData();
metaData.setCreated(pps.jsonUtils.dateToTimestamp(new Date()));
metaData.setCreatedBy('clinician-1');
metaData.setPhenopacketSchemaVersion('2.0.0');

// Add a resource to metadata
const resource = new pps.v2.core.Resource();
resource.setId('hp');
resource.setName('human phenotype ontology');
resource.setUrl('http://purl.obolibrary.org/obo/hp.owl');
resource.setVersion('2024-01-01');
resource.setNamespacePrefix('HP');
resource.setIriPrefix('http://purl.obolibrary.org/obo/HP_');
metaData.addResources(resource);

phenopacket.setMetaData(metaData);

// 2. Add subject (patient) information
const subject = new pps.v2.core.Individual();
subject.setId('patient-1');
subject.setTimeAtLastEncounter(pps.jsonUtils.dateToTimestamp(new Date()));

// Set demographic information
subject.setSex(pps.v2.core.Sex.FEMALE);
const vitalStatus = new pps.v2.core.VitalStatus();
vitalStatus.setStatus(pps.v2.core.VitalStatus.Status.ALIVE);
subject.setVitalStatus(vitalStatus);

// Add date of birth
const birthDate = new pps.v2.core.TimeElement();
birthDate.setTimestamp(pps.jsonUtils.dateToTimestamp(new Date('2020-01-15')));
subject.setDateOfBirth(birthDate);

phenopacket.setSubject(subject);

// 3. Add multiple phenotypic features
const addPhenotype = (id, label, onset, severity, excluded = false) => {
  const feature = new pps.v2.core.PhenotypicFeature();

  // Set type
  const type = new pps.v2.core.OntologyClass();
  type.setId(id);
  type.setLabel(label);
  feature.setType(type);

  // Set onset if provided
  if (onset) {
    const onsetElement = new pps.v2.core.TimeElement();
    onsetElement.setAge({
      iso8601duration: onset,
    });
    feature.setOnset(onsetElement);
  }

  // Set severity if provided
  if (severity) {
    const severityClass = new pps.v2.core.OntologyClass();
    severityClass.setId(severity.id);
    severityClass.setLabel(severity.label);
    feature.setSeverity(severityClass);
  }

  feature.setExcluded(excluded);
  return feature;
};

// Add present phenotypes
phenopacket.addPhenotypicFeatures(
  addPhenotype(
    'HP:0001250', // Seizure
    'Seizure',
    'P2Y', // Onset at 2 years
    { id: 'HP:0012828', label: 'Severe' }
  )
);

phenopacket.addPhenotypicFeatures(
  addPhenotype(
    'HP:0001263', // Global developmental delay
    'Global developmental delay',
    'P1Y', // Onset at 1 year
    { id: 'HP:0012825', label: 'Mild' }
  )
);

// Add excluded phenotype
phenopacket.addPhenotypicFeatures(
  addPhenotype(
    'HP:0001251', // Ataxia
    'Ataxia',
    null,
    null,
    true // Excluded
  )
);

// 4. Add disease information
const disease = new pps.v2.core.Disease();
disease.setTerm({
  id: 'OMIM:616801',
  label: 'Developmental and epileptic encephalopathy 39',
});

// Set disease onset
const diseaseOnset = new pps.v2.core.TimeElement();
diseaseOnset.setAge({
  iso8601duration: 'P2Y', // Disease onset at 2 years
});
disease.setOnset(diseaseOnset);

phenopacket.addDiseases(disease);

// 5. Validate the phenopacket
const json = phenopacket.toObject();
const validationResult = pps.jsonUtils.validatePhenopacketJson(json);
console.log('Validation result:', validationResult);

// 6. Convert to JSON string
const jsonString = pps.jsonUtils.phenopacketToJSON(phenopacket, { pretty: true });
console.log('Phenopacket JSON:', jsonString);
```

## Working with Measurements

Example of adding measurements to a phenopacket:

```javascript
const pps = require('@berntpopp/phenopackets-js');

// Create a measurement
const measurement = new pps.v2.core.Measurement();

// Set the assay
const assay = new pps.v2.core.OntologyClass();
assay.setId('LOINC:35595-1');
assay.setLabel('Blood glucose measurement');
measurement.setAssay(assay);

// Set the value
const value = new pps.v2.core.Value();
const quantity = new pps.v2.core.Quantity();
quantity.setUnit({
  id: 'UO:0000095',
  label: 'millimole per liter',
});
quantity.setValue(5.5);
value.setQuantity(quantity);
measurement.setValue(value);

// Set the time
const timeObserved = new pps.v2.core.TimeElement();
timeObserved.setTimestamp(pps.jsonUtils.dateToTimestamp(new Date()));
measurement.setTimeObserved(timeObserved);

// Add to phenopacket
phenopacket.addMeasurements(measurement);
```

## Working with Family History

Example of creating a family history with a pedigree:

```javascript
const pps = require('@berntpopp/phenopackets-js');

// Create a pedigree
const pedigree = new pps.v2.core.Pedigree();

// Add proband
const proband = new pps.v2.core.Pedigree.Person();
proband.setIndividualId('proband');
proband.setSex(pps.v2.core.Sex.FEMALE);
proband.setAffectedStatus(pps.v2.core.Pedigree.Person.AffectedStatus.AFFECTED);
proband.setMaternalId('mother');
proband.setPaternalId('father');

// Add mother
const mother = new pps.v2.core.Pedigree.Person();
mother.setIndividualId('mother');
mother.setSex(pps.v2.core.Sex.FEMALE);
mother.setAffectedStatus(pps.v2.core.Pedigree.Person.AffectedStatus.UNAFFECTED);

// Add father
const father = new pps.v2.core.Pedigree.Person();
father.setIndividualId('father');
father.setSex(pps.v2.core.Sex.MALE);
father.setAffectedStatus(pps.v2.core.Pedigree.Person.AffectedStatus.UNAFFECTED);

// Add all persons to pedigree
pedigree.addPersons(proband);
pedigree.addPersons(mother);
pedigree.addPersons(father);

// Add pedigree to phenopacket
phenopacket.setPedigree(pedigree);
```

For more detailed API documentation, see the [API Reference](../api/).
