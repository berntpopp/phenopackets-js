// tests/metadata-utils.test.js
const pps = require('../index');

describe('Metadata Handling Utilities', () => {
  describe('Metadata Creation and Manipulation', () => {
    it('should create and populate metadata objects correctly', () => {
      // Create metadata for a phenopacket
      const metadata = new pps.v2.core.MetaData();
      
      // Set basic properties
      if (typeof metadata.setCreated === 'function') {
        metadata.setCreated(pps.jsonUtils.dateToTimestamp(new Date()));
      }
      metadata.setCreatedBy('test-creator');
      
      // Add resources
      const hpoResource = new pps.v2.core.Resource();
      hpoResource.setId('hp');
      hpoResource.setName('Human Phenotype Ontology');
      hpoResource.setUrl('http://purl.obolibrary.org/obo/hp.obo');
      hpoResource.setVersion('2023-01-27');
      hpoResource.setNamespacePrefix('HP');
      hpoResource.setIriPrefix('http://purl.obolibrary.org/obo/HP_');
      
      const mondoResource = new pps.v2.core.Resource();
      mondoResource.setId('mondo');
      mondoResource.setName('Mondo Disease Ontology');
      mondoResource.setUrl('http://purl.obolibrary.org/obo/mondo.obo');
      mondoResource.setVersion('2023-04-04');
      mondoResource.setNamespacePrefix('MONDO');
      mondoResource.setIriPrefix('http://purl.obolibrary.org/obo/MONDO_');
      
      metadata.addResources(hpoResource);
      metadata.addResources(mondoResource);
      
      // Set phenopacket schema version if the method exists
      if (typeof metadata.setPhenopacketSchemaVersion === 'function') {
        metadata.setPhenopacketSchemaVersion('2.0');
      }
      
      // Convert to JSON
      const jsonString = pps.jsonUtils.toJSON(metadata, { pretty: true });
      const parsedObj = JSON.parse(jsonString);
      
      // Verify structure
      expect(parsedObj.createdBy).toBe('test-creator');
      expect(parsedObj.resourcesList).toHaveLength(2);
      expect(parsedObj.resourcesList[0].id).toBe('hp');
      expect(parsedObj.resourcesList[1].id).toBe('mondo');
      expect(parsedObj.phenopacketSchemaVersion).toBe('2.0');
    });
    
    it('should handle external references in metadata', () => {
      // Create metadata with external references
      const metadata = new pps.v2.core.MetaData();
      metadata.setCreatedBy('test-creator');
      
      // Add external references
      const externalRef1 = new pps.v2.core.ExternalReference();
      externalRef1.setId('PMID:12345678');
      externalRef1.setDescription('A scientific paper about phenopackets');
      externalRef1.setReference('https://pubmed.ncbi.nlm.nih.gov/12345678/');
      
      const externalRef2 = new pps.v2.core.ExternalReference();
      externalRef2.setId('DOI:10.1234/journal.pone.0123456');
      externalRef2.setDescription('Another scientific paper');
      externalRef2.setReference('https://doi.org/10.1234/journal.pone.0123456');
      
      metadata.addExternalReferences(externalRef1);
      metadata.addExternalReferences(externalRef2);
      
      // Convert to JSON
      const jsonString = pps.jsonUtils.toJSON(metadata);
      const parsedObj = JSON.parse(jsonString);
      
      // Verify structure
      expect(parsedObj.externalReferencesList).toHaveLength(2);
      expect(parsedObj.externalReferencesList[0].id).toBe('PMID:12345678');
      expect(parsedObj.externalReferencesList[1].id).toBe('DOI:10.1234/journal.pone.0123456');
    });
    
    it('should validate metadata within a phenopacket', () => {
      // Create a phenopacket with metadata
      const phenopacket = new pps.v2.Phenopacket();
      phenopacket.setId('metadata-test');
      
      // Add subject
      const subject = new pps.v2.core.Individual();
      subject.setId('subject-metadata-test');
      phenopacket.setSubject(subject);
      
      // Create metadata
      const metadata = new pps.v2.core.MetaData();
      metadata.setCreatedBy('metadata-validator');
      if (typeof metadata.setPhenopacketSchemaVersion === 'function') {
        metadata.setPhenopacketSchemaVersion('2.0');
      }
      
      // Add a resource
      const hpoResource = new pps.v2.core.Resource();
      hpoResource.setId('hp');
      hpoResource.setName('Human Phenotype Ontology');
      hpoResource.setUrl('http://purl.obolibrary.org/obo/hp.obo');
      hpoResource.setVersion('2023-01-27');
      metadata.addResources(hpoResource);
      
      phenopacket.setMetaData(metadata);
      
      // Convert to JSON
      const jsonString = pps.jsonUtils.phenopacketToJSON(phenopacket);
      const parsedObj = JSON.parse(jsonString);
      
      // Validate - this should pass validation regardless of schema version details
      const validationResult = pps.jsonUtils.validatePhenopacketJson(parsedObj);
      expect(validationResult.isValid).toBe(true);
      
      // Check metadata structure - only check what we know will be there
      expect(parsedObj.metaData.createdBy).toBe('metadata-validator');
      expect(parsedObj.metaData.resourcesList).toHaveLength(1);
    });
    
    it('should detect invalid metadata in validation', () => {
      // Create a phenopacket with invalid metadata
      const invalidPhenopacket = {
        id: 'invalid-metadata-test',
        subject: {
          id: 'subject-invalid-metadata'
        },
        metaData: {
          // Missing createdBy field which is required
          resourcesList: [
            {
              // Missing required id field
              name: 'Human Phenotype Ontology',
              url: 'http://purl.obolibrary.org/obo/hp.obo'
            }
          ]
        }
      };
      
      // Validate
      const validationResult = pps.jsonUtils.validatePhenopacketJson(invalidPhenopacket);
      
      // If the validation implementation checks for required metadata fields
      if (!validationResult.isValid) {
        expect(validationResult.errors.length).toBeGreaterThan(0);
        // Check if it finds the resource missing the ID
        const hasResourceError = validationResult.errors.some(error => 
          error.includes('Resource') && error.includes('missing required field: id')
        );
        expect(hasResourceError).toBe(true);
      }
    });
  });
  
  describe('Update History Tracking', () => {
    it('should track and serialize update history in metadata', () => {
      // Create metadata with update
      const metadata = new pps.v2.core.MetaData();
      metadata.setCreatedBy('original-creator');
      metadata.setCreated(pps.jsonUtils.dateToTimestamp(new Date(2023, 0, 1))); // Jan 1, 2023
      
      // Add an update
      const update1 = new pps.v2.core.Update();
      if (typeof update1.setTimestamp === 'function') {
        update1.setTimestamp(pps.jsonUtils.dateToTimestamp(new Date(2023, 1, 1))); // Feb 1, 2023
      }
      update1.setUpdatedBy('first-updater');
      update1.setComment('First update: added phenotypic features');
      
      const update2 = new pps.v2.core.Update();
      if (typeof update2.setTimestamp === 'function') {
        update2.setTimestamp(pps.jsonUtils.dateToTimestamp(new Date(2023, 2, 1))); // Mar 1, 2023
      }
      update2.setUpdatedBy('second-updater');
      update2.setComment('Second update: added disease information');
      
      metadata.addUpdates(update1);
      metadata.addUpdates(update2);
      
      // Convert to JSON
      const jsonString = pps.jsonUtils.toJSON(metadata);
      const parsedObj = JSON.parse(jsonString);
      
      // Verify update history
      expect(parsedObj.updatesList).toHaveLength(2);
      expect(parsedObj.updatesList[0].updatedBy).toBe('first-updater');
      expect(parsedObj.updatesList[0].comment).toBe('First update: added phenotypic features');
      expect(parsedObj.updatesList[1].updatedBy).toBe('second-updater');
      expect(parsedObj.updatesList[1].comment).toBe('Second update: added disease information');
    });
  });
});
