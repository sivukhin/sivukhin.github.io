/**
 * Created by umqra on 17.12.14.
 */

function Item(p, color)
{
    this.position = p;
    this.color = color;
    this.grayValue = 10;
    this.type = randInt(-2, 10);
    this.radius = 4;
    this.draw = function()
    {
        var r, g, b;
        var re = /(\d*), (\d*), (\d*)/g.exec(this.color);
        r = re[1], g = re[2], b = re[3];
        r = r / this.grayValue | 0;
        g = g / this.grayValue | 0;
        b = b / this.grayValue | 0;

        drawCircle(this.position, this.radius, "rgb(" + r + "," + g + "," + b + ")");
    }
    this.transform = function()
    {
        var delta = this.dieTime - new Date();
        if (this.dieTime != undefined && delta < 2000)
            this.grayValue += 0.2;

        else if (this.grayValue > 1)
            this.grayValue -= 0.5;

        var dir = this.position.subtract(ship.shipPosition);

        dir = dir.norm().multiply(0.1);

        if (this.type == -1)
            this.position = this.position.add(dir);
        if (this.type == 1)
            this.position = this.position.subtract(dir);
    }
    this.kill = function()
    {
        var dir = this.position.subtract(ship.shipPosition);
        if (dir.length() < 7) {
            totalScore++;
            var index = colors.indexOf(this.color);
            colorsScore[index]++;
        }
        itemsCount--;
    }
    this.isDie = function()
    {
        var dir = this.position.subtract(ship.shipPosition);
        if (dir.length() < 7) {
            return true;
        }
        if (this.dieTime == undefined)
            return false;
        return (this.dieTime - new Date()) < 0;
    }
}

var colors = ["255, 182, 193", "173, 216, 230", "144, 238, 144"];
var colorsScore = [1, 1, 1];
var scoreObj = [];
var totalScore = 3;
var itemsCount = 0;

function generateScores()
{
    var pos = new Point(500, 480);
    for (var i = 0; i < colors.length; i++)
    {
        var obj = new Item(pos, colors[i]);
        obj.radius = 10;
        obj.type = 0;
        obj.absolute = pos;
        obj.transform = function()
        {
            if (this.grayValue > 2)
                this.grayValue -= 0.5;
            this.position = this.absolute.add(worldCoord);
            this.radius = colorsScore[colors.indexOf(this.color)] / totalScore * 30 | 0;
        }
        scoreObj.push(obj);
        listObj.push(obj);
        pos = pos.add(new Point(40, 0));
    }
}

function generateItem()
{
    var x = randInt(-width, 2 * width);
    var y = randInt(-height, 2 * height);
    var c = randInt(0, colors.length);
    var dieTime = +(new Date()) + randInt(5000, 20000);
    var obj = new Item((new Point(x, y)).add(worldCoord), colors[c]);
    obj.dieTime = dieTime;
    itemsCount++;
    return obj;
}

function generateItems()
{
    var k = ((new Date() - lastTarget) / 2000 | 0) + 1;
    var x = randInt(0, itemsCount * k);
    if (x == 0)
    {
        listObj.push(generateItem());
    }

}