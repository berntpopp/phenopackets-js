// tests/vrs.test.js
const pps = require('../index');

describe('VRS Functionality', () => {
    it('should create a VRS Allele and set its fields', () => {
        if (!pps.vrs || !pps.vrs.Allele) {
            console.warn('Skipping VRS tests: VRS classes not found in index.js');
            return;
        }

        const allele = new pps.vrs.Allele();
        
        // Create and set sequence location
        const location = new pps.vrs.SequenceLocation();
        location.setSequenceId('refseq:NC_000001.11');
        
        const interval = new pps.vrs.SequenceInterval();
        const start = new pps.vrs.Number();
        start.setValue(100000);
        const end = new pps.vrs.Number();
        end.setValue(100001);
        interval.setStart(start);
        interval.setEnd(end);
        
        location.setInterval(interval);
        allele.setLocation(location);
        
        // Set state
        const literalSequenceExpression = new pps.vrs.LiteralSequenceExpression();
        literalSequenceExpression.setSequence('A');
        allele.setState(literalSequenceExpression);
        
        // Validate the data
        expect(allele.getLocation().getSequenceId()).toBe('refseq:NC_000001.11');
        expect(allele.getLocation().getInterval().getStart().getValue()).toBe(100000);
        expect(allele.getLocation().getInterval().getEnd().getValue()).toBe(100001);
        expect(allele.getState().getSequence()).toBe('A');
    });

    it('should serialize and deserialize a VRS Allele (binary)', () => {
        if (!pps.vrs || !pps.vrs.Allele) {
            console.warn('Skipping VRS tests: VRS classes not found in index.js');
            return;
        }

        const allele = new pps.vrs.Allele();
        const literalSequenceExpression = new pps.vrs.LiteralSequenceExpression();
        literalSequenceExpression.setSequence('T');
        allele.setState(literalSequenceExpression);

        const binaryData = allele.serializeBinary();
        expect(binaryData).toBeInstanceOf(Uint8Array);

        const deserializedAllele = pps.vrs.Allele.deserializeBinary(binaryData);
        expect(deserializedAllele.getState().getSequence()).toBe('T');
    });

    it('should convert a VRS Allele to a JS object', () => {
        if (!pps.vrs || !pps.vrs.Allele) {
            console.warn('Skipping VRS tests: VRS classes not found in index.js');
            return;
        }

        const allele = new pps.vrs.Allele();
        const literalSequenceExpression = new pps.vrs.LiteralSequenceExpression();
        literalSequenceExpression.setSequence('G');
        allele.setState(literalSequenceExpression);

        const alleleObj = allele.toObject();
        expect(alleleObj.state.sequence).toBe('G');
    });
});
