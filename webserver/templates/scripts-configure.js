<script src="/assets/js/bootstrap-input-spinner.js"></script>
<script type="text/JavaScript">
currentRequest = null
$( document ).ready(function() {


  $("input[type='number']").inputSpinner()
  setInterval(function()
  { 


    
    
  }, 1000);

});

function reloadPixelImage() {
  $.ajax({
     url: "/screenshot/",
  });
  d = new Date(); 
  $("#pixel_image").attr("src", "/load_pixel_image?"+d.getTime());
}
$('#saveConfig').on("click", function(event){

    ajax_send_data = {}
    ajax_send_data["save"] = true
    ajax_send_data["pixelcount_left"] = $('#numLeft').val()
    ajax_send_data["pixelcount_right"] = $('#numRight').val()
    ajax_send_data["pixelcount_top"] = $('#numTop').val()
    ajax_send_data["pixelcount_bottom"] = $('#numBottom').val()


    currentRequest = $.ajax({
      type: "POST",
      url: "/update_LED_config",
      data: JSON.stringify(ajax_send_data),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
          location.reload()
      },
      beforeSend : function()    {           
          if(currentRequest != null) {
              currentRequest.abort();
          }
      },
      });

});
$('#numLeft, #numRight, #numTop, #numBottom').on("change", function (event) {
    console.log("here");
    val = $(this).val()
    id = $(this).attr("id")
    
    ajax_send_data = {}
    if(id == "numLeft")
    {
      ajax_send_data["pixelcount_left"] = val
    }
    else if(id == "numRight")
    {
      ajax_send_data["pixelcount_right"] = val
    }
    else if(id == "numTop")
    {
      ajax_send_data["pixelcount_top"] = val
    }
    else if(id == "numBottom")
    {
      ajax_send_data["pixelcount_bottom"] = val
    }

    currentRequest = $.ajax({
      type: "POST",
      url: "/update_LED_config",
      data: JSON.stringify(ajax_send_data),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
          reloadPixelImage();
      },
      beforeSend : function()    {           
          if(currentRequest != null) {
              currentRequest.abort();
          }
      },
      });
})
                
                
</script>