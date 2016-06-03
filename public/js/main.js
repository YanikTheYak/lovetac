
// indexOf in an array of object

function arrayObjectIndexOf(myArray, searchTerm, property) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}

// Format JSON in HTML

function json2Html(myJSON) {
  var table = $('<table />'),
      row = $('<tr />');
  row.append('<td class="checklist">' + myJSON.Name + '</td>');
  table.append(row);

  $.each(myJSON.Pages, function(key, page) {
    var row = $('<tr />');
    row.append('<td class="page">' + page.Name + '</td>');
    table.append(row);

    $.each(page.Groups, function(key, group) {
      var row = $('<tr />');
      row.append('<td class="group">' + group.Name + '</td>');
      table.append(row);

      $.each(group.Steps, function(key, step) {
        var row = $('<tr />');
        row.append('<td class="step">' + step.Name + '</td>');
        table.append(row);
      });
    });
  });
  return table;
}

// Function import fron Excel firectly with copy paste to
function readExcel() {
  var data = $('textarea[name=excel_data]').val(),
  rows = data.split("\n"),
  pages = [],
  groups = [],
  steps = [],
  currentPage = -1,
  currentGroup = -1,
  instructionSheetJSON;

  for(var y in rows) {
    var cells = rows[y].split("\t");

      for(var x in cells) {
        var myText = cells[x].split(":");
          if (myText[0]) {

            switch (myText[0].trim().toLowerCase() ) {
              case 'checklist':
                instructionSheetJSON = createInstructionSheet({
                  'name': myText[1].trim(),
                  'description': null
                }, [] );
                pages = [];
                break;

              case 'page':
                instructionSheetJSON.Pages.push(createPage({
                  'name': myText[1].trim(),
                  'description': null
                }, [] ));

                currentPage++;
                currentGroup = -1;
                groups = [];
                break;

              case 'group':
                instructionSheetJSON.Pages[currentPage].Groups.push(createGroup({
                  'name': myText[1].trim(),
                  'description': null
                }, [] ));

                currentGroup++;
                steps = [];
                break;

              default:
                instructionSheetJSON.Pages[currentPage].Groups[currentGroup].Steps.push(createStep({
                    'name': cells[x].trim(),
                    'description': null,
                    'position': 0
                  },
                  [] // stepAnswers
                ));
            }
          }
          else{
            // need to copy the default action
        }
      }
  }

  // $("#formated").html("<div class='codeBloc'><pre><code>" + JSON.stringify(instructionSheetJSON) + "</code></pre></div>");
  $("#formated").html("<div class='codeBloc'><pre><code>" + JSON.stringify(instructionSheetJSON, null, 2) + "</code></pre></div>");

  $("#tac").html(json2Html(instructionSheetJSON));

  // console.log(JSON.stringify(instructionSheetJSON, null, 2));
  return instructionSheetJSON;
}

// function ...

function containsObject(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i] === obj) {
      return true;
    }
  }
  return false;
}

// ***************  MAIN  ************ Function to 'load JSON' config data
$.getJSON("./temp/config_tactac_dt_config.json", function(data) {
  var dic = {}
    enableD3JS = false;
  // $("<h3>Loading config file (object mapping)</h3>").appendTo(".content");
  $.each(data.ObjectTypes, function(key, objectType) {
    dic[objectType.ScriptName] = objectType;
  });
  // $("<div class='codeBloc'><pre><code>" + JSON.stringify(dic) + "</code></pre></div>").appendTo(".content");
  // $("<div class='codeBloc'><pre><code>" + JSON.stringify(dic, null, 2) + "</code></pre></div>").appendTo(".content");

  // $(".excel2Tac").hide();
  loadContent(data, dic, enableD3JS);

  // ********** API TESTS *****************
  // getAuthenTac();
  // getByIDInstructionSheet(7);
  // getAllInstructionSheet();

  return dic;
});

// Get authentication to Cloud API

function getAuthenTac() {
  $.getJSON('http://tactacauth.azurewebsites.net/api/Login/Authenticate', function(data) {

    $("<div class='codeBloc'><pre><code>" + JSON.stringify(data, null, 1) + "</code></pre></div>").appendTo(".content");
    console.log(JSON.stringify(data, null, 1));
  });
}

// Post an Instruciton Sheet to Cloud API

function postInstructionSheetTac(token, instructionSheet) {
  $.getJSON('http://tactacauth.azurewebsites.net/api/Login/Authenticate', function(data) {

    $("<div class='codeBloc'><pre><code>" + JSON.stringify(data, null, 1) + "</code></pre></div>").appendTo(".content");
    console.log(JSON.stringify(data, null, 1));
  });
}

