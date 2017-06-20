$(document).ready(function(){

	//Plugin Initialization
	$(".button-collapse").sideNav();// mobile side bar ...
	$('.materialboxed').materialbox(); //if you add images dynamically, you will have to add this
	$('.modal').modal();

	// toggle search
	$("#id_search").click(function(){
		$("#id_search_bar").toggle('fast','linear');
	});
	// clear search field
	$('#clearSearch').click(function(){
		$("#searchHome").val('');
		$("#id_search_bar").slideUp();
	});

	// autocomplete search
	$('#searchHome').keyup(function(e){
		var code = e.keyCode || e.which;
		var title = $('#searchHome').val();
		$("#searchList").html('<br>'); // to clear data and for design

		if(code == 13){ //Enter keycode
			if(title)
			window.location.replace('/search/'+title);
		}
		$.ajax({
			url: '/search',
			data: JSON.stringify({"title" : title}),
			contentType: 'application/json',
			type: 'POST',
			success: function(data){
				data.forEach(function(el){
					var regex = new RegExp(title,'gi');
					var final = el.title.replace(regex,'<p style="display:inline;" class="pink-text">'+title+'</p>');
					var list = "<li onclick='goSearch(this)' id="+el.id+">"+final+"</li>";
					$('#searchList').append(list);
				});
			}
		});
	});
});