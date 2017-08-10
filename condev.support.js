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
              */

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
	if (protype(entity, STRING) && truly(entity) && condition instanceof RegExp) {
		return condition.test(entity);
	}

	var type = protype(condition);
	if (type.STRING && enyof(condition, BOOLEAN, FUNCTION, NUMBER, OBJECT, STRING, UNDEFINED, SYMBOL)) {
		if (state === true) {
			return protype(entity, condition) && truly(entity);

		} else {
			return protype(entity, condition);
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

			if (!protype(result, BOOLEAN)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmRldi5zdXBwb3J0LmpzIl0sIm5hbWVzIjpbImFubm9uIiwicmVxdWlyZSIsImNhbGQiLCJjbGF6b2YiLCJkb3VidCIsImVueW9mIiwiZXFlIiwiZmFsenkiLCJmbmFtZWQiLCJwcm90eXBlIiwicmF6ZSIsInRydWx5IiwiY29uZGV2IiwiZW50aXR5IiwiY29uZGl0aW9uIiwic3RhdGUiLCJBU19BUlJBWSIsInNvbWUiLCJTVFJJTkciLCJSZWdFeHAiLCJ0ZXN0IiwidHlwZSIsIkJPT0xFQU4iLCJGVU5DVElPTiIsIk5VTUJFUiIsIk9CSkVDVCIsIlVOREVGSU5FRCIsIlNZTUJPTCIsInJlc3VsdCIsIkVycm9yIiwiZXJyb3IiLCJzdGFjayIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4RUEsSUFBTUEsUUFBUUMsUUFBUyxPQUFULENBQWQ7QUFDQSxJQUFNQyxPQUFPRCxRQUFTLE1BQVQsQ0FBYjtBQUNBLElBQU1FLFNBQVNGLFFBQVMsUUFBVCxDQUFmO0FBQ0EsSUFBTUcsUUFBUUgsUUFBUyxPQUFULENBQWQ7QUFDQSxJQUFNSSxRQUFRSixRQUFTLE9BQVQsQ0FBZDtBQUNBLElBQU1LLE1BQU1MLFFBQVMsS0FBVCxDQUFaO0FBQ0EsSUFBTU0sUUFBUU4sUUFBUyxPQUFULENBQWQ7QUFDQSxJQUFNTyxTQUFTUCxRQUFTLFFBQVQsQ0FBZjtBQUNBLElBQU1RLFVBQVVSLFFBQVMsU0FBVCxDQUFoQjtBQUNBLElBQU1TLE9BQU9ULFFBQVMsTUFBVCxDQUFiO0FBQ0EsSUFBTVUsUUFBUVYsUUFBUyxPQUFULENBQWQ7O0FBRUEsSUFBTVcsU0FBUyxTQUFTQSxNQUFULENBQWlCQyxNQUFqQixFQUF5QkMsU0FBekIsRUFBb0NDLEtBQXBDLEVBQTJDO0FBQ3pEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxLQUFJWCxNQUFPVSxTQUFQLEVBQWtCRSxRQUFsQixDQUFKLEVBQWtDO0FBQ2pDLFNBQU9OLEtBQU1JLFNBQU4sRUFBa0JHLElBQWxCLENBQXdCLFVBQUVILFNBQUYsVUFBaUJGLE9BQVFDLE1BQVIsRUFBZ0JDLFNBQWhCLEVBQTJCQyxLQUEzQixDQUFqQixFQUF4QixDQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7QUFPQSxLQUFJLENBQUVSLE1BQU9RLEtBQVAsS0FBa0JBLFVBQVUsS0FBOUIsS0FBeUNSLE1BQU9NLE1BQVAsQ0FBekMsSUFBNEROLE1BQU9PLFNBQVAsQ0FBaEUsRUFBb0Y7QUFDbkYsU0FBU0QsV0FBV0MsU0FBcEI7QUFDQTs7QUFFRDs7Ozs7QUFLQSxLQUFJUixJQUFLTyxNQUFMLEVBQWFDLFNBQWIsQ0FBSixFQUE4QjtBQUM3QixTQUFPLElBQVA7QUFDQTs7QUFFRDs7Ozs7QUFLQSxLQUFJTCxRQUFTSSxNQUFULEVBQWlCSyxNQUFqQixLQUE2QlAsTUFBT0UsTUFBUCxDQUE3QixJQUFrREMscUJBQXFCSyxNQUEzRSxFQUFxRjtBQUNwRixTQUFPTCxVQUFVTSxJQUFWLENBQWdCUCxNQUFoQixDQUFQO0FBQ0E7O0FBRUQsS0FBSVEsT0FBT1osUUFBU0ssU0FBVCxDQUFYO0FBQ0EsS0FBSU8sS0FBS0gsTUFBTCxJQUFlYixNQUFPUyxTQUFQLEVBQWtCUSxPQUFsQixFQUEyQkMsUUFBM0IsRUFBcUNDLE1BQXJDLEVBQTZDQyxNQUE3QyxFQUFxRFAsTUFBckQsRUFBNkRRLFNBQTdELEVBQXdFQyxNQUF4RSxDQUFuQixFQUFxRztBQUNwRyxNQUFJWixVQUFVLElBQWQsRUFBb0I7QUFDbkIsVUFBU04sUUFBU0ksTUFBVCxFQUFpQkMsU0FBakIsS0FBZ0NILE1BQU9FLE1BQVAsQ0FBekM7O0FBRUEsR0FIRCxNQUdLO0FBQ0osVUFBT0osUUFBU0ksTUFBVCxFQUFpQkMsU0FBakIsQ0FBUDtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0EsS0FBSU8sS0FBS0gsTUFBTCxJQUFlZixPQUFRVSxNQUFSLEVBQWdCQyxTQUFoQixDQUFuQixFQUFnRDtBQUMvQyxTQUFPLElBQVA7QUFDQTs7QUFFRDs7Ozs7QUFLQSxLQUFJTyxLQUFLSCxNQUFMLElBQWVWLE9BQVFLLE1BQVIsRUFBZ0JDLFNBQWhCLENBQW5CLEVBQWdEO0FBQy9DLFNBQU8sSUFBUDtBQUNBOztBQUVELEtBQUlPLEtBQUtFLFFBQUwsS0FBbUJmLE9BQVFNLFNBQVIsRUFBbUIsV0FBbkIsS0FBb0NkLE1BQU9jLFNBQVAsQ0FBdkQsQ0FBSixFQUFpRjtBQUNoRixNQUFHO0FBQ0YsT0FBSWMsU0FBUzFCLEtBQU1ZLFNBQU4sRUFBaUIsSUFBakIsRUFBdUJELE1BQXZCLENBQWI7O0FBRUEsT0FBSSxDQUFDSixRQUFTbUIsTUFBVCxFQUFpQk4sT0FBakIsQ0FBTCxFQUFpQztBQUNoQyxVQUFNLElBQUlPLEtBQUosZ0NBQXlDRCxNQUF6QyxDQUFOOztBQUVBLElBSEQsTUFHSztBQUNKLFdBQU9BLE1BQVA7QUFDQTs7QUFFRCxHQVZELENBVUMsT0FBT0UsS0FBUCxFQUFjO0FBQ2QsU0FBTSxJQUFJRCxLQUFKLGtDQUEyQ0MsTUFBTUMsS0FBakQsQ0FBTjtBQUNBO0FBQ0Q7O0FBRUQsS0FBSVYsS0FBS0UsUUFBVCxFQUFtQjtBQUNsQixTQUFPcEIsT0FBUVUsTUFBUixFQUFnQkMsU0FBaEIsQ0FBUDtBQUNBOztBQUVELFFBQU8sS0FBUDtBQUNBLENBMUdEOztBQTRHQWtCLE9BQU9DLE9BQVAsR0FBaUJyQixNQUFqQiIsImZpbGUiOiJjb25kZXYuc3VwcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuLyo7XHJcblx0QG1vZHVsZS1saWNlbnNlOlxyXG5cdFx0VGhlIE1JVCBMaWNlbnNlIChNSVQpXHJcblx0XHRAbWl0LWxpY2Vuc2VcclxuXHJcblx0XHRDb3B5cmlnaHQgKEBjKSAyMDE3IFJpY2hldmUgU2lvZGluYSBCZWJlZG9yXHJcblx0XHRAZW1haWw6IHJpY2hldmUuYmViZWRvckBnbWFpbC5jb21cclxuXHJcblx0XHRQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcblx0XHRvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcblx0XHRpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcblx0XHR0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcblx0XHRjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuXHRcdGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG5cdFx0VGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXHJcblx0XHRjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5cclxuXHRcdFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuXHRcdElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG5cdFx0RklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcblx0XHRBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcblx0XHRMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG5cdFx0T1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcclxuXHRcdFNPRlRXQVJFLlxyXG5cdEBlbmQtbW9kdWxlLWxpY2Vuc2VcclxuXHJcblx0QG1vZHVsZS1jb25maWd1cmF0aW9uOlxyXG5cdFx0e1xyXG5cdFx0XHRcInBhY2thZ2VcIjogXCJjb25kZXZcIixcclxuXHRcdFx0XCJwYXRoXCI6IFwiY29uZGV2L2NvbmRldi5qc1wiLFxyXG5cdFx0XHRcImZpbGVcIjogXCJjb25kZXYuanNcIixcclxuXHRcdFx0XCJtb2R1bGVcIjogXCJjb25kZXZcIixcclxuXHRcdFx0XCJhdXRob3JcIjogXCJSaWNoZXZlIFMuIEJlYmVkb3JcIixcclxuXHRcdFx0XCJlTWFpbFwiOiBcInJpY2hldmUuYmViZWRvckBnbWFpbC5jb21cIixcclxuXHRcdFx0XCJjb250cmlidXRvcnNcIjogW1xyXG5cdFx0XHRcdFwiSm9obiBMZW5vbiBNYWdoYW5veSA8am9obmxlbm9ubWFnaGFub3lAZ21haWwuY29tPlwiLFxyXG5cdFx0XHRcdFwiVmluc2UgVmluYWxvbiA8dmluc2V2aW5hbG9uQGdtYWlsLmNvbT5cIlxyXG5cdFx0XHRdLFxyXG5cdFx0XHRcInJlcG9zaXRvcnlcIjogXCJodHRwczovL2dpdGh1Yi5jb20vdm9sa292YXN5c3RlbXMvY29uZGV2LmdpdFwiLFxyXG5cdFx0XHRcImdsb2JhbFwiOiB0cnVlXHJcblx0XHR9XHJcblx0QGVuZC1tb2R1bGUtY29uZmlndXJhdGlvblxyXG5cclxuXHRAbW9kdWxlLWRvY3VtZW50YXRpb246XHJcblx0XHRFdmFsdWF0ZSBjb25kaXRpb24gb3ZlciBlbnRpdHkuXHJcblxyXG5cdFx0Q29uZGl0aW9uIGNhbiBiZSwgYSBzdHJpbmcgY29tcGF0aWJsZSB0byBkYXRhIHR5cGUgdGVzdGluZyBtb2R1bGUsXHJcblx0XHRcdGEgcmVndWxhciBleHByZXNzaW9uIHByb3ZpZGVkIHRoYXQgdGhlIGVudGl0eSB0byBiZSB0ZXN0ZWQgaXMgYSBzdHJpbmcsXHJcblx0XHRcdGEgZnVuY3Rpb24gbmFtZWQgY29uZGl0aW9uIHRvIGJlIHRlc3RlZCB3aXRoIGdpdmVuIGVudGl0eSBmb3IgbW9yZSBjdXN0b21pemVkIGV2YWx1YXRpb24sXHJcblx0XHRcdGEgY2xhc3MgdG8gYmUgdGVzdGVkIGZvciBpbmhlcml0YW5jZSBvciBmdW5jdGlvbiBuYW1lLlxyXG5cclxuXHRcdElmIGNvbmRpdGlvbiBpcyBhcnJheSB0aGVuIGl0IHNob3VsZCBldmFsdWF0ZSB0cnVlIHRvIHNvbWUgY29uZGl0aW9uLlxyXG5cclxuXHRcdFJldHVybnMgdHJ1ZSBpZiB0aGUgZW50aXR5IHNhdGlzZnkgdGhlIGNvbmRpdGlvbi5cclxuXHJcblx0XHRTdGF0ZSBkaWN0YXRlIHRoYXQgY29uZGl0aW9uIG11c3QgZXZhbHVhdGUgZW50aXR5IGJhc2VkIG9uIHRoZSBuYXR1cmVcclxuXHRcdFx0b2Ygc3RhdGUgZ2l2ZW4sIGlmIHN0YXRlIGlzIGZhbHNlLCBpdCBzaG91bGQgZXZhbHVhdGUgZW50aXR5IGV2ZW4gaWZcclxuXHRcdFx0aXQgaXMgZmFsc3ksIGVsc2UgaWYgc3RhdGUgaXMgdHJ1ZSwgaXQgc2hvdWxkIG9ubHkgZXZhbHVhdGUgdHJ1dGh5IGVudGl0eS5cclxuXHRAZW5kLW1vZHVsZS1kb2N1bWVudGF0aW9uXHJcblxyXG5cdEBpbmNsdWRlOlxyXG5cdFx0e1xyXG5cdFx0XHRcImFubm9uXCI6IFwiYW5ub25cIixcclxuXHRcdFx0XCJjYWxkXCI6IFwiY2FsZFwiLFxyXG5cdFx0XHRcImNsYXpvZlwiOiBcImNsYXpvZlwiLFxyXG5cdFx0XHRcImRvdWJ0XCI6IFwiZG91YnRcIixcclxuXHRcdFx0XCJlbnlvZlwiOiBcImVueW9mXCIsXHJcblx0XHRcdFwiZXFlXCI6IFwiZXFlXCIsXHJcblx0XHRcdFwiZmFsenlcIjogXCJmYWx6eVwiLFxyXG5cdFx0XHRcImZuYW1lZFwiOiBcImZuYW1lZFwiLFxyXG5cdFx0XHRcInByb3R5cGVcIjogXCJwcm90eXBlXCIsXHJcblx0XHRcdFwicmF6ZVwiOiBcInJhemVcIixcclxuXHRcdFx0XCJ0cnVseVwiOiBcInRydWx5XCJcclxuXHRcdH1cclxuXHRAZW5kLWluY2x1ZGVcclxuKi9cclxuXHJcbmNvbnN0IGFubm9uID0gcmVxdWlyZSggXCJhbm5vblwiICk7XHJcbmNvbnN0IGNhbGQgPSByZXF1aXJlKCBcImNhbGRcIiApO1xyXG5jb25zdCBjbGF6b2YgPSByZXF1aXJlKCBcImNsYXpvZlwiICk7XHJcbmNvbnN0IGRvdWJ0ID0gcmVxdWlyZSggXCJkb3VidFwiICk7XHJcbmNvbnN0IGVueW9mID0gcmVxdWlyZSggXCJlbnlvZlwiICk7XHJcbmNvbnN0IGVxZSA9IHJlcXVpcmUoIFwiZXFlXCIgKTtcclxuY29uc3QgZmFsenkgPSByZXF1aXJlKCBcImZhbHp5XCIgKTtcclxuY29uc3QgZm5hbWVkID0gcmVxdWlyZSggXCJmbmFtZWRcIiApO1xyXG5jb25zdCBwcm90eXBlID0gcmVxdWlyZSggXCJwcm90eXBlXCIgKTtcclxuY29uc3QgcmF6ZSA9IHJlcXVpcmUoIFwicmF6ZVwiICk7XHJcbmNvbnN0IHRydWx5ID0gcmVxdWlyZSggXCJ0cnVseVwiICk7XHJcblxyXG5jb25zdCBjb25kZXYgPSBmdW5jdGlvbiBjb25kZXYoIGVudGl0eSwgY29uZGl0aW9uLCBzdGF0ZSApe1xyXG5cdC8qO1xyXG5cdFx0QG1ldGEtY29uZmlndXJhdGlvbjpcclxuXHRcdFx0e1xyXG5cdFx0XHRcdFwiZW50aXR5OnJlcXVpcmVkXCI6IFwiKlwiLFxyXG5cdFx0XHRcdFwiY29uZGl0aW9uOnJlcXVpcmVkXCI6IFtcclxuXHRcdFx0XHRcdFwic3RyaW5nXCIsXHJcblx0XHRcdFx0XHRcImZ1bmN0aW9uXCIsXHJcblx0XHRcdFx0XHRSZWdFeHAsXHJcblx0XHRcdFx0XHRCT09MRUFOLFxyXG5cdFx0XHRcdFx0RlVOQ1RJT04sXHJcblx0XHRcdFx0XHROVU1CRVIsXHJcblx0XHRcdFx0XHRPQkpFQ1QsXHJcblx0XHRcdFx0XHRTVFJJTkcsXHJcblx0XHRcdFx0XHRVTkRFRklORUQsXHJcblx0XHRcdFx0XHRTWU1CT0wsXHJcblx0XHRcdFx0XHRcIipcIixcclxuXHRcdFx0XHRcdFwiWypdXCJcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdFwic3RhdGVcIjogXCJib29sZWFuXCJcclxuXHRcdFx0fVxyXG5cdFx0QGVuZC1tZXRhLWNvbmZpZ3VyYXRpb25cclxuXHQqL1xyXG5cclxuXHRpZiggZG91YnQoIGNvbmRpdGlvbiwgQVNfQVJSQVkgKSApe1xyXG5cdFx0cmV0dXJuIHJhemUoIGNvbmRpdGlvbiApLnNvbWUoICggY29uZGl0aW9uICkgPT4gY29uZGV2KCBlbnRpdHksIGNvbmRpdGlvbiwgc3RhdGUgKSApO1xyXG5cdH1cclxuXHJcblx0Lyo7XHJcblx0XHRAbm90ZTpcclxuXHRcdFx0SWYgc3RhdGUgaXMgbm90IGdpdmVuIG9yIGZhbHNlLCBhbmQgYm90aFxyXG5cdFx0XHRcdGVudGl0eSBhbmQgY29uZGl0aW9uIGlzIGZhbHN5IHRoZW5cclxuXHRcdFx0XHRlbnRpdHkgYW5kIGNvbmRpdGlvbiBtdXN0IGJlIGVxdWFsLlxyXG5cdFx0QGVuZC1ub3RlXHJcblx0Ki9cclxuXHRpZiggKCBmYWx6eSggc3RhdGUgKSB8fCBzdGF0ZSA9PT0gZmFsc2UgKSAmJiBmYWx6eSggZW50aXR5ICkgJiYgZmFsenkoIGNvbmRpdGlvbiApICl7XHJcblx0XHRyZXR1cm4gKCBlbnRpdHkgPT09IGNvbmRpdGlvbiApO1xyXG5cdH1cclxuXHJcblx0Lyo7XHJcblx0XHRAbm90ZTpcclxuXHRcdFx0SWYgZW50aXR5IGlzIHNoYWxsb3ctbHkgZXF1YWwgdG8gdGhlIGdpdmVuIGNvbmRpdGlvbi5cclxuXHRcdEBlbmQtbm90ZVxyXG5cdCovXHJcblx0aWYoIGVxZSggZW50aXR5LCBjb25kaXRpb24gKSApe1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHQvKjtcclxuXHRcdEBub3RlOlxyXG5cdFx0XHRJZiBjb25kaXRpb24gaXMgYSByZWd1bGFyIGV4cHJlc3Npb24uXHJcblx0XHRAZW5kLW5vdGVcclxuXHQqL1xyXG5cdGlmKCBwcm90eXBlKCBlbnRpdHksIFNUUklORyApICYmIHRydWx5KCBlbnRpdHkgKSAmJiAoIGNvbmRpdGlvbiBpbnN0YW5jZW9mIFJlZ0V4cCApICl7XHJcblx0XHRyZXR1cm4gY29uZGl0aW9uLnRlc3QoIGVudGl0eSApO1xyXG5cdH1cclxuXHJcblx0bGV0IHR5cGUgPSBwcm90eXBlKCBjb25kaXRpb24gKTtcclxuXHRpZiggdHlwZS5TVFJJTkcgJiYgZW55b2YoIGNvbmRpdGlvbiwgQk9PTEVBTiwgRlVOQ1RJT04sIE5VTUJFUiwgT0JKRUNULCBTVFJJTkcsIFVOREVGSU5FRCwgU1lNQk9MICkgKXtcclxuXHRcdGlmKCBzdGF0ZSA9PT0gdHJ1ZSApe1xyXG5cdFx0XHRyZXR1cm4gKCBwcm90eXBlKCBlbnRpdHksIGNvbmRpdGlvbiApICYmIHRydWx5KCBlbnRpdHkgKSApO1xyXG5cclxuXHRcdH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gcHJvdHlwZSggZW50aXR5LCBjb25kaXRpb24gKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qO1xyXG5cdFx0QG5vdGU6XHJcblx0XHRcdElmIHRoZSBjb25kaXRpb24gaXMgYSBzdHJpbmcsIHRoaXMgbWF5IGV2YXVsYXRlIHRvIGJlIGEgY2xhc3MgYXQgdGhpcyBzdGFnZS5cclxuXHRcdEBlbmQtbm90ZVxyXG5cdCovXHJcblx0aWYoIHR5cGUuU1RSSU5HICYmIGNsYXpvZiggZW50aXR5LCBjb25kaXRpb24gKSApe1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHQvKjtcclxuXHRcdEBub3RlOlxyXG5cdFx0XHRJZiB0aGUgY29uZGl0aW9uIGlzIGEgc3RyaW5nLCB0aGlzIG1heSBldmFsdWF0ZSB0byBiZSBhIGZ1bmN0aW9uIG5hbWUuXHJcblx0XHRAZW5kLW5vdGVcclxuXHQqL1xyXG5cdGlmKCB0eXBlLlNUUklORyAmJiBmbmFtZWQoIGVudGl0eSwgY29uZGl0aW9uICkgKXtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0aWYoIHR5cGUuRlVOQ1RJT04gJiYgKCBmbmFtZWQoIGNvbmRpdGlvbiwgXCJjb25kaXRpb25cIiApIHx8IGFubm9uKCBjb25kaXRpb24gKSApICl7XHJcblx0XHR0cnl7XHJcblx0XHRcdGxldCByZXN1bHQgPSBjYWxkKCBjb25kaXRpb24sIHRoaXMsIGVudGl0eSApO1xyXG5cclxuXHRcdFx0aWYoICFwcm90eXBlKCByZXN1bHQsIEJPT0xFQU4gKSApe1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvciggYGludmFsaWQgY29uZGl0aW9uIHJlc3VsdCwgJHsgcmVzdWx0IH1gICk7XHJcblxyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fWNhdGNoKCBlcnJvciApe1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoIGBmYWlsZWQgZXhlY3V0aW5nIGNvbmRpdGlvbiwgJHsgZXJyb3Iuc3RhY2sgfWAgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmKCB0eXBlLkZVTkNUSU9OICl7XHJcblx0XHRyZXR1cm4gY2xhem9mKCBlbnRpdHksIGNvbmRpdGlvbiApO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25kZXY7XHJcbiJdfQ==
//# sourceMappingURL=condev.support.js.map
