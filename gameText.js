/**
 * Created by umqra on 17.12.14.
 */

function Text(p, str, t)
{
    this.position = p;
    this.text = str;
    this.grayValue = 0;
    this.smoothAppear = function()
    {
        var delta = this.dieTime - new Date();

        if (this.dieTime != undefined && delta < 1300 && this.grayValue > 0)
            this.grayValue -= 6;
        else if (this.grayValue < 255) {
            this.grayValue += 4;
        }
    }
    this.setDestructTime = function(tme)
    {
        this.dieTime = tme;
    }
    this.isDie = function()
    {
        if (this.dieTime == undefined)
            return false;
        var delta = (this.dieTime - new Date());
        return delta < 0;
    }
    if (t != undefined)
        this.kill = t;
    else
        this.kill = function(){}
    this.draw = function()
    {
        drawText(this.position, this.text, getGray(this.grayValue), this.font);
    }
}