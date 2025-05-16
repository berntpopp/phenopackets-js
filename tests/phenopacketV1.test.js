// tests/phenopacketV1.test.js
const pps = require('../index');
const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb');

describe('Phenopacket v1 Functionality', () => {
    let individual;
    let metaData;
    let phenotypicFeature;

    beforeEach(() => {
        // Create Individual
        individual = new pps.v1.Individual();
        individual.setId('patient-v1-001');
        individual.setSex(pps.v1.Sex.FEMALE);
        
        // Create MetaData
        metaData = new pps.v1.MetaData();
        const createdTs = new Timestamp();
        createdTs.setSeconds(Math.floor(Date.now() / 1000));
        metaData.setCreated(createdTs);
        metaData.setCreatedBy('Test Script');
        
        const hpoResource = new pps.v1.Resource();
        hpoResource.setId("hp");
        hpoResource.setName("Human Phenotype Ontology");
        hpoResource.setNamespacePrefix("HP");
        hpoResource.setUrl("http://purl.obolibrary.org/obo/hp.owl");
        hpoResource.setVersion("2021-08-02");
        metaData.addResources(hpoResource);

        // Create a Phenotypic Feature
        phenotypicFeature = new pps.v1.PhenotypicFeature();
        const featureType = new pps.v1.OntologyClass();
        featureType.setId("HP:0000789");
        featureType.setLabel("Infertility");
        phenotypicFeature.setType(featureType);
    });

    it('should create a Phenopacket and set basic fields', () => {
        const phenopacket = new pps.v1.Phenopacket();
        phenopacket.setId('ppkt-v1-test-001');
        phenopacket.setSubject(individual);
        phenopacket.setMetaData(metaData);
        phenopacket.addPhenotypicFeatures(phenotypicFeature);

        expect(phenopacket.getId()).toBe('ppkt-v1-test-001');
        expect(phenopacket.getSubject().getId()).toBe('patient-v1-001');
        expect(phenopacket.getSubject().getSex()).toBe(pps.v1.Sex.FEMALE);
        expect(phenopacket.getMetaData().getCreatedBy()).toBe('Test Script');
        expect(phenopacket.getPhenotypicFeaturesList().length).toBe(1);
        expect(phenopacket.getPhenotypicFeaturesList()[0].getType().getId()).toBe("HP:0000789");
    });

    it('should serialize and deserialize a Phenopacket (binary)', () => {
        const phenopacket = new pps.v1.Phenopacket();
        phenopacket.setId('ppkt-binary-test-v1');
        phenopacket.setSubject(individual);
        phenopacket.setMetaData(metaData);
        phenopacket.addPhenotypicFeatures(phenotypicFeature);

        const binaryData = phenopacket.serializeBinary();
        expect(binaryData).toBeInstanceOf(Uint8Array);

        const deserializedPhenopacket = pps.v1.Phenopacket.deserializeBinary(binaryData);
        expect(deserializedPhenopacket.getId()).toBe('ppkt-binary-test-v1');
        expect(deserializedPhenopacket.getSubject().getId()).toBe(individual.getId());
        expect(deserializedPhenopacket.getMetaData().getCreatedBy()).toBe(metaData.getCreatedBy());
    });

    it('should convert a Phenopacket to a JS object', () => {
        const phenopacket = new pps.v1.Phenopacket();
        phenopacket.setId('ppkt-to-object-test-v1');
        phenopacket.setSubject(individual);

        const phenopacketObj = phenopacket.toObject();
        expect(phenopacketObj.id).toBe('ppkt-to-object-test-v1');
        expect(phenopacketObj.subject.id).toBe('patient-v1-001');
        // Note: enum values are numbers in toObject() output
        expect(phenopacketObj.subject.sex).toBe(pps.v1.Sex.FEMALE);
    });
});
