/* jshint -W117 */

$(document).ready(function() {

    // set page at top upon refresh
    $(this).scrollTop(0);

    // toggle class to control open/close of off-canvas
    $('.open-menu').click(function() {
        $('body').addClass('menu-open');
    });

    // toggle class to control open/close of off-canvas
    $('.close-menu').click(function() {
        $('body').removeClass('menu-open');
    });

    // Auto close off-canvas menu when item is clicked
    $('.project-nav li a').click(function() {
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
