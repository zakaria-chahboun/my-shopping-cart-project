//:: for main containt page ::
function displayInfo(obj){
	var id_of_Block = $(obj).parent().parent().attr('id');
	var image = $('#'+id_of_Block+' .myimg img');
	var imageText = $('#'+id_of_Block+' .myimg .textinfo');
	var imageStatut = $(image).css('display');
	var imageTextStatut = $(imageText).css('display');
			
	if(imageStatut.toLowerCase() == 'block' && imageTextStatut.toLowerCase() == 'none')
	{
		$(image).slideUp('slow');				
		$(imageText).slideDown('slow');
	}
	else if(imageStatut.toLowerCase() == 'none' && imageTextStatut.toLowerCase() == 'block')
	{
		$(image).slideDown('slow');				
		$(imageText).slideUp('slow');
	}
}

// add to panel button
function addToPanel(obj){
	var id_of_Block = $(obj).parent().parent().attr('id');
	$.ajax({
		url: '/add_to_cart/'+id_of_Block,
		type: 'GET',
		success: function(data){
				// if a good data :)
				if(data){
					// data is an array
					var HowMany = 0;
					for (var i = 0; i < data.length; i++){
						HowMany++;
					}
					$('#badgeCart').text(HowMany);
				}
				/* if the data come from server with null value == no item */
				else{
						alert('Error!\nRestart Your Page!');
				}
		},
		error: function (){
			alert('Error!\nCheck Your Network Connection!');
		} 
	});
}

// view panel (list and information)
function showCart(){
	/* loading ... */
	$('#modalShoppingCart .myModalCart').html("<img style='display:block;margin:auto;' src='/images/loading/ripple.gif'/>");
	/* request :) */
	$.ajax({
		url: '/show_cart',
		type: 'GET',
		success: function(data){
					if(data == 'noLogin')
						window.location.replace('/login/');

					else if(data == 'noItem')
						alert('Please add same products in the panel');

					else{
						$('#modalShoppingCart').fadeIn();
						$('#modalShoppingCart .myModalCart').html(data);
						$('body').css('overflow','hidden');
					}
		},
		error: function (){
			alert('Error!\nCheck Your Network Connection!');
		} 
	});
}

// check out
function checkOut(){
	// "checkOutForm" from server  :) 
	$('#checkOutForm').submit();
}