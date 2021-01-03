function change_system_status() {

    $('#toggle_aurora_enabled').prop("disabled", true)
    enabled_stats = $('#toggle_aurora_enabled').prop('checked');

    data = { "enabled": enabled_stats }
    system_status_call = make_AJAX_Call("/update_config", data, toast_system_status)


    $('#toggle_aurora_enabled').prop("disabled", false)


}

function toast_system_status(system_status_call) {
    if (system_status_call["status"] == "ok") {
        create_snackbar("System Enabled Status", "Successfully saved system config", "success")
    }

}



$('#aurora_extension_dropdown').on("change", function () { showExtensionDetails(this.value) })

$('#toggle_aurora_enabled').on('click', function () { change_system_status() })

var secondsBeforeReload = 5;

function reloadImages() {
    make_AJAX_Call("/screenshot/", {})
    d = new Date();
    $("#image_screenshot").attr("src", "/load_screenshot?" + d.getTime());
    $("#image_pixels").attr("src", "/load_pixel_image?" + d.getTime());
    secondsBeforeReload = 5;
}
function reloadCounter() {
    if ($('#toggle_images_reload').prop("checked")) {
        secondsBeforeReload--
        $('#reloadTime').text("(reloading in " + secondsBeforeReload + "s)")
        if (secondsBeforeReload == 0) {
            reloadImages();

        }
    }

}
var reloadTimer = setInterval(reloadCounter, 1000);

