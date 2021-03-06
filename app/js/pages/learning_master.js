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
        text: 'Welcome to the courses page! Here you can see and access all course content that is unlocked for you.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 150,
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.red-box',
        text: 'This is Finances 101! Here you can learn tips, tricks and hacks for better managing your money. You can see a short description of the course below, as well as the estimated duration it will take you to complete it.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 150,
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.blue-box',
        text: 'This is Saving & Budgeting! Here you can learn how easy saving can be and why you need to budget.',
        button: '<br/><button data-role="none" onclick="advance_tour = true;">Continue</button>',
        hasaction: false
    },
    {
        top: 150,
        left: 25,
        posx: 'left',
        type: 'top',
        center: true,
        element: '.green-box',
        text: 'This is Credit Score 101! Here you can learn important information about getting the credit you need, and building your credit score.',
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
        positiontoelement: 'h3.ui-bar-a',
        positionto: true,
        text: 'The grayed out courses bewlow are locked until you achieve a certain level, or can be unlocked by completing a prior related course.',
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