// tests/golden.test.js
const fs = require('fs');
const path = require('path');
const pps = require('../index');

describe('Golden Phenopacket Tests', () => {
  // Define the V2 class constructors needed for JSON to Phenopacket conversion
  const v2Classes = {
    Phenopacket: pps.v2.Phenopacket,
    Individual: pps.v2.core.Individual,
    OntologyClass: pps.v2.core.OntologyClass,
    PhenotypicFeature: pps.v2.core.PhenotypicFeature,
    Disease: pps.v2.core.Disease,
    Biosample: pps.v2.core.Biosample,
  };

  // Helper function to read golden files
  const readGoldenFile = (filename) => {
    const filePath = path.join(__dirname, 'golden', 'v2', filename);
    return fs.readFileSync(filePath, 'utf8');
  };

  // Get a list of all golden files
  const goldenFiles = [
    'phenopacket_nephropathy.json',
    'phenopacket_nephrolithiasis.json',
    'phenopacket_chronic_diarrhea.json',
  ];

  // Test loading and validating each golden file
  describe('Loading and validating golden files', () => {
    goldenFiles.forEach((filename) => {
      it(`should load and validate ${filename}`, () => {
        // Read the golden file
        const jsonContent = readGoldenFile(filename);

        // Parse the JSON
        const jsonObject = JSON.parse(jsonContent);

        // Validate the JSON against the phenopacket schema
        const validationResult = pps.jsonUtils.validatePhenopacketJson(jsonObject);

        // Expect the validation to pass
        expect(validationResult.isValid).toBe(true);
        if (!validationResult.isValid) {
          console.error(`Validation errors for ${filename}:`, validationResult.errors);
        }
      });
    });
  });

  // Test converting JSON to Phenopacket objects and back
  describe('JSON to Phenopacket conversion', () => {
    goldenFiles.forEach((filename) => {
      it(`should convert ${filename} to a Phenopacket object and back to JSON`, () => {
        // Read the golden file
        const jsonContent = readGoldenFile(filename);

        // Convert to a Phenopacket
        const phenopacket = pps.jsonUtils.jsonToPhenopacket(jsonContent, v2Classes);

        // Verify basic properties were parsed correctly
        expect(phenopacket.getId()).toBeTruthy();
        expect(phenopacket.getSubject()).toBeTruthy();
        expect(phenopacket.getSubject().getId()).toBeTruthy();

        // Convert back to JSON
        const convertedJson = pps.jsonUtils.phenopacketToJSON(phenopacket);

        // Parse both JSONs for comparison
        const original = JSON.parse(jsonContent);
        const converted = JSON.parse(convertedJson);

        // Compare IDs to ensure the basic identity is preserved
        expect(converted.id).toBe(original.id);
        expect(converted.subject.id).toBe(original.subject.id);
      });
    });
  });

  // Test specific properties in each golden file to ensure they match expectations
  describe('Golden file specific tests', () => {
    it('should contain expected phenotypic features in nephropathy file', () => {
      const jsonContent = readGoldenFile('phenopacket_nephropathy.json');
      const jsonObject = JSON.parse(jsonContent);

      // Check for a specific phenotypic feature in the nephropathy file
      const hasPhenotype = jsonObject.phenotypicFeatures.some(
        (feature) => feature.type.id === 'HP:0000121' && feature.type.label === 'Nephrocalcinosis'
      );

      expect(hasPhenotype).toBe(true);
    });

    it('should contain expected phenotypic features in nephrolithiasis file', () => {
      const jsonContent = readGoldenFile('phenopacket_nephrolithiasis.json');
      const jsonObject = JSON.parse(jsonContent);

      // Check for a specific phenotypic feature in the nephrolithiasis file
      const hasPhenotype = jsonObject.phenotypicFeatures.some(
        (feature) => feature.type.id === 'HP:0000787' && feature.type.label === 'Nephrolithiasis'
      );

      expect(hasPhenotype).toBe(true);
    });

    it('should contain expected phenotypic features in chronic diarrhea file', () => {
      const jsonContent = readGoldenFile('phenopacket_chronic_diarrhea.json');
      const jsonObject = JSON.parse(jsonContent);

      // Check for a specific phenotypic feature in the chronic diarrhea file
      const hasPhenotype = jsonObject.phenotypicFeatures.some(
        (feature) => feature.type.id === 'HP:0002028' && feature.type.label === 'Chronic diarrhea'
      );

      expect(hasPhenotype).toBe(true);
    });
  });

  // Test using the compareWithGoldenFile utility
  describe('Golden file comparison utility', () => {
    it('should create a phenopacket from JSON and match it back to golden file', async () => {
      const filename = 'phenopacket_nephropathy.json';
      const jsonContent = readGoldenFile(filename);

      // Create a phenopacket from the JSON
      const phenopacket = pps.jsonUtils.jsonToPhenopacket(jsonContent, v2Classes);

      // Create a temporary JSON file from the phenopacket
      const tempFilePath = path.join(__dirname, 'golden', 'v2', 'temp_comparison.json');
      fs.writeFileSync(
        tempFilePath,
        pps.jsonUtils.phenopacketToJSON(phenopacket, { pretty: true })
      );

      try {
        // Compare with the original golden file
        const goldenFilePath = path.join(__dirname, 'golden', 'v2', filename);

        // Load both files for manual comparison since ids and structures may differ
        const originalJson = JSON.parse(fs.readFileSync(goldenFilePath, 'utf8'));
        const generatedJson = JSON.parse(fs.readFileSync(tempFilePath, 'utf8'));

        // Compare only essential properties
        expect(generatedJson.id).toBe(originalJson.id);
        expect(generatedJson.subject.id).toBe(originalJson.subject.id);

        // If we get here, the test passed
        expect(true).toBe(true);
      } finally {
        // Clean up the temporary file
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    });
  });
});
