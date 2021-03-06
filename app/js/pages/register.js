function ajax_register() {
    // Defensive Code: Name handling.
    if( $('#id_first_name').val() == "" ){
        $('#login-popup').popup('open');
        $('#id_error').html('Please enter your first name.');
        return;
    }
    if( $('#id_last_name').val() == "" ){
        $('#login-popup').popup('open');
        $('#id_error').html('Please enter your last name.');
        return;
    }

    // Defensive Code: The following code will ensure the proper
    //                 validation occured on the inputted entries.
    if ($('#id_email').val() == '') {
        $('#login-popup').popup('open');
        $('#id_error').html('Please enter a email address.');
        return;
    }
    if ( !is_email_valid( $('#id_email').val() ) ) {
        $('#login-popup').popup('open');
        $('#id_error').html('Please enter a valid email address.');
        return;
    }

    // Defensive Code: Password handling.
    if ( $('#id_password').val() == "" ){
        $('#login-popup').popup('open');
        $('#id_error').html('Please enter a password.');
        return;
    }
    if ( $('#id_password2').val() == "" ){
        $('#login-popup').popup('open');
        $('#id_error').html('Please confirm your password.');
        return;
    }
    if ( $('#id_password').val() != $('#id_password2').val() ){
        $('#login-popup').popup('open');
        $('#id_error').html('Passwords do not match.');
        return;
    }

    // Defensive Code: Ensure that the user agrees to the terms before proceeding.
    //var is_tsa_checked = $('#id_register_tos2').is(':checked');
    //if (is_tsa_checked == false) {
    //$('.alert-danger').text('{% trans "Please agree to the service agreement to continue." %}');
    //$('.alert-danger').show();
    //return;
    //}

    ajax_new_user(
        function(json_result) {

            console.log(json_result);
            ajax_login(
                $('#id_email').val(),
                $('#id_password').val(),
                function(login_json_result) {

                    console.log(login_json_result);
                    window.location = 'dashboard.html';

                },
                function(login_error_json_result) {

                    console.log(login_error_json_result);

                }
            ); // end Login

        },
        function(error_json_result) {
            // Convert the error json into string.
            var string = JSON.stringify( error_json_result );
            console.log(string);
            if (string.indexOf("username") > -1)
            {
                $('#login-popup').popup('open');
                $('#id_error').html('Missing email, please fill it it.');
            }
            else if (string.indexOf("password") > -1)
            {
                $('#login-popup').popup('open');
                $('#id_error').html('Missing password, please fill it in.');
            }
            else if (string.indexOf("has already been taken by another user") > -1)
            {
                $('#login-popup').popup('open');
                $('#id_error').html('Email has already been taken by another user.');
            }
            else if (string.indexOf("first_name") > -1)
            {
                $('#login-popup').popup('open');
                $('#id_error').html('Missing first name, please fill it it.');
            }
            else if (string.indexOf("last_name") > -1)
            {
                $('#login-popup').popup('open');
                $('#id_error').html('Missing last name, please fill it it.');
            } else {
                $('#login-popup').popup('open');
                $('#id_error').html('Unknown error occurred.');
            }
        }
    ); // end New User.
}

function ajax_new_user(success_callback, error_callback) {
    var username = $('#id_email').val();
    var email = $('#id_email').val();
    var password = $('#id_password').val();
    var first_name = $('#id_first_name').val();
    var last_name = $('#id_last_name').val();

    registration(
        username, email, password, first_name, last_name,
        function(json_result) {
            // Success
            if (json_result['status'] == 'success') {
                success_callback(json_result['user_id']);
            } else {
                error_callback(json_result['errors']);
            }

        },
        function(error_json) {
            error_callback(error_json['errors']);
        }
    ); // End Registration
}

function ajax_login(username, password, success_callback, error_callback) {
    sign_in(
        username,
        password,
        function(json_result) {
            if (json_result.status == "success") {
                success_callback();
            }
            else {
                error_callback("{% trans 'Error - Wrong email or password' %}");
            }
        },
        function(error_callback) {
            // Do nothing.
        }
    ); // End Login
}