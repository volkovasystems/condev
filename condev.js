/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "condev",
			"path": "condev/condev.js",
			"file": "condev.js",
			"module": "condev",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"contributors": [
				"John Lenon Maghanoy <johnlenonmaghanoy@gmail.com>",
				"Vinse Vinalon <vinsevinalon@gmail.com>"
			],
			"repository": "https://github.com/volkovasystems/condev.git",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Evaluate condition over entity.

		Condition can be, a string compatible to data type testing module,
			a regular expression provided that the entity to be tested is a string,
			a function named condition to be tested with given entity for more customized evaluation,
			a class to be tested for inheritance or function name.

		If condition is array then it should evaluate true to some condition.

		Returns true if the entity satisfy the condition.

		State dictate that condition must evaluate entity based on the nature
			of state given, if state is false, it should evaluate entity even if
			it is falsy, else if state is true, it should only evaluate truthy entity.
	@end-module-documentation

	@include:
		{
			"annon": "annon",
			"cald": "cald",
			"clazof": "clazof",
			"doubt": "doubt",
			"enyof": "enyof",
			"eqe": "eqe",
			"falzy": "falzy",
			"fnamed": "fnamed",
			"raze": "raze",
			"truly": "truly",
			"zelf": "zelf"
		}
	@end-include
*/

const annon = require( "annon" );
const cald = require( "cald" );
const clazof = require( "clazof" );
const doubt = require( "doubt" );
const enyof = require( "enyof" );
const eqe = require( "eqe" );
const falzy = require( "falzy" );
const fnamed = require( "fnamed" );
const raze = require( "raze" );
const truly = require( "truly" );
const zelf = require( "zelf" );

const condev = function condev( entity, condition, state ){
	/*;
		@meta-configuration:
			{
				"entity:required": "*",
				"condition:required": [
					"string",
					"function",
					RegExp,
					BOOLEAN,
					FUNCTION,
					NUMBER,
					OBJECT,
					STRING,
					UNDEFINED,
					SYMBOL,
					"*",
					"[*]"
				],
				"state": "boolean"
			}
		@end-meta-configuration
	*/

	let self = zelf( this );

	/*;
		@note:
			Type checking condition here will not execute the next expression
				if the type checking is false.
		@end-note
	*/
	if( typeof condition == "object" && doubt( condition, AS_ARRAY ) ){
		let procedure = condev.bind( self );

		return raze( condition ).some( ( condition ) => procedure( entity, condition, state ) );
	}

	/*;
		@note:
			If state is not given or false, and both
				entity and condition is falsy then
				entity and condition must be equal.
		@end-note
	*/
	if(
		( falzy( state ) || state === false )
		&& falzy( entity )
		&& falzy( condition )
	){
		return ( entity === condition );
	}

	/*;
		@note:
			If the state is false, entity must be falsy.
		@end-note
	*/
	if( state === false && truly( entity ) ){
		return false;
	}

	/*;
		@note:
			If the state is true, entity must be truthy.
		@end-note
	*/
	if( state === true && falzy( entity ) ){
		return false;
	}

	/*;
		@note:
			If entity is shallow-ly equal to the given condition.
		@end-note
	*/
	if( eqe( entity, condition ) ){
		return true;
	}

	/*;
		@note:
			If condition is a regular expression.
		@end-note
	*/
	if(
		typeof entity == "string"
		&& truly( entity )
		&& condition instanceof RegExp
	){
		return condition.test( entity );
	}

	if(
		condition === "boolean"
		|| condition === "function"
		|| condition === "number"
		|| condition === "object"
		|| condition === "string"
		|| condition === "undefined"
		|| condition === "symbol"
	){
		if( state === true ){
			return ( typeof entity == condition && truly( entity ) );

		}else{
			return ( typeof entity == condition );
		}
	}

	/*;
		@note:
			Evaluate using the protype features.
		@end-note
	*/
	if( typeof condition == "string" && typeof entity == condition ){
		return true;
	}

	/*;
		@note:
			If the condition is a string, this may evaluate to be a function name.
		@end-note
	*/
	if( typeof condition == "string" && fnamed( entity, condition ) ){
		return true;
	}

	/*;
		@note:
			If the condition is a string, this may evaulate to be a class at this stage.
		@end-note
	*/
	if( typeof condition == "string" && clazof( entity, condition ) ){
		return true;
	}

	/*;
		@note:
			If condition is a function, and anonymous or 'condition' named,
				then execute the condition function.
		@end-note
	*/
	if(
		typeof condition == "function" &&
		( fnamed( condition, "condition" ) || annon( condition ) )
	){
		try{
			let result = cald( condition, self, entity );

			if( typeof result != "boolean" ){
				throw new Error( `invalid condition result, ${ result }` );

			}else{
				return result;
			}

		}catch( error ){
			throw new Error( `cannot execute condition, ${ error.stack }` );
		}
	}

	/*;
		@note:
			If the condition is a function, it may evaulate using clazof.
		@end-note
	*/
	if( typeof condition == "function" ){
		return clazof( entity, condition );
	}

	return false;
};

module.exports = condev;
