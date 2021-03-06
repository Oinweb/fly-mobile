function ajax_delete_me(success_callback, error_callback) {
    delete_me(
        0,
    function(me) {
        success_callback("Was deleted");
    },
    function(error_json) {
        console.log(error_json);
        error_callback("Failed Deletion");
    }
); // end Delete.
}

function deleteAccount(){
    $('#confirm-popup .alert-confirm').hide();
    if( $('#txtDeleteConfirm').val() == "delete" ){
        // delete the user's account info
        $('#confirm-popup .alert-confirm').removeClass('alert-danger').addClass('alert-success').text('Your account has been successfully deleted, you will now be redirected to the home page.');
        $('#confirm-popup .alert-confirm').show();

        // Handle deleting the user account.
        ajax_delete_me(
            function(message) {
                console.log(message); // For debugging purposes only.

                // Add a minor deley before redirecting to the home page.
                setTimeout(function(){
                    console.log("Delete now"); // For debugging purposes only.
                    window.location="/{{ request.language }}/"; // Redirect.
                }, 300);
            },
            function(error_json) {
                console.log(error_json); // For debugging purposes only.
            }
        ); // end Delete.
    }
    else{
        $('#confirm-popup .alert-confirm').show();
    }
}

function ajax_update_me_with_wants_notification(wants_newsletter, callback) {
    get_me(
        0,
    function(me) {
        me['wants_newsletter'] = wants_newsletter;
        set_me(
            me,
            function(me2) {
                callback("OK");
            },
            function(error_json) {
                callback("BAD");
            }
        ); // end Set Me.
    },
    function(error_json) {
        callback("BAD");
    }
); // end Get Me.
}

var advance_tour = false;
var cur_bubble = 0;
var tour_bubbles = [
    {
        top: 200,
        left: 25,
        posx: 'left',
        type: 'bottom',
        element: '.ui-content div.text-center',
        text: 'Welcome to the profile page! In this panel you can see your user info, level and experience points.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 460,
        left: 25,
        posx: 'left',
        type: 'bottom',
        center: true,
        element: '.ui-content div.text-center',
        text: 'In this next panel you can see your currently set goals for savings, credit and long term.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 580,
        left: 25,
        posx: 'left',
        type: 'bottom',
        center: true,
        element: '.ui-content div.text-center',
        text: 'In this panel you can see your previous goal history, whether you were able to attain your goal or not, and what you earned for completing the goal',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 675,
        left: 25,
        posx: 'left',
        type: 'bottom',
        center: true,
        element: '.ui-content div.text-center',
        text: 'Here you can see any courses you\'ve completed, and how well you did on the quiz',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 580,
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.ui-content div.text-center',
        text: 'Here you can click to be taken to a page where you can view all the badges you\'ve collected.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 625,
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.ui-content div.text-center',
        text: 'In this section you can choose to subscribe or unsubscribe from our newsletter, just click the slider on the right and if prompted, enter your email address and you\'ll be signed up.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 780,
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.ui-content div.text-center',
        text: 'This button allows you to remove your account. If you remove your account all your badges and experience, as well as progress on courses will be lost.',
        button: '<br/><button data-role="none" onclick="cur_bubble=0;advance_tour = false;$(\'#tour-bubble\').hide();">Finish</button>',
        finish: true,
        finishnow: false,
        hasaction: false
    }
];

function start_page_tour(){
    $('.tour-bubble').show();
    next_bubble();

    setInterval(function(){ if(advance_tour == true){ advance_tour = false; next_bubble(); } }, 300);
}

function next_bubble(){
    if(cur_bubble <= tour_bubbles.length){
        // get current bubble
        var bubble = tour_bubbles[cur_bubble];
        // get the active bubble
        var active_bubble = $('.tour-bubble');

        if( bubble.center )
            window.location="#tour-bubble";

        // position the tour bubble dependant on element
        $(bubble.element).prepend(active_bubble);

        // change bubble type
        if(bubble.type == 'top'){
            active_bubble.removeClass('bubble-bottom').removeClass('bubble-left').removeClass('bubble-right').addClass('bubble-top');
        }
        else if(bubble.type =='bottom'){
            active_bubble.removeClass('bubble-top').removeClass('bubble-left').removeClass('bubble-right').addClass('bubble-bottom');
        }
        else if(bubble.type == 'left'){
            active_bubble.removeClass('bubble-bottom').removeClass('bubble-top').removeClass('bubble-right').addClass('bubble-left');
        }
        else if(bubble.type == 'right'){
            active_bubble.removeClass('bubble-bottom').removeClass('bubble-top').removeClass('bubble-left').addClass('bubble-right');
        }

        // position bubble with absolute positioning
        active_bubble.css('top',bubble.top+'px');
        if( bubble.posx == 'left'){
            active_bubble.css('left',bubble.left+'px').css('right', 'auto');
        }
        else{
            active_bubble.css('right', bubble.right+'px').css('left', 'auto');
        }

        // change the bubble text and button
        active_bubble.text(bubble.text);

        // if there is an action to be performed, perform it
        if(bubble.hasaction){
            bubble.action();
            setTimeout(function(){ active_bubble.append(bubble.button) }, 1500);
        }
        else{
            active_bubble.append(bubble.button);
        }

        active_bubble.show();

        cur_bubble++;
    }
}