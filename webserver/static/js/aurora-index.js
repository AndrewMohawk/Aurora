function change_system_status()
{
    
    $('#toggle_aurora_enabled').prop("disabled",true)
    enabled_stats = $('#toggle_aurora_enabled').prop('checked');
    
    data = {"enabled":enabled_stats}
    system_status_call = make_AJAX_Call("/update_config",data,toast_system_status)
    

    $('#toggle_aurora_enabled').prop("disabled",false)
    
    
}

function toast_system_status(system_status_call)
{
    if(system_status_call["status"] == "ok")
    {
        if(system_status_call["message"])
        {
            create_snackbar("System Enabled Status",system_status_call["message"],"success")
        }
        else
        {
            create_snackbar("System Enabled Status","Successfully saved system config","success")
        }
    }
    

}



$('#aurora_extension_dropdown').on("change", function() { showExtensionDetails(this.value)})

$('#toggle_aurora_enabled').on('click',function(){ change_system_status() })