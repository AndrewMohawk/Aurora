currentAjaxRequest = null; // Stores our current ajax request so we can cancel it if we do another

function togglePower()
{
    make_AJAX_Call("/toggleEnable",[],function() {
        $('#powerToggle').toggleClass("color-theme")
    })
}

function make_AJAX_Call(url, data_dict, callback_function = false) {

    return_result = false;
    async_state = false
    if (callback_function) {
        async_state = true
    }

    currentAjaxRequest = $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(data_dict),
        contentType: 'application/json',
        dataType: 'json',
        async: async_state, //we wait for these!
        success: function (data) {
            if (data["status"] == "error") {
                create_snackbar("Aurora Error", data["error"], "error")
            }
            if (callback_function) {
                callback_function(data)
            }

            return_result = data
        },
        error: function (data) {
            console.log("Error with AJAX reqest to " + url + " with ASync set to " + async_state + " returned the following:");
            console.log(data);
            return_result = data
        },
        beforeSend: function () {
            if (currentAjaxRequest != null) {
                currentAjaxRequest.abort();
            }
        },
    });
    //console.log("returning " + return_result["status"])
    return return_result

}

function create_snackbar(heading, message, type) {
    col = "bg-highlight"
    if (type == "success") {
        col = "bg-green-dark"
    }
    else if (type == "error") {
        col = "bg-red-dark"
    }

    snackDivUniqueID = "aurora_snackbar"
    snackDiv = $('<div id="' + snackDivUniqueID + '" class="snackbar-toast ' + col + ' bg-green-dark" data-delay="6000" data-autohide="true"><button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button><h1 class="color-white font-20 pt-3 pb-3 mb-n4">' + heading + '</h1> <p class="color-white mb-0 pb-1">' + message + '</p></div>')

    $('#' + snackDivUniqueID).remove(); // if the prev one exists lets get rid of it

    $('body').prepend(snackDiv);
    $('#' + snackDivUniqueID).toast('show');
    return "okay done"
}


//These arent that 'generic', but its used on multiple pages so its going here.

function showExtensionDetails(name) {
    if ($('#extension_details').is(':visible') == false) {
        $('#extension_details').slideDown();
    }
    //The 'extensions' dict is loaded onto pages that have it
    //TODO: this is hacky and should be properly loaded in
    extDetails = extensions[name]

    $('#ext_description').text(extDetails.Description)
    $('#ext_author').text(extDetails.Author)

}

function loadExtension(extension_name = false) {
    if (extension_name == false) {
        extension_name = $('#aurora_extension_dropdown').val()
    }
    data = { 'extension_name': extension_name }
    ajax_response = make_AJAX_Call("/update_extension", data)
    console.log(ajax_response);
    if (ajax_response["status"] == "ok") {
        create_snackbar("Extension Load", "Successfully loaded extension", "success")
    }


}

function reload_pixel_image() {

    pixel_image_reload = make_AJAX_Call("/screenshot/", {})
    //console.log(pixel_image_reload)
    if (pixel_image_reload["status"] == "ok") {
        d = new Date();
        $("#pixel_image").attr("src", "/load_pixel_image?" + d.getTime());
    }
    else {
        console.log(pixel_image_reload)
    }
}

function reload_hdmi_image() {

    pixel_image_reload = make_AJAX_Call("/screenshot/", {})

    d = new Date();
    $("#image_screenshot").attr("src", "/load_screenshot?" + d.getTime());
    console.log("/load_screenshot?" + d.getTime())

}


