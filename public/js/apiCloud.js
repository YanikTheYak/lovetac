
function setHeader(xhr) {
  xhr.setRequestHeader('Authorization', 'Basic VGFjVGFjVGVzdEByaXN1YWwuY29tOkNoYW5nZU1l');
  xhr.setRequestHeader('deviceID', 'CasewiseTestDevice');
}


// Get executions of one IS

function ExecutionGetByInstructionSheetID() {

}


// Get authentication to Cloud API

function getAuthenTac() {
  var password_md5 = $.md5('ChangeMe'),
      settings = {
    "async": true,
    "crossDomain": true,
    "url": "http://tactacauth.azurewebsites.net/api/Login/Authenticate",
    "method": "POST",
    "headers": {
      "username": "TacTacTest@risual.com"
      ,"password": password_md5
      ,"deviceID": "CasewiseTestDevice"
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response);
  });

  // var jsonData = '{ username:\u0027TacTacTest@risual.com\u0027,password:\u0027ChangeMe\u0027,deviceID:\u0027CasewiseTestDevice\u0027}';
  // xhr = new XMLHttpRequest();
  //   $.ajax({
  //     url: 'http://tactacauth.azurewebsites.net/api/Login/Authenticate',
  //     type: 'GET',
  //     datatype: 'json',
  //     success: function() { alert("Success"); },
  //     error: function() { alert('Failed!'); },
  //     beforeSend: setHeader
  //   });

  // $.getJSON('http://tactacauth.azurewebsites.net/api/Login/Authenticate', function(data) {
//
//     $("<div class='codeBloc'><pre><code>" + JSON.stringify(data, null, 1) + "</code></pre></div>").appendTo(".content");
//     console.log('API - getAuthenTac(): ' + JSON.stringify(data, null, 1));
//   });
}

// Post an Instruciton Sheet to Cloud API

function postInstructionSheetTac(token, instructionSheet) {
  $.getJSON('http://tactacauth.azurewebsites.net/api/Login/Authenticate', function(data) {

    $("<div class='codeBloc'><pre><code>" + JSON.stringify(data, null, 1) + "</code></pre></div>").appendTo(".content");
    console.log('API - postInstructionSheetTac(token, instructionSheet): ' + JSON.stringify(data, null, 1));
  });
}

// Get an Instruciton sheet by ID from Cloud API

function getByIDInstructionSheet(id) {
  $.getJSON('http://tactacapi.azurewebsites.net/api/InstructionSheet/GetByID/' + id, function(data) {
    $("<h3>getByIDInstructionSheet</h3>").appendTo(".content");

    $("<div class='codeBloc'><pre><code>" + JSON.stringify(data, null, 1) + "</code></pre></div>").appendTo(".content");

    return data;
    // console.log('API - getByIDInstructionSheet(id): ' + JSON.stringify(data, null, 1));
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

