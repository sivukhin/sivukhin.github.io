'use strict';

var click_counter = 0;
function logo_click() {
    var colors = ["#b7d84b", "#44accf", "#ee3e64", "gray"]
	click_counter += 1;
    if (click_counter >= 5) {
        var table = document.getElementById("logo").getElementsByTagName("table")[0];
        for (var changes = 0; changes < 10; changes++) {
            var x = Math.floor(Math.random() * 9);
            var y = Math.floor(Math.random() * 4);
            table.rows[Math.floor(x / 3)].cells[x % 3].style.backgroundColor = colors[y];
        }
    }
    if (click_counter > 10) {
        var jake = document.getElementById("jake");
        jake.style.display = click_counter % 10 <= 5 ? "block" : "";
    }
}