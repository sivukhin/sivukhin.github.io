/**
 * Created by umqra on 17.12.14.
 */

function getRandomDir()
{
    var x = Math.random();
    var y = Math.random() * 2 - 1;
    return new Point(x, y);
}

function getRandomDirections(p) {
    var result = [];
    var count = Math.random() * (maxCount[level] - minCount[level]) + minCount[level] | 0;

    for (var i = 0; i < count; i++) {
        var dir = getRandomDir();
        var dist = Math.random() * (maxDist[level] - minDist[level]) + minDist[level];
        var newPoint = p.add(dir.multiply(dist));
        var obj = new Node(newPoint.x, newPoint.y);
        if (randInt(0, 2) == 0)
        {
            var dieTime = +new Date() + randInt(5000, 10000);
            obj.dieTime = dieTime;
        }
        result.push({
            dest: obj,
            direction: dir
        });
        listObj.push(obj);
    }
    return result;
}
function Node(x, y)
{
    this.position = new Point(x, y);
    this.reached = false;
    this.grayValue = 1
    this.draw = function()
    {
        if (this.dieTime != undefined && this.dieTime - new Date() < 1300)
            this.grayValue += 0.5;
        drawNode(this, this.grayValue);
    };
    this.transform = function()
    {
        trasformNode(this);
    };
    this.setDestructTime = function(tme)
    {
        this.dieTime = tme;
    }
    this.isDie = function()
    {
        if (this.dieTime == undefined)
            return false;
        return (this.dieTime - new Date()) < 0;
    }
    this.kill = function () {}
}

function drawNode(node, k) {
    if (k == undefined)
        k = 1;
    drawCircle(node.position, 7, getGray(255 / k | 0));
    drawCircle(node.position, 3, "rgb(" + (255 / k)  + ", 0, 0)");
    var dist = ship.shipPosition.subtract(node.position);
    if (dist.length() < 100)
    {
        if (node.childs == undefined)
            node.childs = getRandomDirections(node.position);
        var k = dist.length() / 100. * 40 | 0;
        for (var s = 0; s < node.childs.length; s++) {
            drawRay(node.position, node.childs[s].direction.norm(), 40 - k);
        }
    }
}

function trasformNode(node)
{
    var dist = node.position.subtract(ship.shipPosition);
    if (dist.length() < 10 && !node.reached)
    {
        node.reached = true;
        targets++;
        lastTarget = +(new Date());
    }
}