//:: Admin JS ::

//:::::::::: admin login :::::::::://
	// centerd postion of div
	$('#start').click(function(){
		$(this).fadeOut()
		
		$('.logo').slideUp(function () {
			$('#adminPanel').slideDown();
		});
	});
