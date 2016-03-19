function lockBox(cur_box) {
    $('.' + cur_box + '-box * input').attr('disabled', 'true');
    $('.' + cur_box + '-box * select').attr('disabled', 'true');
    $('#' + cur_box + '-btn').buttonMarkup({icon: 'lock'});
    $('#' + cur_box + '-btn').data('icon', 'lock');
    $('#' + cur_box + '-btn').text('Goal Locked (30 days)');
}

function confirm_save_goal(goal_id)
{
    if ($('#savings_goal_is_locked').val() == 1) {
        return;
    }

    // Defensive Code: Ensure that the values have been set.
    if( $('#save-dollars').val() == "" ){
        $('#error-popup').popup('open');
        $('#id_error_title').html('{% trans "Savings" %}');
        $('#id_error_message').html('{% trans "Please enter saving amount in dollars (red box)" %}');
        return;
    }
    if( $('#save-period').val() == "" ){
        $('#error-popup').popup('open');
        $('#id_error_title').html('{% trans "Savings" %}');
        $('#id_error_message').html('{% trans "Please enter your savings period." %}');
        return;
    }
    if( $('#save-time').val() == "" ){
        $('#error-popup').popup('open');
        $('#id_error_title').html('{% trans "Savings" %}');
        $('#id_error_message').html('{% trans "Please enter your savings time." %}');
        return;
    }

    // Load the confirmation popup.
    $('#confirm-popup').popup('open');

    // Save the goal
    $('#id_goal_id').val(goal_id);
    $('#id_goal_type').val("");
}

function save_goal()
{
    var goal_id = parseInt( $('#id_goal_id').val() );
    var goal_type = parseInt ( $('#id_goal_type').val() );

    if (goal_type == "") {
    console.log("Processing Savings Goal");
    ajax_set_savings_goal(goal_id);
} else {
    alert('{% trans "Unknown goal selected." %}');
    console.log("Goal ID: "+goal_id);
    console.log("Goal Type: "+goal_type);
}
}

function ajax_set_savings_goal(goal_id)
{
    // Step 1: Fetch the Goal model object from the API.
    get_savings_goal(
        goal_id,
        function(goal) {
            // Step 2: Update the goal.
            goal["amount"] = $('#save-dollars').val();
            goal["times"] = parseInt( $('#save-period').val() );
            goal["period"] = parseInt( $('#save-time').val() );
            goal["is_locked"] = 'True';
            var nowPlus30Days = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // Now + 30 days.
            goal["unlocks"] = date_to_django_date(nowPlus30Days);

            // Step 3: Save the goal.
            set_savings_goal(
                goal,
                function(goal) {
                    // Step 4: Lock the particular box depending on what
                    //         the 'type' is set as.
                    lockBox('red');
                    $('#savings_goal_is_locked').val(1);
                },
                function(error_json) {
                    $('#error-popup').popup('open');
                    $('#id_error_title').html('{% trans "Savings" %}');
                    $('#id_error_message').html('{% trans "An unknown error occured when saving goal, please see log." %}');
                    console.log(error_json);
                }
            );
        },
        function(error_json) {
            $('#error-popup').popup('open');
            $('#id_error_title').html('{% trans "Savings" %}');
            $('#id_error_message').html('{% trans "An unknown error occured when fetching goal, please see log." %}');
            console.log(error_json);
        }
    );
}

var advance_tour = false;
var cur_bubble = 0;
var tour_bubbles = [
    {
        top: 180,
        posy: 'top',
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.red-box',
        text: 'This is the savings goal, in the first box you enter how much you want to save.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: true,
        action: function(){ $('#save-dollars').trigger('focus'); }
    },
    {
        bottom: 180,
        posy: 'top',
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.red-box',
        text: 'In the second box, you enter the time period (1,2,3,etc...) how often you would like to save the amount from the box above.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: true,
        action: function(){ $('#save-period').trigger('focus'); }
    },
    {
        bottom: 180,
        posy: 'top',
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.red-box',
        text: 'In the third box, you enter how long you would like to continue this goal for: weeks, or months.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: true,
        action: function(){ $('#save-time').trigger('focus') }
    },
    {
        bottom: 180,
        posy: 'top',
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.red-box',
        text: 'Once you have your goal entered, click the \'Set My Goal!\' button to lock it in. You\'ll be prompted with a popup asking you to confirm locking in your goal. You can change your goal once every 30 days.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Finish</button>',
        finish: true,
        hasaction: true,
        action: function(){ $('#red-btn').trigger('focus'); }
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

        if( cur_bubble == tour_bubbles.length ){
            active_bubble.hide();
            cur_bubble = 0;
            return;
        }

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
        if( bubble.posy == 'top'){
            active_bubble.css('top',bubble.top+'px').css('bottom', 'auto');
        }
        else{
            active_bubble.css('bottom', bubble.bottom+'px').css('top', 'auto');
        }
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

        // advance count to next bubble to prepare for advancement
        cur_bubble++;
    }
}