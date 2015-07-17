(function($) {

$.fn.visible = function(partial) {

    var $t = $(this),
        $w = $(window),
        lastScrollTop = 0;
        viewTop = $w.scrollTop(),
        viewBottom = viewTop + $w.height(),
        _top = $t.offset().top,
        _bottom = _top + $t.height(),
        compareTop = partial === true ? _bottom : _top,
        compareBottom = partial === true ? _top : _bottom;

    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

    };

})(jQuery);

var win = $(window);
var rightModule = $('.project:odd');
var leftModule = $('.project:even');

var skillLevel1 = $('.skill-lvl-1');
var skillLevel2 = $('.skill-lvl-2');
var skillLevel3 = $('.skill-lvl-3');


skillLevel1.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
        el.addClass("already-visible");
    }
});

skillLevel2.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
        el.addClass("already-visible");
    }
});

skillLevel3.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
        el.addClass("already-visible");
    }
});

rightModule.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
        el.addClass("already-visible");
    }
});

leftModule.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
        el.addClass("already-visible");
    }
});

win.scroll(function(event) {

    skillLevel1.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
            el.addClass("skill-lvl-1-active");
        }
    });

    skillLevel2.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
            el.addClass("skill-lvl-2-active");
        }
    });

    skillLevel3.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
            el.addClass("skill-lvl-3-active");
        }
    });

    rightModule.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
            el.addClass("come-in-right");
        }
    });

    leftModule.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
            el.addClass("come-in-left");
        }
    });

});