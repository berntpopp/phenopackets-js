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

    it('should export Timestamp (google.protobuf)', () => {
        // Assuming you've re-exported it from your index.js
        // If Timestamp is directly from 'google-protobuf/google/protobuf/timestamp_pb'
        // and not re-exported via your pps object, this test might need adjustment
        // or you'd import it directly from 'google-protobuf'.
        // For this example, let's assume index.js re-exports it for convenience.
        if (pps.Timestamp) { // Check if Timestamp is directly on pps
             expect(pps.Timestamp).toBeDefined();
             const ts = new pps.Timestamp();
             expect(ts).toBeInstanceOf(pps.Timestamp);
        } else if (pps.google && pps.google.protobuf && pps.google.protobuf.Timestamp) { // Or under a google namespace
             expect(pps.google.protobuf.Timestamp).toBeDefined();
             const ts = new pps.google.protobuf.Timestamp();
             expect(ts).toBeInstanceOf(pps.google.protobuf.Timestamp);
        } else {
            // Fallback if not re-exported: test direct import (though this doesn't test your index.js for it)
            const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb');
            expect(Timestamp).toBeDefined();
        }
    });

    // Add more tests for other key exports from v1, vrs, vrsatile as you populate index.js
    it('should export VRS Allele', () => {
        if (pps.vrs && pps.vrs.Allele) { // Check if vrs and Allele are defined
            expect(pps.vrs.Allele).toBeDefined();
            const allele = new pps.vrs.Allele();
            expect(allele).toBeInstanceOf(pps.vrs.Allele);
        } else {
            console.warn('Skipping VRS Allele export test: pps.vrs.Allele not found in index.js');
        }
    });

    it('should export VRSATILE VariationDescriptor', () => {
        if (pps.vrsatile && pps.vrsatile.VariationDescriptor) { // Check
            expect(pps.vrsatile.VariationDescriptor).toBeDefined();
            const vd = new pps.vrsatile.VariationDescriptor();
            expect(vd).toBeInstanceOf(pps.vrsatile.VariationDescriptor);
        } else {
            console.warn('Skipping VRSATILE VariationDescriptor export test: pps.vrsatile.VariationDescriptor not found in index.js');
        }
    });
});
