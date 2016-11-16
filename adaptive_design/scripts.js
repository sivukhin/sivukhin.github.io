'use strict';

var click_counter = 0;
var colors = ["#b7d84b", "#44accf", "#ee3e64", "gray"]
function logo_click() {
	click_counter += 1;
    if (click_counter >= 5) {
        var table = $("#logo table td");
        for (var changes = 0; changes < 10; changes++) {
            var cellId = Math.floor(Math.random() * 9);
            var colorId = Math.floor(Math.random() * 4);
            table.eq(cellId).css("background-color", colors[colorId]);
        }
        
        if (click_counter % 10 < 5)
            $("#jake").show();
        else
            $("#jake").hide();
    }
}

function logo_init() {
    var logo_image = $("<img>", {src:"images/jake.png", id:"jake"}).hide();
    var logo_square = $("<table>");
    for (var i = 0; i < 3; i++) {
        var square_row = $("<tr>");
        for (var s = 0; s < 3; s++) {
            var square_cell = $("<td>", {id: 3 * i + s + 1});
            square_row.append(square_cell);
        }
        logo_square.append(square_row);
    }
    $("#logo").append(logo_image);
    $("#logo").append(logo_square);
}

$(function() {
    $("#logo").ready(logo_init);
    $("#logo").click(logo_click);   
});