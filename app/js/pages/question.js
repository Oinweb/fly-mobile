/**
 * Created by chad on 4/22/16.
 */
var advance_tour = false;
var cur_bubble = 0;
var tour_bubbles = [
    {
        top: 45,
        left: 25,
        posx: 'left',
        type: 'bottom',
        center: true,
        element: '.ui-content div.text-center',
        text: 'Welcome to the quiz question page. On each page you\'ll be asked one multiple choice question.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 45,
        left: 25,
        posx: 'left',
        type: 'top',
        positiontoelement: '#id_question',
        positionto: true,
        element: '.ui-content div.text-center',
        text: 'To answer the question, simply click on one of the answers.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        bottom: 45,
        left: 35,
        posx: 'left',
        posy: 'bottom',
        type: 'top',
        center: true,
        element: '.ui-content div.text-center',
        text: 'Once you answer the question, you can either click \'Next\' to go to the next page, or \'Back\' to go to the previous page.  Your answer will be saved either way.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        bottom: 45,
        left: 35,
        posx: 'left',
        posy: 'bottom',
        type: 'top',
        element: '.ui-content div.text-center',
        text: 'Once you\'ve answered all of the questions, the \'Next\' button will be replaced with a \'Score Quiz\' button which will take you to the page where you can see how well you did.',
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
        active_bubble.detach();
        if(bubble.position == 'after'){
            $(bubble.element).after(active_bubble);
        }
        else {
            $(bubble.element).prepend(active_bubble);
        }

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
        if( bubble.posy == 'top'){
            active_bubble.css('top', bubble.top+'px').css('bottom', 'auto');
        }
        else if( bubble.posy == 'bottom'){
            active_bubble.css('bottom', bubble.bottom+'px').css('top', 'auto');
        }
        if( bubble.posx == 'left'){
            active_bubble.css('left',bubble.left+'px').css('right', 'auto');
        }
        else{
            active_bubble.css('right', bubble.right+'px').css('left', 'auto');
        }

        if( bubble.positionto ){
            var offset = $(bubble.positiontoelement).offset();
            active_bubble.css('left', offset.left + 25 + 'px');
            active_bubble.css('top', offset.top + 25 + 'px');
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