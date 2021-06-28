function fetch_config_data() {
  ajax_send_data = {}
  ajax_send_data["pixelcount_left"] = $('#aurora_configure_left').val()
  ajax_send_data["pixelcount_right"] = $('#aurora_configure_right').val()
  ajax_send_data["pixelcount_top"] = $('#aurora_configure_top').val()
  ajax_send_data["pixelcount_bottom"] = $('#aurora_configure_bottom').val()
  ajax_send_data["darkthreshhold"] = $('#aurora_config_darkthreshhold').val()
  ajax_send_data["hdmi_gamma"] = $('#hdmi_gamma').val()
  return ajax_send_data
}
$('#aurora_configure_save_button').on("click", function (event) {

  ajax_send_data = fetch_config_data()
  ajax_send_data["save"] = true
  ajax_save_config = make_AJAX_Call("/update_LED_config", ajax_send_data)
  if (ajax_save_config["status"] == "ok") {
    reload_pixel_image();
    create_snackbar("Pixel Configuration", "Successfully saved system config", "success")
  }
});


//Stepper Add
$('.stepper-add').on('click',function(){
  var num = +$(this).parent().find('input').val() + 1;
  $(this).parent().find('input').val(num);
  //return false;
});
$('.stepper-sub').on('click',function(){
  var num = $(this).parent().find('input').val() - 1;
  if(num >= 0){$(this).parent().find('input').val(num);}
  //return false;
});

$('.stepper-add, .stepper-sub').on("click", function (event) {

  ajax_send_data = fetch_config_data()
  ajax_response = make_AJAX_Call("/update_LED_config", ajax_send_data);
  if (ajax_response["status"] == "ok") {
    reload_pixel_image();
  }
})


$('#hdmi_hue, #hdmi_saturation,#hdmi_brightness,#hdmi_contrast,#hdmi_gamma').on("slideStop", function (event) {
  val = $(this).val()
  id = $(this).attr("id")
  setHDMIValues();
})

function save_hdmi_image()
{
  ajax_send_data = fetch_config_data()
  ajax_send_data["save"] = true
  ajax_response = make_AJAX_Call("/update_HDMI_config", ajax_send_data);
  if (ajax_response["status"] == "ok") {
    make_AJAX_Call("/screenshot/", {})
    reload_hdmi_image();
  }
}

function reloadImages() {
  make_AJAX_Call("/screenshot/", {})
  d = new Date();
  $("#image_screenshot").attr("src", "/load_screenshot?" + d.getTime());
  $("#image_pixels").attr("src", "/load_pixel_image?" + d.getTime());
  secondsBeforeReload = 5;
}

function setHDMIValues()
{
  ajax_send_data = fetch_config_data()
  ajax_response = make_AJAX_Call("/update_HDMI_config", ajax_send_data);
  if (ajax_response["status"] == "ok") {
    make_AJAX_Call("/screenshot/", {})
    reload_hdmi_image();
  }
}
function reset_gamma(hue_gamma)
{
  $('#hdmi_gamma').slider('setValue',hue_gamma)
  setHDMIValues()
}

