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
        text: 'Welcome to the course quiz page! Here, you\'ll go through 5 questions that test your knowledge of the course you\'ve just taken.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 45,
        left: 25,
        posx: 'left',
        type: 'bottom',
        center: true,
        element: '.ui-content div.text-center',
        text: 'The questions are all multiple choice, and once you\'ve completed the questions, we\'ll score your quiz and you may receive XP or a badge depending on your score.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 45,
        left: 25,
        posx: 'left',
        posy: 'top',
        type: 'bottom',
        center: true,
        element: '.ui-content div.text-center',
        text: 'If you didn\'t do very well on the quiz, you can always take it again.  You can also look at the right answers for the quiz, but doing this won\'t allow you to re-take the quiz.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        bottom: 45,
        right: 25,
        posx: 'right',
        posy: 'bottom',
        type: 'top',
        center: true,
        element: '.ui-page',
        text: 'To start the quiz, click the \'Begin\' button and you\'ll be taken to the first page.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        bottom: 45,
        left: 25,
        posx: 'left',
        posy: 'bottom',
        type: 'top',
        center: true,
        element: '.ui-page',
        text: 'To close the quiz and return to the course content, click the \'Close Quiz\' button.',
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
            active_bubble.css('left', offset.left);
            active_bubble.css('top', offset.top);
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