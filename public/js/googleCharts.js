// Load the Visualization API and the corechart package.
google.charts.load('current', {
  'packages': ['corechart']
});

moment.locale('en');

// Set a callback to run when the Google Visualization API is loaded:
google.charts.setOnLoadCallback(drawChart_CompletionChart);
google.charts.setOnLoadCallback(drawChart_numberOfJobsPerIs);
// google.charts.setOnLoadCallback(drawChart_averageDurationOfJobs);
// google.charts.setOnLoadCallback(drawChart_ColumnChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart_numberOfJobsPerIs() {
  var dataGraph;

  // Create the data table.
  getExecutedStepsByJobID(null, 4, function(err, data, next) {
    parseExecutedStep(err, data, function(err, data, next) {
      getDataTableForExecutionsPerIS(err, data, function(err, data, next) {
        var dataGraph = google.visualization.arrayToDataTable(data);
        var view = new google.visualization.DataView(dataGraph);

        // var data = new google.visualization.DataTable();
        // data.addColumn('string', 'Instruction Sheet');
        // data.addColumn('number', 'Slices');
        // data.addRows([
        //   ['Housekeeping - Executive Suite', 35],
        //   ['Departmental Health and Safety Inspection', 103],
        //   ['Restaurant Service - 2012', 214],
        //   ['Install 4G Module on Telecom Relay Mast', 13]
        // ]);

        // Set chart options
        var options = {
          'title': 'Jobs by Instruction Sheet',
          'width': 400,
          'height': 400,
          'colors': ['#e2431e', '#d3362d', '#e7711b', '#e49307', '#e49307', '#b9c246'],
          'pieSliceText': 'value'
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('chart_div_numberOfJobsPerIs'));
        chart.draw(dataGraph, options);

      });
    });
  });
}


/**
 * draw Completion Chart based on cloud data using API call get exec data
 */
function drawChart_CompletionChart() {
  var dataGraph;

  getExecutedStepsByJobID(null, 4, function(err, data, next) {
    parseExecutedStep(err, data, function(err, data, next) {
      getDataTableForExecutionsCompletion(err, data, function(err, data, next) {

        dataGraph = google.visualization.arrayToDataTable(data);
        var view = new google.visualization.DataView(dataGraph);
        var options_stacked = {
          isStacked: true,
          height: 500,
          legend: {
            position: 'top',
            maxLines: 3
          },
          colors: ['#b9c246', '#e2431e', '#e49307', '#e7711b', '#d3362d' ],
          vAxis: {
            minValue: 0
          }
        };

        var options_fullStacked = {
          isStacked: 'percent',
          height: 400,
          legend: {position: 'top', maxLines: 3},
          colors: ['#b9c246', '#e2431e', '#e49307', '#e7711b', '#d3362d' ],
          vAxis: {
            minValue: 0,
            ticks: [0, .3, .6, .9, 1]
          }
        };

        var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
        chart.draw(view, options_fullStacked);

      });
    });
  });
}

/**
 *
 */
function drawChart_averageDurationOfJobs() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['<= 1 day', 3],
    ['2 - 5 days', 7],
    ['5 - 9 days', 2],
    ['>= 10 days', 1]
  ]);

  // Set chart options
  var options = {
    'title': 'Average duration of Jobs', //Average Jobs duration',
    'width': 400,
    'height': 300,
    'colors': ['#b9c246', '#e49307', '#e7711b', '#d3362d', '#e2431e']
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div_averageDurationOfJobs'));
  chart.draw(data, options);
}

/*
 *
 */
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


// see with pouya for sequencing async call hen more than 3 functions as callback
var done = function(err, data) {

  // ...

  // err = erreur qq part
  // data = dernier appel
};

function mstep(firstArg, listOfFunctions, done) {
  // get and delete first of listOfFunctions
  // do the call
  // ...

  if (listOfFunctions.length > 0) {
    mstep(firstArg, listOfFunctions[0], done);
  }
}

// mstep(4, [
//   "getExecutedStepsByJobID",
//   "parseExecutedStep",
//   "drawIndicator",
// ], done);

/**
 * Extract data from all Jobs to create a chart data table
 * @constructor
 * @param {error} error - error code.
 * @param {object} executions - Results of all jobs (not archived).
 * @param {string} callback - callback function.
 * @return {array} graphContent - data table (array of array) with value for google charts.
 */
function getDataTableForExecutionsDuration(err, executions, callback) {

  graphContent.push(['Job', 'Completed', 'Not Completed', 'To Be Completed', { role: 'annotation'}]);
}

/**
 * Extract data from all Jobs to create a chart data table
 * @constructor
 * @param {error} error - error code.
 * @param {object} executions - Results of all jobs (not archived).
 * @param {string} callback - callback function.
 * @return {array} graphContent - data table (array of array) with value for google charts.
 */
