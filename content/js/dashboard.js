/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9112474437627812, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.977, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.839, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.693, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.592, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 200.35555555555626, 1, 3452, 13.0, 607.8000000000029, 1301.9500000000007, 2274.9900000000016, 24.560823895376807, 165.14280208041507, 216.352229773037], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.468000000000002, 4, 98, 7.0, 11.900000000000034, 14.949999999999989, 25.99000000000001, 0.5682534956113783, 6.089687475849226, 0.20532597009395503], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.632000000000004, 4, 36, 7.0, 9.0, 11.0, 18.0, 0.5682354131128277, 6.101227978036564, 0.23972431490697418], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.12999999999999, 13, 270, 19.0, 27.0, 32.89999999999998, 66.96000000000004, 0.5647101342880699, 0.3043258208061802, 6.286812041878904], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 40.70399999999999, 25, 82, 41.0, 51.0, 53.0, 56.0, 0.5679933476619122, 2.3623863942305507, 0.23629410752341268], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.473999999999998, 1, 24, 2.0, 3.0, 4.0, 8.0, 0.5680288376880317, 0.3550180235550199, 0.2401918815614431], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 35.71800000000001, 20, 121, 35.5, 45.0, 47.0, 54.98000000000002, 0.5679881858457344, 2.3306596472793366, 0.2063394581392707], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 759.9899999999998, 570, 1474, 748.0, 908.9000000000001, 932.9, 981.8600000000001, 0.5676664028910114, 2.4009406161337603, 0.2760721373434802], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.595999999999998, 5, 33, 8.5, 11.0, 12.0, 18.99000000000001, 0.567792106327021, 0.8444798612656766, 0.2899953824306953], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.558, 2, 26, 3.0, 5.0, 6.0, 12.0, 0.5655923052298057, 0.5457082007490704, 0.30930829192255005], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.764000000000003, 8, 28, 13.0, 16.0, 17.94999999999999, 23.0, 0.5679804432973764, 0.9257415623665246, 0.3710731607089305], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 633.0, 633, 633, 633.0, 633.0, 633.0, 633.0, 1.5797788309636651, 0.6741829581358609, 1868.546665185624], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.6139999999999946, 3, 25, 4.0, 6.0, 7.949999999999989, 12.0, 0.5656031818572599, 0.5677241937892246, 0.3319604612267707], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.555999999999996, 9, 42, 14.0, 16.0, 18.0, 24.99000000000001, 0.5679785076932689, 0.8918150037202591, 0.3377919054542976], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.287999999999997, 5, 50, 8.0, 10.0, 12.0, 21.0, 0.5679649588338997, 0.8791254489763, 0.3244721688650697], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1978.9100000000003, 1538, 2489, 1976.0, 2235.8, 2306.95, 2388.9700000000003, 0.5668143784937021, 0.8657203984024903, 0.31219073190473434], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.76199999999999, 11, 100, 17.0, 24.0, 29.0, 63.87000000000012, 0.564673782309222, 0.30494590001660143, 4.552682369868103], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.34200000000001, 12, 39, 17.0, 21.0, 23.0, 30.0, 0.5679901215158066, 1.0283727395413138, 0.47369488649853403], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.906000000000004, 8, 61, 13.0, 16.0, 18.94999999999999, 24.99000000000001, 0.5679888310676259, 0.9618092119836555, 0.40713261914417714], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 6.0496144480519485, 1771.205357142857], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 0.7375327093397746, 3079.6189361916263], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3599999999999994, 1, 23, 2.0, 3.0, 4.0, 9.980000000000018, 0.565511703264699, 0.47549372706143156, 0.23912750733751437], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 415.22599999999994, 320, 716, 416.0, 481.0, 495.0, 564.8500000000001, 0.5653166904099677, 0.4973241087782376, 0.2616797961468014], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.198000000000002, 1, 21, 3.0, 4.0, 6.0, 10.0, 0.5655526410742786, 0.512532080973565, 0.27614875052455007], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1181.616000000001, 920, 2030, 1181.0, 1359.9, 1387.9, 1449.8700000000001, 0.5649494087804436, 0.5346054463947754, 0.29847424819357427], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.668417008196721, 1079.4537653688524], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 43.252000000000024, 27, 652, 41.0, 51.0, 59.0, 106.99000000000001, 0.564266577587783, 0.3047259935605898, 25.809685508844314], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.05400000000001, 29, 191, 42.0, 50.0, 57.94999999999999, 85.90000000000009, 0.5650298505270033, 127.86393766901456, 0.17436468043606743], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 316.0, 316, 316, 316.0, 316.0, 316.0, 316.0, 3.1645569620253164, 1.6595381724683544, 1.2979628164556962], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3160000000000016, 1, 23, 2.0, 3.0, 4.0, 7.0, 0.5684815630059487, 0.6178906051031453, 0.24371426382774555], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.29, 2, 20, 3.0, 4.0, 6.0, 10.990000000000009, 0.56847639231238, 0.5834655159378042, 0.20929257802906961], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1520000000000015, 1, 12, 2.0, 3.0, 4.0, 8.0, 0.5682670582405543, 0.32242496175562696, 0.22031447472802737], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.64799999999998, 84, 671, 120.0, 144.0, 153.0, 209.72000000000025, 0.5682024800901851, 0.5177079237540456, 0.18533166831066586], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 165.68399999999997, 110, 587, 164.0, 192.0, 216.95, 358.96000000000004, 0.5648000777164907, 0.30501410446994076, 167.07823236496478], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3259999999999996, 1, 29, 2.0, 3.0, 4.0, 7.980000000000018, 0.5684738070008686, 0.316346791192749, 0.2381594367220436], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 460.81600000000014, 348, 647, 461.5, 536.0, 550.0, 591.9000000000001, 0.5682547872624554, 0.6175553295479989, 0.24417197890183628], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.984000000000004, 8, 313, 11.0, 17.0, 24.0, 103.81000000000017, 0.5640902409003783, 0.23852643975572635, 0.4092959462783018], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.952000000000001, 2, 12, 3.0, 4.0, 5.0, 7.0, 0.5684835020402873, 0.6051240402577277, 0.2309464227038667], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9179999999999953, 2, 25, 3.0, 5.0, 7.0, 18.920000000000073, 0.5654989114145955, 0.34736212429666075, 0.28274945570729776], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.220000000000001, 2, 61, 4.0, 5.0, 6.0, 17.940000000000055, 0.5654842015023784, 0.33133839931779985, 0.2667274114508289], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 535.5680000000001, 378, 924, 534.5, 638.9000000000001, 657.0, 724.94, 0.564978135346162, 0.5157853125459044, 0.24883314359484288], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.14600000000001, 6, 123, 15.0, 27.900000000000034, 33.94999999999999, 46.98000000000002, 0.5651460846114111, 0.5005737292407715, 0.23235009923965247], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.276000000000001, 4, 45, 7.0, 9.0, 10.949999999999989, 15.990000000000009, 0.5656153385829978, 0.37726101196502687, 0.26457983123169526], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 557.5160000000001, 427, 3452, 535.0, 627.9000000000001, 666.9, 811.8300000000002, 0.5653601570344372, 0.42512433683253575, 0.3124939930483315], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.683999999999992, 8, 29, 13.0, 15.0, 16.0, 20.0, 0.5677779216148513, 0.4635374438183747, 0.35042543599666603], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.50999999999999, 8, 26, 13.0, 15.0, 16.0, 18.99000000000001, 0.5677805006007117, 0.4717679307920992, 0.3592985980363879], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.939999999999998, 8, 43, 13.0, 16.0, 18.0, 27.970000000000027, 0.5677611587778146, 0.4596425787371175, 0.3465339103868497], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.707999999999995, 10, 42, 16.0, 19.0, 20.94999999999999, 25.99000000000001, 0.5677701847978398, 0.5078881731199426, 0.3947777066172479], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.649999999999999, 8, 34, 13.0, 16.0, 17.0, 22.99000000000001, 0.5675697458082136, 0.4262315766860511, 0.313161041388321], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2202.8099999999995, 1715, 2850, 2197.5, 2525.8, 2630.95, 2733.91, 0.5664778784723677, 0.47289838831378794, 0.3606870866835779], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
