// var domain = 'risualdev-tactac-api';
var domain = 'tactacapi';

// deserialize();

function deserialize() {
  var escapeJSON = "{\"InstructionSheetID\":\"7\",\"StepID\":\"89\",\"StepNotes\":null,\"StepProgress\":null}";
  console.log(escapeJSON);
  var your_object = JSON.parse(escapeJSON);
  console.log(your_object);

  var jsonAsString = JSON.stringify(your_object).replace(/\\"/g, '\\"');
  console.log(jsonAsString);
  // console.log(escape(jsonAsString));
  // console.log(jsonAsString.replace(/\\"/g, '\\"')); //.replace(/\"/g,'&quot;'));

  var your_object = JSON.parse(jsonAsString);
  console.log(your_object);
}


/**
 * Get authentication to Cloud API
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
function getAuthenTac() {
  // password_md5 = $.md5('password'),
  var password_md5 = "807ff71b3301262e222ad05e5b7c4325",
    registerRequestJSON = {
      "username": "TacTacTest@risual.com",
      "password": password_md5,
      "deviceID": "CasewiseTestDevice"
    };

  $.ajax({
    type: "POST",
    url: "https://" + domain + ".azurewebsites.net/api/Login/Authenticate",
    data: registerRequestJSON,
    contentType: "application/json",
    success: function(data) {
      console.log('api/Login/Authenticate: ' + data);
    },
    error: function(jqxhr) {
      console.error('api/Login/Authenticate: ' + JSON.stringify(jqxhr, null, 1));
    }
  });
}


/**
 * Post an Instruction Sheet to Cloud API
 * @constructor
 * @param {string} token - web token JWT. not required yet
 * @param {object} instructionSheet - not required yet.
 */
function postInstructionSheetTac(token, instructionSheet) {
  var IS_ID = -1;
  $.getJSON('https://' + domain + '.azurewebsites.net/api/InstructionSheet/Add', function(data) {
    // $("<div class='codeBloc'><pre><code>" + JSON.stringify(data, null, 1) + "</code></pre></div>").appendTo(".content");
    console.log('API - postInstructionSheetTac(token, instructionSheet): ' + JSON.stringify(data, null, 1));
  });
  return IS_ID;
}

/**
 * Get an Instruction sheet by ID from Cloud API
 * @constructor
 * @param {error} error - error code.
 * @param {int} id - instruction Sheet ID.
 * @param {string} callback - callback function.
 * @return {object} InstructionSheet -
 */
function getByIDInstructionSheet(error, id, callback) {
  var error = null;
  $.getJSON('https://' + domain + '.azurewebsites.net/api/InstructionSheet/GetByID/' + id, function(data) {
    // console.log(JSON.stringify(data, null, 1));
    // console.debug("getByIDInstructionSheet: " + data.Name);
    return callback && callback(error, data);
  });
}

/**
 * Just for test purpose in between a get and a post call
 * @constructor
 * @param {error} error - error code.
 * @param {object} data - instruction Sheet.
 * @param {string} callback - callback function.
 */
function changeISName(error, data, callback) {
  var error = null,
    d = new Date(),
    previousName = data.Name;
  data.Name = previousName + " " + d.toISOString().substring(0, 19);
  console.info("changeISName: " + previousName + " > " + data.Name);
  return callback && callback(error, data);
}

// Update an Instruciton sheet by ID from Cloud API

function testUpdateByIDInstructionSheet(error, data, callback) {
  var error = null;
  $.ajax({
    type: "POST",
    url: "https://" + domain + ".azurewebsites.net/api/InstructionSheet/Update/" + data.InstructionSheetID,
    data: data,
    contentType: "application/json",
    success: function(data2) {
      console.log('api/InstructionSheet/Update/' + data.InstructionSheetID + ': ' + data2);
      return callback && callback(error, data2);
    },
    error: function(jqxhr) {
      console.error('api/InstructionSheet/Update/' + data.InstructionSheetID + ': ' + JSON.stringify(jqxhr, null, 1));
      return callback && callback(jqxhr.status, undefined);
    }
  });
}

// getExecutedStepsByJobID(null, 4, parseExecutedStep);
// parseExecutedStep();

// Get Executed steps by Job ID from Cloud API ** DEPRECATED

function getExecutedStepsByJobID(error, id, callback) {
  var error = null;
  $.getJSON('https://' + domain + '.azurewebsites.net/api/Execution/GetExecutedStepsByJobID/' + id, function(data) {
    // console.log("getExecutedStepsByJobID: " + JSON.stringify(data, null, 1));
    // console.debug("getExecutedStepsByJobID: " + data.Name);
    return callback && callback(error, data);
  });
}

// Get Executed steps by Job ID from Cloud API ** DEPRECATED
// "StepID": 10001,
// "AnswerID": 31,
// "Notes": "{\"InstructionSheetID\":\"7\",\"StepID\":\"94\",\"StepNotes\":null,\"StepProgress\":\"Completed\"}",
// "JobID": 4


function parseExecutedStep(error, executedSteps, callback) {

  var nbCompleted = 0,
    nbNotCompleted = 0,
    nbNotes = 0,
    nbAnswer = 0,
    strNotes = "",
    job = 0,
    display = false,
    executions = [],
    answers = [],
    currentJob = 0,
    previousJob = 0,
    jobInfo = [],
    nbanswers = null,
    header = {},
    toBeCompleted = null,
    header = [],
    answers = [],
    jobHasChanged = false;

  // ALL GOOD
  executedSteps.forEach(function(executedStep) {
    if (executedStep.StepID > 9999) {
      currentJob = executedStep.StepID;
      jobInfo = JSON.parse(executedStep.Notes);

      if (executedStep.Notes[2] == 'A') {
        executions.push({
          "execID": currentJob,
          jobInfo,
          "answers": []
        });
      }

      if (executedStep.Notes[2] == 'I') {
        executions[executions.length - 1].answers.push(JSON.parse(executedStep.Notes));
      }
    }
  });
  // console.log(JSON.stringify(executions, null, 1));
  return callback && callback(error, executions);
}



// Get an Instruciton sheet by ID from Cloud API

function getAllInstructionSheet() {
  $("<img id='loarder' src='./images/5.gif'>").appendTo(".content");

  var jqxhr = $.getJSON("https://" + domain + ".azurewebsites.net/api/InstructionSheet/GetAll")
    .complete(function() {
      $("#loader").remove();
      $("<h3>getAllInstructionSheet</h3>").appendTo(".content");
      $("<div class='codeBloc'><pre><code>" + JSON.stringify(jqxhr.responseText, null, 1) + "</code></pre></div>").appendTo(".content");
      // console.log('API - getAllInstructionSheet(): ' + JSON.stringify(jqxhr.responseText, null, 1));
    });
}
