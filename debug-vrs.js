// debug-vrs.js - Debug VRS class behavior
const pps = require('./index');

console.log('\n=== Testing VRS Allele Creation ===');

// Check if Allele class exists
if (!pps.vrs || !pps.vrs.Allele) {
  console.error('Error: VRS Allele class not found!');
  process.exit(1);
}

try {
  // Create an Allele object with step-by-step debugging
  console.log('1. Creating Allele object...');
  const allele = new pps.vrs.Allele();
  
  console.log('2. Setting ID...');
  allele.setId('test-allele');
  console.log(`   ID set to: ${allele.getId()}`);
  
  console.log('3. Creating SequenceLocation...');
  const location = new pps.vrs.SequenceLocation();
  
  console.log('4. Setting sequenceId on location...');
  location.setSequenceId('refseq:NC_000001.11');
  console.log(`   SequenceId set to: ${location.getSequenceId()}`);
  
  console.log('5. Creating SequenceInterval...');
  const interval = new pps.vrs.SequenceInterval();
  
  console.log('6. Creating Number objects for start and end...');
  const startNum = new pps.vrs.Number();
  const endNum = new pps.vrs.Number();
  
  console.log('7. Setting values on Number objects...');
  startNum.setValue(100000);
  endNum.setValue(100001);
  console.log(`   Start Number value: ${startNum.getValue()}`);
  console.log(`   End Number value: ${endNum.getValue()}`);
  
  console.log('8. Setting start and end on interval...');
  console.log('   Available interval methods:', 
    Object.getOwnPropertyNames(Object.getPrototypeOf(interval))
      .filter(name => name.startsWith('set') || name.startsWith('get'))
  );
  
  interval.setStartNumber(startNum);
  interval.setEndNumber(endNum);
  
  console.log('9. Setting interval on location...');
  console.log('   Available location methods:', 
    Object.getOwnPropertyNames(Object.getPrototypeOf(location))
      .filter(name => name.startsWith('set') || name.startsWith('get'))
  );
  
  location.setInterval(interval);
  
  console.log('10. Setting location on allele...');
  console.log('   Available allele methods:', 
    Object.getOwnPropertyNames(Object.getPrototypeOf(allele))
      .filter(name => name.startsWith('set') || name.startsWith('get'))
  );
  
  allele.setSequenceLocation(location);
  
  console.log('11. Creating and setting LiteralSequenceExpression...');
  const lse = new pps.vrs.LiteralSequenceExpression();
  lse.setSequence('A');
  console.log(`   Sequence set to: ${lse.getSequence()}`);
  
  console.log('12. Setting expression on allele...');
  allele.setLiteralSequenceExpression(lse);
  
  console.log('13. Checking Allele object structure...');
  console.log('   Has SequenceLocation:', !!allele.getSequenceLocation());
  if (allele.getSequenceLocation()) {
    console.log('   Location SequenceId:', allele.getSequenceLocation().getSequenceId());
  }
  console.log('   Has LiteralSequenceExpression:', !!allele.getLiteralSequenceExpression());
  if (allele.getLiteralSequenceExpression()) {
    console.log('   Expression Sequence:', allele.getLiteralSequenceExpression().getSequence());
  }
  
  console.log('\n=== Test completed successfully ===');
} catch (error) {
  console.error(`\nERROR: ${error.message}`);
  console.error(error.stack);
}