// Get an Instruciton sheet by ID from Cloud API

function getByIDInstructionSheet(id) {
  $.getJSON('http://tactacapi.azurewebsites.net/api/InstructionSheet/GetByID/' + id, function(data) {
    $("<h3>getByIDInstructionSheet</h3>").appendTo(".content");

    $("<div class='codeBloc'><pre><code>" + JSON.stringify(data, null, 1) + "</code></pre></div>").appendTo(".content");

    return data;
    // console.log(JSON.stringify(data, null, 1));
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
      // console.log(JSON.stringify(jqxhr.responseText, null, 1));
    });
}

// Function to 'load JSON' Love Diagram data

function loadContent(relevantObjectTypes, relevantObjectTypesDic, enableD3JS) {
  $.getJSON("./temp/cw_evolve_Assess_Customer_Accounts_diagram.json", function(data) {
    // $.getJSON( "./temp/cw_diagram_evolve_basic_steps.json", function( data ) {
    // $.getJSON( "./temp/cw_evolve_diagram.json", function( data ) {
    // $.getJSON( "./temp/cw_diagram_evolve_product_installation.json", function( data ) {

    var relevantShapes = getRelevantShapes(relevantObjectTypesDic, data.result.diagram.shapes);
    var exportJson = generateInstructionSheet(relevantObjectTypes, relevantObjectTypesDic, {
      'name': data.result.name,
      'description': 'This is the description of this process from Evolve to be used Live in the field thanks to Casewise Tactac.'
    }, data.result.diagram.shapes, false);

    $("<h4>Loading diagram \"" + data.result.name + "\":</h4>").appendTo("#evo");
    $("<img src='./temp/cw_evolve_Assess_Customer_Accounts_diagram.png' width='90%'></img>").appendTo("#evo");

    $("<h4>Loading config file for mapping:</h4>").appendTo("#evo");
    $("<div class='codeBloc'><pre><code>" + JSON.stringify(relevantObjectTypesDic) + "</code></pre></div>").appendTo("#evo");

    $("<h4>Relevant objects parsed from the diagram:</h4>").appendTo("#evo");
    var joiners = getRelevantJoiners(relevantShapes, data.result.diagram.joiners, enableD3JS);
    var processHtml = drawProcessSequenceHtml(relevantShapes, joiners);
    $(processHtml).appendTo("#evo");

    // $("<div class='codeBloc'><pre><code>" + JSON.stringify(exportJson) + "</code></pre></div>").appendTo("#formated2");
    $("<div class='codeBloc'><pre><code>" + JSON.stringify(exportJson, null, 1) + "</code></pre></div>").appendTo("#formated2");

    $("#tac2").html(json2Html(exportJson));
  });
}

// Parse shapes

function getRelevantShapes(relevantObjectTypesDic, shapes) {
  var relevantShapes = [];
  // LATER: to build an external config file with the required consitency rules

  // recognising the Object type of the palette entries:
  $.each(shapes, function(key, shape) {
    var posInRelevantDic = relevantObjectTypesDic[shape['cwObject']['objectTypeScriptName']]; // is undefined if not in the Dic

    if (posInRelevantDic !== undefined) {
      //add each relevant one to the global list
      relevantShapes.push(shape);
    }
  });
  return relevantShapes;
}

// function generate an Instruction Sheet in JSON for import in the cloud API

