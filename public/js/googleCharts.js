
// Load the Visualization API and the corechart package.
google.charts.load('current', {
  'packages': ['corechart']
});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart_numberOfJobsPerIs);
// google.charts.setOnLoadCallback(drawChart_averageDurationOfJobs);
google.charts.setOnLoadCallback(drawChart_ColumnChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.

function drawChart_numberOfJobsPerIs() {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Instruciton Sheet');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Housekeeping - Executive Suite', 35],
    ['Departmental Health and Safety Inspection', 103],
    ['Restaurant Service - 2012', 214],
    ['Install 4G Module on Telecom Relay Mast', 13]
  ]);

  // Set chart options
  var options = {
    'title': 'Jobs by Instruction Sheet',
    'width': 400,
    'height': 300,
    'colors': ['#e2431e', '#d3362d', '#e7711b', '#e49307', '#e49307', '#b9c246'],
    'pieSliceText': 'value'
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div_numberOfJobsPerIs'));
  chart.draw(data, options);
}
//
// function drawChart_averageDurationOfJobs() {
//
//   // Create the data table.
//   var data = new google.visualization.DataTable();
//   data.addColumn('string', 'Topping');
//   data.addColumn('number', 'Slices');
//   data.addRows([
//     ['<= 1 day', 3],
//     ['2 - 5 days', 7],
//     ['5 - 9 days', 2],
//     ['>= 10 days', 1]
//   ]);
//
//   // Set chart options
//   var options = {
//     'title': 'Average duration of Jobs', //Average Jobs duration',
//     'width': 400,
//     'height': 300,
//     'colors': ['#b9c246', '#e49307', '#e7711b', '#d3362d', '#e2431e']
//   };
//
//   // Instantiate and draw our chart, passing in some options.
//   var chart = new google.visualization.PieChart(document.getElementById('chart_div_averageDurationOfJobs'));
//   chart.draw(data, options);
// }

function drawChart_ColumnChart() {
  var data = google.visualization.arrayToDataTable([
    ["Duration", "Quantity", {
      role: "style"
    }],
    ["<= 1 day", 21.45, "color: #68cf9b"],
    ["2 - 5 days", 19.30, "color: #b9c246"],
    ["5 - 9 days", 10.49, "color: #e49307"],
    [">= 10 days", 8.30, "color: #e7711b"]
  ]);

  var view = new google.visualization.DataView(data);
  view.setColumns([0, 1, {
      calc: "stringify",
      sourceColumn: 1,
      type: "string",
      role: "annotation"
    },
    2
  ]);

  var options = {
    title: 'Duration of Jobs',
    width: 600,
    height: 400,
    bar: {
      groupWidth: "95%"
    },
    legend: {
      position: "none"
    },
  };
  var chart = new google.visualization.ColumnChart(document.getElementById("chart_div_ColumnChart"));
  chart.draw(view, options);
}
