
const assert = require( "assert" );
const condev = require( "./condev.js" );

assert.equal( condev( null, OBJECT, false ), true, "should be true" );

assert.equal( condev( "yeah", String ), true, "should be true" );

assert.equal( condev( true, Boolean ), true, "should be true" );

assert.equal( condev( 123, Number ), true, "should be true" );

assert.equal( condev( 0, 0, true ), true, "should be true" );

assert.equal( condev( function( ){ }, function( ){ } ), true, "should be true" );

assert.equal( condev( function Hello( ){ return "hello" }, function Hello( ){ return "hi" } ), true, "should be true" );

assert.equal( condev( "yeah", /eah/ ), true, "should be true" );

assert.equal( condev( [ ], Array ), true, "should be true" );

assert.equal( condev( { }, Object ), true, "should be true" );

assert.equal( condev( Array, "Array" ), true, "should return true" );

assert.equal( condev( Array, Array ), true, "should return true" );

assert.equal( condev( Object, Object ), true, "should return true" );

assert.equal( condev( Date, Date ), true, "should return true" );

assert.equal( condev( Array, Object ), true, "should return true" );


assert.equal( condev( Function, Object ), true, "should return true" );

assert.equal( condev( Array, Function ), true, "should be true" );

assert.equal( condev( "yeah", function condition( entity ){ return entity == "yeah"; } ), true, "should be true" );

assert.equal( condev( "yeah", ( entity ) => ( typeof entity == "string" ) ), true, "should be true" );

assert.equal( condev( function constructor( ){ }, "constructor" ), true, "should be true" );

assert.equal( condev( null, [ OBJECT, STRING ], false ), true, "should be true" );

assert.equal( condev( "yeah", [ STRING, "yeah" ] ), true, "should be true" );


assert.equal( condev( { }, { } ), false, "should return false" );

assert.equal( condev( 0, "0" ), false, "should return false" );

assert.equal( condev( 0, "" ), false, "should return false" );

assert.equal( condev( null, undefined ), false, "should return false" );

assert.equal( condev( 123, "123" ), false, "should return false" );

assert.equal( condev( function Hello( ){ }, function Hi( ){ } ), false, "should return false" );

assert.equal( condev( "yeah", function hello( ){ } ), false, "should be false" );

assert.equal( condev( "yeah", function condition( entity ){ return typeof entity == "number"; } ),
				false, "should be false" );

assert.equal( condev( 123, [ STRING, "yeah" ] ), false, "should be false" );

console.log( "ok" );
