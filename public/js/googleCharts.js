// Load the Visualization API and the corechart package.
google.charts.load('current', {
  'packages': ['corechart']
});

var instructionSheets_ID_Name_Dic = {
  "7": "Housekeeping - Executive Suite"};


moment.locale('en');

// Set a callback to run when the Google Visualization API is loaded:
google.charts.setOnLoadCallback(drawChart_CompletionChart);
google.charts.setOnLoadCallback(drawChart_numberOfJobsPerUser);
// google.charts.setOnLoadCallback(drawChart_averageDurationOfJobs);
google.charts.setOnLoadCallback(drawChart_ColumnChart_averageDurationOfJobs);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart_numberOfJobsPerUser() {
  var dataGraph;
  // Create the data table.
  getExecutedStepsByJobID(null, 4, function(err, data, next) {
    parseExecutedStep(null, data, function(err, data, next) {
      getDataTableForExecutionsPerUser(null, data, function(err, data, next) {
      // getDataTableForExecutionsPerIS(null, data, function(err, data, next) {
        var dataGraph = google.visualization.arrayToDataTable(data);
        var view = new google.visualization.DataView(dataGraph);

        // Set chart options
        var options = {
          'title': 'Open Jobs per User',
          'width': 400,
          'height': 400,
          // 'colors': ['#e2431e', '#d3362d', '#e7711b', '#e49307', '#e49307', '#b9c246'],
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
          title: '% of completion per Job id',
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
          title: '% of completion per Job id',
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
 * FAKE
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
 * FAKE
 */
function drawChart_ColumnChart_averageDurationOfJobs() {
  getExecutedStepsByJobID(null, 4, function(err, data, next) {
    parseExecutedStep(null, data, function(err, data, next) {
      getDataTableForAverageDuration(null, data, function(err, data, next) {
        var dataGraph = google.visualization.arrayToDataTable(data);
        // var view = new google.visualization.DataView(dataGraph);

        //
        // var data = google.visualization.arrayToDataTable([
        //   ["Duration", "Quantity", {
        //     role: "style"
        //   }],
        //   ["<= 1 day", 21.45, "color: #68cf9b"],
        //   ["2 - 5 days", 19.30, "color: #b9c246"],
        //   ["5 - 9 days", 10.49, "color: #e49307"],
        //   [">= 10 days", 8.30, "color: #e7711b"]
        // ]);

        var view = new google.visualization.DataView(dataGraph);
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
      });
    });
  });
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
  var graphContent = [], dic = {}, nb, ISname = '';

  graphContent.push(["Instruction Sheet", "Quantity", {role: "style"}]);
  nb = executions.length;

  executions.forEach(function(exec) {
    if (exec.jobInfo !== undefined) {
      if (exec.jobInfo.Archived == false) {
        // console.error("executions: " + JSON.stringify(exec.jobInfo));

        // Need to retrieve the name of an IS from API !!
        // Need to avoid calling another time if already got the name

        console.debug("IF : " + instructionSheets_ID_Name_Dic[exec.jobInfo.isID]);

        if (!instructionSheets_ID_Name_Dic[exec.jobInfo.isID]) {
          getByIDInstructionSheet(null, exec.jobInfo.isID, function(err, data, done) {
            dic[data.Name] = 1;
            instructionSheets_ID_Name_Dic[exec.jobInfo.isID] = data.Name;
            console.debug("  -- NEW " + instructionSheets_ID_Name_Dic[exec.jobInfo.isID]);
          });
        }
        else {
          console.debug("  -- EXISTING " + instructionSheets_ID_Name_Dic[exec.jobInfo.isID]);
          ISname = instructionSheets_ID_Name_Dic[exec.jobInfo.isID];
          dic[ISname] = parseInt(dic[ISname])+1;

          if (nb<2) {
          console.debug(JSON.stringify(instructionSheets_ID_Name_Dic));

          console.debug(JSON.stringify(dic));
            var arr = [['instruction sheet', 'quantity']];

            for(var x in dic){
              arr.push([x, dic[x] ]);
            }
            console.debug(JSON.stringify(arr));
            return callback && callback(null, arr);
           }
        }
      }
    }
    console.debug(nb);
    nb--;
  });
}

/**
 * Jobs (not archived) per User
 * @constructor
 * @param {error} error - error code.
 * @param {object} executions - Results of all jobs (not archived).
 * @param {string} callback - callback function.
 * @return {array} graphContent - data table (array of array) with value for google charts.
 */
function getDataTableForExecutionsPerUser(err, executions, callback) {
  var graphContent = [], dic = {}, nb, ISname = '', archived_jobs, open_jobs;

  graphContent.push(["User name", "Quantity", {role: "style"}]);
  nb = executions.length;
  open_jobs = archived_jobs = 0;

  executions.forEach(function(exec) {
    if (exec.jobInfo !== undefined) {
      if (exec.jobInfo.Archived == false) {
        if (dic[exec.jobInfo.UserName] == null) {
          dic[exec.jobInfo.UserName] = 1;
        } else {
          dic[exec.jobInfo.UserName] = dic[exec.jobInfo.UserName] + 1;
        }
        open_jobs++;
      }
      else {
        archived_jobs++;
      }
    }
    if (nb < 2) {
      var arr = [
        ['User name', 'quantity']
      ];
      for (var x in dic) {
        arr.push([x, dic[x]]);
      }
      document.getElementById("job-value").innerHTML = " " + open_jobs + " Open and " + archived_jobs + " Archived";


      return callback && callback(null, arr);
    }
    nb--;
  });
}

/**
 * Extract data from all Jobs to create a chart data table
 * @constructor
 * @param {error} error - error code.
 * @param {object} executions - Results of all jobs (not archived).
 * @param {string} callback - callback function.
 * @return {array} graphContent - data table (array of array) with value for google charts.
 */
function getDataTableForAverageDuration(err, executions, callback) {
  // console.log("executions: " + JSON.stringify(executions));
  var ISID = null,
    graphContent = [],
    previousAnswerTime = moment();

  graphContent.push(['Duration', 'Quantity', {
    role: 'style'
  }], ["<= 4 hours", 0, "color: #68cf9b"], ["< 8 hours", 0, "color: #b9c246"], ["1 - 2 days", 0, "color: #e49307"], [">= 3 days", 0, "color: #e7711b"]);

  // console.log("NUMBER OF JOBS: " + executions.length);
  executions.forEach(function(exec) {
      if (exec.jobInfo !== undefined) {
        if (exec.jobInfo.Archived == false) {
          // console.log("executions: " + JSON.stringify(exec));
          nbanswers = exec.answers.length;

          exec.answers.forEach(function(answer) {
            if (previousAnswerTime) {
              previousAnswerTime = moment(answer.TimeAnswered);
            }
          });

          var jobRequestTimeStamp = moment(exec.jobInfo.RequestTime);
          var jobStartTimeStamp = moment(exec.jobInfo.StartTime);
          var jobEndTimeStamp = moment(exec.jobInfo.EndTime);
          var delta = Math.abs(msDuration(jobRequestTimeStamp, jobEndTimeStamp));

          if (delta < 14400001) {
            // less than 4 hours
            graphContent[1][1]++;
          } else if (delta < 28800001) {
            // less than 8 hours
            graphContent[2][1]++;
          } else if (delta < 172800001) {
            // less than 48 hours
            graphContent[3][1]++;
          } else {
            // case < 432000000:
            // less than 5 days
            // more than 5 days
            graphContent[4][1]++;
            // break;
          }
        }
        // *** DISPLAY :
        // document.getElementById("average").innerHTML = document.getElementById("average").innerHTML + '</br>Job ' + exec.execID + " - <b>" + exec.jobInfo.UserName +  "</b> reacts in " + humanizedDuration(jobRequestTimeStamp, jobStartTimeStamp) + " and has spend " + humanizedDuration(jobStartTimeStamp, jobEndTimeStamp) + " on it.";
      }
  });

// console.log(JSON.stringify(graphContent));
return callback && callback(null, graphContent);
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

        var jobRequestTimeStamp = moment(exec.jobInfo.RequestTime);
        var jobStartTimeStamp = moment(exec.jobInfo.StartTime);
        var jobEndTimeStamp = moment(exec.jobInfo.EndTime);

        // *** DEBUG :
        // console.log("Instruction Sheet : " + ISID + " > JOB " + exec.execID + ": " + nbanswers + " steps (" + nbCompleted + " Completed + " + nbNotCompleted + " Not Completed + " + toBeCompleted + " To Be Completed)");
        // console.log('exec.RequestTime: ' +  exec.RequestTime + '. exec.RequestTime: ' + exec.StartTime + '. exec.EndTime: ' + exec.EndTime);
        // console.log('JOB ' + exec.execID + " - " + exec.jobInfo.UserName +  " reacts in " + humanizedDuration(jobRequestTimeStamp, jobStartTimeStamp) + " and has spend " + humanizedDuration(jobStartTimeStamp, jobEndTimeStamp) + " on it.");

        // *** DISPLAY :
        // document.getElementById("average").innerHTML = document.getElementById("average").innerHTML + '</br>Job ' + exec.execID + " - <b>" + exec.jobInfo.UserName +  "</b> reacts in " + humanizedDuration(jobRequestTimeStamp, jobStartTimeStamp) + " and has spend " + humanizedDuration(jobStartTimeStamp, jobEndTimeStamp) + " on it.";


         // + ': ' + exec.jobInfo.UserName
        graphContent.push([exec.execID+'', nbCompleted, nbNotCompleted, toBeCompleted, '']);

        if (nbNotes > 0) {
          var qte = parseInt(document.getElementById("comment-value").innerHTML.split(' New '))[0];
          if (qte > 0) {
            document.getElementById("comment-value").innerHTML = qte + nbNotes + " New / 173 Comments";
            // console.log(nbNotes + " Note(s):");
            // console.log(strNotes);
          } else {
            document.getElementById("comment-value").innerHTML = nbNotes + " New / 173 Comments";
          }
        } else {
          document.getElementById("comment-value").innerHTML = " 173 Comments";
        }


        nbCompleted = 0, nbNotCompleted = 0, nbNotes = 0, nbanswers = 0, strNotes = "";
      }
    }
  });

  // console.log(JSON.stringify(graphContent));
  return callback && callback(null, graphContent);
}


function msDuration(now, then) {
  var ms = moment(now).diff(moment(then));
  // console.debug(moment.duration(ms));
  return(moment.duration(ms));
}

function humanizedDuration(now, then) {
  var ms = moment(now).diff(moment(then));
  var d = moment.duration(ms);
  // var s = d.format("hh:mm:ss");
  // console.log(d.humanize());
  return d.humanize();
}