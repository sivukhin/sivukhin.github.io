/**
 * Created by umqra on 13.12.14.
 */

var contextGame;

function getGray(value) {
    return "rgb(" + value + "," + value + "," + value + ")";
}

function drawCircle(p, r, color)
{
    contextGame.beginPath();
    contextGame.arc(p.x - worldCoord.x, p.y - worldCoord.y, r, 0, 2 * Math.PI, false);
    contextGame.fillStyle = color;
    contextGame.fill();
    contextGame.closePath();
}

function drawRing(p, r, w, color)
{
    contextGame.beginPath();
    contextGame.lineWidth = w;
    contextGame.strokeStyle = color;
    contextGame.arc(p.x - worldCoord.x, p.y - worldCoord.y, r, 0, 2 * Math.PI, false);
    contextGame.stroke();
    contextGame.closePath();
}

function drawRay(p, d, t) {
    var g = contextGame.createLinearGradient(p.x - worldCoord.x, p.y - worldCoord.y,
        p.x - worldCoord.x + d.multiply(100).x, p.y - worldCoord.y + d.multiply(100).y);
    g.addColorStop(0, "white");
    g.addColorStop(1, "black");

    var value = 255;
    var delta = 255 / t | 0;
    for (var i = 0; i < t; i++)
    {
        contextGame.beginPath();
        drawCircle(p, 1, getGray(value));
        value -= delta;
        p = p.add(d.multiply(5));
        contextGame.closePath();
    }
}

function drawText(p, s, color, font)
{
    if (color == undefined)
        color = "#FFF";
    if (font == undefined)
        font = "15pt Arial";
    contextGame.fillStyle = color;
    contextGame.font = font;
    contextGame.fillText(s, p.x, p.y);
}



var listObj = [];
var tempList = [];

function transformObjects()
{
    for (var i = 0; i < listObj.length; i++)
        listObj[i].transform();
}

function drawAllObjects() {
    var newLen = 0;
    tempList = [];
    for (var i = 0; i < listObj.length; i++) {

        listObj[i].draw();
        if (!listObj[i].isDie()) {
            listObj[newLen++] = listObj[i];
        }
        else
            listObj[i].kill();
    }
    listObj.length = newLen;
    listObj = listObj.concat(tempList);
}