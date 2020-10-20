<script type="text/JavaScript">
                $( document ).ready(function() {
                
                //showExtensionDetails($('#extensionSelect').val());
                
                setInterval(function()
                { 
                
                if($("#autoreload").is(':checked'))
                {
                
                $.ajax({
                    url: "/screenshot/",
                    success: function(data) {
                      $('#fps').text(data + " FPS");
                    }
                  })
                  d = new Date();
                  $("#screenshot_image").attr("src", "/load_screenshot/?"+d.getTime());
                  $("#pixel_image").attr("src", "/load_pixel_image?"+d.getTime());
                  
                }
                }, 1000);
                
                });
                var currentRequest = null;
                $('#extensionSelect').on('change', function() {
                showExtensionDetails(this.value)
                });
                
                function showExtensionDetails(name)
                {
                if($('#extension_details').is(':visible') == false)
                {
                $('#extension_details').slideDown();
                }
                extDetails = extensions[name]
                $('#ext_name').text(extDetails.Name)
                $('#ext_description').text(extDetails.Description)
                $('#ext_author').text(extDetails.Author)
                
                }
                
                function loadSelectedExtension()
                {
                selected_extension = $('#extensionSelect').val()
                if(selected_extension != '')
                {
                loadExtension(selected_extension)
                }
                }
                
                function loadExtension(extension_name)
                {
                
                currentRequest = $.ajax({
                type: "POST",
                url: "/update_extension",
                data: JSON.stringify({'extension_name':extension_name}),
                contentType: 'application/json',
                dataType: 'json',
                success: function(data) {
                    console.log(data)
                    location.reload()
                },
                beforeSend : function()    {           
                    if(currentRequest != null) {
                        currentRequest.abort();
                    }
                },
                });
                }
                
                
                var extensions = {{extensions_meta}}
                
                </script>