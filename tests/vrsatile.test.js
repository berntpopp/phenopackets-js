// tests/vrsatile.test.js
const pps = require('../index');

describe('VRSatile Functionality', () => {
    it('should create a VariationDescriptor and set its fields', () => {
        if (!pps.vrsatile || !pps.vrsatile.VariationDescriptor) {
            console.warn('Skipping VRSatile tests: VRSatile classes not found in index.js');
            return;
        }

        const variationDescriptor = new pps.vrsatile.VariationDescriptor();
        variationDescriptor.setId('variant:1234');
        
        // Add a label
        variationDescriptor.setLabel('NM_000059.3(BRCA2):c.7397T>G (p.Val2466Gly)');
        
        // Set gene context
        const geneDescriptor = new pps.vrsatile.GeneDescriptor();
        geneDescriptor.setValueId('hgnc:1101');
        geneDescriptor.setSymbol('BRCA2');
        variationDescriptor.setGeneContext(geneDescriptor);
        
        // Create and add a VCF record
        const vcfRecord = new pps.vrsatile.VcfRecord();
        vcfRecord.setChrom('13');
        vcfRecord.setPos(32355250);
        vcfRecord.setId('rs80359352');
        vcfRecord.setRef('T');
        vcfRecord.setAlt('G');
        variationDescriptor.setVcfRecord(vcfRecord);
        
        // Set VRS variation if available
        if (pps.vrs && pps.vrs.Allele) {
            const allele = new pps.vrs.Allele();
            const literalSequenceExpression = new pps.vrs.LiteralSequenceExpression();
            literalSequenceExpression.setSequence('G');
            allele.setState(literalSequenceExpression);
            
            variationDescriptor.setVariation({
                valueId: 'ga4gh:VA.abc123',
                allele: allele
            });
        }
        
        // Validate the data
        expect(variationDescriptor.getId()).toBe('variant:1234');
        expect(variationDescriptor.getLabel()).toBe('NM_000059.3(BRCA2):c.7397T>G (p.Val2466Gly)');
        expect(variationDescriptor.getGeneContext().getValueId()).toBe('hgnc:1101');
        expect(variationDescriptor.getGeneContext().getSymbol()).toBe('BRCA2');
        expect(variationDescriptor.getVcfRecord().getChrom()).toBe('13');
        expect(variationDescriptor.getVcfRecord().getPos()).toBe(32355250);
        expect(variationDescriptor.getVcfRecord().getRef()).toBe('T');
        expect(variationDescriptor.getVcfRecord().getAlt()).toBe('G');
    });

    it('should serialize and deserialize a VariationDescriptor (binary)', () => {
        if (!pps.vrsatile || !pps.vrsatile.VariationDescriptor) {
            console.warn('Skipping VRSatile tests: VRSatile classes not found in index.js');
            return;
        }

        const variationDescriptor = new pps.vrsatile.VariationDescriptor();
        variationDescriptor.setId('test:binary');
        variationDescriptor.setLabel('Binary Test Variant');
        
        const binaryData = variationDescriptor.serializeBinary();
        expect(binaryData).toBeInstanceOf(Uint8Array);

        const deserializedDescriptor = pps.vrsatile.VariationDescriptor.deserializeBinary(binaryData);
        expect(deserializedDescriptor.getId()).toBe('test:binary');
        expect(deserializedDescriptor.getLabel()).toBe('Binary Test Variant');
    });

    it('should convert a VariationDescriptor to a JS object', () => {
        if (!pps.vrsatile || !pps.vrsatile.VariationDescriptor) {
            console.warn('Skipping VRSatile tests: VRSatile classes not found in index.js');
            return;
        }

        const variationDescriptor = new pps.vrsatile.VariationDescriptor();
        variationDescriptor.setId('test:object');
        variationDescriptor.setLabel('Object Test Variant');
        
        const descriptorObj = variationDescriptor.toObject();
        expect(descriptorObj.id).toBe('test:object');
        expect(descriptorObj.label).toBe('Object Test Variant');
    });
});
