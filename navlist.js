if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

function NavList(parent,compareFunc) {
	this._next=this._prev=this;
	this._parent=parent||this;
	this._list=this;
	this._length=0;
	this._compareFunc = compareFunc
}

NavList.Node = function(prev, elem/*optional*/) { // A class captured in the NavList namespace, which is also the base class of a Linked List
	var t=prev._next;
	prev._next=this;
	this._prev=prev;
	this._next=t;
	t._prev = this;
	this._elem=elem||this;
	this._list = prev._list;
	this._list._length++;
}

NavList.Node.prototype={
	constructor: NavList.Node,
	list: function() {
		return this._list;
	},
	parent: function() {
		return this._list._parent;
	},
	setParent: function(val) {
		_list._parent = val;
	},
	_startNode: function() { return this; },
	elem: function() { return this._elem; },
	setElem: function(val) { this._elem = val; },
	lastNode: function() {
		return this._list._prev;
	},
	last: function() {
		return this.lastNode()._elem;
	},		
	takeRange: function(start,end) {
		start=start._startNode();
		if (start==end)
			return this;
		var last=end._prev;

		var myList=this._list;
		start.forEachRange(end, function(elem,index,node) {
			node._list._length--;
			node._list=myList;
			node._list._length++;
		});

		end._prev=start._prev;
		start._prev._next=end;

		var tn=this._startNode();
		tn._prev._next=start;
		start._prev = tn._prev;

		tn._prev = last;
		last._next = tn; 
		return last;
	},
	take: function(list) {
		return this.takeRange(list,list._list);
	},
	takeSome: function(list,count) {
		return this.takeRange(list,list.indexNode(count));
	},
	cloneRange: function(end) {
		var ll=new NavList();
		for(var n=this._startNode(); n!=end;n=n._next)
			ll.insert(n._elem);
		return ll;
	},
	cloneSome: function(count) {
		return this.cloneRange(this.indexNode(count));
	},
	shiftRange: function(end) {
		var ll=new NavList();
		ll.takeRange(this,end);
		return ll;
	},
	shiftSome: function(count) {
		return this.shiftRange(this.indexNode(count));
	},
	shift: function() { return this.shiftSome(1).index(0); },
	slice: function(begin,end) {
		return this.indexNode(begin).cloneRange(end!=null?this.indexNode(end):this._list);
	},
	splice: function(index,cutCount,elemToInsert1) {
		var n=this.indexNode(index);
		var nn=n._next;
		var r=n.shiftSome(cutCount);
		nn.insertArray( Array.prototype.slice.call(arguments,2));
		return r;
	},
	remove: function() {
		return this._prev.shiftSome(1).index(0);
	},
	pop: function() {
		return this.lastNode().remove();
	},
	insert: function(elem) {
		return new NavList.Node(this._prev,elem);
	},
	insertArray: function(elems) {
		var n=this;
		for(var i=0; i<elems.length; i++) {
			n=n.insert(elems[i])._next;
		}
	},
	unshift: function() {
		this._startNode().insertArray(arguments);
		return this._list._count;
	},
	push: function(elem) {
		this._list.insertArray(arguments);
		return this._list._count;
	},
	indexOfNode: function(node) {
		var r = this.forEach(function(i,index,n) {
			if (n==node)
				return index;
		});
		return r==null? -1 : r;
	},
	indexOf: function(elem) {
		var r= this.forEach(function(i,index,n) {
			if (i==elem)
				return index;
		});
		return r==null? -1 : r;
	},
	lastIndexOf: function(elem) {
		this.forEachBack(function(i,index,n) {
			if (i==elem)
				return index;
		});
		return -1;
	},
	indexNode: function(index) { //assumes this is a list, thus index(0) gets the first element by taking the next of the list
		var s;
		if (index<0) {
			s=this._prev;
			while(++index<0 && !s._isList) 
				s=s._prev;
		} else {
			s=this._startNode();
			while(--index>=0 && !s._isList) 
				s=s._next;
		}
		return s;
	},
	pos: function(index) {
		var s = this;
		if (index<0) {
			while(++index<=0) s=s._prev;
		} else
			while(--index>=0) s=s._next;
		return s;
	},
	index: function(index) {
		var n=this.indexNode(index);
		return n._isList ? null : n._elem;
	},
	next: function() { return this._next; },
	prev: function() { return this._prev; },
	countRange: function(end) { // counts the nunmber of successors
		var i = 0;
		for(var s=this._next;s!=end;s=s._next) 
			i++;
		return i;
	},
	isList: function() { return this._isList; },
	reverse: function() {
		var r=new NavList();
		while (!this._next._isList)
			r.takeSome(this,1);
		this.take(r);
		return this;
	},
	forEachRange: function (end, func/*(elem,index,Node): retVal*/) {
		var index=0;
		for(var s=this._startNode();s!=end;s=s._next) {
			var value=func.call(this,s._elem,index,s);
			if (value!==undefined)
				return value;
			index++;
		}
	},
	forEach: function (func/*(elem,index,Node): retVal*/) {
		return this.forEachRange(this.list(), func);
	},
	forEachBackRange: function (end, func/*(elem,index,Node): retVal*/) {
		var index=0; //this is faster than starting with calculating count
		for(var s=this._prev;s!=end;s=s._prev) {
			index--;
			var value=func.call(this,s._elem,index,s);
			if (value!==undefined)
				return value;
		}
	},
	forEachBack: function (func/*(elem,index,Node): retVal*/) {
		return this.forEachBackRange(this.list(), func);
	},
	map: function (func/*(elem,index,Node): retVal*/) {
		var index=0;
		var res=[];
		for(var s=this._next;!s._isList;s=s._next) {
			res.push(func(s._elem,index,s));
			index++;
		}
		return res;
	},
	toArray: function() {
		return this.map(function(i) { return i; });
	}
};

