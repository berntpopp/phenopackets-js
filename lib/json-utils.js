/**
 * json-utils.js
 * 
 * Utility functions for converting between phenopackets-js objects and JSON.
 * These functions simplify the process of serializing and deserializing
 * Protocol Buffer objects to and from JSON format.
 */

const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb');

/**
 * Convert a Protocol Buffer object to a JSON string
 * @param {Object} pbObject - Protocol Buffer object to convert
 * @param {Object} options - Conversion options
 * @param {boolean} options.pretty - Whether to format the JSON with indentation (default: false)
 * @param {boolean} options.useProtoFieldName - Whether to use protobuf field names (default: false)
 * @returns {string} JSON string representation
 */
function toJSON(pbObject, options = {}) {
  if (!pbObject || typeof pbObject.toObject !== 'function') {
    throw new Error('Invalid Protocol Buffer object: missing toObject method');
  }

  // Default options
  const defaultOptions = {
    pretty: false,
    useProtoFieldName: false
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Convert to a plain JavaScript object
  const jsObject = pbObject.toObject(mergedOptions.useProtoFieldName);
  
  // Convert to JSON with optional pretty printing
  return mergedOptions.pretty 
    ? JSON.stringify(jsObject, null, 2) 
    : JSON.stringify(jsObject);
}

/**
 * Simplified utility for creating a Protocol Buffer object from a JSON object
 * This only handles direct property assignments for simple cases
 * For complex nested objects, manual conversion is recommended
 * 
 * @param {string} json - JSON string to convert
 * @param {Function} MessageType - Protocol Buffer message constructor (e.g., pps.v2.Phenopacket)
 * @returns {Object} Protocol Buffer object instance with basic properties set
 */
function fromJSON(json, MessageType) {
  if (typeof json !== 'string') {
    throw new Error('JSON input must be a string');
  }
  
  if (typeof MessageType !== 'function') {
    throw new Error('MessageType must be a Protocol Buffer constructor');
  }
  
  // Parse JSON to JavaScript object
  const jsObject = JSON.parse(json);
  
  // Create a new message instance
  const message = new MessageType();
  
  // Get all setter methods for this message type
  const proto = Object.getPrototypeOf(message);
  const setterMethods = Object.getOwnPropertyNames(proto)
    .filter(name => name.startsWith('set') && typeof proto[name] === 'function');
  
  // Process each property in the JavaScript object (only handle primitive values)
  for (const key in jsObject) {
    if (jsObject[key] === null || jsObject[key] === undefined) {
      continue; // Skip null/undefined values
    }
    
    // Convert key to setter method name (e.g., "id" => "setId")
    const setterName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
    
    // Check if setter exists and value is a primitive (not an object or array)
    if (setterMethods.includes(setterName) && 
        (typeof jsObject[key] !== 'object' || jsObject[key] === null)) {
      // Handle primitive values only
      try {
        message[setterName](jsObject[key]);
      } catch (e) {
        console.warn(`Could not set property ${key}: ${e.message}`);
      }
    }
  }
  
  return message;
}

/**
 * Convert a JavaScript Date to a Protocol Buffer Timestamp
 * @param {Date} date - JavaScript Date object
 * @returns {Timestamp} Protocol Buffer Timestamp
 */
function dateToTimestamp(date) {
  if (!(date instanceof Date)) {
    throw new Error('Input must be a Date object');
  }
  
  const timestamp = new Timestamp();
  timestamp.setSeconds(Math.floor(date.getTime() / 1000));
  timestamp.setNanos((date.getTime() % 1000) * 1000000);
  return timestamp;
}

/**
 * Convert a Protocol Buffer Timestamp to a JavaScript Date
 * @param {Timestamp} timestamp - Protocol Buffer Timestamp
 * @returns {Date} JavaScript Date object
 */
function timestampToDate(timestamp) {
  if (!timestamp || typeof timestamp.getSeconds !== 'function') {
    throw new Error('Input must be a Protocol Buffer Timestamp');
  }
  
  const millis = timestamp.getSeconds() * 1000 + timestamp.getNanos() / 1000000;
  return new Date(millis);
}

/**
 * Compare a Protocol Buffer object with a golden JSON file
 * @param {Object} pbObject - Protocol Buffer object to compare
 * @param {string} goldenFilePath - Path to the golden JSON file
 * @returns {Promise<boolean>} Promise that resolves to true if the objects match
 */
function compareWithGoldenFile(pbObject, goldenFilePath) {
  return new Promise((resolve, reject) => {
    try {
      const fs = require('fs');
      const goldenJson = fs.readFileSync(goldenFilePath, 'utf8');
      const currentJson = toJSON(pbObject);
      
      // Compare the two JSON objects (after parsing to handle formatting differences)
      const goldenObj = JSON.parse(goldenJson);
      const currentObj = JSON.parse(currentJson);
      
      resolve(JSON.stringify(goldenObj) === JSON.stringify(currentObj));
    } catch (e) {
      reject(new Error(`Error comparing with golden file: ${e.message}`));
    }
  });
}

/**
 * Helper function to get all available setter methods on a Protocol Buffer object
 * @param {Object} pbObject - Protocol Buffer object to inspect
 * @returns {Array<string>} Array of setter method names
 */
function getSetterMethods(pbObject) {
  if (!pbObject) return [];
  
  const proto = Object.getPrototypeOf(pbObject);
  return Object.getOwnPropertyNames(proto)
    .filter(name => name.startsWith('set') && typeof proto[name] === 'function');
}

/**
 * Helper function to get all available getter methods on a Protocol Buffer object
 * @param {Object} pbObject - Protocol Buffer object to inspect
 * @returns {Array<string>} Array of getter method names
 */
function getGetterMethods(pbObject) {
  if (!pbObject) return [];
  
  const proto = Object.getPrototypeOf(pbObject);
  return Object.getOwnPropertyNames(proto)
    .filter(name => name.startsWith('get') && typeof proto[name] === 'function');
}

/**
 * Specialized helper to convert a Phenopacket v2 to JSON
 * This function handles the specific structure of Phenopackets
 * @param {Object} phenopacket - A v2 Phenopacket object
 * @param {Object} options - Options for JSON conversion (same as toJSON)
 * @returns {string} JSON representation of the phenopacket
 */
function phenopacketToJSON(phenopacket, options = {}) {
  if (!phenopacket || typeof phenopacket.getId !== 'function') {
    throw new Error('Invalid Phenopacket object');
  }
  
  return toJSON(phenopacket, options);
}

/**
 * Convert JSON to a Phenopacket v2 object with proper handling of nested structures
 * @param {string} json - JSON string representation of a phenopacket
 * @param {Object} v2Classes - Object containing v2 class constructors (optional)
 * @returns {Object} Fully populated Phenopacket object
 */
function jsonToPhenopacket(json, v2Classes) {
  // Ensure we have a proper JSON string
  if (typeof json !== 'string') {
    throw new Error('JSON input must be a string');
  }
  
  // Parse the JSON string
  const data = JSON.parse(json);
  
  // We need to dynamically import the classes if not provided
  // In a real implementation, you'd handle this differently to avoid circular dependencies
  let Phenopacket, Individual, OntologyClass, PhenotypicFeature, Disease, Biosample;
  
  try {
    if (v2Classes) {
      // Use provided classes
      Phenopacket = v2Classes.Phenopacket;
      Individual = v2Classes.Individual;
      OntologyClass = v2Classes.OntologyClass;
      PhenotypicFeature = v2Classes.PhenotypicFeature;
      Disease = v2Classes.Disease;
      Biosample = v2Classes.Biosample;
    } else {
      // This is a placeholder - in a real implementation, you would use a different
      // approach to avoid circular dependencies
      throw new Error('v2Classes must be provided');
    }
    
    // Create a new phenopacket
    const phenopacket = new Phenopacket();
    
    // Set basic properties
    if (data.id) phenopacket.setId(data.id);
    
    // Set subject (Individual)
    if (data.subject) {
      const subject = new Individual();
      if (data.subject.id) subject.setId(data.subject.id);
      if (data.subject.sex !== undefined) subject.setSex(data.subject.sex);
      if (data.subject.dateOfBirth) subject.setDateOfBirth(data.subject.dateOfBirth);
      if (data.subject.timeAtLastEncounter) {
        // Handle TimeElement
      }
      phenopacket.setSubject(subject);
    }
    
    // Set phenotypic features
    if (data.phenotypicFeaturesList && Array.isArray(data.phenotypicFeaturesList)) {
      data.phenotypicFeaturesList.forEach(featureData => {
        const feature = new PhenotypicFeature();
        
        // Set feature type (OntologyClass)
        if (featureData.type) {
          const type = new OntologyClass();
          if (featureData.type.id) type.setId(featureData.type.id);
          if (featureData.type.label) type.setLabel(featureData.type.label);
          feature.setType(type);
        }
        
        // Add the feature to the phenopacket
        phenopacket.addPhenotypicFeatures(feature);
      });
    }
    
    // Set diseases
    if (data.diseasesList && Array.isArray(data.diseasesList)) {
      data.diseasesList.forEach(diseaseData => {
        const disease = new Disease();
        
        // Set disease term (OntologyClass)
        if (diseaseData.term) {
          const term = new OntologyClass();
          if (diseaseData.term.id) term.setId(diseaseData.term.id);
          if (diseaseData.term.label) term.setLabel(diseaseData.term.label);
          disease.setTerm(term);
        }
        
        // Add the disease to the phenopacket
        phenopacket.addDiseases(disease);
      });
    }
    
    // Set biosamples
    if (data.biosamplesList && Array.isArray(data.biosamplesList)) {
      data.biosamplesList.forEach(biosampleData => {
        const biosample = new Biosample();
        if (biosampleData.id) biosample.setId(biosampleData.id);
        
        // Set sample type (OntologyClass)
        if (biosampleData.sampleType) {
          const sampleType = new OntologyClass();
          if (biosampleData.sampleType.id) sampleType.setId(biosampleData.sampleType.id);
          if (biosampleData.sampleType.label) sampleType.setLabel(biosampleData.sampleType.label);
          biosample.setSampleType(sampleType);
        }
        
        // Add the biosample to the phenopacket
        phenopacket.addBiosamples(biosample);
      });
    }
    
    // Additional fields would be handled similarly
    
    return phenopacket;
  } catch (error) {
    throw new Error(`Failed to convert JSON to Phenopacket: ${error.message}`);
  }
}

/**
 * Validate a JSON object against the Phenopacket schema
 * 
 * @param {Object|string} json - JSON object or string to validate
 * @param {string} schemaVersion - Schema version to validate against ("v1" or "v2")
 * @returns {Object} Validation result with isValid and errors properties
 */
function validatePhenopacketJson(json, schemaVersion = 'v2') {
  try {
    // Parse JSON if it's a string
    const jsonObj = typeof json === 'string' ? JSON.parse(json) : json;
    
    if (!jsonObj || typeof jsonObj !== 'object') {
      throw new Error('Invalid JSON: must be an object');
    }

    // Initialize validation results
    const validationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };
    
    // Basic schema validation logic
    if (schemaVersion === 'v2') {
      // Validate required v2 fields
      if (!jsonObj.id) {
        validationResult.isValid = false;
        validationResult.errors.push('Missing required field: id');
      } else if (typeof jsonObj.id !== 'string') {
        validationResult.isValid = false;
        validationResult.errors.push('Field id must be a string');
      }
      
      // Metadata validation (required in v2)
      if (!jsonObj.metaData) {
        validationResult.isValid = false;
        validationResult.errors.push('Missing required field: metaData');
      } else {
        if (!jsonObj.metaData.created) {
          validationResult.isValid = false;
          validationResult.errors.push('Missing required field: metaData.created');
        }
        if (!jsonObj.metaData.createdBy) {
          validationResult.isValid = false;
          validationResult.errors.push('Missing required field: metaData.createdBy');
        }
        if (!jsonObj.metaData.resources || !Array.isArray(jsonObj.metaData.resources)) {
          validationResult.warnings.push('metaData.resources should be an array of ontology resources');
        }
      }
      
      // Subject validation
      if (!jsonObj.subject) {
        validationResult.warnings.push('No subject information provided');
      } else if (typeof jsonObj.subject === 'object') {
        if (!jsonObj.subject.id) {
          validationResult.isValid = false;
          validationResult.errors.push('Missing required field: subject.id');
        }
        if (typeof jsonObj.subject.sex === 'undefined') {
          validationResult.warnings.push('Subject sex not specified');
        }
      } else {
        validationResult.isValid = false;
        validationResult.errors.push('Field subject must be an object');
      }
      
      // Validate phenotypic features
      if (jsonObj.phenotypicFeaturesList) {
        if (!Array.isArray(jsonObj.phenotypicFeaturesList)) {
          validationResult.isValid = false;
          validationResult.errors.push('phenotypicFeaturesList must be an array');
        } else {
          jsonObj.phenotypicFeaturesList.forEach((feature, index) => {
            if (!feature.type) {
              validationResult.isValid = false;
              validationResult.errors.push(`PhenotypicFeature at index ${index} is missing required field: type`);
            } else {
              const termValidation = validateOntologyTerm(feature.type, `phenotypicFeaturesList[${index}].type`);
              validationResult.errors.push(...termValidation.errors);
              validationResult.warnings.push(...termValidation.warnings);
              if (termValidation.errors.length > 0) {
                validationResult.isValid = false;
              }
            }

            // Validate onset if present
            if (feature.onset) {
              const onsetValidation = validateOntologyTerm(feature.onset, `phenotypicFeaturesList[${index}].onset`);
              validationResult.errors.push(...onsetValidation.errors);
              validationResult.warnings.push(...onsetValidation.warnings);
              if (onsetValidation.errors.length > 0) {
                validationResult.isValid = false;
              }
            }
          });
        }
      }
      
      // Validate diseases
      if (jsonObj.diseasesList) {
        if (!Array.isArray(jsonObj.diseasesList)) {
          validationResult.isValid = false;
          validationResult.errors.push('diseasesList must be an array');
        } else {
          jsonObj.diseasesList.forEach((disease, index) => {
            if (!disease.term) {
              validationResult.isValid = false;
              validationResult.errors.push(`Disease at index ${index} is missing required field: term`);
            } else {
              const termValidation = validateOntologyTerm(disease.term, `diseasesList[${index}].term`);
              validationResult.errors.push(...termValidation.errors);
              validationResult.warnings.push(...termValidation.warnings);
              if (termValidation.errors.length > 0) {
                validationResult.isValid = false;
              }
            }

            // Validate disease stage if present
            if (disease.diseaseStage) {
              const stageValidation = validateOntologyTerm(disease.diseaseStage, `diseasesList[${index}].diseaseStage`);
              validationResult.errors.push(...stageValidation.errors);
              validationResult.warnings.push(...stageValidation.warnings);
              if (stageValidation.errors.length > 0) {
                validationResult.isValid = false;
              }
            }
          });
        }
      }
      
      // Validate biosamples
      if (jsonObj.biosamplesList) {
        if (!Array.isArray(jsonObj.biosamplesList)) {
          validationResult.isValid = false;
          validationResult.errors.push('biosamplesList must be an array');
        } else {
          jsonObj.biosamplesList.forEach((biosample, index) => {
            if (!biosample.id) {
              validationResult.isValid = false;
              validationResult.errors.push(`Biosample at index ${index} is missing required field: id`);
            }
            if (!biosample.sampleType || !biosample.sampleType.id) {
              validationResult.warnings.push(`Biosample at index ${index} is missing recommended field: sampleType.id`);
            }
          });
        }
      }
    } else if (schemaVersion === 'v1') {
      // Validate required v1 fields
      if (!jsonObj.id) {
        validationResult.isValid = false;
        validationResult.errors.push('Missing required field: id');
      }
      
      // v1 specific validations would go here
    } else {
      throw new Error(`Unsupported schema version: ${schemaVersion}`);
    }
    
    return validationResult;
  } catch (error) {
    return {
      isValid: false,
      errors: [`Validation failed: ${error.message}`],
      warnings: []
    };
  }
  
  return validationResult;
}

