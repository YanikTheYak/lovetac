/*global describe, it, expect, beforeEach, angular*/
(function() {
  'use strict';

  describe('LOVETAC:', function() {
    //
    // it('Guess root node(s) of graph from joiners list', function(done) {
    //   $.getJSON("/base/spec/joiners.json", function(joiners) {
    //     var rootNodes = getRootNodesOfGraphFromListOfJoiners(joiners),
    //       result = [11];
    //
    //     expect(rootNodes).toEqual(result);
    //     done();
    //   });
    // });
    //
    // it('Guess next node(s) of a node in a graph', function(done) {
    //   $.getJSON("/base/spec/joiners.json", function(joiners) {
    //     $.getJSON("/base/spec/relevantShapes.json", function(relevantShapes) {
    //       var nextSteps = getNextStep(relevantShapes, joiners, 8),
    //       result = {shapes: '9,2'};
    //       expect(nextSteps).toEqual(result);
    //       // console.log(JSON.stringify(nextSteps, null, 1));
    //       done();
    //     });
    //   });
    // });
    //
    // it('Guess next node(s) of a node in a graph', function(done) {
    //   $.getJSON("/base/spec/joiners.json", function(joiners) {
    //     $.getJSON("/base/spec/relevantShapes.json", function(relevantShapes) {
    //       var nextSteps = getNextStep(relevantShapes, joiners, 7),
    //       result = {shapes: '9,2'};
    //       expect(nextSteps).toEqual(result);
    //       // console.log(JSON.stringify(nextSteps, null, 1));
    //       done();
    //     });
    //   });
    // });
    //
    // it('Guess next node(s) of a node in a graph', function(done) {
    //   $.getJSON("/base/spec/joiners.json", function(joiners) {
    //     $.getJSON("/base/spec/relevantShapes.json", function(relevantShapes) {
    //       var nextSteps = getNextStep(relevantShapes, joiners, 3),
    //       result = {shapes: '5,0'};
    //       expect(nextSteps).toEqual(result);
    //       // console.log(JSON.stringify(nextSteps, null, 1));
    //       done();
    //     });
    //   });
    // });
    //
    // it('Guess next node(s) of a node in a graph', function(done) {
    //   $.getJSON("/base/spec/joiners.json", function(joiners) {
    //     $.getJSON("/base/spec/relevantShapes.json", function(relevantShapes) {
    //       var nextSteps = getNextStep(relevantShapes, joiners, 11),
    //       result = {'shapes': 7};
    //       expect(nextSteps).toEqual(result);
    //       // console.log(JSON.stringify(nextSteps, null, 1));
    //       done();
    //     });
    //   });
    // });

    it('Get all nodes as a graph', function(done) {
      $.getJSON("/base/spec/joiners.json", function(joiners) {
        // $.getJSON("/base/spec/relevantShapes.json", function(relevantShapes) {
          // var nextSteps = getNextStep(relevantShapes, joiners, 11), // 11: event
          var result = {'shapes': 7};

          var genealogyList = getParentsAndChildrenFromListOfJoiners(joiners);
          var tree = buildTree(genealogyList, 11, {});
          console.log('test result: ' + JSON.stringify(tree, null, 1));

          expect(tree).toEqual(result);
          // console.log(JSON.stringify(nextSteps, null, 1));
          done();
        // });
      });
    });

    // it('JSON to HTML table', function(done) {
    //   var htmlTable, base_result;
    //   $.get("/base/spec/IS_table.html", function(data) {
    //     base_result = data;
    //     // console.log(base_result);
    //     $.getJSON("/base/spec/api_IS_input.json", function(generatedJson) {
    //       htmlTable = json2HtmlTable(generatedJson)[0].outerHTML;
    //       // console.log(htmlTable);
    //       expect(htmlTable).toEqual(base_result);
    //       done();
    //     });
    //   });
    // });

    // it('Clean Excel to JSON to HTML table', function(done) {
    //   var htmlTable, base_result;
    //   $.get("/base/spec/IS_table.html", function(data) {
    //     base_result = data;
    //     // console.log(base_result);
    //     $.get("/base/spec/excel_input_hotel.txt", function(excelInput) {
    //       htmlTable = json2HtmlTable(readExcel(excelInput))[0].outerHTML;
    //       // console.log(htmlTable);
    //       expect(htmlTable).toEqual(base_result);
    //       done();
    //     });
    //   });
    // });

    // it('Excel without Page to JSON to HTML table', function(done) {
    //   var htmlTable, base_result;
    //   $.get("/base/spec/IS_table_withoutPage.html", function(data) {
    //     base_result = data;
    //     // console.log(base_result);
    //     $.get("/base/spec/excel_input_hotel_without_page.txt", function(excelInput) {
    //       htmlTable = json2HtmlTable(readExcel(excelInput))[0].outerHTML;
    //       // console.log(htmlTable);
    //       expect(htmlTable).toEqual(base_result);
    //       done();
    //     });
    //   });
    // });

////////// NOT YET TESTED  //////////////////////

    // it('API Authen', function(done) {
    //   var htmlTable, base_result;
    //   $.getJSON("/base/spec/IS_table.html", function(data) {
    //     base_result = data;
    //     // console.log(base_result);
    //     $.get("/base/spec/excel_input_hotel.txt", function(excelInput) {
    //       htmlTable = json2HtmlTable(readExcel(excelInput))[0].outerHTML;
    //       // console.log(htmlTable);
    //       expect(htmlTable).toEqual(base_result);
    //       done();
    //     });
    //   });
    // });


  });
}());
