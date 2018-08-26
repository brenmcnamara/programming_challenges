
def find_middle(list):
    """Find the middle element of a linked list

    Args:
    - list: A linked list. Assuming this is a valid linked list, and not nil

    Returns:
    The middle element of the linked list.
    """
    ptr1 = list
    ptr2 = list['next'];

    while ptr2:
        ptr1 = ptr1['next']
        assert ptr1, 'Expecting ptr1 to not be nil'

        ptr2 = ptr2['next']
        ptr2 = ptr2['next'] if ptr2 else ptr2

    return ptr1

if __name__ == '__main__':
    print("--- TESTING SOLUTION ---")

    nodeA = {'value': 'A', 'next': None}
    nodeB = {'value': 'B', 'next': None}
    nodeC = {'value': 'C', 'next': None}
    nodeD = {'value': 'D', 'next': None}
    nodeE = {'value': 'E', 'next': None}

    nodeA['next'] = nodeB
    nodeB['next'] = nodeC
    nodeC['next'] = nodeD
    nodeD['next'] = nodeE

    test1_result = find_middle(nodeA)
    assert test1_result is nodeC, "Test 1 Failed"
    print("Test 1 passed")

    test2_result = find_middle(nodeE)
    assert test2_result is nodeE, "Test 2 Failed"
    print("Test 2 passed")

    test3_result = find_middle(nodeD)
    assert test3_result is nodeD or test3_result is nodeE, "Test 3 Failed"
    print("Test 3 passed")
    

    
