
// indexOf in an array of object

function arrayObjectIndexOf(myArray, searchTerm, property) {
  for (var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
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

function displayExcelImport() {
  var result = readExcel();

  if(result) {
    $("#formated").html("<div class='codeBloc'><pre><code>" + JSON.stringify(result) + "</code></pre></div>");
    // $("#formated").html("<div class='codeBloc'><pre><code>" + JSON.stringify(instructionSheetJSON, null, 2) + "</code></pre></div>");
  } else { $("#formated").html('');}

  $("#tac").html(json2Html(result));
}

// ***************  MAIN  ************ Function to 'load JSON' config data
function main() {
  $.getJSON("./temp/config_tactac_dt_config.json", function(data) {
    var dic = {}
      enableD3JS = false;

    // $("<h3>Loading config file (object mapping)</h3>").appendTo(".content");
    $.each(data.ObjectTypes, function(key, objectType) {
      dic[objectType.ScriptName] = objectType;
    });

    // $(".excel2Tac").hide();
    // ********** LOAD from EVOLVE *****************
    loadContent(data, dic, enableD3JS);

    // ********** APIs *****************
    getAuthenTac();
    // getByIDInstructionSheet(7);
    // getAllInstructionSheet();

    return dic;
  });
}

// Create one InstructionSheet

