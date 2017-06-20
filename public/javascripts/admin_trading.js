// DH per day in week charts | home page 
function displayTradingChart(mydata) {
var ctx = document.getElementById("myChart");
var chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
    	labels: ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],
    	datasets: [{
            label: 'Total: DH',
            data: mydata,
			backgroundColor: "rgba(95,231,241,0.1)",
			borderColor: "rgba(75,192,192,1)",
			pointBorderColor: "#e16fb7",
			pointBackgroundColor: "#fff",
			pointBorderWidth: 3 
        }],		
    },
    options: {
        title: {
            display: true,
            text: 'Les ventes de la semaine'
        }
    }
})
}

// How Many items buy in categories charts
function displayItemsCategories(mydata,mycolors,mylabels) {
var ctx = document.getElementById("myChartA");
var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data:  {
        labels: mylabels,
        datasets: [{
            data: mydata,
            backgroundColor: mycolors
        }]
    },
    options:  {
        title: {
            display: true,
            text: 'Les produits achetés'
        }
    }
});
}

// How Mach buy categories charts
function displayMoneyCategories(mydata,mycolors,mylabels) {
var ctx = document.getElementById("myChartB");
var myDoughnutChart = new Chart(ctx, {
    type: 'bar',
    data:  {
        labels: mylabels,
        datasets: [{
            label: 'DH ',
            data: mydata,
            backgroundColor: mycolors
        }]
    },
    options:  {
        title: {
            display: true,
            text: 'Les ventes'
        }
    }
});
}