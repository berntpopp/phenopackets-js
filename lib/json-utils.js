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

module.exports = {
  toJSON,
  fromJSON,
  dateToTimestamp,
  timestampToDate,
  compareWithGoldenFile,
  getSetterMethods,
  getGetterMethods
};
