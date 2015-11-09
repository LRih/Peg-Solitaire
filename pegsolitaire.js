
//============================================================================= CONSTANTS
PegSolitaire.SQ_COUNT = 7;

PegSolitaire.INVALID = 0;
PegSolitaire.HOLE    = 1;
PegSolitaire.PEG     = 2;

//============================================================================= INITIALIZE
function PegSolitaire()
{
    var n = PegSolitaire.INVALID;
    var h = PegSolitaire.HOLE;
    var p = PegSolitaire.PEG;

    this.grid =
    [
        [n, n, p, p, p, n, n],
        [n, n, p, p, p, n, n],
        [p, p, p, p, p, p, p],
        [p, p, p, h, p, p, p],
        [p, p, p, p, p, p, p],
        [n, n, p, p, p, n, n],
        [n, n, p, p, p, n, n]
    ];
}

// ============================================================================ FUNCTIONS
PegSolitaire.prototype.move = function(start, end)
{
    if (this.canMove(start, end))
    {
        var jumpedPt = this.getJumpedPt(start, end);
        this.setType(start.x, start.y, PegSolitaire.HOLE);
        this.setType(jumpedPt.x, jumpedPt.y, PegSolitaire.HOLE);
        this.setType(end.x, end.y, PegSolitaire.PEG);
    }
}

PegSolitaire.prototype.canMove = function(start, end)
{
    if (!this.isInBounds(start.x, start.y) || !this.isInBounds(end.x, end.y))
        return false;

    if (this.getType(start.x, start.y) != PegSolitaire.PEG || this.getType(end.x, end.y) != PegSolitaire.HOLE)
        return false;

    if (!start.isSameRow(end, 2) && !start.isSameColumn(end, 2))
        return false;

    var jumpedPt = this.getJumpedPt(start, end);
    if (this.getType(jumpedPt.x, jumpedPt.y) != PegSolitaire.PEG)
        return false;

    return true;
}

PegSolitaire.prototype.getJumpedPt = function(start, end)
{
    var pt = new Point(start.x, start.y);

    if (start.isSameRow(end, 2))
    {
        if (start.y > end.y)
            pt.y = start.y - 1;
        else
            pt.y = start.y + 1;
    }
    else if (start.isSameColumn(end, 2))
    {
        if (start.x > end.x)
            pt.x = start.x - 1;
        else
            pt.x = start.x + 1;
    }

    return pt;
}

PegSolitaire.prototype.isInBounds = function(x, y)
{
    return x >= 0 && y >= 0 && x < PegSolitaire.SQ_COUNT && y < PegSolitaire.SQ_COUNT;
}

// ============================================================================ PROPERTIES
PegSolitaire.prototype.getType = function(x, y)
{
    return this.grid[y][x];
}
PegSolitaire.prototype.setType = function(x, y, piece)
{
    this.grid[y][x] = piece;
}

PegSolitaire.prototype.isGameOver = function()
{
    var dx = [-2, 2, 0, 0];
    var dy = [0, 0, -2, 2];

    var validMoves = 0;
    for (var y = 0; y < PegSolitaire.SQ_COUNT; y++)
    {
        for (var x = 0; x < PegSolitaire.SQ_COUNT; x++)
        {
            for (var i = 0; i < 4; i++)
                if (this.canMove(new Point(x, y), new Point(x + dx[i], y + dy[i]))) validMoves++;
        }
    }
    return validMoves == 0;
}

PegSolitaire.prototype.remainingPegs = function()
{
    var count = 0;
    for (var y = 0; y < PegSolitaire.SQ_COUNT; y++)
        for (var x = 0; x < PegSolitaire.SQ_COUNT; x++)
            if (this.getType(x, y) == PegSolitaire.PEG) count++;
    return count;
}
