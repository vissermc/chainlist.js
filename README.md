NavList.js
==========

Use this container type when the elements needs quick access to its siblings and/or its parent container or associated parent element.

It is implemented as a doubly linked list, therefore navigating n elements away takes O(n) time. Additionally, there is fast (O(1)) access to the parent list, the last element, and the element count.

Concrete elements can either inherit from NavList.Node or aggregate it (by passing itself as parameter, and adding the generated node as a property.
Similarly, a concrete container can either inherit from NavList or aggregate it.

NavList inherits from NavList.Node as well, being a node in the list itself. Some functions, such as 'pos', 'next', and 'prev' can reach this container node.

A lot of functions are both available from a node and a container.

Also available, a sorted variant of NavList called NavListSorted. It does not have a unshift, push, or insertAt function. Only insert and insertArray can be used to insert elements. They will be inserted at the correct sorted location according the comparison function supplied to the constructor.

List-only functions
-------------------
* LinkedList( parent )
* LinkedListSorted( parent, compareFunc )
* empty ()
* count ()
* clone ()
* insertAt ( index,elem )
* removeAt ( index )
* LinkedList.fromArray ( array,parent )

Node-only functions
-------------------
* LinkedList.Node ( prev, elem *optional* )
* list ()
* elem ()
* remove ()
* setElem ( val )

Common functions
-------------------
* parent ()
* setParent ( val )
* lastNode ()
* last ()
* takeRange ( start,end )
* take ( list )
* takeSome ( list,count )
* cloneRange ( end )
* cloneSome ( count )
* shiftRange ( end )
* shiftSome ( count )
* shift ()
* slice ( begin,end )
* splice ( index,cutCount,elemToInsert1 )
* pop ()
* insert ( elem )
* insertArray ( elems )
* unshift ()  
	inserts elem at the begin of the list
	return new length property.	
* push ( elem1, ..., elemN )  
	inserts elem at the end of the list
	return new length property.
* indexOfNode ( node )
* indexOf ( elem )
* lastIndexOf ( elem )
* indexNode ( n )  
	In case node is a list, it returns the n'th node, or if n is negative, returns (count - n)'th node.
	Else, it returns n'th successor or -n'th predecessor. This list itself is never returned, not does it wrap around.
* index ( n )  
	In case node is a list, it returns the n'th elem, or if n is negative, returns (count - n)'th elem.
	Else, it returns n'th successor or -n'th predecessor. 
	It will not wrap around.
* pos ( n )  
	returns n'th successor or -n'th predecessor node. This list itself is also node that might be returned. This function wraps around.
* next ()  
	returns the next elem, or the list if there is no next.
* prev ()  
	returns the previous elem, or the list if there is no previous.
* countRange ( end )
* isList ()
* reverse ()
* forEachRange ( end, func *( elem,index,Node ): retval* )
* forEach ( func *( elem,index,Node ): retval* )
* forEachBackRange ( end, func *( elem,index,Node ): retval* )
* forEachBack ( func *(elem,index,Node ): retval* )
* map ( func *( elem,index,Node ): retval* )
