/**
The MIT License (MIT)

Copyright (c) 2014 Michiel Visser

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
**/

function chainlist_test() {

	var testContent = function(l,c) {
		assert_equal(l.toArray(),c);
		l._testInvariants();
	}
	var makeList = function(array,parent) {
		var a=array.slice(0);
		var l = ChainList.fromArray(a,parent);
		assert_equal(a,array);
		testContent(l,array);
		return l;
	}

	var tests = {
		test_parent: function() {
			var l=makeList([]);
			assert(l.parent()==l);
			l=makeList(['a','b','c'],'x');
			assert(l.parent()=='x');
		},
		test_indexLink_empty: function() {
			var l=makeList([]);
			assert(l.parent()==l);
			assert_equal(l.indexLink(0)._isList,true);
			assert_equal(l.indexLink(1)._isList,true);
			assert_equal(l.indexLink(-1)._isList,true);
			assert_equal(l.indexLink(0).elem(),null);
		},
		test_indexLink_nonEmpty: function() {
			var l=makeList(['a','b','c'],'x');
			assert_equal(l.indexLink(0)._isList,true);
			assert_equal(l.indexLink(1).elem(),'a');
			assert_equal(l.indexLink(2).elem(),'b');
			assert_equal(l.indexLink(3).elem(),'c');
			assert_equal(l.indexLink(4)._isList,true);
			assert_equal(l.indexLink(-1).elem(),'c');
			assert_equal(l.indexLink(-2).elem(),'b');
			assert_equal(l.indexLink(-3).elem(),'a');
			assert_equal(l.indexLink(-4)._isList,true);
		},
		test_get_empty: function() {
			var l=makeList([]);
			assert_equal(l.get(0),null);
			assert_equal(l.get(1),null);
			assert_equal(l.get(-1),null);
		},
		test_get_nonEmpty: function() {
			var l=makeList(['a','b','c'],'x');
			assert_equal(l.get(0),'a');
			assert_equal(l.get(1),'b');
			assert_equal(l.get(2),'c');
			assert_equal(l.get(3),null);
			assert_equal(l.get(4),null);
			assert_equal(l.get(-1),'c');
			assert_equal(l.get(-2),'b');
			assert_equal(l.get(-3),'a');
			assert_equal(l.get(-4),null);
			assert_equal(l.get(-5),null);
		},
		test_indexPos: function() {
			var l=makeList([]);
			assert_equal(l.indexPos(0)._isList,true);
			assert_equal(l.indexPos(1)._isList,true);
			assert_equal(l.indexPos(-1)._isList,true);
			l=makeList(['a','b','c'],'x');
			assert_equal(l.indexPos(0).elem(),'a');
			assert_equal(l.indexPos(1).elem(),'b');
			assert_equal(l.indexPos(-3).elem(),'a');
		},
		test_last: function() {
			var l=makeList(['a','b','c'],'x');
			assert_equal(l.last().elem(),'c');
		},
		test_takeRange: function() {
			var l=ChainList.fromArray(['a','b','c'],'x');
			var l2=ChainList.fromArray([],'y');
			l2.takeRange(l,l);
			testContent(l,[]);
			testContent(l2,['a','b','c']);

			l=ChainList.fromArray(['a','b','c'],'x');
			l2=ChainList.fromArray([],'y');
			l2.takeRange(l,l.indexPos(0));
			testContent(l,['a','b','c']);
			testContent(l2,[]);

			l=ChainList.fromArray(['a','b','c'],'x');
			l2=ChainList.fromArray([],'y');
			l2.takeRange(l,l.indexPos(1));
			testContent(l,['b','c']);
			testContent(l2,['a']);

			l=ChainList.fromArray(['a','b','c'],'x');
			l2=ChainList.fromArray([],'y');
			l2.takeRange(l,l.indexPos(2));
			testContent(l,['c']);
			testContent(l2,['a','b']);
		},
		test_take: function() {
			var l=ChainList.fromArray(['a','b','c'],'x');
			var l2=ChainList.fromArray(['d'],'y');
			l.indexPos(1).take(l2);
			testContent(l2,[]);
			testContent(l,['a','d','b','c']);
		},
		test_takeSome: function() {
			var l=ChainList.fromArray(['a','b','c'],'x');
			var l2=ChainList.fromArray(['d','e'],'y');
			l.takeSome(l2,1);
			testContent(l2,['e']);
			testContent(l,['a','b','c','d']);
		},
		test_remove: function() {
			var l=ChainList.fromArray(['a','b','c'],'x');
			l.indexPos(0).remove();
			testContent(l,['b','c']);

			l=ChainList.fromArray(['a','b','c'],'x');
			l.indexPos(1).remove();
			testContent(l,['a','c']);

			l=ChainList.fromArray(['a','b','c'],'x');
			l.indexPos(2).remove();
			testContent(l,['a','b']);
		},
		test_removeAt: function() {
			var l=ChainList.fromArray(['a','b','c'],'x');
			l.removeAt(0);
			testContent(l,['b','c']);

			l=ChainList.fromArray(['a','b','c'],'x');
			l.removeAt(1);
			testContent(l,['a','c']);

			l=ChainList.fromArray(['a','b','c'],'x');
			l.removeAt(2);
			testContent(l,['a','b']);
		},
		test_reverse: function() {
			var l=ChainList.fromArray([]);
			l.reverse();
			testContent(l,[]);

			l=ChainList.fromArray(['a'],'x');
			l.reverse();
			testContent(l,['a']);

			l=ChainList.fromArray(['a','b'],'x');
			l.reverse();
			testContent(l,['b','a']);
		},
		test_insert: function() {
			var l=makeList([],'p');
			l.insert("a");
			testContent(l, ["a"]);

			l=makeList(['a'],'p');
			l.insert("c");
			testContent(l,["a","c"]);

			l=makeList(['a','b'],'p');
			l.last().insert("c");
			testContent(l, ["a","c","b"]);
		},
		test: function() {
			var l=makeList(['a','b','c'],'p');
			var l2=new ChainList();
			l2.takeRange(l,l.indexPos(1));
			assert_equal(l2.toArray(),["a"]);
			testContent(l,["b","c"]);
			l2.clear();
			assert_equal(l2.toArray(),[]);
			l2 = l.shiftRange(l._next);
			assert_equal(l2.toArray(),[]);
			testContent(l, ["b","c"]);
			l.unshift("a");
			testContent(l, ["a","b","c"]);
			assert_equal(l.indexPos(1).shiftSome(1).toArray(),["b"]);
			testContent(l, ["a","c"]);
			var cl=l.clone();
			assert_equal(cl.toArray(),["a","c"]);
			cl.clear();
			assert_equal(cl.toArray(),[]);
			testContent(l, ["a","c"]);
			l.insertArray(["d","e"]);
			testContent(l, ["a","c","d","e"]);
			assert_equal(l.indexPos(1).shiftSome(2).toArray(),["c","d"]);
			testContent(l, ["a","e"]);
			l.insert("z");
			l.reverse();
			testContent(l, ["z","e","a"]);
			l.reverse();
			testContent(l, ["a","e","z"]);
			assert_equal(l.indexPos(1).get(1),"z");
			assert_equal(l.indexPos(1).get(-1),"a");
			assert_equal(l.indexPos(1).get(2),null);
			assert_equal(l.indexPos(1).get(-2),null);
			assert_equal(l.cloneSome(2).toArray(),["a","e"]);
			assert_equal(l.slice(1,3).toArray(),["e","z"]);
			assert_equal(l.slice(0,2).toArray(),["a","e"]);
			testContent(l, ["a","e","z"]);
			assert_equal(l.splice(1,1,"f","g").toArray(),["e"]);
			testContent(l, ["a","f","g","z"]);
			assert_equal(l._length,4);
			assert_equal(l.parent(),"p");
			assert_equal(l.indexPos(1).parent(),"p");
			assert_equal(l.indexPos(-1).parent(),"p");
			assert_equal(l.indexPos(-3).parent(),"p");
			assert_equal(l.indexOf(l.indexPos(0)),0);
			assert_equal(l.indexOf(l.indexPos(1)),1);
			assert_equal(l.indexOf(l.indexPos(2)),2);
			l.insertAt(0,"x");
			testContent(l, ["x","a","f","g","z"]);
			l.insertAt(-1,"y");
			testContent(l, ["x","a","f","g","z","y"]);
			l.insertAt(l._length,"q");
			testContent(l, ["x","a","f","g","z","y","q"]);
		},
		test_chainListSorted: function() {
			var ls = new ChainListSorted();
			testContent(ls, []);
			ls.insert(2);
			testContent(ls, [2]);
			ls.insert(1);
			testContent(ls, [1,2]);
			ls.insert(5);
			testContent(ls, [1,2,5]);
			ls.insert(5);
			testContent(ls, [1,2,5,5]);
			ls.insert(3);
			testContent(ls, [1,2,3,5,5]);

			var ls = new ChainListSorted(null,function(a,b) { return b-a; } );
			testContent(ls, []);
			ls.insert(2);
			testContent(ls, [2]);
			ls.insert(1);
			testContent(ls, [2,1]);
			ls.insert(5);
			testContent(ls, [5,2,1]);
			ls.insert(5);
			testContent(ls, [5,5,2,1]);
			ls.insert(3);
			testContent(ls, [5,5,3,2,1]);
			var ls = new ChainListSorted.fromArray([7,4,8,3,2]);
			testContent(ls,[2,3,4,7,8]);
		}
	};
	for(var key in tests) {
		if (tests.hasOwnProperty(key)) {
			console.log('Executing: '+key);
			tests[key]();
		}
	}
};
