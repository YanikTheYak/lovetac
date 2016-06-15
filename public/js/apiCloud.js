var domain = 'risualdev-tactac-api';
// var domain = 'tactacapi';

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

// Get authentication to Cloud API

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
    url: "http://"+ domain +".azurewebsites.net/api/Login/Authenticate",
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


// Post an Instruction Sheet to Cloud API
function postInstructionSheetTac(token, instructionSheet) {
  var IS_ID = -1;
  $.getJSON('http://'+ domain +'.azurewebsites.net/api/InstructionSheet/Add', function(data) {
    // $("<div class='codeBloc'><pre><code>" + JSON.stringify(data, null, 1) + "</code></pre></div>").appendTo(".content");
    console.log('API - postInstructionSheetTac(token, instructionSheet): ' + JSON.stringify(data, null, 1));
  });
  return IS_ID;
}


// Get an Instruciton sheet by ID from Cloud API
function getByIDInstructionSheet(error, id, callback) {
  var error = null;
  $.getJSON('http://'+ domain +'.azurewebsites.net/api/InstructionSheet/GetByID/' + id, function(data) {
    // console.log(JSON.stringify(data, null, 1));
    console.debug("getByIDInstructionSheet: " + data.Name);
    return callback && callback(error, data);
  });
}

// Just for test purpose in between a get and a post call
function changeISName (error, data, callback) {
  var error = null, d = new Date();
  data.Name = "Test " + d.toISOString().substring(0, 10);
  console.debug("changeISName: " + data.Name);
  return callback && callback(error, data);
}

// Update an Instruciton sheet by ID from Cloud API
function updateByIDInstructionSheet(error, data, callback) {
  var error = null;
  $.ajax({
    type: "POST",
    url: "http://"+ domain +".azurewebsites.net/api/InstructionSheet/Update/" + data.InstructionSheetID,
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

getExecutedStepsByJobID(null, 4, parseExecutedStep);
// Get Executed steps by Job ID from Cloud API ** DEPRECATED

function getExecutedStepsByJobID(error, id, callback) {
  var error = null;
  $.getJSON('http://' + domain + '.azurewebsites.net/api/Execution/GetExecutedStepsByJobID/' + id, function(data) {
    // console.log("getExecutedStepsByJobID: " + JSON.stringify(data, null, 1));
    // console.debug("getExecutedStepsByJobID: " + data.Name);
    return callback && callback(error, data);
  });
}

// Get Executed steps by Job ID from Cloud API ** DEPRECATED

function parseExecutedStep(error, executedSteps, id) {
  var nbCompleted = 0,
    nbNotCompleted = 0,
    nbNotes = 0,
    nbAnswer = 0,
    strNotes = "",
    job = 0,
    display = false;

  executedSteps.forEach(function(executedStep) {
    if (executedStep.StepID > 100) {

      // Pouya: Faire une liste de liste !!!

      // executedStep.StepID // 10000 = exec
      // executedStep.AnswerID // = step id

      var executionValue = JSON.parse(executedStep.Notes);
      // console.warn(executionValue);
      if (executionValue.InstructionSheetID) {
        nbAnswer++;

        if (executionValue.StepNotes != null) {
          nbNotes++;
          strNotes += "  Note" + nbNotes + ": " + executionValue.StepNotes + "\n";
        }

        if (executionValue.StepProgress != null) {
          // console.log(executionValue.StepProgress);
          switch (executionValue.StepProgress) {
            case "Not Completed":
              nbNotCompleted++;
              break;

            case "Completed":
              nbCompleted++;
              break;
          }
        }
      }
      // console.log(job);
      if ( job != executedStep.StepID ) {
        display = true;
      }
      // console.log("--  " + JSON.stringify(executedStep, null, 1));
      if (display) {
        job = executedStep.StepID;
        display = false;
        console.log("-- Job " + job + ":");
        var toBeCompleted = nbAnswer - (nbNotCompleted + nbCompleted);
        console.log(nbNotes + " Note(s):");
        if(nbNotes>0) {console.log(strNotes);}
        console.log(nbAnswer + " Answers : " + nbCompleted + " Completed + " + nbNotCompleted + " Not Completed + " + toBeCompleted + " To Be Completed");
        nbCompleted = 0, nbNotCompleted = 0, nbNotes = 0, nbAnswer = 0, strNotes = "";
      }

    }
  });
}



// Get an Instruciton sheet by ID from Cloud API

function getAllInstructionSheet() {
  $("<img id='loarder' src='./images/5.gif'>").appendTo(".content");

  var jqxhr = $.getJSON("http://"+ domain +".azurewebsites.net/api/InstructionSheet/GetAll")
    .complete(function() {
      $( "#loader" ).remove();
      $("<h3>getAllInstructionSheet</h3>").appendTo(".content");
      $("<div class='codeBloc'><pre><code>" + JSON.stringify(jqxhr.responseText, null, 1) + "</code></pre></div>").appendTo(".content");
      // console.log('API - getAllInstructionSheet(): ' + JSON.stringify(jqxhr.responseText, null, 1));
    });
}

