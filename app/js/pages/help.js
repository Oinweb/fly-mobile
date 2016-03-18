var advance_tour = false;
var cur_bubble = 0;
var tour_bubbles = [
    {
        top: 45,
        left: 25,
        posx: 'left',
        type: 'bottom',
        element: '.ui-content',
        text: "{% trans 'Welcome to the help page, from here you can send us bugs you may have found, help requests, or just general comments.' %}",
        button: '<br/><button data-role="none" onclick="advance_tour = true;">{% trans "Continue" %}</button>',
        hasaction: false
    },
    {
        top: 130,
        left: 25,
        posx: 'left',
        type: 'top',
        element: '.ui-content',
        text: "{% trans 'First, fill in your name so we know who the message is coming from.' %}",
        button: '<br/><button data-role="none" onclick="advance_tour = true;">{% trans "Continue" %}</button>',
        hasaction: true,
        action: function(){ $('#name').trigger('focus'); }

    },
    {
        top: 200,
        left: 25,
        posx: 'left',
        type: 'top',
        element: '.ui-content',
        text: "{% trans 'Enter your email address next so that we can reply to your question.' %}",
        button: '<br/><button data-role="none" onclick="advance_tour = true;">{% trans "Continue" %}</button>',
        hasaction: true,
        action: function(){ $('#email').trigger('focus'); }

    },
    {
        top: 270,
        left: 25,
        posx: 'left',
        type: 'top',
        element: '.ui-content',
        text: "{% trans 'Select the subject of the email so we know how important it is for us to get back to you quickly.' %}",
        button: '<br/><button data-role="none" onclick="advance_tour = true;">{% trans "Continue" %}</button>',
        hasaction: true,
        action: function(){ $('#subject').trigger('focus'); }
    },
    {
        top: 320,
        left: 25,
        posx: 'left',
        type: 'top',
        element: '.ui-content',
        text: "{% trans 'Finally, enter a message, be it a question about how to use a certain feature, or a bug report.  If submitting a bug report please be as thorough as possible so we can find and identify the problem quickly.' %}",
        button: '<br/><button data-role="none" onclick="advance_tour = true;">{% trans "Continue" %}</button>',
        hasaction: true,
        action: function(){ $('#message').trigger('focus'); }
    },
    {
        top: 400,
        left: 25,
        posx: 'left',
        posy: 'top',
        type: 'top',
        center: true,
        element: '.ui-page',
        text: "{% trans 'To send your message, click the \'Send Message\' button, and we\'ll try to respond to your inquiry as quickly as possible.' %}",
        button: '<br/><button data-role="none" onclick="cur_bubble=0;advance_tour = false;$(\'#tour-bubble\').hide();">{% trans "Finish" %}</button>',
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

        if( bubble.finishnow || cur_bubble == tour_bubbles.length ){
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

        // advance count to next bubble to prepare for advancement
        if(bubble.finish){
            cur_bubble = 0;
            bubble.finishnow = true;
            return;
        }

        cur_bubble++;
    }
}