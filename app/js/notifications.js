/**
 *  Function will lookup any Notifications in Queue and then load the
 *  associated modal popup for the found Notifications.
 */
function handle_fly_notifications()
{
    var criteria = Array();
    criteria.push({ 'user': {{ request.user.id }} });

    filter_notifications(
        criteria,
        function(json_result) {
            $(json_result).each(function(iter,notifications){
                $(notifications['results']).each(function(iter2,notification){
                    var type = notification['type'];
                    if (type == 1) {
                        popup_level_up_modal(notification);
                    } else if (type == 2) {
                        popup_new_badge_modal(notification);
                    }
                    console.log("Create Popup of Type: "+type);

                    // Stop the current iteration which will result handling
                    // only a single notification at a time.
                    return false;
                });
            });
        },
        function(error_json) {
            alert("Unknown error with notifications. See console log.");
            console.log(error_json);
        }
    );
}

/**
 *  Function will delete the Notification object and then load-up
 *  the modal indicating a modal.
 */
function popup_level_up_modal(notification) {
    // Extract data from the notification.
    var id = notification['id'];
    var num = notification['xplevel_num'];
    var title = notification['xplevel_title'];

    // Load up the UI on the page.
    $('#id_levelup_num').html("Level "+num);
    $('#id_levelup_title').html(title);
    $('#notification_id').val(id);
    $('#notification_type').val(1);
    $('#levelup-popup').popup('open');
}

function popup_new_badge_modal(notification) {
    // Extract data from the notification.
    var id = notification['id'];
    var description = notification['description'];
    var title = notification['title'];

    // Load up the UI on the page.
    $('#id_new_badge_description').html(description);
    $('#id_new_badge_title').html(title);
    $('#notification_id').val(id);
    $('#notification_type').val(2);
    $('#badge-popup').popup('open');
}

/**
 *  Function will delete the currently popped notification.
 */
function ajax_delete_this_notification() {
    var id = parseInt( $('#notification_id').val() );

    // Delete the notification in the database.
    delete_notification(
        id,
        function(ok) {
            // Do Nothing.
        },
        function(error_json) {
            alert("Unknown error with notification deletion. See console log.");
            console.log(error_json);
        }
    ); // end Delete Notification.
}

/**
 *  Function will load the share page for the particular notification_id.
 */
function ajax_share_and_reload(){
    var id = parseInt( $('#notification_id').val() );
    window.location ="/{{ request.language }}/share/"+id+"/";
}