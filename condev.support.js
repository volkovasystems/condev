"use strict";

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
              			"protype": "protype",
              			"raze": "raze",
              			"truly": "truly"
              		}
              	@end-include
              */var _typeof2 = require("babel-runtime/helpers/typeof");var _typeof3 = _interopRequireDefault(_typeof2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var annon = require("annon");
var cald = require("cald");
var clazof = require("clazof");
var doubt = require("doubt");
var enyof = require("enyof");
var eqe = require("eqe");
var falzy = require("falzy");
var fnamed = require("fnamed");
var protype = require("protype");
var raze = require("raze");
var truly = require("truly");

var condev = function condev(entity, condition, state) {
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

	if (doubt(condition, AS_ARRAY)) {
		return raze(condition).some(function (condition) {return condev(entity, condition, state);});
	}

	/*;
   	@note:
   		If state is not given or false, and both
   			entity and condition is falsy then
   			entity and condition must be equal.
   	@end-note
   */
	if ((falzy(state) || state === false) && falzy(entity) && falzy(condition)) {
		return entity === condition;
	}

	/*;
   	@note:
   		If entity is shallow-ly equal to the given condition.
   	@end-note
   */
	if (eqe(entity, condition)) {
		return true;
	}

	/*;
   	@note:
   		If condition is a regular expression.
   	@end-note
   */
	if ((typeof entity === "undefined" ? "undefined" : (0, _typeof3.default)(entity)) == STRING && truly(entity) && condition instanceof RegExp) {
		return condition.test(entity);
	}

	var type = protype(condition);
	if (type.STRING && enyof(condition, BOOLEAN, FUNCTION, NUMBER, OBJECT, STRING, UNDEFINED, SYMBOL)) {
		if (state === true) {
			return (typeof entity === "undefined" ? "undefined" : (0, _typeof3.default)(entity)) == condition && truly(entity);

		} else {
			return (typeof entity === "undefined" ? "undefined" : (0, _typeof3.default)(entity)) == condition;
		}
	}

	/*;
   	@note:
   		If the condition is a string, this may evaulate to be a class at this stage.
   	@end-note
   */
	if (type.STRING && clazof(entity, condition)) {
		return true;
	}

	/*;
   	@note:
   		If the condition is a string, this may evaluate to be a function name.
   	@end-note
   */
	if (type.STRING && fnamed(entity, condition)) {
		return true;
	}

	if (type.FUNCTION && (fnamed(condition, "condition") || annon(condition))) {
		try {
			var result = cald(condition, this, entity);

			if ((typeof result === "undefined" ? "undefined" : (0, _typeof3.default)(result)) != BOOLEAN) {
				throw new Error("invalid condition result, " + result);

			} else {
				return result;
			}

		} catch (error) {
			throw new Error("failed executing condition, " + error.stack);
		}
	}

	if (type.FUNCTION) {
		return clazof(entity, condition);
	}

	return false;
};

module.exports = condev;

//# sourceMappingURL=condev.support.js.map