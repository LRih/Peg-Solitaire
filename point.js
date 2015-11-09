
//============================================================================= INITIALIZE
function Point(x, y)
{
    this.x = x;
    this.y = y;
}

// ============================================================================ FUNCTIONS
Point.prototype.equals = function(x, y)
{
    return this.x == x && this.y == y;
};

Point.prototype.isSameRow = function(pt, separation)
{
    return this.x == pt.x && Math.abs(this.y - pt.y) == separation;
};

Point.prototype.isSameColumn = function(pt, separation)
{
    return this.y == pt.y && Math.abs(this.x - pt.x) == separation;
};
