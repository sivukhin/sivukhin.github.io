var hashes = [
  ["c398c51e4bbc9f73580d57ee96f820c9", "4d2054e41c5c8b69cce461eb46520ba8"],
  ["842b394af7ecf7453a47a9e829da4fc9", "7f6f9f4aa7a084e64c288b80867bffe1"],
  ["1ff61e91349d3f6623a81ccd3d881fa1"],
  ["2ec0dfce896fa30233359748248dddec", "226cb7f86386d6ccfb70f6ce8ebc6b99"],
  ["a59e8822cb657478b270e54682bacb99", "314ee13ad4db219cc07584f13a957f35"],
  ["1b36ea1c9b7a1c3ad668b8bb5df7963f"]
];

var quizes = undefined;
$(function() {
    $(".guess_button").click(guess); 
    $(".guess_input").keydown(function(e) {
        if (e.key == "Enter")
            guess(e);
    })
    quizes = $(".quiz_area");
});

function filterString(value) {
    var filtered = value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~() ]/g,"");
    return filtered.toLowerCase();
}

function guess(e) {
    var parent = $(e.target).parent();
    var index = quizes.index(parent);
    var filteredHash = md5(filterString(parent.find(".guess_input").val()));
    var matched = hashes[index].includes(filteredHash);
    if (matched) {
        parent.find(".quiz_image").removeClass("red_border");
        parent.find(".quiz_image").addClass("green_border");
        var next = parent.next();
        if (next.is(".quiz_area"))
            next.show();
    }
    else {
        parent.find(".quiz_image").removeClass("green_border");
        parent.find(".quiz_image").addClass("red_border");
    }
}