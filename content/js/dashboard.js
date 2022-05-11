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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9120654396728016, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.988, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.814, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.724, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.611, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 200.9335605544189, 1, 3540, 14.0, 590.0, 1290.0, 2279.0, 24.498097932273694, 164.70736091199333, 215.79968715313845], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.53999999999999, 4, 44, 8.0, 12.0, 15.0, 28.980000000000018, 0.5670027102729551, 6.062346466297359, 0.2048740261728451], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.995999999999993, 4, 49, 7.0, 10.0, 12.0, 19.99000000000001, 0.5669859931780246, 6.087812770735812, 0.2391972158719791], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.354000000000013, 14, 251, 20.0, 28.0, 36.89999999999998, 61.98000000000002, 0.5632527168494798, 0.3035404094396649, 6.2705868868008485], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.35800000000002, 25, 108, 43.0, 52.0, 54.0, 65.0, 0.5667745427546376, 2.3573171656171894, 0.23578706563815982], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.665999999999999, 1, 22, 2.0, 4.0, 5.0, 11.990000000000009, 0.5668015276434774, 0.3542509547771733, 0.2396729115914313], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.88, 23, 176, 38.0, 46.0, 48.0, 66.99000000000001, 0.566767475708346, 2.3256506348929262, 0.20589599703467257], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 768.3719999999998, 560, 1254, 763.5, 906.0, 924.95, 1099.1600000000008, 0.5664464322937908, 2.395780760023836, 0.27547883133037876], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.638000000000003, 6, 49, 9.0, 12.0, 14.0, 25.99000000000001, 0.5664798038620328, 0.8425280676580819, 0.2893251341990655], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5639999999999974, 2, 23, 3.0, 5.0, 7.0, 14.990000000000009, 0.5641685284228105, 0.544334478595446, 0.3085296639812245], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 14.542000000000003, 9, 93, 14.0, 18.0, 21.0, 32.98000000000002, 0.5667604088382886, 0.9237530491709995, 0.3702760874148584], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 0.6850045144462279, 1898.5393885433386], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.690000000000002, 3, 25, 4.0, 6.0, 8.0, 17.99000000000001, 0.5641793503587617, 0.5662950229226069, 0.3311247944976716], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.248000000000012, 10, 54, 15.0, 19.0, 22.0, 35.97000000000003, 0.5667475604351261, 0.889882224189466, 0.33705982842284354], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.872, 5, 37, 9.0, 11.0, 12.0, 18.0, 0.566745633224896, 0.8772381139272072, 0.3237755814810197], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1993.2139999999988, 1465, 2639, 1968.0, 2244.6000000000004, 2312.95, 2423.8100000000004, 0.5655590381424327, 0.8638030621628561, 0.31149931397688674], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.051999999999996, 12, 93, 17.0, 25.0, 31.94999999999999, 52.930000000000064, 0.5632038640290704, 0.30415208672663663, 4.54083115373438], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.710000000000004, 12, 45, 19.0, 22.0, 25.0, 30.99000000000001, 0.5667713304390211, 1.026166061165962, 0.47267843378410546], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.083999999999996, 9, 35, 14.0, 18.0, 19.0, 26.980000000000018, 0.5667694030671293, 0.9597442821468771, 0.4062585369641337], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 5.354256465517242, 1567.6185344827588], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 664.0, 664, 664, 664.0, 664.0, 664.0, 664.0, 1.5060240963855422, 0.6897708019578312, 2880.185782191265], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4039999999999964, 1, 23, 2.0, 3.0, 5.0, 9.990000000000009, 0.564033607378462, 0.47425091401646075, 0.2385024921824942], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 412.2020000000001, 317, 914, 415.0, 479.0, 489.95, 563.8300000000002, 0.5638326183935732, 0.4960185312047524, 0.2609928331235876], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.374000000000001, 1, 36, 3.0, 4.0, 7.0, 19.0, 0.5641271542605704, 0.5112402335486418, 0.27545271204129407], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1169.6679999999997, 932, 1863, 1162.0, 1351.7, 1376.95, 1463.5400000000004, 0.5635345790453048, 0.5332666084911136, 0.2977267649057714], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 61.0, 61, 61, 61.0, 61.0, 61.0, 61.0, 16.393442622950822, 7.668417008196721, 1079.4537653688524], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.482, 28, 707, 42.0, 52.900000000000034, 59.0, 106.96000000000004, 0.5627652031019618, 0.3039151926908055, 25.741012287978208], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.859999999999985, 29, 203, 42.0, 50.0, 59.0, 94.96000000000004, 0.5635758663288217, 127.53490700857311, 0.17391598999990981], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 350.0, 350, 350, 350.0, 350.0, 350.0, 350.0, 2.857142857142857, 1.498325892857143, 1.171875], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.425999999999999, 1, 33, 2.0, 3.0, 4.0, 10.0, 0.5672336355932299, 0.6165342152492822, 0.24317926369670698], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4459999999999993, 2, 21, 3.0, 5.0, 6.0, 11.990000000000009, 0.5672278440804102, 0.5821840470004992, 0.2088329074397604], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1439999999999984, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.5670168562771034, 0.32171561864941123, 0.2198297772871192], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.7980000000001, 87, 431, 123.0, 150.0, 155.0, 171.97000000000003, 0.5669487047489892, 0.5165655679011786, 0.1849227220567992], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 177.77400000000006, 121, 643, 174.0, 201.90000000000003, 229.84999999999997, 393.9200000000001, 0.5633244252964212, 0.30421719452043067, 166.6417072870521], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.432, 1, 24, 2.0, 3.0, 5.0, 8.990000000000009, 0.5672239831375654, 0.3156512837413186, 0.2376358288730621], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 464.14000000000027, 339, 1234, 471.0, 538.0, 550.0, 617.7000000000003, 0.5670207144007384, 0.6162141912243337, 0.2436417132190673], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.33400000000001, 8, 354, 11.0, 17.0, 22.0, 49.930000000000064, 0.5625594203387733, 0.23787912988934456, 0.4081852044059654], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.113999999999999, 1, 31, 3.0, 4.0, 5.0, 13.990000000000009, 0.5672349226121395, 0.603794985983625, 0.23043918731118165], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9600000000000044, 2, 25, 3.5, 5.0, 7.0, 13.990000000000009, 0.564025972267971, 0.3464573599185095, 0.2820129861339855], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.241999999999999, 2, 32, 4.0, 5.0, 7.0, 13.0, 0.5640081578139946, 0.3304735299691375, 0.2660311916251557], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 522.0000000000007, 372, 1181, 519.0, 633.9000000000001, 648.0, 765.6400000000003, 0.5635015535737832, 0.5144372972098784, 0.24818281314626586], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.90400000000001, 7, 116, 16.0, 29.0, 34.0, 48.0, 0.5636978579481398, 0.4992909737880496, 0.23175468573844418], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.81, 4, 44, 8.0, 10.0, 11.0, 20.99000000000001, 0.5641908093317161, 0.37631086208355663, 0.26391347428700385], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 543.6659999999997, 385, 3540, 530.0, 590.0, 632.95, 692.97, 0.5639738045447265, 0.42408186474554627, 0.31172770837140157], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 14.398000000000001, 9, 63, 14.0, 17.0, 19.94999999999999, 35.940000000000055, 0.5664541330759365, 0.4624566945815264, 0.3496084102578046], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 14.48199999999999, 9, 61, 14.0, 17.0, 19.0, 51.90000000000009, 0.566461192310176, 0.4706717195949123, 0.3584637232587833], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 14.244000000000003, 9, 61, 15.0, 18.0, 19.94999999999999, 30.0, 0.5664284646163467, 0.45856366910835095, 0.3457204984230631], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 17.36000000000001, 11, 63, 17.0, 21.0, 23.0, 37.99000000000001, 0.5664380900160755, 0.5066965727096926, 0.3938514844643025], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.541999999999996, 9, 47, 14.0, 16.0, 18.0, 24.99000000000001, 0.566228330441794, 0.4252242051852926, 0.31242090498009145], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2205.5299999999984, 1667, 2981, 2201.0, 2520.3, 2597.95, 2731.0, 0.5651920805285676, 0.47182499816312573, 0.35986839502404894], "isController": false}]}, function(index, item){
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