/**
 * Create an empty phenopacket structure with required fields
 * 
 * @param {string} schemaVersion - Schema version to use ("v1" or "v2")
 * @returns {Object} An empty phenopacket object with required fields
 */
function createEmptyPhenopacketJson(schemaVersion = 'v2') {
  if (schemaVersion === 'v2') {
    return {
      id: '',
      subject: {
        id: '',
        sex: 0 // UNKNOWN
      },
      phenotypicFeaturesList: [],
      diseasesList: [],
      biosamplesList: [],
      interpretationsList: []
    };
  } else if (schemaVersion === 'v1') {
    return {
      id: '',
      subject: {
        id: ''
      },
      phenotypicFeatures: [],
      diseases: [],
      biosamples: []
    };
  } else {
    throw new Error(`Unsupported schema version: ${schemaVersion}`);
  }
}

/**
 * Validate an ontology term object
 * @param {Object} term - The ontology term to validate
 * @param {string} fieldPath - Path to the field being validated (for error messages)
 * @returns {Object} Validation result with errors and warnings
 */
function validateOntologyTerm(term, fieldPath) {
  const result = {
    errors: [],
    warnings: []
  };

  if (!term || typeof term !== 'object') {
    result.errors.push(`${fieldPath} must be an object`);
    return result;
  }

  // Required fields
  if (!term.id) {
    result.errors.push(`${fieldPath}.id is required`);
  } else if (typeof term.id !== 'string') {
    result.errors.push(`${fieldPath}.id must be a string`);
  } else if (!term.id.includes(':')) {
    result.warnings.push(`${fieldPath}.id should be a CURIE (e.g., 'HP:0000118')`);
  }

  // Optional but recommended fields
  if (!term.label) {
    result.warnings.push(`${fieldPath}.label is recommended`);
  } else if (typeof term.label !== 'string') {
    result.errors.push(`${fieldPath}.label must be a string`);
  }

  return result;
}

module.exports = {
  toJSON,
  fromJSON,
  dateToTimestamp,
  timestampToDate,
  compareWithGoldenFile,
  getSetterMethods,
  getGetterMethods,
  
  // Phenopacket-specific helpers
  phenopacketToJSON,
  jsonToPhenopacket,
  validatePhenopacketJson,
  createEmptyPhenopacketJson,
  validateOntologyTerm
};
