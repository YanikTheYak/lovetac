// function GetIDVar(o) {
//   var prefix = "";
//
//   if (o.GetType().Equals(typeof(Job))) {
//     prefix = "J";
//   }
//
//   if (o.GetType().Equals(typeof(InstructionSheet))) {
//     prefix = "I";
//   }
//
//   if (o.GetType().Equals(typeof(SheetGroup))) {
//     prefix = "G";
//   }
//
//   if (o.GetType().Equals(typeof(SheetPage))) {
//     prefix = "P";
//   }
//
//   if (o.GetType().Equals(typeof(Step))) {
//     prefix = "S";
//   }
//
//   if (prefix == "") {
//     prefix = "Z";
//   }
//
//   tempidvar++;
//   return prefix + tempidvar + rd.Next(0, 9999);
// }


function createJobTitlePageFields(fields) {
  var JobTitlePageFields = {
    "FieldName": FieldName,
    "FieldType": FieldType,
    "PlaceHolderText" : PlaceHolderText
  }
  return JobTitlePageFields;
}

function createInstructionSheet(instructionSheet, pages, JobTitlePageFields) {

  var InstructionSheetJSON = {
    // "InstructionSheetID": 10,
    "Name": instructionSheet.name,
    "Description": instructionSheet.description,
    // "ImageURL": null,
    // "Status": null,
    "SLA": 12,
    // "MainContactID": 0,
    "Version": 0,
    // "ImageFile": null,
    // "AllSteps": null,
    "Pages": pages,
    "JobTitlePagefields": JobTitlePageFields
  }
  return InstructionSheetJSON;
}

// Create one Page

function createPage(page, groups) { //, instructionSheet) {
  var pageJSON = {
    // "PageID": 27,
    "Name": page.name,
    "Description": page.description,
    // "Position": 0,
    // "InstructionSheetID": 10,
    "Groups": groups,
    "ImageURL": null,
    "ImageData": null
  }
  // console.log(pageJSON);
  return pageJSON;
}

// Create one Group

function createGroup(group, steps) { //, page, instructionSheet) {
  var groupJSON = {
    // "GroupID": 63,
    "Name": group.name,
    // "Position": 0,
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
    // "ImageURL": null,
    // "Image2URL": null,
    // "Image3URL": null,
    "ProofRequired": false,
    "TempID": "uuid",
    // "ProofType": 0,
    // "StepPosition": step.position,
    // "AnswerSet": 0,
    // "ImageGroupID": null,
    // "Position": 0,
    // "Image1Data": null,
    "StepAnswers": createStepAnswers(stepAnswers)
  };
  // console.log(stepJSON);
  return stepJSON;
}

// Create Step answers
//    {'AnswerText': 'text', 'AnswerSetID': answerSetID, 'AnswerID': answerId++, 'TempTargetStepID': targetSeq}

function createStepAnswers(stepAnswers) { //, page, instructionSheet) {

  var answerJSON = {};
  if(stepAnswers) {
  stepAnswers.forEach( function(answer) {
      answerJSON.push({
        "AnswerText": answer.text,
        "AnswerSetID": 1, // ref to set of answers
        "AnswerID": 1, //pos
        "TempTargetStepID": answer.TempTargetStepID


      })
    });
  } else {answerJSON = null}
  return answerJSON;
}
