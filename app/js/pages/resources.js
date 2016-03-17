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
        text: 'Welcome to the resources page! Here, you\'ll have access to blogs, social accounts, and applications that can help with your financial management',
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
        text: 'In this box you\'ll find links to social media accounts that talk about finances and money management. Just click one of the links and you\'ll be taken to their page.',
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
        text: 'In this box you\'ll find access to financial blogs that can give you tips and tricks for managing your money.',
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
        text: 'In the green box, you\'ll find links to mobile applications that can help with budgeting, saving money, and just keeping general track of your finances.',
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