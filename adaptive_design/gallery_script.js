var gallery_images = [];
var selected_image = undefined;

$(function() {
    $(".gallery_image").click(function(e) {
        show_image($(e.target).attr('id'));
    }) 
    $("#view_scroll_left").click(function() { view_shift(-1); });
    $("#view_scroll_right").click(function() { view_shift(1); });
    $(".view_panel").click(function(e) {
        if (!$(e.target).is(".view_scroll"))
            hide_view_panel();
    });
    
    $(document).keydown(function(e) {
        process_keypress(e);
    });
    gallery_images = $(".gallery_image");
});

function process_keypress(e) {
    if (e.keyCode == 27) {
        //Pressed ESC key
        hide_view_panel();
    }
    if (e.keyCode == 37 && selected_image != undefined) {
        //Pressed Left arrow
        view_shift(-1);
    }
    if (e.keyCode == 39 && selected_image != undefined) {
        //Pressed Right arrow
        view_shift(1);
    }
}

function hide_view_panel() {
    selected_image = undefined;
    $(".view_panel").hide();
    $("body").css("overflow", "auto");
}

function get_image_source(image_id) {
    return './resources/image' + image_id + '.jpg';
}

function show_image(image_id) {
    image_id = parseInt(image_id);
    selected_image = image_id;
    $(".view_panel").show();
    
    $("#selected_image").hide();
    $("#loading").show();
    var loaded_image = $("<img>", {id: "selected_image"});
    loaded_image.load(function () {
        $("#selected_image").replaceWith(loaded_image).show();
        $('#loading').hide();
    });
    loaded_image.attr("src", get_image_source(image_id));
}

function view_shift(direction) {
    if (selected_image != undefined) {
        var next_id = (selected_image + direction + gallery_images.length) % gallery_images.length;
        show_image(next_id);
    }
}