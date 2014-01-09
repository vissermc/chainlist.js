(function() {

	var _genAssertMessage = function(txt,level) {
		console.log("Assert: "+txt+(new Error).stack.split("\n").slice(level||3).join("\n"));
	}
	assert = function (expr,level) {
		if (!expr) {
			//throw("assert");
			_genAssertMessage('',level);
		}
	}
	assert_equal = function(v1,v2,level) {
		v1=JSON.stringify(v1);
		v2=JSON.stringify(v2);
		if (v1!=v2)
			_genAssertMessage(''+(v1)+" != "+(v2),level);
	}

	assert_reciprocal = function(func, arg,func2) {
		assert_equal(func2(func(arg)),arg,4);
	}

	assert_reciprocalObject = function(constructor, arg,func) {
		assert_equal(func.call(new constructor(arg)),arg,4);
	}

})();