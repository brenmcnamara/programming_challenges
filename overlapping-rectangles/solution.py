
class Rectangle:
    def __init__(self, startX, startY, width, height):
        self.startX = startY
        self.startY = startY
        self.width = width
        self.height = height

# Different cases:
#   - One rectangle is entirely inside the other
#   - Rectangles are not overlapping
#   - Rectangles are partially overlapping,
#   - Rectangles are identical
#   - Rectangles are touching at a single corner: consider this as not overlapping
#   - Rectangles are touching at a single edge: consider this is not overlapping
def is_overlapping(rec1, rec2):
    """Check to see if the two rectangles are overlapping

    Args:
    - rec1: The first rectangle
    - rec2: The second rectangle

    Returns:
    True if the rectangles are overlapping, false otherwise.
    """
    minX1 = rect1.startX
    maxX1 = rect1.startX + rect1.width

    minY1 = rect1.startY
    maxY1 = rect1.startY + rect1.height

    minX2 = rect2.startX
    maxX2 = rect2.startX + rect2.width

    minY2 = rect2.startY
    maxY2 = rect2.startY + rect2.height

    # TODO: Implement me!
    isXOverlapping = False
    isYOverlapping = False

    return isXOverlapping and isYOverlapping



