var goto = function (arg) {
// window.location.replace('http://localhost:3000/'+arg);
	document.getElementById('space').value = arg;
};

var testVar = function (arg1, arg2) {
	var txt1 = 'ID : ' + arg1;
	var txt2 = 'MSG: ' + arg2;
	var txt3 = txt1 + '<br>' + txt2;
	document.getElementById('mydiv').innerHTML = txt3;
};

// welcome page
var autoEmail = function () {
	var firstname = document.getElementById('fn').value;
	var lastname = document.getElementById('ln').value;
	if (firstname && lastname)
	document.getElementById('mail').value = firstname + '@' + lastname + '.com';
};

// show_infos page
var deletUser = function(id){
	$.ajax({
    url: 'http://localhost:3000/show/'+id,
    type: 'DELETE',
    success: function(result) {
      window.location.replace('http://localhost:3000/show ');
    }
	});
}