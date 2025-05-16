// tests/phenopacket-json-utils.test.js
const pps = require('../index');

describe('Phenopacket-specific JSON Utilities', () => {
  // Test for phenopacketToJSON
  it('should convert a Phenopacket to JSON string using phenopacketToJSON', () => {
    // Create a phenopacket with nested objects
    const phenopacket = new pps.v2.Phenopacket();
    phenopacket.setId('phenopacket-json-test-001');

    const subject = new pps.v2.core.Individual();
    subject.setId('subject-001');
    subject.setSex(pps.v2.core.Sex.MALE);
    phenopacket.setSubject(subject);

    // Convert to JSON string
    const jsonString = pps.jsonUtils.phenopacketToJSON(phenopacket);

    // Parse JSON string back to object
    const parsedObj = JSON.parse(jsonString);

    // Verify key properties
    expect(parsedObj.id).toBe('phenopacket-json-test-001');
    expect(parsedObj.subject.id).toBe('subject-001');
    expect(parsedObj.subject.sex).toBe(pps.v2.core.Sex.MALE);
  });

  // Test for jsonToPhenopacket
  it('should convert JSON to a Phenopacket using jsonToPhenopacket', () => {
    // Create JSON string directly
    const jsonString = JSON.stringify({
      id: 'phenopacket-json-test-002',
      subject: {
        id: 'subject-002',
        sex: pps.v2.core.Sex.FEMALE,
      },
    });

    // Create an object with v2 class constructors
    const v2Classes = {
      Phenopacket: pps.v2.Phenopacket,
      Individual: pps.v2.core.Individual,
      OntologyClass: pps.v2.core.OntologyClass,
      PhenotypicFeature: pps.v2.core.PhenotypicFeature,
      Disease: pps.v2.core.Disease,
      Biosample: pps.v2.core.Biosample,
    };

    // Convert JSON to Phenopacket
    const phenopacket = pps.jsonUtils.jsonToPhenopacket(jsonString, v2Classes);

    // Verify key properties
    expect(phenopacket.getId()).toBe('phenopacket-json-test-002');
    expect(phenopacket.getSubject().getId()).toBe('subject-002');
    expect(phenopacket.getSubject().getSex()).toBe(pps.v2.core.Sex.FEMALE);
  });

  // Test for validatePhenopacketJson with valid data
  it('should validate a valid Phenopacket JSON', () => {
    // Create a valid phenopacket JSON
    const validJson = {
      id: 'valid-phenopacket-001',
      subject: {
        id: 'valid-subject-001',
        sex: pps.v2.core.Sex.FEMALE,
      },
      phenotypicFeaturesList: [
        {
          type: {
            id: 'HP:0000118',
            label: 'Phenotypic abnormality',
          },
        },
      ],
      diseasesList: [
        {
          term: {
            id: 'MONDO:0000001',
            label: 'disease',
          },
        },
      ],
      biosamplesList: [
        {
          id: 'biosample-001',
          sampleType: {
            id: 'UBERON:0000178',
            label: 'blood',
          },
        },
      ],
    };

    // Validate the JSON
    const validationResult = pps.jsonUtils.validatePhenopacketJson(validJson);

    // Check the validation result
    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors.length).toBe(0);
  });

  // Test for validatePhenopacketJson with invalid data
  it('should identify validation errors in an invalid Phenopacket JSON', () => {
    // Create an invalid phenopacket JSON
    const invalidJson = {
      // Missing id
      subject: {
        // Missing subject.id
        sex: pps.v2.core.Sex.FEMALE,
      },
      phenotypicFeaturesList: [
        {
          // Missing type with id
        },
      ],
      diseasesList: [
        {
          // Missing term with id
        },
      ],
      biosamplesList: [
        {
          // Missing id
          sampleType: {
            id: 'UBERON:0000178',
            label: 'blood',
          },
        },
      ],
    };

    // Validate the JSON
    const validationResult = pps.jsonUtils.validatePhenopacketJson(invalidJson);

    // Check the validation result
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors.length).toBeGreaterThan(0);

    // Specific error checks
    expect(validationResult.errors).toContain('Missing required field: id');
    expect(validationResult.errors).toContain('Missing required field: subject.id');
    expect(validationResult.errors).toContain(
      'PhenotypicFeature at index 0 is missing required field: type.id'
    );
    expect(validationResult.errors).toContain(
      'Disease at index 0 is missing required field: term.id'
    );
    expect(validationResult.errors).toContain('Biosample at index 0 is missing required field: id');
  });

  // Test for createEmptyPhenopacketJson
  it('should create an empty phenopacket JSON structure with required fields', () => {
    // Create an empty v2 phenopacket
    const emptyV2 = pps.jsonUtils.createEmptyPhenopacketJson('v2');

    // Verify structure
    expect(emptyV2.id).toBe('');
    expect(emptyV2.subject.id).toBe('');
    expect(emptyV2.phenotypicFeaturesList).toEqual([]);
    expect(emptyV2.diseasesList).toEqual([]);
    expect(emptyV2.biosamplesList).toEqual([]);

    // Create an empty v1 phenopacket
    const emptyV1 = pps.jsonUtils.createEmptyPhenopacketJson('v1');

    // Verify structure
    expect(emptyV1.id).toBe('');
    expect(emptyV1.subject.id).toBe('');
    expect(emptyV1.phenotypicFeatures).toEqual([]);
    expect(emptyV1.diseases).toEqual([]);
    expect(emptyV1.biosamples).toEqual([]);
  });

  // Test for error handling
  it('should handle errors properly in phenopacket JSON utilities', () => {
    // Test phenopacketToJSON with invalid input
    expect(() => {
      pps.jsonUtils.phenopacketToJSON(null);
    }).toThrow('Invalid Phenopacket object');

    // Test jsonToPhenopacket with invalid input
    expect(() => {
      pps.jsonUtils.jsonToPhenopacket(null);
    }).toThrow('JSON input must be a string');

    // Test jsonToPhenopacket without required classes
    expect(() => {
      pps.jsonUtils.jsonToPhenopacket('{"id":"test"}');
    }).toThrow('v2Classes must be provided');

    // Test validatePhenopacketJson with invalid schema version
    expect(() => {
      pps.jsonUtils.validatePhenopacketJson({}, 'v3');
    }).toThrow('Unsupported schema version: v3');

    // Test createEmptyPhenopacketJson with invalid schema version
    expect(() => {
      pps.jsonUtils.createEmptyPhenopacketJson('v3');
    }).toThrow('Unsupported schema version: v3');
  });
});