function generateInstructionSheet(relevantObjectTypes, relevantObjectTypesDic, instructionSheet, shapes, enableLog) {
  var rule = [],
    relevantShapes = [],
    pages = [],
    groups = [],
    steps = [],
    nbStep = 0,
    nbRole = 0,
    nbEvent = 0,
    nbResult = 0,
    nbObjectInError = 0,
    instructionSheetJSON,
    posInRelevantDic,
    ot,
    evtrsltType,
    oName;

  ///////////////////////////////////////
  shapes.forEach(function(shape) {
    posInRelevantDic = relevantObjectTypesDic[shape['cwObject']['objectTypeScriptName']]; // is undefined if not in the Dic
    ot = shape['cwObject']['objectTypeScriptName'];
    oName = shape['cwObject']['properties']['name'];

    switch (posInRelevantDic.TactacObject) {
      case 'step':
        console.info(shape['cwObject']['objectTypeScriptName'] + ': ' + oName + ' >> This object has been used to create a step');
        steps.push(createStep({
            'name': oName,
            'description': shape.cwObject.properties.description,
            'position': nbStep
          },
          null // stepAnswers
        ));
        nbStep++;
        break;
      case 'eventresult':
        evtrsltType = shape['paletteEntryKey'].split("|")[1];
        switch (evtrsltType) {
          case '4':
          case '1':
            console.warn('Result: ' + oName + ' >> This object has been ignored');
            nbResult++;
            break;
          case '0':
          case '2':
            console.warn('Event: ' + oName + ' >> This object has been ignored');
            nbEvent++;
            break;
          default:
            console.error(shape['cwObject']['objectTypeScriptName'] + ': ' + oName + ' of type:' + evtrsltType + ' >> This object has not been selected, check your config file');
        }
        break;
      case 'role':
        console.info(shape['cwObject']['objectTypeScriptName'] + ': ' + oName + ' >> This object has been considered has the main role');
        nbRole++;
        break;
      case 'connectorset':
        console.warn(shape['cwObject']['properties']['type'] + ': ' + oName + ' >> This object has been ignored');
        break;
      default:
        nbObjectInError++;
        console.error(shape['cwObject']['objectTypeScriptName'] + ': ' + oName + ' >> This object has not been selected, check your config file');
    }
  });

  groups.push(createGroup({
    'name': 'Group 1',
    'description': 'Group description'
  }, steps));

  pages.push(createPage({
    'name': 'Page 1',
    'description': 'Page description'
  }, groups));

  instructionSheetJSON = createInstructionSheet({
    'name': instructionSheet.name,
    'description': instructionSheet.description
  }, pages);

  return instructionSheetJSON;
}

// Parse shapes

function checkConsistencyOnShapes(shapes) {
  //TBD
}

// Create one InstructionSheet

function createInstructionSheet(instructionSheet, pages) {
  var InstructionSheetJSON = {
    // "InstructionSheetID": 10,
    "Name": instructionSheet.name,
    "Description": instructionSheet.description,
    "ImageURL": null,
    "Status": null,
    "SLA": "1 Day",
    "MainContactID": 0,
    "Version": 0.00,
    "ImageFile": null,
    "AllSteps": null,
    "Pages": pages
  }
  return InstructionSheetJSON;
}

// Create one Page

function createPage(page, groups) { //, instructionSheet) {
  var pageJSON = {
    // "PageID": 27,
    "Name": page.name,
    "Description": page.description,
    "Position": 0,
    // "InstructionSheetID": 10,
    "Groups": groups
  }
  // console.log(pageJSON);
  return pageJSON;
}

// Create one Group

function createGroup(group, steps) { //, page, instructionSheet) {
  var groupJSON = {
    // "GroupID": 63,
    "Name": group.name,
    "Position": 0,
    // "PageID": 27,
    // "InstructionSheetID": 10,
    "Steps": steps
  }
  return groupJSON;
}

// Create one Step in json for Tactac from step in Evolve

function createStep(step, stepAnswers) { //, group, page, instructionSheet) {
  var stepJSON = {
    // "StepID": 0,
    // "GroupID": 0,
    // "PageID": 0,
    // "InstructionSheetID": 0,
    "Name": step.name,
    "Description": step.description,
    "ImageURL": null,
    "Image2URL": null,
    "Image3URL": null,
    "ProofRequired": false,
    "ProofType": 0,
    "StepPosition": step.position,
    "AnswerSet": 0,
    "ImageGroupID": null,
    "Position": 0,
    "Image1Data": null,
    "StepAnswers": createStepAnswers(stepAnswers)
  };
  // console.log(stepJSON);
  return stepJSON;
}

// Create Step answers

function createStepAnswers(stepAnswers) { //, page, instructionSheet) {
  var answerJSON = {};

  // stepAnswers.forEach( function(answer) {
  //     answerJSON.push({
  //       "AnswerText": answer.text
  //       // "TargetStepID": answer.TargetStepID,
  //       // "TempTargetStepID": answer.TempTargetStepID
  //     })
  //   });
  return answerJSON;
}

// Parse and get only the joiners

