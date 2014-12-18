/**
 * Created by umqra on 13.12.14.
 */



var angleRotation = Math.PI / 100;
var angleSin = Math.sin(angleRotation);
var angleCos = Math.cos(angleRotation);

var modificators = {};
var ship = {
    shipPosition: new Point(400, 300),
    shipRadius: 100,
    deltaRadius: 0.04,
    moveDirection: new Point(0.2, 0),
    setDestructTime: function (tme) {
        this.dieTime = tme;
    },
    isDie: function () {
        if (this.dieTime == undefined)
            return false;
        return (this.dieTime - new Date()) < 0;
    },
    draw: function () {
        drawShip();
    },
    transform: function () {
        transformShip();
    },
    outOfCamera: function () {
        var p = ship.shipPosition.subtract(worldCoord);
        return (p.x < 400 || p.x > 1000 - 400 || p.y < 200 || p.y > 500 - 200);
    },
    kill: function () {
    }
}

function blinkShip()
{
    ship.shipRadius += ship.deltaRadius;
    if (ship.shipRadius < 4 || ship.shipRadius > 5)
        ship.deltaRadius *= -1;
}

function drawTrace() {
    var radius = 1;
    var value = 20;
    var step = 1;
    var deltaValue = (255 - value) / (shipTrace.length / step);
    var deltaRadius = (2.3 - radius) / (shipTrace.length / step);
    for (var i = 0; i < shipTrace.length; i += step) {
        drawCircle(shipTrace[i], radius, getGray(value | 0));
        //drawCircle(shipTrace[i], radius, getGray(value | 0));
        value += deltaValue;
        radius += deltaRadius;

    }
}

function drawShip() {

    drawCircle(ship.shipPosition, ship.shipRadius, "white");
    drawTrace();
}


function transformShip() {
    var newTime = new Date();
    var delta = newTime - gameTime;
    ship.shipPosition = ship.shipPosition.add(ship.moveDirection.multiply(delta / 10));


    if (ship.outOfCamera()) {
        worldCoord = worldCoord.add(ship.moveDirection.multiply(delta / 10));
    }
    if (traceTime == 0 || new Date() - traceTime > 200) {
        traceTime = new Date();
        shipTrace.push(ship.shipPosition);
    }
    if (shipTrace.length > 20)
        shipTrace.shift();

    blinkShip();
    gameTime = newTime;
}

function changeDirection() {
    if (clickPosition != undefined)
    {
        var dir = clickPosition.subtract(ship.shipPosition);
        if (ship.moveDirection.crossProduct(dir) < 0)
            modificators.changeDirection = "Right";
        else
            modificators.changeDirection = "Left";
        if (dir.length() > 100)
            modificators.changeSpeed = "Up";
        else {
            if (Math.abs(ship.moveDirection.crossProduct(dir)) < 0.1) {
                modificators.changeDirection = "None";
                modificators.changeSpeed = "None";
                clickPosition = undefined;
            }
            else
                modificators.changeSpeed = "Down";
        }
    }
    if (modificators.changeDirection == "Left")
        ship.moveDirection = ship.moveDirection._rotate(angleSin, angleCos);
    if (modificators.changeDirection == "Right")
        ship.moveDirection = ship.moveDirection._rotate(-angleSin, angleCos);
    if (modificators.changeSpeed == "Up" && ship.moveDirection.length() < 1)
        ship.moveDirection = ship.moveDirection.multiply(1.01);
    if (modificators.changeSpeed == "Down" && ship.moveDirection.length() > 0.2)
        ship.moveDirection = ship.moveDirection.multiply(0.99);
}