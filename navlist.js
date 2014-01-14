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
		var ll=this.list()._initClone();
		for(var n=this._startNode(); n!=end;n=n._next)
			ll.insert(n._elem);
		return ll;
	},
	cloneSome: function(count) {
		return this.cloneRange(this.indexNode(count));
	},
	shiftRange: function(end) {
		var ll=this.list()._initClone();
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
		var r=new NavList(); // no need for _initClone
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
NavList.prototype._initClone = function() { return new NavList(); }
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
NavListSorted.prototype._initClone = function() { return new NavListSorted(null,this._compareFunc); }
NavListSorted.fromArray = function(array,parent,compareFunc) {
	var ll = new NavListSorted(parent,compareFunc);
	ll.insertArray(array);
	return ll;
}

NavListSorted.Node = function(prev, elem) {
	NavList.Node.call(this,prev,elem);
};
NavListSorted.Node.prototype = Object.create (NavList.Node.prototype);
NavListSorted.Node.prototype.constructor = NavListSorted.Node;
NavListSorted.Node.prototype.insert = function(elem) {
	return this.list().insert(elem);
}
