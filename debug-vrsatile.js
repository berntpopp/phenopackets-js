// debug-vrsatile.js - Debug VRSatile class behavior
const pps = require('./index');

console.log('\n=== Testing VRSatile VariationDescriptor Creation ===');

// Check if VariationDescriptor class exists
if (!pps.vrsatile || !pps.vrsatile.VariationDescriptor) {
  console.error('Error: VRSatile VariationDescriptor class not found!');
  process.exit(1);
}

try {
  // Create a VariationDescriptor with step-by-step debugging
  console.log('1. Creating VariationDescriptor object...');
  const variationDescriptor = new pps.vrsatile.VariationDescriptor();

  console.log('2. Setting ID...');
  variationDescriptor.setId('test-variation');
  console.log(`   ID set to: ${variationDescriptor.getId()}`);

  console.log('3. Setting Label...');
  variationDescriptor.setLabel('Test Variation Label');
  console.log(`   Label set to: ${variationDescriptor.getLabel()}`);

  console.log('4. Setting ValueId...');
  console.log(
    '   Available methods:',
    Object.getOwnPropertyNames(Object.getPrototypeOf(variationDescriptor)).filter(
      (name) => name.startsWith('set') || name.startsWith('get')
    )
  );

  // Check if setValueId exists
  if (typeof variationDescriptor.setValueId === 'function') {
    variationDescriptor.setValueId('ga4gh:VA.test123');
    console.log(`   ValueId set to: ${variationDescriptor.getValueId()}`);
  } else {
    console.log('   setValueId method not found');
  }

  // Create a GeneDescriptor
  console.log('5. Creating GeneDescriptor...');
  const geneDescriptor = new pps.vrsatile.GeneDescriptor();

  console.log('6. Setting values on GeneDescriptor...');
  console.log(
    '   Available GeneDescriptor methods:',
    Object.getOwnPropertyNames(Object.getPrototypeOf(geneDescriptor)).filter(
      (name) => name.startsWith('set') || name.startsWith('get')
    )
  );

  geneDescriptor.setValueId('hgnc:1101');
  geneDescriptor.setSymbol('BRCA2');

  console.log('7. Setting GeneContext...');
  // Check if setGeneContext exists
  if (typeof variationDescriptor.setGeneContext === 'function') {
    variationDescriptor.setGeneContext(geneDescriptor);
    console.log('   GeneContext set successfully');
  } else {
    console.log('   setGeneContext method not found');
  }

  // Try creating a VRS object and setting it
  if (pps.vrs && pps.vrs.Allele) {
    console.log('8. Creating VRS Allele...');
    const allele = new pps.vrs.Allele();
    allele.setId('test-allele');

    console.log('9. Trying to set Variation field...');
    console.log('   Checking for setVariation method...');

    // Check if setVariation exists
    if (typeof variationDescriptor.setVariation === 'function') {
      try {
        console.log('   Attempting to call setVariation...');
        variationDescriptor.setVariation({
          valueId: 'ga4gh:VA.abc123',
          allele: allele,
        });
        console.log('   Variation set successfully');
      } catch (e) {
        console.error(`   Failed to set Variation: ${e.message}`);
      }
    } else {
      console.log('   setVariation method not found');
    }
  }

  // Create a VCF record
  console.log('10. Creating VcfRecord...');
  const vcfRecord = new pps.vrsatile.VcfRecord();

  console.log('11. Setting values on VcfRecord...');
  console.log(
    '   Available VcfRecord methods:',
    Object.getOwnPropertyNames(Object.getPrototypeOf(vcfRecord)).filter(
      (name) => name.startsWith('set') || name.startsWith('get')
    )
  );

  vcfRecord.setChrom('13');
  vcfRecord.setPos(32355250);
  vcfRecord.setId('rs80359352');
  vcfRecord.setRef('T');
  vcfRecord.setAlt('G');

  console.log('12. Setting VcfRecord...');
  variationDescriptor.setVcfRecord(vcfRecord);

  console.log('13. Final VariationDescriptor structure:');
  console.log('   ID:', variationDescriptor.getId());
  console.log('   Label:', variationDescriptor.getLabel());

  if (typeof variationDescriptor.getValueId === 'function') {
    console.log('   ValueId:', variationDescriptor.getValueId());
  }

  if (typeof variationDescriptor.getGeneContext === 'function') {
    console.log('   Has GeneContext:', !!variationDescriptor.getGeneContext());
    if (variationDescriptor.getGeneContext()) {
      console.log('   GeneContext ValueId:', variationDescriptor.getGeneContext().getValueId());
      console.log('   GeneContext Symbol:', variationDescriptor.getGeneContext().getSymbol());
    }
  }

  console.log('   Has VcfRecord:', !!variationDescriptor.getVcfRecord());
  if (variationDescriptor.getVcfRecord()) {
    console.log('   VcfRecord Chrom:', variationDescriptor.getVcfRecord().getChrom());
    console.log('   VcfRecord Pos:', variationDescriptor.getVcfRecord().getPos());
  }

  console.log('\n=== Test completed successfully ===');
} catch (error) {
  console.error(`\nERROR: ${error.message}`);
  console.error(error.stack);
}
