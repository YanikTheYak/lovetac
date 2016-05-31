// Log for Guiom

function luliObj(data) {
  if (typeof data === 'object') {
    $("<li>" + label + ":</div>").appendTo(".content");
    // $.each( data, function( key, val ) {
    //     // console.log(key + ' : ' + typeof val + ' :' + val);
    //     // $("<div> - " + key + ": " + val + "</div>").appendTo(".content");
    //   });
  } else if (typeof data === 'undefined') {
    $("<div>" + label + ": " + data + "</div>").appendTo(".content");
  } else {
    $("<li>" + data + "</li>").appendTo(".content");
  }
}

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

// Function to 'load JSON' config data
$.getJSON("./temp/config_tactac_dt_config.json", function(data) {
  var dic = {};
  $("<h3>Loading config file</h3>").appendTo(".content");
  $.each(data.ObjectTypes, function(key, objectType) {
    dic[objectType.ScriptName] = objectType;
  });

  $("<div class='codeBloc'><pre><code>" + JSON.stringify(dic, null, 2) + "</code></pre></div>").appendTo(".content");
  // console.info(JSON.stringify(dic, null, 1));

  loadContent(data, dic);
  // getAuthenTactac();
});

function getAuthenTactac() {
  $.getJSON('http://tactacauth.azurewebsites.net/api/Login/Authenticate', function(data) {
    console.log(JSON.stringify(data, null, 1));
  });
}

// Function to 'load JSON' EVOLVE Diagram data

function loadContent(relevantObjectTypes, relevantObjectTypesDic) {
  $.getJSON("./temp/cw_evolve_Assess_Customer_Accounts_diagram.json", function(data) {
    // $.getJSON( "./temp/cw_diagram_evolve_basic_steps.json", function( data ) {
    // $.getJSON( "./temp/cw_evolve_diagram.json", function( data ) {
    // $.getJSON( "./temp/cw_diagram_evolve_product_installation.json", function( data ) {
    $("<h3>Loading diagram content file</h3>").appendTo(".content");

    var exportJson = getRelevantSteps(relevantObjectTypes, relevantObjectTypesDic, {
      'name': data.name,
      'description': 'This is the description of this process from Evolve to be used Live in the field thanks to Casewise Tactac.'
    }, data.result, false);
  });
}

// Parse shapes

function getRelevantSteps(relevantObjectTypes, relevantObjectTypesDic, instructionSheet, data, enableLog) {
  var rule = [],
    relevantShapes = [],
    pages = [],
    groups = [],
    steps = [],
    nbStep = 0,
    nbRole = 0,
    nbEventresult = 0,
    nbObjectInError = 0,
    instructionSheetJSON,
    shapes = data.diagram.shapes;

  // LATER: to build an external config file with the required consitency rules

  $("<h4> Diagram Name: " + data.name + "</h4>").appendTo(".content");

  // recognising the Object type of the palette entries:
  $.each(shapes, function(key, shape) {
    var posInRelevantDic = relevantObjectTypesDic[shape['cwObject']['objectTypeScriptName']], // is undefined if not in the Dic
      ot = shape['cwObject']['objectTypeScriptName'],
      oName = shape['cwObject']['properties']['name'];

    if (posInRelevantDic !== undefined) {
      //add each relevant one to the global list
      relevantShapes.push(shape);

      switch (posInRelevantDic.TactacObject) {
        case 'step':
          console.info(shape['cwObject']['objectTypeScriptName'] + ': ' + oName + ' >> This object has been used to create a step');
          steps.push(createStep({
            'name': oName,
            'description': shape.cwObject.properties.description,
            'position': nbStep
          }));
          nbStep++;
          break;
        case 'eventresult':
          switch (shape['paletteEntryKey'].split("|")[1]) {
            case '4':
              console.warn('Result: ' + oName + ' >> This object has been ignored');
              nbEventresult++;
              break;
            case '2':
              console.warn('Event: ' + oName + ' >> This object has been ignored');
              nbEventresult++;
              break;
            default:
              console.error(shape['cwObject']['objectTypeScriptName'] + ': ' + oName + ' >> This object has not been selected, check your config file');
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
    } else {
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

  getRelevantJoiners(relevantShapes, data.diagram.joiners, true);
  $("<h3>Generating export json</h3>").appendTo(".content");
  // console.log(JSON.stringify(instructionSheetJSON));
  $("<div class='codeBloc'><pre><code>" +  JSON.stringify(instructionSheetJSON, null, 1) + "</code></pre></div>").appendTo(".content");

  // console.log(JSON.stringify(relevantShapes, null, 1));
  return instructionSheetJSON;
}

// Parse shapes

function checkConsistencyOnShapes(shapes) {
  //TBD
}

// Creat one InstructionSheet

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

// Creat one Page

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

// Creat one Group

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

// Creat one Step in json for Tactac from step in Evolve

function createStep(step) { //, group, page, instructionSheet) {
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
    "StepAnswers": []
  };
  // console.log(stepJSON);
  return stepJSON;
}

// Parse joiners

function getRelevantJoiners(relevantShapes, joiners, enableLog) {
  var myList = [], links = [], nodes = [], i = 0;

  $.each(joiners, function(key, joiner) {
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

    if (arrayObjectIndexOf(nodes, sourceKey, "id") < 0) {
      nodes.push({
        'id': sourceKey,
        'name': srcObj.cwObject.properties.name,
        'reflexive': false
      });
      i++;
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

    console.log(sourceKey + ' > ' + targetKey);
  });

  // console.log(JSON.stringify(myList, null, 1));
  // console.log(JSON.stringify(nodes, null, 1));
  // console.log(JSON.stringify(links, null, 1));

  drawProcessSequence(relevantShapes, myList);
  drawGraphD3JS(nodes, links);
  return myList;
}

// Draw process tree

function drawProcessSequence(relevantShapes, joiners) {
  var previousStep, srcOT, srcType, trgOT, trgType, srcNsme, trgName, srcObj, trgObj;

  $.each(joiners, function(key, joiner) {
    srcObj = relevantShapes[joiner.sourceKey];
    trgObj = relevantShapes[joiner.targetKey];

    if (srcObj.cwObject.objectTypeScriptName == 'eventresult') {
      if (srcObj.paletteEntryKey.split("|")[1] == '4') {
        srcOT = 'Result';
      }
      if (srcObj.paletteEntryKey.split("|")[1] == '2') {
        srcOT = 'Event';
      }
    }
    if (trgObj.cwObject.objectTypeScriptName == 'eventresult') {
      if (trgObj.paletteEntryKey.split("|")[1] == '4') {
        trgOT = 'Result';
      }
      if (trgObj.paletteEntryKey.split("|")[1] == '2') {
        trgOT = 'Event';
      }
    }
    if (srcObj.cwObject.objectTypeScriptName == 'connectorset') {
      if (srcObj.paletteEntryKey.split("|")[1] == '73') {
        srcOT = 'XOR';
      }
    }
    if (trgObj.cwObject.objectTypeScriptName == 'connectorset') {
      if (trgObj.paletteEntryKey.split("|")[1] == '73') {
        trgOT = 'XOR';
      }
    }
    if (srcObj.cwObject.objectTypeScriptName == 'process') {
      srcOT = 'Process';
    }
    if (trgObj.cwObject.objectTypeScriptName == 'process') {
      trgOT = 'Process';
    }

    luliObj(
      '<div class="objecttype ' + srcOT + '">' + srcOT + '</div> ' +
      srcObj.cwObject.properties.name + ' <div class="objecttype ' + trgOT + '">' + trgOT + '</div> ' + trgObj.cwObject.properties.name
    );

  });
}
