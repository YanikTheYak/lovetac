// Function import fron Excel firectly with copy paste to

function readExcel(inputData) {
  var data,
    rows,
    // pages = [],
    // groups = [],
    // steps = [],
    currentPage = -1,
    currentGroup = -1,
    instructionSheetJSON;

  if (inputData) {
    data = inputData;
  } else {
    data = $('textarea[name=excel_data]').val();
    if (data == '') {return ;}
  }
  rows = data.split("\n");

  for (var y in rows) {
    // var cells = rows[y].split("\t");
    var cell = rows[y].split("\t")[0];

    // for (var x in cells) {
    // var myText = cells[x].split(":");
    var myText = cell.split(":");
    if (myText[0]) {

      switch (myText[0].trim().toLowerCase()) {

        case 'checklist':
          instructionSheetJSON = createInstructionSheet({
            'name': myText[1].trim(),
            'description': null
          }, [], null);
          // pages = [];
          break;

        case 'page':
          if (instructionSheetJSON) {
            instructionSheetJSON.Pages.push(createPage({
              'name': myText[1].trim(),
              'description': null
            }, []));

            currentPage++;
            currentGroup = -1;
            // groups = [];

          } else {
            instructionSheetJSON = createInstructionSheet({
              'name': 'Empty Checklist title',
              'description': null
            }, [], null);
            instructionSheetJSON.Pages.push(createPage({
              'name': myText[1].trim(),
              'description': null
            }, []));

            currentPage++;
            currentGroup = -1;
          }
          break;

        case 'group':
          if (instructionSheetJSON.Pages[currentPage]) {
            instructionSheetJSON.Pages[currentPage].Groups.push(createGroup({
              'name': myText[1].trim(),
              'description': null
            }, []));

            currentGroup++;
            // steps = [];
          } else {
            instructionSheetJSON.Pages.push(createPage({
              'name': 'Empty Page title',
              'description': null
            }, []));

            currentPage++;
            currentGroup = -1;

            instructionSheetJSON.Pages[currentPage].Groups.push(createGroup({
              'name': myText[1].trim(),
              'description': null
            }, []));

            currentGroup++;
          }
          break;

        default: // Step
          if (instructionSheetJSON.Pages[currentPage].Groups[currentGroup]) {
            instructionSheetJSON.Pages[currentPage].Groups[currentGroup].Steps.push(createStep({
                // 'name': cells[x].trim(),
                'name': cell.trim(),
                'description': null,
                'position': 0
              }, [] // stepAnswers
            ));
          } else {

            instructionSheetJSON.Pages[currentPage].Groups.push(createGroup({
              'name': 'Empty Group title',
              'description': null
            }, []));
            currentGroup++;

            instructionSheetJSON.Pages[currentPage].Groups[currentGroup].Steps.push(createStep({
                // 'name': cells[x].trim(),
                'name': cell.trim(),
                'description': null,
                'position': 0
              }, [] // stepAnswers
            ));
          }
      }
    } else {
      // need to copy the default action
    }
    // }
  }

  // console.log(JSON.stringify(instructionSheetJSON, null, 2));
  return instructionSheetJSON;
}
