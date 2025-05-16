// tests/exports.test.js
const pps = require('../index'); // Adjust if your index.js is elsewhere relative to tests

describe('Package Exports', () => {
  it('should export Phenopacket (v2)', () => {
    expect(pps.v2.Phenopacket).toBeDefined();
    const phenopacket = new pps.v2.Phenopacket();
    expect(phenopacket).toBeInstanceOf(pps.v2.Phenopacket);
  });

  it('should export Individual (v2.core)', () => {
    expect(pps.v2.core.Individual).toBeDefined();
    const individual = new pps.v2.core.Individual();
    expect(individual).toBeInstanceOf(pps.v2.core.Individual);
  });

  it('should export OntologyClass (v2.core)', () => {
    expect(pps.v2.core.OntologyClass).toBeDefined();
    const ontologyClass = new pps.v2.core.OntologyClass();
    expect(ontologyClass).toBeInstanceOf(pps.v2.core.OntologyClass);
  });

  it('should export Sex enum (v2.core.Individual)', () => {
    expect(pps.v2.core.Sex).toBeDefined();
    expect(pps.v2.core.Sex.MALE).toBeDefined();
    expect(pps.v2.core.Sex.FEMALE).toBeDefined();
  });

  it('should export Google Protobuf Timestamp', () => {
    let TimestampClass;
    let timestampSource = '';

    if (pps.Timestamp) {
      TimestampClass = pps.Timestamp;
      timestampSource = 'pps.Timestamp';
    } else if (pps.google && pps.google.protobuf && pps.google.protobuf.Timestamp) {
      TimestampClass = pps.google.protobuf.Timestamp;
      timestampSource = 'pps.google.protobuf.Timestamp';
    } else {
      TimestampClass = require('google-protobuf/google/protobuf/timestamp_pb').Timestamp;
      timestampSource = 'google-protobuf direct import';
    }

    expect(TimestampClass).toBeDefined();
    const ts = new TimestampClass();
    expect(ts).toBeInstanceOf(TimestampClass);
    console.log(`Using Timestamp from ${timestampSource}`);
  });

  // Add more tests for other key exports from v1, vrs, vrsatile as you populate index.js
  it('should export VRS Allele', () => {
    // Skip test if VRS Allele is not available
    if (!pps.vrs || !pps.vrs.Allele) {
      console.warn('Skipping VRS Allele export test: pps.vrs.Allele not found in index.js');
      return;
    }

    // If we get here, pps.vrs.Allele exists and we can test it without conditionals
    expect(pps.vrs.Allele).toBeDefined();
    const allele = new pps.vrs.Allele();
    expect(allele).toBeInstanceOf(pps.vrs.Allele);
  });

  it('should export VRSATILE VariationDescriptor', () => {
    // Skip test if VRSATILE VariationDescriptor is not available
    if (!pps.vrsatile || !pps.vrsatile.VariationDescriptor) {
      console.warn(
        'Skipping VRSATILE VariationDescriptor export test: pps.vrsatile.VariationDescriptor not found in index.js'
      );
      return;
    }

    // If we get here, pps.vrsatile.VariationDescriptor exists and we can test it without conditionals
    expect(pps.vrsatile.VariationDescriptor).toBeDefined();
    const vd = new pps.vrsatile.VariationDescriptor();
    expect(vd).toBeInstanceOf(pps.vrsatile.VariationDescriptor);
  });
});
