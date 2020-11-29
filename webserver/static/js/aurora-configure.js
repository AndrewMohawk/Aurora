function fetch_pixel_data()
{
  ajax_send_data = {}
  ajax_send_data["pixelcount_left"] = $('#aurora_configure_left').val()
  ajax_send_data["pixelcount_right"] = $('#aurora_configure_right').val()
  ajax_send_data["pixelcount_top"] = $('#aurora_configure_top').val()
  ajax_send_data["pixelcount_bottom"] = $('#aurora_configure_bottom').val()
  console.log(ajax_send_data)
  return ajax_send_data
}
$('#aurora_configure_save_button').on("click", function(event){

  ajax_send_data = fetch_pixel_data()
  ajax_send_data["save"] = true
  ajax_save_config = make_AJAX_Call("/update_LED_config",ajax_send_data)
  if(ajax_save_config["status"] == "ok")
  {
    reload_pixel_image();
    create_snackbar("Pixel Configuration","Successfully saved system config","success")
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
    
    ajax_send_data = fetch_pixel_data()
    ajax_response = make_AJAX_Call("/update_LED_config",ajax_send_data)
    if(ajax_response["status"] == "ok")
    {
      reload_pixel_image();
    }
    

    // currentRequest = $.ajax({
    //   type: "POST",
    //   url: "/update_LED_config",
    //   data: JSON.stringify(ajax_send_data),
    //   contentType: 'application/json',
    //   dataType: 'json',
    //   success: function(data) {
    //       reloadPixelImage();
    //   },
    //   beforeSend : function()    {           
    //       if(currentRequest != null) {
    //           currentRequest.abort();
    //       }
    //   },
    //   });
})
                
                
