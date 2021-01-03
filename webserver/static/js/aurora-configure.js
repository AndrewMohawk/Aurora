function fetch_config_data() {
  ajax_send_data = {}
  ajax_send_data["pixelcount_left"] = $('#aurora_configure_left').val()
  ajax_send_data["pixelcount_right"] = $('#aurora_configure_right').val()
  ajax_send_data["pixelcount_top"] = $('#aurora_configure_top').val()
  ajax_send_data["pixelcount_bottom"] = $('#aurora_configure_bottom').val()
  // ajax_send_data["hdmi_saturation"] = $('#hdmi_saturation').val()
  // ajax_send_data["hdmi_hue"] = $('#hdmi_hue').val()
  // ajax_send_data["hdmi_brightness"] = $('#hdmi_brightness').val()
  // ajax_send_data["hdmi_contrast"] = $('#hdmi_contrast').val()
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
  // ajax_response = make_AJAX_Call("")

  // currentRequest = $.ajax({
  //   type: "POST",
  //   url: "/update_LED_config",
  //   data: JSON.stringify(ajax_send_data),
  //   contentType: 'application/json',
  //   dataType: 'json',
  //   success: function(data) {
  //       location.reload()
  //   },
  //   beforeSend : function()    {           
  //       if(currentRequest != null) {
  //           currentRequest.abort();
  //       }
  //   },
  //   });

});



$('.stepper-add, .stepper-sub').on("click", function (event) {

  val = $(this).val()
  id = $(this).attr("id")

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
function setHDMIValues()
{
  ajax_send_data = fetch_config_data()
  ajax_response = make_AJAX_Call("/update_HDMI_config", ajax_send_data);
  if (ajax_response["status"] == "ok") {
    make_AJAX_Call("/screenshot/", {})
    reload_hdmi_image();
  }
}
// function reset_hdmi_value(brightness_default,sat_default,contrast_default,hue_default,hue_gamma) 
// {
  
//   $('#hdmi_saturation').slider('setValue',sat_default)
//   $('#hdmi_brightness').slider('setValue',brightness_default)
//   $('#hdmi_contrast').slider('setValue',contrast_default)
//   $('#hdmi_hue').slider('setValue',hue_default)
//   $('#hdmi_gamma').slider('setValue',hue_gamma)
//   setHDMIValues()
  
// }
function reset_gamma(hue_gamma)
{
  $('#hdmi_gamma').slider('setValue',hue_gamma)
  setHDMIValues()
}

