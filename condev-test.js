const assert = require( "assert" );
const condev = require( "./condev.js" );

assert.equal( condev( null, OBJECT, true ), false, "should be false" );

assert.equal( condev( null, OBJECT, false ), true, "should be true" );

assert.equal( condev( "yeah", String ), true, "should be true" );

assert.equal( condev( "yeah", function hello( ){ } ), false, "should be false" );

assert.equal( condev( "yeah", function condition( entity ){
return entity == "yeah"; } ), true, "should be true" );

assert.equal( condev( "yeah", function condition( entity ){
return typeof entity == "number"; } ), false, "should be false" );

assert.equal( condev( "yeah", /eah/ ), true, "should be true" );

assert.equal( condev( "yeah", ( entity ) => ( typeof entity == "string" ) ),
true, "should be true" );

assert.equal( condev( function constructor( ){ }, "constructor" ),
true, "should be true" );

console.log( "ok" );
