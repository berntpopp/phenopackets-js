// tests/structure.test.js
// Converted from debug-structure.js to a proper test
const pps = require('../index');

describe('Module Structure', () => {
  it('should provide expected top-level namespaces', () => {
    // Test for major namespaces
    expect(pps.v1).toBeDefined();
    expect(pps.v2).toBeDefined();
    expect(pps.vrs).toBeDefined();
    expect(pps.vrsatile).toBeDefined();
  });

  it('should provide v1 Phenopacket class', () => {
    expect(pps.v1.Phenopacket).toBeDefined();
    expect(typeof pps.v1.Phenopacket).toBe('function');

    // Verify it can be instantiated
    const phenopacket = new pps.v1.Phenopacket();
    expect(phenopacket).toBeDefined();
    expect(typeof phenopacket.setId).toBe('function');
  });

  it('should provide v2 Phenopacket class', () => {
    expect(pps.v2.Phenopacket).toBeDefined();
    expect(typeof pps.v2.Phenopacket).toBe('function');

    // Verify it can be instantiated
    const phenopacket = new pps.v2.Phenopacket();
    expect(phenopacket).toBeDefined();
    expect(typeof phenopacket.setId).toBe('function');
  });

  it('should provide core classes for v2', () => {
    expect(pps.v2.core).toBeDefined();
    expect(pps.v2.core.Individual).toBeDefined();
    expect(pps.v2.core.PhenotypicFeature).toBeDefined();
    expect(pps.v2.core.Disease).toBeDefined();
    expect(pps.v2.core.OntologyClass).toBeDefined();
  });

  it('should provide core classes with proper methods', () => {
    const individual = new pps.v2.core.Individual();
    expect(individual).toBeDefined();
    expect(typeof individual.setId).toBe('function');
    expect(typeof individual.getId).toBe('function');

    const ontologyClass = new pps.v2.core.OntologyClass();
    expect(ontologyClass).toBeDefined();
    expect(typeof ontologyClass.setId).toBe('function');
    expect(typeof ontologyClass.setLabel).toBe('function');
  });

  // Only test VRS if it's available
  if (pps.vrs && pps.vrs.Allele) {
    it('should provide VRS classes', () => {
      expect(pps.vrs.Allele).toBeDefined();
      expect(typeof pps.vrs.Allele).toBe('function');
    });
  }

  // Only test VRSatile if it's available
  if (pps.vrsatile && pps.vrsatile.VariationDescriptor) {
    it('should provide VRSatile classes', () => {
      expect(pps.vrsatile.VariationDescriptor).toBeDefined();
      expect(typeof pps.vrsatile.VariationDescriptor).toBe('function');
    });
  }
});
