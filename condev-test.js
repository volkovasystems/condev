
const condev = require( "./condev.js" );

console.log( condev( null, OBJECT, true ) );

console.log( condev( null, OBJECT, false ) );

console.log( condev( "yeah", String ) );

console.log( condev( "yeah", function hello( ){ } ) );

console.log( condev( "yeah", function condition( entity ){ return entity == "yeah"; } ) );

console.log( condev( "yeah", function condition( entity ){ return typeof entity == "number"; } ) );

console.log( condev( "yeah", /eah/ ) );