NavList.prototype = Object.create (NavList.Node.prototype);
NavList.prototype.constructor = NavList;
NavList.prototype._isList = true;
NavList.prototype.list = function() { return this; };
NavList.prototype.empty = function() { return this.shiftRange(this._list); };
NavList.prototype.remove = null;
NavList.prototype.count = function() { return this._length; }
NavList.prototype.clone = function() { return this.cloneRange(this);};
NavList.prototype._startNode = function() { return this._next; };
NavList.prototype.elem = function() { return null };
NavList.prototype.insertAt = function(index,elem) { return this.pos(index+1).insert(elem); } // 0 = begin, length or -1=end
NavList.prototype.removeAt = function(index) { return this.index(index).remove(); } // 0 = first, -1=last
NavList.prototype._testInvariants = function() {
	var count=0;
	this.forEach(function(elem,index,node) {
		count++;
		assert(node._prev._next==node);
		assert(node._next._prev==node);
		assert(node._list==this);
		assert(node._isList==null);
	});
	assert_equal(count,this.count());
};
NavList.fromArray = function(array,parent) {
	var ll = new NavList(parent);
	ll.insertArray(array);
	return ll;
}

function NavListSorted(parent,compareFunc) {
	NavList.call(this,parent);
	this._compareFunc = compareFunc || (parent && parent.compareFunc) || NavListSorted.defaultCompareFunc;
}
NavListSorted.defaultCompareFunc = function(a,b) {
	return a-b;
}
NavListSorted.prototype = Object.create (NavList.prototype);
NavListSorted.prototype.constructor = NavListSorted;
NavListSorted.prototype.insert = function(elem) {
	var node = this.forEach(function(e,index,node) {
		if (this._compareFunc(elem,e)<=0)
			return node;
	}) || this;
	return new NavListSorted.Node(node._prev,elem);
};
NavListSorted.prototype.insertAt = null; //disable
NavListSorted.prototype.unshift = null; //disable
NavListSorted.prototype.push = null; //disable

NavListSorted.Node = function(prev, elem) {
	NavList.Node.call(this,prev,elem);
};
NavListSorted.Node.prototype = Object.create (NavList.Node.prototype);
NavListSorted.Node.prototype.constructor = NavListSorted.Node;
NavListSorted.Node.prototype.insert = function(elem) {
	return this.list().insert(elem);
}

function NavList_test() {
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
}
NavList_test();
