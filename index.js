// Main export for phenopackets-js

/**
 * This file exports the classes generated from the proto files.
 * It provides a structured API for accessing both v1 and v2 phenopackets classes.
 */

// Import v1 classes
const baseV1 = require('./lib/phenopackets/schema/v1/base_pb');
const interpretationV1 = require('./lib/phenopackets/schema/v1/interpretation_pb');
const phenopacketsV1 = require('./lib/phenopackets/schema/v1/phenopackets_pb');

// Import v2 core classes
const baseV2 = require('./lib/phenopackets/schema/v2/core/base_pb');
const biosampleV2 = require('./lib/phenopackets/schema/v2/core/biosample_pb');
const diseaseV2 = require('./lib/phenopackets/schema/v2/core/disease_pb');
const genomeV2 = require('./lib/phenopackets/schema/v2/core/genome_pb');
const individualV2 = require('./lib/phenopackets/schema/v2/core/individual_pb');
const interpretationV2 = require('./lib/phenopackets/schema/v2/core/interpretation_pb');
const measurementV2 = require('./lib/phenopackets/schema/v2/core/measurement_pb');
const medicalActionV2 = require('./lib/phenopackets/schema/v2/core/medical_action_pb');
const metaDataV2 = require('./lib/phenopackets/schema/v2/core/meta_data_pb');
const pedigreeV2 = require('./lib/phenopackets/schema/v2/core/pedigree_pb');
const phenotypicFeatureV2 = require('./lib/phenopackets/schema/v2/core/phenotypic_feature_pb');
const phenopacketsV2 = require('./lib/phenopackets/schema/v2/phenopackets_pb');

// Import VRS and VRSatile
const vrs = require('./lib/schema/vrs_pb');
const vrsatile = require('./lib/phenopackets/vrsatile/v1/vrsatile_pb');

// Export all classes organized by version and category
module.exports = {
  // Version 1 classes
  v1: {
    ...baseV1,
    ...interpretationV1,
    ...phenopacketsV1,
  },

  // Version 2 classes
  v2: {
    core: {
      ...baseV2,
      ...biosampleV2,
      ...diseaseV2,
      ...genomeV2,
      ...individualV2,
      ...interpretationV2,
      ...measurementV2,
      ...medicalActionV2,
      ...metaDataV2,
      ...pedigreeV2,
      ...phenotypicFeatureV2,
    },
    ...phenopacketsV2,
  },

  // VRS and VRSatile classes
  vrs: {
    ...vrs,
  },
  vrsatile: {
    ...vrsatile,
  },
  // Export JSON utilities
  jsonUtils: require('./lib/json-utils'),
};
