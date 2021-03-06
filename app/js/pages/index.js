/**
 *
 */
function ajax_login()
{
    // Defensive Code: Password handling.
    if( $('#id_email').val() == "" ){
        $('#login-popup').popup('open');
        $('#id_error').html('Please enter your email.');
        return;
    }
    if ( !is_email_valid( $('#id_email').val() ) ) {
        $('#login-popup').popup('open');
        $('#id_error').html('Please enter a valid email address.');
        return;
    }
    if( $('#id_password').val() == "" ){
        $('#login-popup').popup('open');
        $('#id_error').html('Please enter your password.');
        return;
    }

    // Login into our portal for editing customer information.
    ajax_login2(
        $('#id_email').val(),
        $('#id_password').val(),
        function(json_result) {
            localStorage.removeItem('user_id');
            localStorage.setItem('user_id',json_result.user_id);
            window.location="dashboard.html";
        },
        function(json_error) {
            // Convert the error json into string.
            var string = JSON.stringify( json_error );
            console.log(string);
            if (string.indexOf("username and/or password are blank") > -1)
            {
                $('#login-popup').popup('open');
                $('#id_error').html('Username and/or password are blank, please fill it it.');
            }
            else if (string.indexOf("Error - Wrong email or password.") > -1)
            {
                $('#login-popup').popup('open');
                $('#id_error').html('Wrong username or password');
            }
            else if (string.indexOf("username not found") > -1)
            {
                $('#login-popup').popup('open');
                $('#id_error').html('Email not found');
            }
            else {
                $('#login-popup').popup('open');
                $('#id_error').html('Unknown error.');
            }
        }
    ); // End Login
}

/**
 * Handle logging in the user.
 */
function ajax_login2(username, password, success_callback, error_callback) {
    sign_in(
        username,
        password,
        function(json_result) {
            if (json_result.status == "success") {
                success_callback(json_result);
            }
            else {
                error_callback('{% trans "Error - Wrong email or password." %}');
            }
        },
        function(error_json) {
            error_callback(error_json);
        }
    ); // End Login
}