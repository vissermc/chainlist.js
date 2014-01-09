NavList.js
==========

Use this container type when the elements needs quick access to its siblings and/or its parent container or associated parent element. Hence, its navigability is the very similar to the DOM.

It is implemented as a doubly linked list, therefore navigating n elements away takes O(n) time. Additionally, there is fast (O(1)) access to the parent list, the last element, and the element count.

Concrete elements can either inherit from NavList.Node or aggregate it (by passing itself as parameter, and adding the generated node as a property.
Similarly, a concrete container can either inherit from NavList or aggregate it.

NavList inherits from NavList.Node as well, being a node in the list itself. Some functions, such as 'pos', 'next', and 'prev' can reach this container node.

A lot of functions are both available from a node and a container.

Also available, a sorted variant of NavList called NavListSorted. It does not have a unshift, push, or insertAt function. Only insert and insertArray can be used to insert elements. They will be inserted at the correct sorted location according the comparison function supplied to the constructor.

Example
-------
<pre>
var list = LinkedList.fromArray([6,3,7,8])
var thirdNode = list.indexNode(2)  
thirdNode.item()==7  
thirdNode.next().item()==8  
thirdNode.list() == list  
</pre>
<pre>
var list2 = new LinkedList();  
var elemX = {}  
elemX.node = list2.insertAt(0,elemX); // also store a reference to the node from within the elem object.  
...  
elemX.node.next().item() // travel from the item to an adjacent item
</pre>

List-only functions
-------------------
* <code>LinkedList( parent )</code>  
  Constructor, where a parent aggregator can be supplied which can be accessed using 'list.parent()'.
* <code>LinkedListSorted( parent, compareFunc )</code>  
  Constructor for a sorted LinkedList, where the compareFunc(a,b) will determine where the element will be placed: before the first element b where the function returns a positive number.
* <code>empty ()</code>  
  Removes all elements from the list.
* <code>count ()</code>
  Returns the amount of elements in the list (in constant time).
* <code>clone ()</code>  
  Returns a copy of the list.
* <code>insertAt ( index,elem )</code>  
  Inserts at index 'index', starting from zero, the element in this list and returns the created node. Negative indices will insert backwards, where -1 will append the item.
* <code>removeAt ( index )</code>
* <code>LinkedList.fromArray ( array,parent )</code>

Node-only functions
-------------------
* <code>LinkedList.Node ( prev, elem *optional* )</code>
* <code>list ()</code>
* <code>elem ()</code>
* <code>remove ()</code>
* <code>setElem ( val )</code>

Common functions
-------------------
* <code>parent ()</code>
* <code>setParent ( val )</code>
* <code>lastNode ()</code>
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
* <code>indexOfNode ( node )</code>
* <code>indexOf ( elem )</code>
* <code>lastIndexOf ( elem )</code>
* <code>indexNode ( n )</code>  
	In case node is a list, it returns the n'th node, or if n is negative, returns (count - n)'th node.
	Else, it returns n'th successor or -n'th predecessor. This list itself is never returned, not does it wrap around.
* <code>index ( n )</code>  
	In case node is a list, it returns the n'th elem, or if n is negative, returns (count - n)'th elem.
	Else, it returns n'th successor or -n'th predecessor. 
	It will not wrap around.
* <code>pos ( n )</code>  
	returns n'th successor or -n'th predecessor node. This list itself is also node that might be returned. This function wraps around.
* <code>next ()</code>  
	returns the next node, or the list if there is no next.
* <code>prev ()</code>  
	returns the previous node, or the list if there is no previous.
* <code>countRange ( end )</code>
* <code>isList ()</code>
* <code>reverse ()</code>
* <code>forEachRange ( end, func *( elem,index,Node ): retval* )</code>
* <code>forEach ( func *( elem,index,Node ): retval* )</code>
* <code>forEachBackRange ( end, func *( elem,index,Node ): retval* )</code>
* <code>forEachBack ( func *(elem,index,Node ): retval* )</code>
* <code>map ( func *( elem,index,Node ): retval* )</code>
