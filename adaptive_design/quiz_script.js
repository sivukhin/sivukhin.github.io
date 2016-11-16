var hashes = [
  ["c398c51e4bbc9f73580d57ee96f820c9", "4d2054e41c5c8b69cce461eb46520ba8"],
  ["842b394af7ecf7453a47a9e829da4fc9", "7f6f9f4aa7a084e64c288b80867bffe1"],
  ["1ff61e91349d3f6623a81ccd3d881fa1"],
  ["2ec0dfce896fa30233359748248dddec", "226cb7f86386d6ccfb70f6ce8ebc6b99"],
  ["a59e8822cb657478b270e54682bacb99", "314ee13ad4db219cc07584f13a957f35"],
  ["1b36ea1c9b7a1c3ad668b8bb5df7963f"]
];

function track_press(e, id) {
    if (e.key == "Enter")
        guess(id);
}

function filterString(value) {
    var filtered = value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~() ]/g,"");
    return filtered.toLowerCase();
}

function guess(id) {
    var index = id.id.substring("quiz_".length) - 1;
    var filteredValue = filterString(id.value)
    var filteredHash = md5(filteredValue);
    var ok = false;
    hashes[index].forEach(function (item, i, arr) {
       if (item === filteredHash) 
           ok = true;
    });
    var targetImage = document.getElementById("quiz_image_" + (index + 1));
    if (ok)
    {
        targetImage.className = "green_border";
        var nextQuiz = targetImage.parentElement.nextElementSibling;
        if (nextQuiz.className.search("quiz_area") != -1)
            nextQuiz.style.display = "block";
    }
    else
        targetImage.className = "red_border";
}