function getDataTableForExecutionsPerIS(err, executions, callback) {
  var graphContent = [], dic ={};

  graphContent.push(["Instruction Sheet", "Username", {role: "style"}]);
  var nb = executions.length;

  executions.forEach(function(exec) {
    if (exec.jobInfo !== undefined) {
      if (exec.jobInfo.Archived == false) {
        // console.log("executions: " + JSON.stringify(exec.jobInfo));

        // Need to retrieve the name of an IS from API !!
        // Need to avoid calling another time if already got the name
        getByIDInstructionSheet(null, exec.jobInfo.isID, function(err, data, next) {
          if(dic[data.Name] === undefined) {dic[data.Name] = 1;}
          else {dic[data.Name] = dic[data.Name]+1;}
          nb--;
          if(nb < 1){
            // console.log(JSON.stringify(dic));
            var arr = [['instruction sheet', 'qte']];

            for(var x in dic){
              arr.push([x, dic[x]]);
            }
            // console.log(JSON.stringify(arr));
            return callback && callback(null, arr);
          }
        });

      }
    }
  });

  // graphContent.push([exec.jobInfo.isID, exec.execID, exec.jobInfo.UserName]);
  // console.log(JSON.stringify(dic));

}

/**
 * Extract data from all Jobs to create a chart data table
 * @constructor
 * @param {error} error - error code.
 * @param {object} executions - Results of all jobs (not archived).
 * @param {string} callback - callback function.
 * @return {array} graphContent - data table (array of array) with value for google charts.
 */
function getDataTableForExecutionsCompletion(err, executions, callback) {
  // console.log("executions: " + JSON.stringify(executions));
  var ISID = null,
    graphContent = [],
    nbCompleted = 0,
    nbNotCompleted = 0,
    nbNotes = 0,
    nbAnswer = 0,
    strNotes = "",
    job = 0,
    answers = [],
    currentJob = 0,
    previousJob = 0,
    jobInfo = [],
    nbanswers = null,
    toBeCompleted = null,
    previousAnswerTime= moment();

    graphContent.push(['Job', 'Completed', 'Not Completed', 'To Be Completed', { role: 'annotation'}]);


  // console.log("NUMBER OF JOBS: " + executions.length);
  executions.forEach(function(exec) {
    if (exec.jobInfo !== undefined) {
      if (exec.jobInfo.Archived == false) {
        // console.log("executions: " + JSON.stringify(exec));
        nbanswers = exec.answers.length;

        exec.answers.forEach(function(answer) {
          ISID = answer.InstructionSheetID;
          stepStatus = answer.StepProgress;
          if (stepStatus != null) {
            switch (stepStatus) {
              case "Not Completed":
                nbNotCompleted++;
                break;
              case "Completed":
                nbCompleted++;
                break;
            }
          }

          if (answer.StepNotes != null) {
            nbNotes++;
            strNotes += "  Note" + nbNotes + ": " + answer.StepNotes + "\n";
          }

          if(previousAnswerTime){
            // console.log("Answering duration : " + moment(answer.TimeAnswered).from(previousAnswerTime));
            // console.log("Answering duration : " + humanizedDuration(jobRequestTimeStamp, jobStartTimeStamp));
            previousAnswerTime = moment(answer.TimeAnswered);
          }
        });

        toBeCompleted = nbanswers - (nbNotCompleted + nbCompleted);

        // console.log("Instruction Sheet : " + ISID + " > JOB " + exec.execID + ": " + nbanswers + " steps (" + nbCompleted + " Completed + " + nbNotCompleted + " Not Completed + " + toBeCompleted + " To Be Completed)");

        var jobRequestTimeStamp = moment(exec.jobInfo.RequestTime);
        var jobStartTimeStamp = moment(exec.jobInfoStartTime);
        var jobEndTimeStamp = moment(exec.jobInfo.EndTime);

        // console.log('exec.RequestTime: ' +  exec.RequestTime + '. exec.RequestTime: ' + exec.StartTime + '. exec.EndTime: ' + exec.EndTime);


        document.getElementById("average").innerHTML = document.getElementById("average").innerHTML + '</br>JOB ' + exec.execID + " - " + exec.jobInfo.UserName +  " reacts in " + humanizedDuration(jobRequestTimeStamp, jobStartTimeStamp) + " and has spend " + humanizedDuration(jobStartTimeStamp, jobEndTimeStamp) + " on it.";

        // console.log('JOB ' + exec.execID + " - " + exec.jobInfo.UserName +  " reacts in " + humanizedDuration(jobRequestTimeStamp, jobStartTimeStamp) + " and has spend " + humanizedDuration(jobStartTimeStamp, jobEndTimeStamp) + " on it.");


         // + ': ' + exec.jobInfo.UserName
        graphContent.push([exec.execID+'', nbCompleted, nbNotCompleted, toBeCompleted, '']);

        // if (nbNotes > 0) {
        //   console.log(nbNotes + " Note(s):");
        //   console.log(strNotes);
        // }
        nbCompleted = 0, nbNotCompleted = 0, nbNotes = 0, nbanswers = 0, strNotes = "";
      }
    }
  });

  // console.log(JSON.stringify(graphContent));

  return callback && callback(null, graphContent);
}


function humanizedDuration(now, then) {
  var ms = moment(now).diff(moment(then));
  var d = moment.duration(ms);
  // var s = d.format("hh:mm:ss");
  // console.log(d.humanize());
  return d.humanize();
}