// tests/json-utils.test.js
const pps = require('../index');

// This is a preliminary test file for JSON utilities
// In the future, we'll expand this with actual JSON serialization/deserialization functions

describe('JSON Utilities', () => {
    it('should convert a Phenopacket to JSON string and back (basic structure)', () => {
        // Create a simple phenopacket
        const phenopacket = new pps.v2.Phenopacket();
        phenopacket.setId('json-test-001');
        
        const subject = new pps.v2.core.Individual();
        subject.setId('subject-json-001');
        subject.setSex(pps.v2.core.Sex.MALE);
        phenopacket.setSubject(subject);
        
        // Convert to object and then to JSON string
        const phenopacketObj = phenopacket.toObject();
        const jsonString = JSON.stringify(phenopacketObj);
        
        // Parse JSON string back to object
        const parsedObj = JSON.parse(jsonString);
        
        // Verify key properties
        expect(parsedObj.id).toBe('json-test-001');
        expect(parsedObj.subject.id).toBe('subject-json-001');
        expect(parsedObj.subject.sex).toBe(pps.v2.core.Sex.MALE);
    });
    
    // This test demonstrates a simple helper function for JSON conversion
    it('should demonstrate a basic toJSON helper function', () => {
        // Helper function to convert a phenopacket to a JSON string
        function phenopacketToJSON(phenopacket) {
            return JSON.stringify(phenopacket.toObject());
        }
        
        // Helper function to create a phenopacket from a JS object (preliminary version)
        function createPhenopacketFromObject(obj) {
            const phenopacket = new pps.v2.Phenopacket();
            if (obj.id) phenopacket.setId(obj.id);
            
            if (obj.subject) {
                const subject = new pps.v2.core.Individual();
                if (obj.subject.id) subject.setId(obj.subject.id);
                if (obj.subject.sex !== undefined) subject.setSex(obj.subject.sex);
                phenopacket.setSubject(subject);
            }
            
            return phenopacket;
        }
        
        // Create a phenopacket
        const phenopacket = new pps.v2.Phenopacket();
        phenopacket.setId('json-helper-test');
        
        const subject = new pps.v2.core.Individual();
        subject.setId('subject-helper');
        subject.setSex(pps.v2.core.Sex.FEMALE);
        phenopacket.setSubject(subject);
        
        // Convert to JSON string
        const jsonString = phenopacketToJSON(phenopacket);
        
        // Parse JSON string and create a new phenopacket
        const parsedObj = JSON.parse(jsonString);
        const recreatedPhenopacket = createPhenopacketFromObject(parsedObj);
        
        // Verify recreated phenopacket
        expect(recreatedPhenopacket.getId()).toBe('json-helper-test');
        expect(recreatedPhenopacket.getSubject().getId()).toBe('subject-helper');
        expect(recreatedPhenopacket.getSubject().getSex()).toBe(pps.v2.core.Sex.FEMALE);
    });
});
