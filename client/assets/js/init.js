$(document).ready(function() {

    // toggle class to control open/close of off-canvas
    $('.open-menu').click(function() {
        $('body').toggleClass('menu-open');
    });

    // Closes the off-canvas menu on window resize
    $(window).resize(function() {
        if ($(window).width() < 978) {
            $('body').removeClass('menu-open');
        }
    });

    // Auto close off-canvas menu when item is clicked
    $('.mobile-menu li a').click(function() {
        $('body').removeClass('menu-open');
    });

    // Toggle class on body when site is at top position
    $(window).scroll(function() {
        if ($(window).scrollTop() >= 100) {
            $('body').addClass('changed');
        } else {
            $('body').removeClass('changed');
        }
    });

});