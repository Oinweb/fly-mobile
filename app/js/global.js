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
            var token = get_user_token(username, password);
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

function get_user_token(username, password){
    var data = {
        'username': username,
        'password': password,
    };
    var url = "http://127.0.0.1:8000/api-token-auth/?format=json";
    var type = "POST";

    $.ajax({
        url: url,
        data: data,
        type: type,
        success: function(json_result){
            localStorage.setItem('auth_token',json_result.token);
            window.location="dashboard.html";
        },
        error: function(xhr, status, error){
            console.debug(status + ': ' + error + ' -- ' + xhr.responseText);
        }
    })
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
function ajax_refresh_me_top_menu() {
    get_me(
        1,
        function(me) {
            var level = me['num'];
            $('#id_me_xp_level').html("Lvl "+level);

            var xp_score = me['xp'] + "/" + me['max_xp'];
            $('#id_me_xp').html(xp_score);

            var xp_percent = me['xp_percent'];
            $('#id_me_xp').css('width', xp_percent);
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
            window.location='index.html';
        },
        function(bad) {
            console.log(bad);
        }
    );
};

function is_email_valid(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}