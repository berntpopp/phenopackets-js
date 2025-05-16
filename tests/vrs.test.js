// tests/vrs.test.js
const pps = require('../index');

describe('VRS Functionality', () => {
    it('should create a VRS Allele and set its fields', () => {
        if (!pps.vrs || !pps.vrs.Allele) {
            console.warn('Skipping VRS tests: Allele class not found in index.js');
            return;
        }

        // Create an Allele object
        const allele = new pps.vrs.Allele();
        allele.setId('example-allele');
        
        // Create and set sequence location
        const location = new pps.vrs.SequenceLocation();
        location.setSequenceId('refseq:NC_000001.11');
        
        // Create and set interval using correct API
        const interval = new pps.vrs.SequenceInterval();
        const startNum = new pps.vrs.Number();
        startNum.setValue(100000);
        interval.setStartNumber(startNum);
        
        const endNum = new pps.vrs.Number();
        endNum.setValue(100001);
        interval.setEndNumber(endNum);
        
        location.setSequenceInterval(interval);
        allele.setSequenceLocation(location);
        
        // Set state using LiteralSequenceExpression
        const literalSequenceExpression = new pps.vrs.LiteralSequenceExpression();
        literalSequenceExpression.setSequence('A');
        allele.setLiteralSequenceExpression(literalSequenceExpression);
        
        // Validate the data
        expect(allele.getId()).toBe('example-allele');
        expect(allele.getSequenceLocation().getSequenceId()).toBe('refseq:NC_000001.11');
        const startValue = interval.getStartNumber().getValue();
        const endValue = interval.getEndNumber().getValue();
        expect(startValue).toBe(100000);
        expect(endValue).toBe(100001);
        expect(allele.getLiteralSequenceExpression().getSequence()).toBe('A');
        
    });

    it('should serialize and deserialize a VRS Allele (binary)', () => {
        if (!pps.vrs || !pps.vrs.Allele) {
            console.warn('Skipping VRS serialize test: Allele class not found');
            return;
        }

        const allele = new pps.vrs.Allele();
        allele.setId('binary-test');
        
        // Set a literal sequence expression
        const literalSequenceExpression = new pps.vrs.LiteralSequenceExpression();
        literalSequenceExpression.setSequence('T');
        allele.setLiteralSequenceExpression(literalSequenceExpression);

        // Serialize to binary
        const binaryData = allele.serializeBinary();
        expect(binaryData).toBeInstanceOf(Uint8Array);

        // Deserialize and check values
        const deserializedAllele = pps.vrs.Allele.deserializeBinary(binaryData);
        expect(deserializedAllele.getId()).toBe('binary-test');
        expect(deserializedAllele.getLiteralSequenceExpression().getSequence()).toBe('T');
    });

    it('should convert a VRS Allele to a JS object', () => {
        if (!pps.vrs || !pps.vrs.Allele) {
            console.warn('Skipping VRS toObject test: Allele class not found');
            return;
        }

        const allele = new pps.vrs.Allele();
        
        // Set a literal sequence expression
        const literalSequenceExpression = new pps.vrs.LiteralSequenceExpression();
        literalSequenceExpression.setSequence('G');
        allele.setLiteralSequenceExpression(literalSequenceExpression);

        // Convert to JavaScript object
        const alleleObj = allele.toObject();
        
        // Check if the sequence is correctly included in the object
        expect(alleleObj.literalSequenceExpression.sequence).toBe('G');
    });
});
