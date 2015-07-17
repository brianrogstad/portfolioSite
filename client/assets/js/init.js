
$(document).ready(function(){
	$('.open-menu').click(function(){
		$('body').toggleClass('menu-open');
	});

	$(window).resize(function() {
		if ($(window).width() < 978) {
			$('body').removeClass('menu-open');
		}
	});

	$('.mobile-menu li a').click(function(){
		$('body').removeClass('menu-open');
	});

});