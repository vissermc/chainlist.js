ChainList.js
==========

Use this container type when the elements needs quick access to its siblings and/or its parent container or associated parent element. Hence, its navigability is the very similar to the DOM.

It is implemented as a doubly linked list, therefore navigating n elements away takes O(n) time. Additionally, there is fast (O(1)) access to the parent list, the last element, and the element count.

Both the list (ChainList) and its nodes (ChainList.Node) inherit from ChainList.Link. 
Concrete elements can either inherit from ChainList.Node or aggregate it by passing itself as parameter (see dashed 'elem' in diagram).
Similarly, a concrete container can either inherit from ChainList or aggregate it (see dashed 'parent' in diagram).
Some functions, such as 'indexLink', 'nextLink', and 'prevLink', traverse over all links.
A lot of functions are both available from a node and a container.

![uml.png]

Also available, a sorted variant of ChainList called ChainListSorted. It does not have a unshift, push, or insertAt function. Only insert and insertArray can be used to insert elements. They will be inserted at the correct sorted location according the comparison function supplied to the constructor.

Example
-------
<pre>
var list = ChainList.fromArray([6,3,7,8])
list.get(2) == 7
var thirdNode = list.index(2)  
thirdNode.elem()== 7  
thirdNode.next().elem()==8  
thirdNode.list() == list  
</pre>
<pre>
var list2 = new ChainList();  
var elemX = {};
elemX.node = list2.insertAt(0,elemX); // also store a reference to the node from within the elem object.  
...  
elemX.node.next().elem() // travel from the item to an adjacent item
</pre>

List-only functions
-------------------
* <code>ChainList( parent )</code>  
  Constructor, where a parent aggregator can be supplied which can be accessed using 'list.parent()'.
* <code>ChainListSorted( parent, compareFunc )</code>  
  Constructor for a sorted ChainList, where the compareFunc(a,b) will determine where the element will be placed: before the first element b where the function returns a positive number.
* <code>empty ()</code>  
  Removes all elements from the list.
* <code>count ()</code>
  Returns the amount of elements in the list (in constant time).
* <code>clone ()</code>  
  Returns a copy of the list.
* <code>insertAt ( index,elem )</code>  
  Inserts at index 'index', starting from zero, the element in this list and returns the created node. Negative indices will insert backwards, where -1 will append the item.
* <code>removeAt ( index )</code>
* <code>ChainList.fromArray ( array,parent )</code>

Node-only functions
-------------------
* <code>ChainList.Node ( prev, elem *optional* )</code>
* <code>list ()</code>
* <code>elem ()</code>
* <code>remove ()</code>
* <code>setElem ( val )</code>

Common functions
-------------------
* <code>parent ()</code>
* <code>setParent ( val )</code>
* <code>last ()</code>
* <code>takeRange ( start,end )</code>
* <code>take ( list )</code>
* <code>takeSome ( list,count )</code>
* <code>cloneRange ( end )</code>
* <code>cloneSome ( count )</code>
* <code>shiftRange ( end )</code>
* <code>shiftSome ( count )</code>
* <code>shift ()</code>
* <code>slice ( begin,end )</code>
* <code>splice ( index,cutCount,elemToInsert1 )</code>
* <code>pop ()</code>
* <code>insert ( elem )</code>
* <code>insertArray ( elems )</code>
* <code>unshift ()</code>  
	inserts elem at the begin of the list
	return new length property.	
* <code>push ( elem1, ..., elemN )</code>  
	inserts elem at the end of the list
	return new length property.
* <code>indexOf ( node )</code>
* <code>indexOfElem ( elem )</code>
* <code>lastIndexOfElem ( elem )</code>
* <code>index ( n )</code>  
	In case link is a list, it returns the n'th node, or if n is negative, returns (count - n)'th node.
	Else, it returns n'th successor or -n'th predecessor. This list itself is never returned, not does it wrap around.
* <code>get ( n )</code>  
	In case link is a list, it returns the n'th elem, or if n is negative, returns (count - n)'th elem.
	Else, it returns n'th successor or -n'th predecessor. 
	It will not wrap around.
* <code>indexLink ( n )</code>  
	returns n'th successor or -n'th predecessor node. This list itself is also link that might be returned. This function wraps around.
* <code>nextLink ()</code>  
	returns the next link, i.e. either a node or the container.
* <code>prevLink ()</code>  
	returns the previous link, i.e. either a node or the container.
* <code>next ()</code>  
	returns the next node, or null if it was the last.
* <code>prev ()</code>  
	returns the previous link, or null if it was the first.
* <code>countRange ( end )</code>
* <code>isList ()</code>
* <code>reverse ()</code>
* <code>forEachRange ( end, func *( elem,index,Node ): retval* )</code>
* <code>forEach ( func *( elem,index,Node ): retval* )</code>
* <code>forEachBackRange ( end, func *( elem,index,Node ): retval* )</code>
* <code>forEachBack ( func *(elem,index,Node ): retval* )</code>
* <code>map ( func *( elem,index,Node ): retval* )</code>
