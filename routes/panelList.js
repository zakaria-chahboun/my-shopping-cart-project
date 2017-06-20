/* Add Items To the Panel List */

module.exports = {
	"add": function (panelArray,list){
		var comp = 0;

		/* last quantity == 1 by default */

		// if panelList is empty
		if(panelArray.length == 0){
		list.lastQuantity = 1;
		panelArray.push(list);
		}
		// else if the panelList not empty
		else{
			for (var i = 0; i < panelArray.length; i++){
			// if element alery exist
			if(panelArray[i].id == list.id){
			/*	add a price to the product */
			comp++;
			}
			}
			// if a new element
			if(comp == 0)
			{
			list.lastQuantity = 1;
			panelArray.push(list);
			}
		}
	}
}