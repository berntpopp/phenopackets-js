// tests/json-utils.test.js
const pps = require('../index');

describe('JSON Utilities', () => {
  // Basic test for toJSON
  it('should convert a Phenopacket to JSON string using toJSON', () => {
    // Create a simple phenopacket
    const phenopacket = new pps.v2.Phenopacket();
    phenopacket.setId('json-test-001');

    // Convert to JSON string
    const jsonString = pps.jsonUtils.toJSON(phenopacket);

    // Parse JSON string back to object
    const parsedObj = JSON.parse(jsonString);

    // Verify key properties
    expect(parsedObj.id).toBe('json-test-001');
  });

  // Test for toJSON with nested objects
  it('should convert a Phenopacket with nested objects to JSON string', () => {
    // Create a phenopacket with a nested object
    const phenopacket = new pps.v2.Phenopacket();
    phenopacket.setId('json-test-002');

    const subject = new pps.v2.core.Individual();
    subject.setId('subject-json-002');
    phenopacket.setSubject(subject);

    // Convert to JSON string with pretty printing
    const jsonString = pps.jsonUtils.toJSON(phenopacket, { pretty: true });

    // Verify the JSON has the correct structure
    const parsedObj = JSON.parse(jsonString);
    expect(parsedObj.id).toBe('json-test-002');
    expect(parsedObj.subject.id).toBe('subject-json-002');
  });

  // Test for error handling in toJSON
  it('should handle error cases in toJSON', () => {
    expect(() => {
      pps.jsonUtils.toJSON(null);
    }).toThrow('Invalid Protocol Buffer object');
  });

  // Test for timestamp conversion
  it('should provide timestamp conversion utilities', () => {
    // This test verifies the timestamp conversion functions exist
    // without actually testing their functionality yet
    expect(typeof pps.jsonUtils.dateToTimestamp).toBe('function');
    expect(typeof pps.jsonUtils.timestampToDate).toBe('function');
  });

  // Test for manual object conversion (demonstration)
  it('should demonstrate a manual conversion approach', () => {
    // This is an example of how users might convert between JSON and objects
    // without using the complex fromJSON functionality

    // Create a phenopacket
    const phenopacket = new pps.v2.Phenopacket();
    phenopacket.setId('manual-conversion-test');

    // Convert to JSON string
    const jsonString = pps.jsonUtils.toJSON(phenopacket);

    // Parse the JSON
    const parsedObj = JSON.parse(jsonString);

    // Manually create a new object from the parsed JSON
    const recreated = new pps.v2.Phenopacket();
    recreated.setId(parsedObj.id);

    // Verify the recreated object
    expect(recreated.getId()).toBe('manual-conversion-test');
  });
});
