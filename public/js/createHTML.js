
// Format JSON in HTML

function json2HtmlTable(myJSON) {

  if(myJSON && myJSON != ''){
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

      group.Steps.sort(function(a, b) {
          return a.StepPosition - b.StepPosition;
      })

      $.each(group.Steps, function(key, step) {
        var row = $('<tr />');
        row.append('<td class="step">' + step.Name + '</td>');
        // row.append('<td class="step">' + step.StepPosition + ': ' + step.Name + '</td>');
        table.append(row);
      });
    });
  });
  return table;
}
else {return '';}
}


// Get next step when a step is followed by a XOR return a list
//  pour o on regarde ses enfants si les enfants de o sont des steps on les renvoient, si il s'agit de xor on recupere les enfants des xor et on les renvoient en plus

function getNextStep(relevantShapes, joiners, oSeq) {
  var genealogyTree = getParentsAndChildrenFromListOfJoiners(joiners);
  var nextSteps = {};

  // console.debug('Look for children of: ' + oSeq);
  joiners.forEach( function( joiner) {
    if(joiner.sourceKey == oSeq) {
      trgObj = relevantShapes[joiner.targetKey];
      trgOT = trgObj.cwObject.objectTypeScriptName;
      switch (trgOT) {
        case 'process':
          // console.debug(' child: step: ' + joiner.targetKey);
          if (nextSteps.shapes === undefined) {
            nextSteps = {'shapes': joiner.targetKey};
          }
          else {
            nextSteps.shapes = nextSteps.shapes + ',' + joiner.targetKey;
          }
          break;
        case 'connectorset':
          // console.debug(' child: connectorset: ' + joiner.targetKey);
          genealogyTree.parents.forEach( function( shape) {
            // console.debug('  checking genea: ' + shape.father +" ("+ shape.children +") == "+ joiner.targetKey);
            if (shape.father ==  joiner.targetKey) {
              if (nextSteps.shapes === undefined) {
                nextSteps = {'shapes': shape.children};
              }
              else {
                nextSteps.shapes = nextSteps.shapes + ',' + shape.children;
              }
            }
          });
          break;
        default:
          console.error(' default');
      }
    }
  });
  return nextSteps;
}



// Draw process tree in HTML

function drawProcessSequenceHtml(relevantShapes, joiners) {
  // console.log(JSON.stringify(relevantShapes, null, 1));
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

    outputHtml += '<li><div class="objecttype ' + srcOT + '">' + srcOT + '</div> ' + srcObj.cwObject.properties.name + ' ' + joiner.sourceKey + ' <div class="objecttype ' + trgOT + '">' + trgOT + '</div> ' + trgObj.cwObject.properties.name + ' ' + joiner.targetKey + '</li>';


  });

  // add sort joiners by position or starting from event or oprhean object
  return outputHtml;

}
