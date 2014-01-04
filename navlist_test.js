(function() {

	var testContent = function(l,c) {
		assert_equal(l.toArray(),c);
		l._testInvariants();
	}
	var makeList = function(array,parent) {
		var a=array.slice(0);
		var l = NavList.fromArray(a,parent);
		assert_equal(a,array);
		testContent(l,array);
		return l;
	}

	function test() {
		var l, l2;

		l=makeList([]);
		assert(l.parent()==l);
		assert_equal(l.pos(0)._isList,true);
		assert_equal(l.pos(1)._isList,true);
		assert_equal(l.pos(-1)._isList,true);
		assert_equal(l.pos(0).elem(),null);
		assert_equal(l.index(0),null);
		assert_equal(l.index(-1),null);
		assert_equal(l.indexNode(0)._isList,true);
		assert_equal(l.indexNode(1)._isList,true);
		assert_equal(l.indexNode(-1)._isList,true);

		l=makeList(['a','b','c'],'x');
		assert(l.parent()=='x');
		assert_equal(l.pos(0)._isList,true);
		assert_equal(l.pos(1).elem(),'a');
		assert_equal(l.pos(2).elem(),'b');
		assert_equal(l.pos(3).elem(),'c');
		assert_equal(l.pos(4)._isList,true);
		assert_equal(l.pos(-1).elem(),'c');
		assert_equal(l.pos(-2).elem(),'b');
		assert_equal(l.pos(-3).elem(),'a');
		assert_equal(l.pos(-4)._isList,true);
		assert_equal(l.index(0),'a');
		assert_equal(l.index(1),'b');
		assert_equal(l.index(2),'c');
		assert_equal(l.index(3),null);
		assert_equal(l.index(4),null);
		assert_equal(l.index(-1),'c');
		assert_equal(l.index(-2),'b');
		assert_equal(l.index(-3),'a');
		assert_equal(l.index(-4),null);
		assert_equal(l.index(-5),null);
		assert_equal(l.indexNode(0).elem(),'a');
		assert_equal(l.indexNode(1).elem(),'b');
		assert_equal(l.indexNode(-3).elem(),'a');
		assert_equal(l.lastNode().elem(),'c');
		assert_equal(l.last(),'c');

		l=NavList.fromArray(['a','b','c'],'x');
		l2=NavList.fromArray([],'y');
		l2.takeRange(l,l);
		testContent(l,[]);
		testContent(l2,['a','b','c']);

		l=NavList.fromArray(['a','b','c'],'x');
		l2=NavList.fromArray([],'y');
		l2.takeRange(l,l.indexNode(0));
		testContent(l,['a','b','c']);
		testContent(l2,[]);

		l=NavList.fromArray(['a','b','c'],'x');
		l2=NavList.fromArray([],'y');
		l2.takeRange(l,l.indexNode(1));
		testContent(l,['b','c']);
		testContent(l2,['a']);

		l=NavList.fromArray(['a','b','c'],'x');
		l2=NavList.fromArray([],'y');
		l2.takeRange(l,l.indexNode(2));
		testContent(l,['c']);
		testContent(l2,['a','b']);

		l=makeList([],'p');
		l.insert("a");
		testContent(l, ["a"]);
		l.insert("c");
		testContent(l,["a","c"]);
		l.lastNode().insert("b");
		testContent(l, ["a","b","c"]);
		assert_equal(l.index(1),"b");
		var l2=new NavList();
		l2.takeRange(l,l.indexNode(1));
		assert_equal(l2.toArray(),["a"]);
		testContent(l,["b","c"]);
		l2.empty();
		assert_equal(l2.toArray(),[]);
		l2 = l.shiftRange(l._next);
		assert_equal(l2.toArray(),[]);
		testContent(l, ["b","c"]);
		l.unshift("a");
		testContent(l, ["a","b","c"]);
		assert_equal(l.indexNode(1).shiftSome(1).toArray(),["b"]);
		testContent(l, ["a","c"]);
		var cl=l.clone();
		assert_equal(cl.toArray(),["a","c"]);
		cl.empty();
		assert_equal(cl.toArray(),[]);
		testContent(l, ["a","c"]);
		l.insertArray(["d","e"]);
		testContent(l, ["a","c","d","e"]);
		assert_equal(l.indexNode(1).shiftSome(2).toArray(),["c","d"]);
		testContent(l, ["a","e"]);
		l.insert("z");
		l.reverse();
		testContent(l, ["z","e","a"]);
		l.reverse();
		testContent(l, ["a","e","z"]);
		assert_equal(l.indexNode(1).index(1),"z");
		assert_equal(l.indexNode(1).index(-1),"a");
		assert_equal(l.indexNode(1).index(2),null);
		assert_equal(l.indexNode(1).index(-2),null);
		assert_equal(l.cloneSome(2).toArray(),["a","e"]);
		assert_equal(l.slice(1,3).toArray(),["e","z"]);
		assert_equal(l.slice(0,2).toArray(),["a","e"]);
		testContent(l, ["a","e","z"]);
		assert_equal(l.splice(1,1,"f","g").toArray(),["e"]);
		testContent(l, ["a","f","g","z"]);
		assert_equal(l._length,4);
		assert_equal(l.parent(),"p");
		assert_equal(l.indexNode(1).parent(),"p");
		assert_equal(l.indexNode(-1).parent(),"p");
		assert_equal(l.indexNode(-3).parent(),"p");
		assert_equal(l.indexOfNode(l.indexNode(0)),0);
		assert_equal(l.indexOfNode(l.indexNode(1)),1);
		assert_equal(l.indexOfNode(l.indexNode(2)),2);
		l.insertAt(0,"x");
		testContent(l, ["x","a","f","g","z"]);
		l.insertAt(-1,"y");
		testContent(l, ["x","a","f","g","z","y"]);
		l.insertAt(l._length,"q");
		testContent(l, ["x","a","f","g","z","y","q"]);

		var ls = new NavListSorted();
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

		var ls = new NavListSorted(null,function(a,b) { return b-a; } );
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
	}
	test();
})();
