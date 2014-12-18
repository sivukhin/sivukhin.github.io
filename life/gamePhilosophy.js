/**
 * Created by umqra on 17.12.14.
 */

function createStoryMessage(text)
{
    var text = new Text(new Point(450 - text.length * 4, 50), text);

    text.transform = function () {
        this.smoothAppear();
        if (this.dieTime == undefined) {
            this.dieTime = +new Date() + 5000;
        }
    }
    text.font = "20pt Times New Roman";
    return text;
}

var startText = [
    "This is a game...",
    "...about life.",
    "As in real life...",
    "I will not say",
    "What you must do",
    "And what is the meaning",
    "You must understand all...",
    "...by yourself",
    "No one can help you.",
    "And despite the darkness around you...",
    "...you should try go to the light",
    "",
    "",
    "",
    "Time goes by...",
    "Life becomes more complicated",
    "Every day you must fight...",
    "...fight for your future.",
    "",
    "",
    "Maybe one day",
    "Sitting in an empty room,",
    "you realize",
    "That your life...",
    "...is boring and sameness.",
    "",
    "After that...",
    "Try to change it.",
    "And i hope that soon",
    "Your life will be interesting and various",
    "Because...",
    "...all in your hands"
];


var endText = [
    "But one day...",
    "You will die."
];

var thisIsTheEnd = true;

function putMyStory(strings)
{
    if (!thisIsTheEnd)
        return false;
    var prev = undefined;
    for (var i = 0; i < strings.length; i++)
    {
        var cur = createStoryMessage(strings[i]);
        if (prev != undefined) {
            prev.nextText = cur;
            prev.kill = function () {
                tempList.push(this.nextText);
            };
        }
        else
            listObj.push(cur);
        prev = cur;
    }
    thisIsTheEnd = false;
    prev.kill = function()
    {
        thisIsTheEnd = true;
    }
    return true;
}