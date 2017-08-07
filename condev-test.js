
const assert = require( "assert" );
const condev = require( "./condev.js" );

let duration = Date.now( );

assert.equal( condev( null, OBJECT, false ), true, "should be equal to true" );

assert.equal( condev( "yeah", String ), true, "should be equal to true" );

assert.equal( condev( true, Boolean ), true, "should be equal to true" );

assert.equal( condev( 123, Number ), true, "should be equal to true" );

assert.equal( condev( 0, 0, true ), true, "should be equal to true" );

assert.equal( condev( function( ){ }, function( ){ } ), true, "should be equal to true" );

assert.equal( condev( ( ) => { }, ( ) => { } ), true, "should be equal to true" );

assert.equal( condev( function Hello( ){ return "hello" }, function Hello( ){ return "hi" } ), true, "should be equal to true" );

assert.equal( condev( "yeah", /eah/ ), true, "should be equal to true" );

assert.equal( condev( { }, Object ), true, "should be equal to true" );

assert.equal( condev( Array, "Array" ), true, "should be equal to true" );

assert.equal( condev( Array, Array ), true, "should be equal to true" );

assert.equal( condev( "yeah", function condition( entity ){ return entity == "yeah"; } ), true, "should be equal to true" );

assert.equal( condev( "yeah", ( entity ) => ( typeof entity == "string" ) ), true, "should be equal to true" );

assert.equal( condev( function constructor( ){ }, "constructor" ), true, "should be equal to true" );

assert.equal( condev( null, [ OBJECT, STRING ], false ), true, "should be equal to true" );

assert.equal( condev( "yeah", [ STRING, "yeah" ] ), true, "should be equal to true" );

assert.equal( condev( [ ], [ ] ), false, "should be equal to false" );

assert.equal( condev( 123, [ STRING, "yeah" ] ), false, "should be equal to false" );

assert.equal( condev( { }, { } ), false, "should be equal to false" );

assert.equal( condev( 0, "0" ), false, "should be equal to false" );

assert.equal( condev( null, undefined ), false, "should be equal to false" );

assert.equal( condev( function Hello( ){ }, function Hi( ){ } ), false, "should be equal to false" );

assert.equal( condev( "yeah", function hello( ){ } ), false, "should be equal to false" );

assert.equal( condev( "yeah", function condition( entity ){ return typeof entity == "number"; } ), false, "should be equal to false" );

console.log( "ok", Date.now( ) - duration, "ms" );
