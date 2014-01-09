(function() {

	var _genAssertMessage = function(txt,level) {
		console.log("Assert: "+txt+(new Error).stack.split("\n").slice(level||3).join("\n"));
	}
	function assert(expr,level) {
		if (!expr) {
			//throw("assert");
			_genAssertMessage('',level);
		}
	}
	function assert_equal(v1,v2,level) {
		v1=JSON.stringify(v1);
		v2=JSON.stringify(v2);
		if (v1!=v2)
			_genAssertMessage(''+(v1)+" != "+(v2),level);
	}

	function assert_reciprocal(func, arg,func2) {
		assert_equal(func2(func(arg)),arg,4);
	}

	function assert_reciprocalObject(constructor, arg,func) {
		assert_equal(func.call(new constructor(arg)),arg,4);
	}
	
})();