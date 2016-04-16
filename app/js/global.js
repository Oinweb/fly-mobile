function get_get_var(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function sign_in(username, password, success_callback, error_callback) {
    var data = {
        'username': username,
        'password': password,
    };
    var url = "http://127.0.0.1:8000/api/logins/0/sign_in/?format=json";
    var type = "POST"; // Insert.

    $.ajax({
        url: url,
        data: data,
        type: type,
        traditional: true, // Note: This allows many-to-many arrays for Django REST Framework
        success: function(json_result){
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_id');
            localStorage.setItem('auth_token', json_result.token);
            localStorage.setItem('user_id', json_result.user_id);

            var dashboard = window.open("http://127.0.0.1:8000/en/dashboard");
            setTimeout(function(){
                dashboard.close();
            }, 5000);

            setTimeout(function(){ success_callback(json_result) }, 500); // Call back the function with the JSON results.
        },
        error: function(xhr,status,error) {
            // Print the error log to console.
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);

            // Convert JSON string into javascript associative array.
            var json = jQuery.parseJSON(xhr.responseText);
            error_callback(json); // Return JSON
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });

}

function sign_off(success_callback, error_callback) {
    var url = "http://127.0.0.1:8000/api/logins/0/sign_off/?format=json";

    $.ajax({
        url: url,
        data: {},
        type: "POST",
        traditional: true, // Note: This allows many-to-many arrays for Django REST Framework
        success: function (json_result) {
            success_callback(json_result);  // Call back the function with the JSON results.
        },
        error: function (xhr, status, error) {
            // Print the error log to console.
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);

            // Convert JSON string into javascript associative array.
            var json = jQuery.parseJSON(xhr.responseText);
            error_callback(json); // Return JSON
        },
        complete: function (xhr, status) {
            // Do nothing.
        }
    });
}

function registration(username, email, password, first_name, last_name, success_callback, error_callback) {
    var data = {
        'username': username,
        'email': email,
        'password': password,
        'first_name': first_name,
        'last_name': last_name,
    };
    var url = "http://127.0.0.1:8000/api/registers/0/registration/?format=json";

    jQuery.ajax({
        url: url,
        data: data,
        type: "POST",
        traditional: true, // Note: This allows many-to-many arrays for Django REST Framework
        success: function(json_result){

            success_callback(json_result); // Call back the function with the JSON results.
        },
        error: function(xhr,status,error) {
            // Print the error log to console.
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);

            // Convert JSON string into javascript associative array.
            var json = jQuery.parseJSON(xhr.responseText);
            error_callback(json); // Return JSON
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });

}

/**
 *  Function will fetch the Me object and update the Top Menu with the
 *  latest data.
 */
function ajax_refresh_me_top_menu(user_id) {
    get_me(
        {user_id: user_id},
        function(me) {
            var level = me.results[0].xplevel;
            $('#id_me_xp_level').html("Lvl "+level);

            var xp_score = me.results[0].xp + "/" + me.results[0].max_xp + " XP";
            $('.progress .xp').html(xp_score);

            var xp_percent = me.results[0].xp_percent;
            $('#id_me_xp').css('width', xp_percent + '%');
        },
        function(json_error) {
            console.log(json_error);
        }
    );
}

/**
 *  Function will log out the user and return the user to the main authentication page.
 */
function ajax_logoff()
{
    sign_off(
        function(ok) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_id');
            window.location='index.html';
        },
        function(bad) {
            console.log(bad);
        }
    );
};

// regex if email is valid
function is_email_valid(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

// https://stackoverflow.com/questions/6154689/how-to-check-if-date-is-within-30-days
var num_days_between = function(d1, d2) {
    var diff = Math.abs(d1.getTime() - d2.getTime());
    return diff / (1000 * 60 * 60 * 24);
};

function check_me_status(id, success_callback, error_callback) {
    var url = "http://127.0.0.1:8000/api/me/?user=" + id + "&format=json";
    jQuery.ajax({
        url: url,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('auth_token')
        },
        cache: false,
        contentType: false,
        processData: false,
        type: 'GET',
        success: function(json_results){
            if(json_results.count == 0){
                set_me(
                    {
                        user: localStorage.getItem('user_id'),
                        xp: 0,
                        xp_percent: 0,
                        xplevel: 1
                    },
                    function(results){
                        console.debug(results);
                    },
                    function(error){
                        console.debug(error);
                    }
                )

            }
            else{
                return json_results;
            }
        },
        error: function(xhr,status,error) {
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);
            error_callback(xhr.responseText);
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });
}


