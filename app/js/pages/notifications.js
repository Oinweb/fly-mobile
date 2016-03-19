var advance_tour = false;
var cur_bubble = 0;
var tour_bubbles = [
    {
        top: 150,
        left: 25,
        posx: 'left',
        type: 'bottom',
        element: '.ui-content div.text-center',
        text: 'Welcome to the notifications page! Here you can turn on and off notifications about goals, courses, and resources.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 150,
        left: 25,
        posx: 'left',
        type: 'bottom',
        element: '.ui-content div.text-center',
        text: 'To be notified about when it\'s time to set a new goal, turn this on and you\'ll know what goals need to be set.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 225,
        left: 25,
        posx: 'left',
        type: 'bottom',
        element: '.ui-content div.text-center',
        text: 'To be notified about when new course content is available, turn this on and you\'ll know right away when new content has been unlocked or is available to you.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 300,
        left: 25,
        posx: 'left',
        type: 'bottom',
        element: '.ui-content div.text-center',
        text: 'To be notified about when new resources are available, turn this on and you\'ll be able to see any new resources that have been added to the resources page.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 215,
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.ui-content div.text-center',
        text: 'This button will save any changes you have made to your notification settings, so be sure so click it before you leave the page.',
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