function getRelevantJoiners(relevantShapes, joiners, enableGraph) {
  var myList = [],
    links = [],
    nodes = [],
    i = 0;

  joiners.forEach(function(joiner) {
    var sourceSeq = joiner['FromSeq'],
      targetSeq = joiner['ToSeq'],
      sourceCondition = '',
      targetCondition = '',
      sourceKey = arrayObjectIndexOf(relevantShapes, sourceSeq, "Sequence"),
      targetKey = arrayObjectIndexOf(relevantShapes, targetSeq, "Sequence"),
      srcObj = relevantShapes[sourceKey],
      trgObj = relevantShapes[targetKey];

    myList.push({
      'sourceKey': sourceKey,
      'targetKey': targetKey,
      'FromSeq': sourceSeq,
      'ToSeq': targetSeq
    });

    if (srcObj.cwObject.objectTypeScriptName == 'connectorset') {

      var previous = links[links.length - 1];
      // WARNING NOT GOOD AT ALL (managing the XOR)
      // links.pop();

      if (arrayObjectIndexOf(nodes, targetKey, "id") < 0) {
        nodes.push({
          'id': targetKey,
          'name': trgObj.cwObject.properties.name,
          'reflexive': false
        });
        i++;
      }

      links.push({
        'source': previous.source,
        'target': nodes[arrayObjectIndexOf(nodes, targetKey, "id")],
        'left': false,
        'right': true
      });
      // console.log(JSON.stringify({
      //   'source': previous.source,
      //   'target': nodes[arrayObjectIndexOf(nodes, targetKey, "id")],
      //   'left': false,
      //   'right': true
      // }));
      return true; // it is a connector we skip it to reach targets directly

    } else {
      if (arrayObjectIndexOf(nodes, sourceKey, "id") < 0) {
        nodes.push({
          'id': sourceKey,
          'name': srcObj.cwObject.properties.name,
          'reflexive': false
        });
        i++;
      }
    }

    if (arrayObjectIndexOf(nodes, targetKey, "id") < 0) {
      nodes.push({
        'id': targetKey,
        'name': trgObj.cwObject.properties.name,
        'reflexive': false
      });
      i++;
    }

    links.push({
      'source': nodes[arrayObjectIndexOf(nodes, sourceKey, "id")],
      'target': nodes[arrayObjectIndexOf(nodes, targetKey, "id")],
      'left': false,
      'right': true
    });
    // console.log(sourceKey + ' > ' + targetKey);
  });
  // console.log(JSON.stringify(myList, null, 1));
  // console.log(JSON.stringify(nodes, null, 1));
  // console.log(JSON.stringify(links, null, 1));

  if(enableGraph) {drawGraphD3JS(nodes, links);}
  return myList;
}

// Draw process tree in HTML

function drawProcessSequenceHtml(relevantShapes, joiners) {
  var previousStep, srcOT, srcType, trgOT, trgType, srcNsme, trgName, srcObj, trgObj, oType, outputHtml = '';

  joiners.forEach( function( joiner) {
    srcObj = relevantShapes[joiner.sourceKey];
    trgObj = relevantShapes[joiner.targetKey];

    srcOT = srcObj.cwObject.objectTypeScriptName;
    trgOT = trgObj.cwObject.objectTypeScriptName;

    switch (srcOT) {
      case 'eventresult':
        oType = srcObj.paletteEntryKey.split("|")[1];
        switch (oType) {
          case '4':
          case '1':
            srcOT = 'Result';
            break;
          case '2':
          case '0':
            srcOT = 'Event';
            break;
          default:
            console.error(srcOT + ': of type:' + oType + ' >> This source object is unknown');
          }
        break;
      case 'connectorset':
        oType = srcObj.paletteEntryKey.split("|")[1];
        switch (oType) {
          case '73':
            srcOT = 'XOR';
            break;
          default:
            console.error(srcOT + ': of type:' + oType + ' >> This source object is unknown');
          }
        break;
      case 'process':
        srcOT = 'Process';
        break;
      default:
        console.error(srcOT + ' >> This source object is unknown');
    }

    switch (trgOT) {
      case 'eventresult':
        oType = trgObj.paletteEntryKey.split("|")[1];
        switch (oType) {
          case '4':
          case '1':
            trgOT = 'Result';
            break;
          case '2':
          case '0':
            trgOT = 'Event';
            break;
          default:
            console.error(trgOT + ': of type:' + oType + ' >> This source object is unknown');
          }
        break;
      case 'connectorset':
        oType = trgObj.paletteEntryKey.split("|")[1];
        switch (oType) {
          case '73':
            trgOT = 'XOR';
            break;
          default:
            console.error(trgOT + ': of type:' + oType + ' >> This source object is unknown');
          }
        break;
      case 'process':
        trgOT = 'Process';
        break;
      default:
        console.error(trgOT + ' >> This source object is unknown');
    }

    outputHtml += '<li><div class="objecttype ' + srcOT + '">' + srcOT + '</div> ' +
    srcObj.cwObject.properties.name + ' <div class="objecttype ' + trgOT + '">' + trgOT + '</div> ' + trgObj.cwObject.properties.name + '</li>';


  });
  return outputHtml;

}
