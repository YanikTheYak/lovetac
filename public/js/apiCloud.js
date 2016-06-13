// Get executions of one IS

function ExecutionGetByInstructionSheetID() {

}


// Get authentication to Cloud API

function getAuthenTac() {
  var password_md5 = $.md5('ChangeMe'),
    settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://risualdev-tactac-ap.azurewebsites.net/api/Login/Authenticate", // "http://tactacauth.azurewebsites.net/api/Login/Authenticate",
      "method": "POST",
      "headers": {
        "username": "TacTacTest@risual.com",
        "password": password_md5,
        "deviceID": "CasewiseTestDevice"
      }
    },
    registerRequestJSON = {
      "username": "TacTacTest@risual.com",
      "password": password_md5,
      "deviceID": "CasewiseTestDevice"
    };

  $.ajax(settings).done(function(response) {
    console.log(response.body);
  });


$.ajax({
  type: "POST",
  url: "http://risualdev-tactac-api.azurewebsites.net/api/Login/Authenticate", // "http://tactacauth.azurewebsites.net/api/Login/Authenticate",
  data: registerRequestJSON,
  contentType: "application/json",
  success: function(data) {
    console.log(data);
  },
  error: function(jqxhr) {
    console.log(jqxhr.responseText); // @text = response error, it is will be errors: 324, 500, 404 or anythings else
  }
});

}


// Post an Instruction Sheet to Cloud API
function postInstructionSheetTac(token, instructionSheet) {
  var IS_ID = -1;
  $.getJSON('http://tactacapi.azurewebsites.net/api/InstructionSheet/Add', function(data) {

    // $("<div class='codeBloc'><pre><code>" + JSON.stringify(data, null, 1) + "</code></pre></div>").appendTo(".content");
    console.log('API - postInstructionSheetTac(token, instructionSheet): ' + JSON.stringify(data, null, 1));
  });
  return IS_ID;
}


// Get an Instruciton sheet by ID from Cloud API
function getByIDInstructionSheet(error, id, callback) {
  var error = null, domain1 = 'risualdev-tactac-api', domain2 = 'tactacapi';
  $.getJSON('http://'+ domain2 +'.azurewebsites.net/api/InstructionSheet/GetByID/' + id, function(data) {
    // console.log(JSON.stringify(data, null, 1));
    console.debug("getByIDInstructionSheet! " + data.Name);
    return callback && callback(error, data);
  });
}

// Just for test purpose in between a get and a post call
function changeISName (error, data, callback) {
  var error = null, d = new Date();
  data.Name = "Test " + d.toISOString().substring(0, 10);
  console.debug("changeISName! " + data.Name);
  return callback && callback(error, data);
}

// Update an Instruciton sheet by ID from Cloud API
function updateByIDInstructionSheet(error, data, callback) {
  var error = null, domain1 = 'risualdev-tactac-api', domain2 = 'tactacapi';
  $.ajax({
    type: "POST",
    url: "http://"+ domain2 +".azurewebsites.net/api/InstructionSheet/Update/" + data.InstructionSheetID,
    data: data,
    contentType: "application/json",
    success: function(data2) {
      console.log("on success: " + data2);
      return callback && callback(error, data2);
    },
    error: function(jqxhr) {
      if (jqxhr.status == 501) {
        // console.error(" 501 (Not Implemented)");
      }
      return callback && callback(jqxhr.status, undefined);
    }
  });
}


// Get an Instruciton sheet by ID from Cloud API

function getAllInstructionSheet() {
  $("<img id='loarder' src='./images/5.gif'>").appendTo(".content");

  var jqxhr = $.getJSON("http://tactacapi.azurewebsites.net/api/InstructionSheet/GetAll")
    .complete(function() {
      $( "#loader" ).remove();
      $("<h3>getAllInstructionSheet</h3>").appendTo(".content");
      $("<div class='codeBloc'><pre><code>" + JSON.stringify(jqxhr.responseText, null, 1) + "</code></pre></div>").appendTo(".content");
      // console.log('API - getAllInstructionSheet(): ' + JSON.stringify(jqxhr.responseText, null, 1));
    });
}

