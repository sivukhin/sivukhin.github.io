var selected_image = undefined;
document.addEventListener('click', function(e) {
    if (e.target.className == "gallery_image")
        preview_image(e.target);
    if (e.target.className == "view_panel")
        hide_view_panel();
});

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 27) {
        //Pressed ESC key
        hide_view_panel();
    }
    if (e.keyCode == 37 && selected_image != undefined) {
        //Pressed Left arrow
        view_shift_left();
    }
    if (e.keyCode == 39 && selected_image != undefined) {
        //Pressed Right arrow
        view_shift_right();
    }
})

                  

var shift_value = 200;
function shift_left() {
    var element = document.getElementsByClassName("images")[0];
    var width = element.offsetWidth;
    if (element.style.marginLeft == "")
        element.style.marginLeft = "0px";
    var value = element.style.marginLeft;
    var parsed_value = parseInt(value.substr(0, value.length - 2));
    var current_shift = Math.max(0, Math.min(shift_value, -parsed_value));
    element.style.marginLeft = (parseInt(value.substr(0, value.length - 2)) + current_shift) + "px";
}

function shift_right() {
    var element = document.getElementsByClassName("images")[0];
    var scroll_area = document.getElementById("scroll_area");
    var width = element.scrollWidth;
    var area_width = scroll_area.scrollWidth;
    if (element.style.marginLeft == "")
        element.style.marginLeft = "0px";
    var value = element.style.marginLeft;
    var parsed_value = parseInt(value.substr(0, value.length - 2));
    var current_shift = Math.max(0, Math.min(shift_value, width + parsed_value - area_width));
    element.style.marginLeft = (parseInt(value.substr(0, value.length - 2)) - current_shift) + "px";
}

function hide_view_panel() {
    selected_image = undefined;
    var view_panel = document.getElementsByClassName("view_panel")[0];
    view_panel.style.display = "none";  
    document.body.style.overflow = "auto";
}

function get_image_source(preview_im) {
    return preview_im.src.replace(/preview\/preview_/g, '');
}

function preview_image(im) {
    selected_image = im;
    var view_panel = document.getElementsByClassName("view_panel")[0];
    view_panel.style.display = "block";
    
    $("#selected_image").hide();
    $('#loading').show();
    var img = new Image();
    var src = get_image_source(im);
    img.onload = function () {
        $("#selected_image").attr('src', src);
        $("#selected_image").show();
        $('#loading').hide();
    }
    img.src = src;
}


var gallery_images = document.getElementsByClassName("gallery_image");

function get_image_id(im) {
    for (var i = 0; i < gallery_images.length; i++) {
        if (gallery_images[i] == selected_image)
            return i;
    }
    return undefined;
}

function view_shift_right() {
    var position = get_image_id(selected_image);
    if (position != undefined)
        preview_image(gallery_images[(position + 1) % gallery_images.length])
}

function view_shift_left() {
    var position = get_image_id(selected_image);
    if (position != undefined)
        preview_image(gallery_images[(position - 1 + gallery_images.length) % gallery_images.length])
}