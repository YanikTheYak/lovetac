
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

function downloadJSON(obj) {
  var filename, data, d;
  d = new Date();
  filename = obj.Name + "_" + d.toISOString().substring(0, 10);
  data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
  return ('<a class="download" href="data:' + data + '" download="'+filename+'.json">Download (.json)</a>');
}

// -------------- //
// Date.prototype.yyyymmdd = function() {
//    var yyyy = this.getFullYear().toString();
//    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
//    var dd = this.getDate().toString();
//    return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
//   };




// function ...

function displayExcelImport() {
  var result = readExcel();

  if(result) {
    $("#formated").html("<div class='codeBloc'><pre><code>" + JSON.stringify(result) + "</code></pre></div>");
    // $("#formated").html("<div class='codeBloc'><pre><code>" + JSON.stringify(instructionSheetJSON, null, 2) + "</code></pre></div>");

    $(downloadJSON(result)).appendTo("#downloadtac2");
  } else { $("#formated").html('');}

  $("#tac").html(json2HtmlTable(result));
}

// ***************  MAIN  ************ Function to 'load JSON' config data
function main() {
  $.getJSON("./temp/config_tactac_dt_config.json", function(data) {
    var dic = {}, ISdataJson = {},
      enableD3JS = false;

    // $("<h3>Loading config file (object mapping)</h3>").appendTo(".content");
    $.each(data.ObjectTypes, function(key, objectType) {
      dic[objectType.ScriptName] = objectType;
    });


    // $(".excel2Tac").hide();
    // $(".evo2tac").hide();

    // ********** LOAD from EVOLVE *****************
    // loadContent(data, dic, enableD3JS);

    // ********** APIs *****************
    // getAuthenTac();

    getByIDInstructionSheet(null, 36, function(err, data, next){
      changeISName(err, data, updateByIDInstructionSheet);
    });

    // NOTE: ecrire une method STEP qui prend le 1er argument (45) et une liste de methodes a appeler dans l'ordre
    // !er arg, liste meth e tun callback pour apture l error et le resultat final

    // updateByIDInstructionSheet(null, 45, ISdataJson);

    // getAllInstructionSheet();

    return true;
  });
}

