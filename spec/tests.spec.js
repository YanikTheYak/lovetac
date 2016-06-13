/*global describe, it, expect, beforeEach, angular*/
(function() {
  'use strict';

  describe('LOVETAC:', function() {

    it('Guess root node(s) of graph from joiners list', function(done) {
      $.getJSON("/base/spec/joiners.json", function(joiners) {
        var rootNodes = getRootNodesOfGraphFromListOfJoiners(joiners),
          result = [11];

        expect(rootNodes).toEqual(result);
        done();
      });
    });

    it('JSON to HTML table', function(done) {
      var htmlTable, base_result;
      $.get("/base/spec/IS_table.html", function(data) {
        base_result = data;
        // console.log(base_result);
        $.getJSON("/base/spec/api_IS_input.json", function(generatedJson) {
          htmlTable = json2HtmlTable(generatedJson)[0].outerHTML;
          // console.log(htmlTable);
          expect(htmlTable).toEqual(base_result);
          done();
        });
      });
    });

    it('Clean Excel to JSON to HTML table', function(done) {
      var htmlTable, base_result;
      $.get("/base/spec/IS_table.html", function(data) {
        base_result = data;
        // console.log(base_result);
        $.get("/base/spec/excel_input_hotel.txt", function(excelInput) {
          htmlTable = json2HtmlTable(readExcel(excelInput))[0].outerHTML;
          // console.log(htmlTable);
          expect(htmlTable).toEqual(base_result);
          done();
        });
      });
    });

    it('Excel without Page to JSON to HTML table', function(done) {
      var htmlTable, base_result;
      $.get("/base/spec/IS_table_withoutPage.html", function(data) {
        base_result = data;
        // console.log(base_result);
        $.get("/base/spec/excel_input_hotel_without_page.txt", function(excelInput) {
          htmlTable = json2HtmlTable(readExcel(excelInput))[0].outerHTML;
          // console.log(htmlTable);
          expect(htmlTable).toEqual(base_result);
          done();
        });
      });
    });

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
