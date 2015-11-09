
//============================================================================= CONSTANTS
var COL_BOARD_0 = "#FFFFFF";
var COL_BOARD_1 = "#C4A06C";
var COL_BOARD_2 = "#AD854C";

//============================================================================= VARIABLES
var _imgPeg;
var _imgShadow;

var _canvas;
var _context;

var _game;

var _dragInfo;

//============================================================================= INITIALIZE
$(function()
{
    $("#game").on('dragstart', function() { return false })
              .bind('contextmenu', function() { return false });

    $("#newgame").click(function() { startNewGame(); });

    _imgPeg = new Image();
    _imgPeg.src = "images/peg.png";
    _imgShadow = new Image();
    _imgShadow.src = "images/shadow.png";

    _canvas = document.getElementById("game");
    _context = _canvas.getContext("2d");
    startNewGame();

    _canvas.onmousedown = onMouseDown;
    _canvas.onmousemove = onMouseMove;
    document.onmouseup = _canvas.onmouseup = onMouseUp;
});

//============================================================================= FUNCTIONS
function startNewGame()
{
    _game = new PegSolitaire();
    _dragInfo = DragInfo.createInvalid();
    $("#status").html((_game.isGameOver() ? "Game Over: " : "Remaining pegs: ") + _game.remainingPegs());
    draw();
}

function draw()
{
    drawBoard();
    drawPegs(); 
}

function drawBoard()
{
    _context.fillStyle = COL_BOARD_0;
    _context.fillRect(0, 0, _canvas.width, _canvas.height);

    var sqWidth = squareWidth();
    var sqHeight = squareHeight();
    for (var y = 0; y < PegSolitaire.SQ_COUNT; y++)
    {
        for (var x = 0; x < PegSolitaire.SQ_COUNT; x++)
        {
            if (_game.getType(x, y) != PegSolitaire.INVALID)
            {
                 _context.fillStyle = ((x + y) % 2 == 0 ? COL_BOARD_1 : COL_BOARD_2);
                _context.fillRect(x * sqWidth, y * sqHeight, sqWidth, sqHeight);
            }
        }
        
    }
}

function drawPegs()
{
    for (var y = 0; y < PegSolitaire.SQ_COUNT; y++)
    {
        for (var x = 0; x < PegSolitaire.SQ_COUNT; x++)
        {
            if (_dragInfo.isValid() && _dragInfo.startCoord.equals(x, y))
                continue;

            if (_game.getType(x, y) == PegSolitaire.PEG)
                drawPeg(x * squareWidth(), y * squareHeight(), true);
        }
    }
}

function drawPeg(x, y, isShadow)
{
    if (isShadow) _context.drawImage(_imgShadow, x, y, squareWidth(), squareHeight());
    _context.drawImage(_imgPeg, x, y, squareWidth(), squareHeight());
}

function posToCoord(pos)
{
    return Math.floor(pos / 60);
}

function clientPosToCanvasPos(x, y)
{
    var pos = [];
    pos[0] = x + document.body.scrollLeft + document.documentElement.scrollLeft - _canvas.offsetLeft;
    pos[1] = y + document.body.scrollTop + document.documentElement.scrollTop - _canvas.offsetTop;
    return pos;
}

//============================================================================= PROPERTIES
function squareWidth()
{
    return _canvas.width / PegSolitaire.SQ_COUNT;
}
function squareHeight()
{
    return _canvas.height / PegSolitaire.SQ_COUNT;
}

//============================================================================= EVENTS
function onMouseDown(e)
{
    if (e.which == 1)
    {
        var pos = clientPosToCanvasPos(e.clientX, e.clientY);
        var cx = posToCoord(pos[0]);
        var cy = posToCoord(pos[1]);

        if (_game.getType(cx, cy) == PegSolitaire.PEG)
        {
            _dragInfo = new DragInfo(new Point(cx, cy), new Point(squareWidth() / 2, squareHeight() / 2));
            draw();
            drawPeg(pos[0] - _dragInfo.offsetPos.x, pos[1] - _dragInfo.offsetPos.y, false);
        }
    }
}

function onMouseMove(e)
{
    if (_dragInfo.isValid())
    {
        var pos = clientPosToCanvasPos(e.clientX, e.clientY);
        draw();
        drawPeg(pos[0] - _dragInfo.offsetPos.x, pos[1] - _dragInfo.offsetPos.y, false);
    }
}

function onMouseUp(e)
{
    if (_dragInfo.isValid())
    {
        var pos = clientPosToCanvasPos(e.clientX, e.clientY);
        var cx = posToCoord(pos[0]);
        var cy = posToCoord(pos[1]);

        _game.move(_dragInfo.startCoord, new Point(cx, cy));
        _dragInfo = DragInfo.createInvalid();

        draw();

        $("#status").html((_game.isGameOver() ? "Game Over: " : "Remaining pegs: ") + _game.remainingPegs());
    }
}


//============================================================================= CLASSES
function DragInfo(startCoord, offsetPos)
{
    this.startCoord = startCoord;
    this.offsetPos = offsetPos;
}

DragInfo.createInvalid = function()
{
    return new DragInfo(new Point(-1, -1), new Point(-1, -1));
}

DragInfo.prototype.isValid = function()
{
    return this.startCoord.x != -1 && this.startCoord.y != -1;
};
