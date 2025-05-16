// tests/phenopacketV2.test.js
const pps = require('../index');
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb'); // Direct import for clarity

describe('Phenopacket v2 Functionality', () => {
  let subject;
  let metaData;
  let phenotypicFeature;

  beforeEach(() => {
    // Create Subject (Individual)
    subject = new pps.v2.core.Individual();
    subject.setId('patient-007');
    subject.setSex(pps.v2.core.Sex.FEMALE);
    const dob = new Timestamp();
    dob.setSeconds(Math.floor(new Date('1992-02-02T00:00:00Z').getTime() / 1000));
    subject.setDateOfBirth(dob);

    // Create MetaData
    metaData = new pps.v2.core.MetaData();
    const createdTs = new Timestamp();
    createdTs.setSeconds(Math.floor(Date.now() / 1000));
    metaData.setCreated(createdTs);
    metaData.setCreatedBy('Test Script');
    metaData.setPhenopacketSchemaVersion('2.0.0'); // Example

    const hpoResource = new pps.v2.core.Resource();
    hpoResource.setId('hp');
    hpoResource.setName('Human Phenotype Ontology');
    metaData.addResources(hpoResource);

    // Create a Phenotypic Feature
    phenotypicFeature = new pps.v2.core.PhenotypicFeature();
    const featureType = new pps.v2.core.OntologyClass();
    featureType.setId('HP:0000789');
    featureType.setLabel('Infertility');
    phenotypicFeature.setType(featureType);
  });

  it('should create a Phenopacket and set basic fields', () => {
    const phenopacket = new pps.v2.Phenopacket();
    phenopacket.setId('ppkt-v2-test-001');
    phenopacket.setSubject(subject);
    phenopacket.setMetaData(metaData);
    phenopacket.addPhenotypicFeatures(phenotypicFeature);

    expect(phenopacket.getId()).toBe('ppkt-v2-test-001');
    expect(phenopacket.getSubject().getId()).toBe('patient-007');
    expect(phenopacket.getSubject().getSex()).toBe(pps.v2.core.Sex.FEMALE);
    expect(phenopacket.getMetaData().getCreatedBy()).toBe('Test Script');
    expect(phenopacket.getPhenotypicFeaturesList().length).toBe(1);
    expect(phenopacket.getPhenotypicFeaturesList()[0].getType().getId()).toBe('HP:0000789');
  });

  it('should serialize and deserialize a Phenopacket (binary)', () => {
    const phenopacket = new pps.v2.Phenopacket();
    phenopacket.setId('ppkt-binary-test');
    phenopacket.setSubject(subject);
    phenopacket.setMetaData(metaData);
    phenopacket.addPhenotypicFeatures(phenotypicFeature);

    const binaryData = phenopacket.serializeBinary();
    expect(binaryData).toBeInstanceOf(Uint8Array);

    const deserializedPhenopacket = pps.v2.Phenopacket.deserializeBinary(binaryData);
    expect(deserializedPhenopacket.getId()).toBe('ppkt-binary-test');
    expect(deserializedPhenopacket.getSubject().getId()).toBe(subject.getId());
    expect(deserializedPhenopacket.getMetaData().getCreatedBy()).toBe(metaData.getCreatedBy());
    expect(deserializedPhenopacket.getPhenotypicFeaturesList().length).toBe(1);
    expect(deserializedPhenopacket.getPhenotypicFeaturesList()[0].getType().getLabel()).toBe(
      'Infertility'
    );
  });

  it('should convert a Phenopacket to a JS object', () => {
    const phenopacket = new pps.v2.Phenopacket();
    phenopacket.setId('ppkt-to-object-test');
    phenopacket.setSubject(subject);

    const phenopacketObj = phenopacket.toObject();
    expect(phenopacketObj.id).toBe('ppkt-to-object-test');
    expect(phenopacketObj.subject.id).toBe('patient-007');
    // Note: enum values are numbers in toObject() output
    expect(phenopacketObj.subject.sex).toBe(pps.v2.core.Sex.FEMALE);
  });

  it('should handle repeated message fields (phenotypicFeatures)', () => {
    const phenopacket = new pps.v2.Phenopacket();
    const pf1 = new pps.v2.core.PhenotypicFeature();
    const type1 = new pps.v2.core.OntologyClass();
    type1.setId('HP:0000001');
    type1.setLabel('Feature 1');
    pf1.setType(type1);

    const pf2 = new pps.v2.core.PhenotypicFeature();
    const type2 = new pps.v2.core.OntologyClass();
    type2.setId('HP:0000002');
    type2.setLabel('Feature 2');
    pf2.setType(type2);

    phenopacket.addPhenotypicFeatures(pf1);
    phenopacket.addPhenotypicFeatures(pf2);
    // Or: phenopacket.setPhenotypicFeaturesList([pf1, pf2]);

    const featuresList = phenopacket.getPhenotypicFeaturesList();
    expect(featuresList.length).toBe(2);
    expect(featuresList[0].getType().getId()).toBe('HP:0000001');
    expect(featuresList[1].getType().getId()).toBe('HP:0000002');
  });
});
