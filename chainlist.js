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

function ChainList(parent,compareFunc) {
	this._next=this._prev=this;
	this._parent=parent||this;
	this._list=this;
	this._length=0;
	this._compareFunc = compareFunc
}

ChainList.Link = function(prev) { // A class captured in the ChainList namespace, which is also the base class of a Linked List
	var t=prev._next;
	prev._next=this;
	this._prev=prev;
	this._next=t;
	t._prev = this;
	this._list = prev._list;
	this._list._length++;
}

ChainList.Link.prototype={
	constructor: ChainList.Link,
	
	parent: function() {
		return this._list._parent;
	},

	//----- list functions -----

	isList: function() { return this._isList; },
	reverse: function() {
		var r=new ChainList(); // no need for _initClone
		while (!this._next._isList)
			r._next.takeSome(this,1);
		this.take(r);
		return this;
	},
	takeRange: function(start,end) {
		start=start.firstPos();
		if (start==end)
			return this;
		var last=end._prev;

		var myList=this._list;
		start.forEachTill(end, function(elem,index,node) {
			node._list._length--;
			node._list=myList;
			node._list._length++;
		});

		end._prev=start._prev;
		start._prev._next=end;

		var tn=this;
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
		return this.takeRange(list,list.indexPos(count));
	},
	clone: function() { return this.cloneRange(this._list);},
	cloneRange: function(end) {
		var ll=this._list._initClone();
		for(var n=this.firstPos(); n!=end;n=n._next)
			ll.insert(n._elem);
		return ll;
	},
	cloneSome: function(count) {
		return this.cloneRange(this.indexPos(count));
	},
	shiftRange: function(end) {
		var ll=this._list._initClone();
		ll.takeRange(this,end);
		return ll;
	},
	shiftSome: function(count) {
		return this.shiftRange(this.indexPos(count));
	},
	truncate: function() {
		return this.shiftRange(this._list);
	},
	shift: function() { return this.shiftSome(1).index(0); },
	slice: function(begin,end) {
		return this.indexPos(begin).cloneRange(end!=null?this.indexPos(end):this._list);
	},
	pop: function() {
		return this.lastPos().remove();
	},

	//----- node navigation functions -----
	last: function() {
		return this.lastPos().node();
	},
	first: function() {
		return this.firstPos().node();
	},
	lastPos: function() {
		return this._list._prev;
	},
	index: function(index) { return this.indexPos(index).node(); },
	indexOf: function(node) {
		var r = this.forEach(function(i,index,n) {
			if (n==node)
				return index;
		});
		return r==null? -1 : r;
	},
	next: function() { return this._next.node(); },
	prev: function() { return this._prev.node(); },
	selfIndex: function() {
		return this._list.indexOf(this);
	},
	indexPos: function(index) {
		var s;
		if (index<0) {
			s=this._prev;
			while(++index<0 && !s._isList) 
				s=s._prev;
		} else {
			s=this.firstPos();
			while(--index>=0 && !s._isList) 
				s=s._next;
		}
		return s;
	},
	
	//----- elem functions -----
	
	indexOfElem: function(elem) {
		var r= this.forEach(function(i,index,n) {
			if (i==elem)
				return index;
		});
		return r==null? -1 : r;
	},
	indexElem: function(index) { return this.indexPos(index).elem(); },
	lastIndexOfElem: function(elem) {
		this.forEachBack(function(i,index,n) {
			if (i==elem)
				return index;
		});
		return -1;
	},
	toArray: function() {
		return this.map(function(elem) { return elem; });
	},

    //------ elem insertion -----
    
    insert: function(elem) {
		return new ChainList.Node(this._prev,elem);
	},
	push: function(elem) {
		this._list.insertArray(arguments);
		return this._list._count;
	},
	unshift: function() {
		this.firstPos().insertArray(arguments);
		return this._list._count;
	},
	insertArray: function(elems) {
		var n=this;
		for(var i=0; i<elems.length; i++) {
			n=n.insert(elems[i])._next;
		}
	},
	splice: function(index,cutCount,elemToInsert1) {
		var n=this.indexPos(index);
		var nn=n._next;
		var r=n.shiftSome(cutCount);
		nn.insertArray( Array.prototype.slice.call(arguments,2));
		return r;
	},

	//------ link functions -----

	indexLink: function(index) {
		var s = this;
		if (index<0) {
			while(++index<=0) s=s._prev;
		} else
			while(--index>=0) s=s._next;
		return s;
	},
	nextLink: function() { return this._next; },
	prevLink: function() { return this._prev; },
	countRange: function(end) { // counts the nunmber of successors
		var i = 0;
		for(var s=this._next;s!=end;s=s._next) 
			i++;
		return i;
	},

	//----- iterators -----

	forEachTill: function (end, func/*(elem,index,Node): retVal*/) {
		var index=0;
		for(var s=this.firstPos();s!=end;s=s._next) {
			var value=func.call(this,s._elem,index,s);
			if (value!==undefined)
				return value;
			index++;
		}
	},
	forEach: function (func/*(elem,index,Node): retVal*/) {
		return this.forEachTill(this._list, func);
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
		return this.forEachBackRange(this._list, func);
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
	extend: function(props) {
		for (var prop in props) {
            if (!this.hasOwnProperty(prop)) {
                this[prop] = props[prop];
            }
		}
	}
};
ChainList.Link.prototype.get = ChainList.Link.prototype.indexElem;

ChainList.Node = function(prev, elem/*optional*/) {
	ChainList.Link.call(this, prev);
	this._elem=elem||this;
};

ChainList.Node.prototype = Object.create (ChainList.Link.prototype);

ChainList.Node.prototype.extend({
	constructor: ChainList.Node,
	// ----- list functions -----
	remove: function() {
		return this.shiftSome(1).index(0);
	},
	list: function() {
		return this._list;
	},
	//----- node navigation functions -----
	node: function() { return this; },
	firstPos: function() { return this; },
	//----- elem functions -----
	elem: function() { return this._elem; },
	setElem: function(val) { this._elem = val; },
});

ChainList.prototype = Object.create (ChainList.Link.prototype);
ChainList.prototype.extend({
	constructor: ChainList,
	_isList: true,
	list: function() { return this; },
	setParent: function(val) {
		this._parent = val;
	},
	clear: ChainList.Link.prototype.truncate,
	truncate: function() {},
	count: function() { return this._length; },
	node: function() { return null; },
	firstPos: function() { return this._next; },
	elem: function() { return null; },
	insertAt: function(index,elem) { return this.indexLink(index+1).insert(elem); }, // 0:begin, length or -1=end
	removeAt: function(index) { return this.indexPos(index).remove(); }, // 0:first, -1=last
	_testInvariants:function() {
		var count=0;
		this.forEach(function(elem,index,node) {
			count++;
			assert(node._prev._next==node);
			assert(node._next._prev==node);
			assert(node._list==this);
			assert(node._isList==null);
		});
		assert_equal(count,this.count());
	},
	_initClone: function() { return new ChainList(); }
});
ChainList.fromArray = function(array,parent) {
	var ll = new ChainList(parent);
	ll.insertArray(array);
	return ll;
}

function ChainListSorted(parent,compareFunc) {
	ChainList.call(this,parent);
	this._compareFunc = compareFunc || (parent && parent.compareFunc) || ChainListSorted.defaultCompareFunc;
}

ChainListSorted.defaultCompareFunc = function(a,b) {
	return a-b;
};

ChainListSorted.prototype = Object.create (ChainList.prototype);
ChainListSorted.prototype.extend({
	constructor: ChainListSorted,
	insert: function(elem) {
		var node = this.forEach(function(e,index,node) {
			if (this._compareFunc(elem,e)<=0)
				return node;
		}) || this;
		return new ChainListSorted.Node(node._prev,elem);
	},
	insertAt: null, //disable
	unshift: null, //disable
	push: null, //disable
	_initClone: function() { return new ChainListSorted(null,this._compareFunc); }
});

ChainListSorted.fromArray = function(array,parent,compareFunc) {
	var ll = new ChainListSorted(parent,compareFunc);
	ll.insertArray(array);
	return ll;
};

ChainListSorted.Node = function(prev, elem) {
	ChainList.Node.call(this,prev,elem);
};

ChainListSorted.Node.prototype = Object.create (ChainList.Node.prototype);

ChainListSorted.Node.prototype.extend({
	constructor: ChainListSorted.Node,
	insert: function(elem) {
		return this._list.insert(elem);
	}
});