/**
* Created by umqra on 12.12.14.
*/

function randInt(l, r)
{
    var x = Math.random();
    return (x * (r - l) + l) | 0;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.add = function (p) {
        return new Point(this.x + p.x, this.y + p.y);
    };
    this.subtract = function (p) {
        return new Point(this.x - p.x, this.y - p.y);
    };
    this.multiply = function (k) {
        return new Point(this.x * k, this.y * k);
    };
    this.divide = function (k) {
        return new Point(this.x / k, this.y / k);
    };
    this.dotProduct = function (p) {
        return this.x * p.x + this.y * p.y;
    };
    this.crossProduct = function (p) {
        return this.x * p.y - this.y * p.x;
    };
    this.length = function()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    this.rotate = function (alpha) {
        var sina = Math.sin(alpha);
        var cosa = Math.cos(alpha);
        return this._rotate(sina, cosa);
    };
    this._rotate = function(sina, cosa)
    {
        return new Point(this.x * cosa - this.y * sina, this.x * sina + this.y * cosa);
    }
    this.norm = function()
    {
        return new Point(x / this.length(), y / this.length());
    }
    this.toString = function () {
        return x + ", " + y;
    }
}

var width = 1000;
var height = 500;

var worldCoord = new Point(0, 0);

var level = 0;
var maxDist = [2000, 4000, 6000, 8000, 10000];
var minDist = [500, 800, 1000, 2000, 2000];
var minCount = [2, 2, 1, 0, 0];
var maxCount = [3, 3, 2, 2, 2];

var bornTime;
var targets = 0;
var shipTrace = [];
var traceTime = 0;
var lastTarget;


function onKeyDown(e) {
    if (e.keyCode == 37) // Right
        modificators.changeDirection = "Right"
    if (e.keyCode == 39) // Left
        modificators.changeDirection = "Left";
    if (e.keyCode == 38)
        modificators.changeSpeed = "Up";
    if (e.keyCode == 40)
        modificators.changeSpeed = "Down";
}

function onKeyUp(e) {

    if (e.keyCode == 37 && modificators.changeDirection == "Right") // Right
        modificators.changeDirection = "None"
    if (e.keyCode == 39 && modificators.changeDirection == "Left") // Left
        modificators.changeDirection = "None";
    if (e.keyCode == 38 && modificators.changeSpeed == "Up")
        modificators.changeSpeed = "None";
    if (e.keyCode == 40 && modificators.changeSpeed == "Down")
        modificators.changeSpeed = "None";
}

var gameTime;

function loadGame()
{
    bornTime = new Date();
    gameTime = new Date();
    contextGame = document.getElementById("canvasGame").getContext("2d");
    contextGame.shadowBlur = 4;
    ship.shipRadius = 4;
    listObj.push(ship);
    listObj.push(new Node(600, 300));
    var ageText = new Text(new Point(20, 30), "Age: 0");
    ageText.transform = function()
    {
        this.smoothAppear();
        this.text = "Age: " + getAge(new Date() - bornTime);
    };

    var targetsText = new Text(new Point(890, 30), "Targets: 0");
    targetsText.transform = function ()
    {
        this.smoothAppear();
        this.text = "Targets: " + targets;
    };

    listObj.push(ageText);
    listObj.push(targetsText);
    putMyStory(startText);
    generateScores();
    lastTarget = +(new Date());
    draw();
}

function getAge(time)
{
    return time / 3000 | 0;
}

function isDie()
{
    if (getAge(+new Date() - bornTime) > 60) {
        var r = randInt(0, 1000 * targets / (getAge(+new Date() - bornTime) - 60));
        //console.log(r);
        return r == 0;
    }
    return false;
}

function draw()
{
    level = Math.min(4, getAge() / 20 | 0);
    setTimeout(requestAnimationFrame(draw), 1000 / 24);
    changeDirection();
    transformObjects();

    contextGame.clearRect(0, 0, 1000, 500);
    drawAllObjects();
    generateItems();

    if (isDie() && ship.dieTime == undefined)
    {
        if (putMyStory(endText))
            ship.dieTime = +new Date() + endText.length * 5000;
    }
}