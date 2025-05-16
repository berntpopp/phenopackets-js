// debug-structure.js
// This script helps debug the structure of the phenopackets-js module exports

const pps = require('./index');

// Utility function to inspect object structure
function inspectObject(obj, name = '', maxDepth = 3, currentDepth = 0) {
  if (currentDepth > maxDepth) return;

  if (!obj) {
    console.log(`${name || 'Object'} is ${obj}`);
    return;
  }

  const type = typeof obj;
  if (type !== 'object') {
    console.log(`${name || 'Value'} is a ${type}: ${obj}`);
    return;
  }

  try {
    console.log(`\n== ${name} ==`);
    const keys = Object.keys(obj);
    console.log(`Has ${keys.length} keys: ${keys.join(', ')}`);

    if (currentDepth < maxDepth) {
      for (const key of keys) {
        const value = obj[key];
        const fullPath = name ? `${name}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
          inspectObject(value, fullPath, maxDepth, currentDepth + 1);
        } else if (typeof value === 'function') {
          console.log(`${fullPath} is a function`);

          // Check if it's a constructor
          try {
            const instance = new value();
            console.log(`  - Can be instantiated as a constructor`);

            // List a few methods if available
            const proto = Object.getPrototypeOf(instance);
            const methods = Object.getOwnPropertyNames(proto).filter(
              (m) => m !== 'constructor' && typeof proto[m] === 'function'
            );

            if (methods.length > 0) {
              console.log(
                `  - Has methods: ${methods.slice(0, 5).join(', ')}${methods.length > 5 ? '...' : ''}`
              );
            }
          } catch (e) {
            // Not a constructor or has required params
          }
        } else {
          console.log(`${fullPath} = ${value} (${typeof value})`);
        }
      }
    }
  } catch (e) {
    console.log(`Error inspecting ${name}: ${e.message}`);
  }
}

console.log('\n=============================================');
console.log('PHENOPACKETS-JS MODULE STRUCTURE');
console.log('=============================================\n');

// Inspect each major section of the module
console.log('\n----- V1 STRUCTURE -----');
inspectObject(pps.v1, 'pps.v1', 2);

console.log('\n----- V2 STRUCTURE -----');
inspectObject(pps.v2, 'pps.v2', 2);

console.log('\n----- VRS STRUCTURE -----');
inspectObject(pps.vrs, 'pps.vrs', 2);

console.log('\n----- VRSATILE STRUCTURE -----');
inspectObject(pps.vrsatile, 'pps.vrsatile', 2);

// Try to find specific classes
console.log('\n\n----- LOOKING FOR SPECIFIC CLASSES -----');

// Check for Allele in VRS
const alleleLocations = [];
function findClass(obj, className, path = '') {
  if (!obj || typeof obj !== 'object') return;

  // Check direct properties
  if (obj[className] && typeof obj[className] === 'function') {
    alleleLocations.push(`${path}.${className}`);
  }

  // Check nested properties (but not too deep)
  if (path.split('.').length < 5) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        findClass(obj[key], className, path ? `${path}.${key}` : key);
      }
    }
  }
}

findClass(pps, 'Allele');
console.log(
  `Allele class found at: ${alleleLocations.length ? alleleLocations.join(', ') : 'Not found'}`
);

const vdLocations = [];
findClass(pps, 'VariationDescriptor');
console.log(
  `VariationDescriptor class found at: ${vdLocations.length ? vdLocations.join(', ') : 'Not found'}`
);

// Check if proto.org.ga4gh namespace exists
console.log('\n----- CHECKING FOR NAMESPACED CLASSES -----');
if (pps.vrs.proto && pps.vrs.proto.org && pps.vrs.proto.org.ga4gh && pps.vrs.proto.org.ga4gh.vrs) {
  console.log('Found proto.org.ga4gh.vrs namespace in VRS');
  const v1 = pps.vrs.proto.org.ga4gh.vrs.v1;
  if (v1) {
    console.log('Found v1 namespace with keys:', Object.keys(v1));
    if (v1.Allele) {
      console.log('Found Allele class in proto.org.ga4gh.vrs.v1 namespace');
    }
  }
} else {
  console.log('proto.org.ga4gh.vrs namespace NOT found in VRS');
}

if (
  pps.vrsatile.proto &&
  pps.vrsatile.proto.org &&
  pps.vrsatile.proto.org.ga4gh &&
  pps.vrsatile.proto.org.ga4gh.vrsatile
) {
  console.log('Found proto.org.ga4gh.vrsatile namespace in VRSATILE');
  const v1 = pps.vrsatile.proto.org.ga4gh.vrsatile.v1;
  if (v1) {
    console.log('Found v1 namespace with keys:', Object.keys(v1));
    if (v1.VariationDescriptor) {
      console.log('Found VariationDescriptor class in proto.org.ga4gh.vrsatile.v1 namespace');
    }
  }
} else {
  console.log('proto.org.ga4gh.vrsatile namespace NOT found in VRSATILE');
}

console.log('\n=============================================');
