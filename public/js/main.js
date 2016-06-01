
// indexOf in an array of object

function arrayObjectIndexOf(myArray, searchTerm, property) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}

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
  var dic = {};
  // $("<h3>Loading config file (object mapping)</h3>").appendTo(".content");
  $.each(data.ObjectTypes, function(key, objectType) {
    dic[objectType.ScriptName] = objectType;
  });

  // $("<div class='codeBloc'><pre><code>" + JSON.stringify(dic) + "</code></pre></div>").appendTo(".content");
  // $("<div class='codeBloc'><pre><code>" + JSON.stringify(dic, null, 2) + "</code></pre></div>").appendTo(".content");
  // console.info(JSON.stringify(dic, null, 1));

  loadContent(data, dic);
  // getAuthenTac();
});

// Get authentication to Cloud API

function getAuthenTac() {
  $.getJSON('http://tactacauth.azurewebsites.net/api/Login/Authenticate', function(data) {
    console.log(JSON.stringify(data, null, 1));
  });
}

// Function to 'load JSON' Love Diagram data

function loadContent(relevantObjectTypes, relevantObjectTypesDic) {
  $.getJSON("./temp/cw_evolve_Assess_Customer_Accounts_diagram.json", function(data) {
    // $.getJSON( "./temp/cw_diagram_evolve_basic_steps.json", function( data ) {
    // $.getJSON( "./temp/cw_evolve_diagram.json", function( data ) {
    // $.getJSON( "./temp/cw_diagram_evolve_product_installation.json", function( data ) {
    $("<h3>Loading diagram content file</h3>").appendTo(".content");

    var relevantShapes = getRelevantShapes(relevantObjectTypesDic, data.result.diagram.shapes);
    var exportJson = generateInstructionSheet(relevantObjectTypes, relevantObjectTypesDic, {
      'name': data.name,
      'description': 'This is the description of this process from Evolve to be used Live in the field thanks to Casewise Tactac.'
    }, data.result.diagram.shapes, false);

    $("<h4> Diagram Name: " + data.result.name + "</h4>").appendTo(".content");
    $("<img src='./temp/cw_evolve_Assess_Customer_Accounts_diagram.png' width='90%'></img>").appendTo(".content");

    var joiners = getRelevantJoiners(relevantShapes, data.result.diagram.joiners, false);
    var processHtml = drawProcessSequenceHtml(relevantShapes, joiners);
    $(processHtml).appendTo(".content");

    $("<h3>Generating export json</h3>").appendTo(".content");
    $("<div class='codeBloc'><pre><code>" + JSON.stringify(exportJson, null, 1) + "</code></pre></div>").appendTo(".content");
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
    'name': 'Group name',
    'description': 'Group description'
  }, steps));
  pages.push(createPage({
    'name': 'Page name',
    'description': 'Page description'
  }, groups));
  instructionSheetJSON = createInstructionSheet({
    'name': instructionSheet.name,
    'description': instructionSheet.description
  }, groups);

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
    // "StepID": 136,
    // "GroupID": 63,
    // "PageID": 27,
    // "InstructionSheetID": 10,
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