/* ------------- user profile info -------------- */
function set_me(data, success_callback, error_callback)
{
    // Setup depending on whether we are inserting or updating.
    var type = "POST"; // Insert.
    var url = "http://127.0.0.1:8000/api/me/";
    if (data['id'] > 0) {
        type = "PUT"; // Update
        url += data['id'] + "/";
    }

    jQuery.ajax({
        url: url,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('auth_token')
        },
        data: data,
        type: type,
        traditional: true, // Note: This allows many-to-many arrays for Django REST Framework
        success: function(json_result){
            success_callback(json_result); // Call back the function with the JSON results.
        },
        error: function(xhr,status,error) {
            // Print the error log to console.
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);

            // Convert JSON string into javascript associative array.
            var json = jQuery.parseJSON(xhr.responseText);
            error_callback(json); // Return JSON
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });
}

function get_me(id, success_callback, error_callback) {
    var url = "http://127.0.0.1:8000/api/me/?user_id=" + id + "&format=json";
    jQuery.ajax({
        url: url,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('auth_token')
        },
        cache: false,
        contentType: false,
        processData: false,
        type: 'GET',
        success: function(json_results){
            success_callback(json_results);
        },
        error: function(xhr,status,error) {
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);
            error_callback(xhr.responseText);
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });
}

function delete_me(id, success_callback, error_callback) {
    var url = "http://127.0.0.1:8000/api/me/" + id + "/";
    jQuery.ajax({
        url: url,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('auth_token')
        },
        cache: false,
        contentType: false,
        processData: false,
        type: 'DELETE',
        success: function(json_results){
            success_callback(json_results);
        },
        error: function(xhr,status,error) {
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);
            error_callback(xhr.responseText);
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });
}

function evaluate_me(id, success_callback, error_callback) {
    var url = "http://127.0.0.1:8000/api/me/" + id + "/evaluate_me/?format=json";
    jQuery.ajax({
        url: url,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('auth_token')
        },
        cache: false,
        contentType: false,
        processData: false,
        type: 'GET',
        success: function(json_results){
            success_callback(json_results);
        },
        error: function(xhr,status,error) {
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);
            error_callback(xhr.responseText);
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });
}

/* ------------- notification popups -------------- */
function filter_notifications(criteria, success_callback, error_callback)
{
    var url = "http://127.0.0.1:8000/api/notifications/?format=json";
    for (var i = 0; i < criteria.length; i++) {
        url += "&";

        // Build our search criteria in the URL based on the results.
        for(var index in criteria[i]) {
            url += index + "=" + criteria[i][index];
        }
    }

    jQuery.ajax({
        url: url,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('auth_token')
        },
        cache: false,
        contentType: false,
        processData: false,
        type: 'GET',
        success: function(json_results){
            success_callback(json_results);
        },
        error: function(xhr,status,error) {
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);
            error_callback(xhr.responseText);
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });
}

function set_notification(data, success_callback, error_callback)
{
    // Setup depending on whether we are inserting or updating.
    var type = "POST"; // Insert.
    var url = "http://127.0.0.1:8000/api/notifications/";
    if (data['id'] > 0) {
        type = "PUT"; // Update
        url += data['id'] + "/";
    }

    jQuery.ajax({
        url: url,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('auth_token')
        },
        data: data,
        type: type,
        traditional: true, // Note: This allows many-to-many arrays for Django REST Framework
        success: function(json_result){
            success_callback(json_result); // Call back the function with the JSON results.
        },
        error: function(xhr,status,error) {
            // Print the error log to console.
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);

            // Convert JSON string into javascript associative array.
            var json = jQuery.parseJSON(xhr.responseText);
            error_callback(json); // Return JSON
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });
}

function get_notification(id, success_callback, error_callback) {
    var url = "http://127.0.0.1:8000/api/notifications/" + id + "/?format=json";
    jQuery.ajax({
        url: url,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('auth_token')
        },
        cache: false,
        contentType: false,
        processData: false,
        type: 'GET',
        success: function(json_results){
            success_callback(json_results);
        },
        error: function(xhr,status,error) {
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);
            error_callback(xhr.responseText);
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });
}

function delete_notification(id, success_callback, error_callback) {
    var url = "http://127.0.0.1:8000/api/notifications/" + id + "/";
    jQuery.ajax({
        url: url,
        headers: {
            Authorization: 'Token ' + localStorage.getItem('auth_token')
        },
        cache: false,
        contentType: false,
        processData: false,
        type: 'DELETE',
        success: function(json_results){
            success_callback(json_results);
        },
        error: function(xhr,status,error) {
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);
            error_callback(xhr.responseText);
        },
        complete: function(xhr,status) {
            // Do nothing.
        }
    });
}