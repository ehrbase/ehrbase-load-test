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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9113610543058396, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.975, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.813, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.722, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.593, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 200.382958418541, 1, 2788, 13.0, 607.0, 1307.9500000000007, 2271.0, 24.64060879828182, 165.6702635501653, 217.10316795729858], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.022, 5, 37, 8.0, 12.0, 15.949999999999989, 25.980000000000018, 0.5696960443724854, 6.095990240679488, 0.206959891119692], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.371999999999993, 5, 92, 8.0, 10.0, 12.0, 17.99000000000001, 0.5696402266256677, 6.116311669250935, 0.24142954917533185], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.60199999999999, 14, 270, 20.0, 26.0, 31.0, 72.88000000000011, 0.5671943843218397, 0.3056645986759414, 6.3155765332398595], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.61200000000001, 27, 145, 46.0, 54.0, 56.0, 64.99000000000001, 0.5694138226344272, 2.3682944048828376, 0.23799718367923325], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4979999999999998, 1, 9, 2.0, 3.0, 4.0, 6.0, 0.569447544769966, 0.35590471548122876, 0.24190398630364765], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.409999999999975, 23, 77, 40.0, 48.0, 50.0, 62.97000000000003, 0.5694079865164189, 2.336485599672021, 0.20796737007533267], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 763.3120000000001, 579, 1023, 766.5, 893.9000000000001, 924.95, 965.9200000000001, 0.569065162513629, 2.406856659029812, 0.27786384888360793], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.718000000000005, 5, 30, 9.0, 11.0, 12.0, 19.0, 0.5692562894281137, 0.8466575476552902, 0.2918550312009372], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.677999999999997, 1, 28, 3.0, 5.0, 7.0, 13.0, 0.5676026055230003, 0.5476478264225824, 0.31151627373430296], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.110000000000003, 8, 58, 13.5, 17.0, 18.0, 24.0, 0.5693982599189177, 0.9280524373092516, 0.3731115550835877], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 0.6950452972312704, 1926.3713227809446], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.803999999999996, 2, 26, 4.0, 6.0, 7.0, 19.99000000000001, 0.5676135596068027, 0.5697421104553283, 0.33424900043252154], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.14, 9, 61, 14.0, 18.0, 19.0, 26.0, 0.5693885336537093, 0.894028964794707, 0.3397425723265785], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.59, 5, 20, 9.0, 11.0, 13.0, 17.0, 0.5693852916391464, 0.881323913328171, 0.32639567010954973], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1977.5320000000008, 1569, 2783, 1967.5, 2229.7000000000003, 2300.9, 2441.9300000000003, 0.5682179775076596, 0.8678641765839644, 0.3140736086614603], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.61000000000001, 11, 130, 17.0, 23.900000000000034, 29.0, 53.0, 0.5671216873004441, 0.30626786433314995, 4.573526263405339], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.054000000000013, 11, 46, 19.0, 22.0, 24.0, 31.99000000000001, 0.5694092834211932, 1.0309421986942306, 0.4759905728599037], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.266000000000005, 8, 75, 14.0, 17.0, 18.0, 23.0, 0.5694040958375421, 0.9642057638499005, 0.40925919388323345], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 4.313151041666667, 1262.8219039351852], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 632.0, 632, 632, 632.0, 632.0, 632.0, 632.0, 1.5822784810126582, 0.7246959058544303, 3026.0210640822784], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.301999999999998, 1, 18, 2.0, 3.0, 4.0, 8.990000000000009, 0.5677779216148513, 0.47739920948279974, 0.2411947225609964], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 414.32799999999975, 314, 722, 413.0, 483.90000000000003, 500.95, 539.8900000000001, 0.5675169205169852, 0.4992597096469932, 0.2638066935215674], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.298000000000001, 2, 40, 3.0, 4.0, 6.0, 13.990000000000009, 0.567779211104853, 0.5145499100637729, 0.2783448866939806], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1178.0139999999988, 917, 1444, 1171.0, 1360.0, 1387.0, 1418.99, 0.5669885649746216, 0.536535077598055, 0.3006589753722847], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.356000000000044, 28, 732, 41.0, 49.900000000000034, 56.89999999999998, 92.95000000000005, 0.5666602067403098, 0.3060186468040931, 25.920277425504015], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.411999999999985, 29, 186, 42.0, 50.0, 56.0, 92.98000000000002, 0.5674911556503393, 128.42092092322866, 0.1762326049773514], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.7081891286644952, 1.3423758143322475], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.399999999999999, 1, 30, 2.0, 3.0, 4.0, 8.0, 0.5699512577684357, 0.6194880370080751, 0.24545752409753918], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.482000000000001, 2, 20, 3.0, 5.0, 7.0, 11.0, 0.5699460603048528, 0.5849739349417972, 0.21094683286673752], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2620000000000005, 1, 15, 2.0, 3.0, 4.0, 8.980000000000018, 0.5697090268116461, 0.32324310993902977, 0.22198623212680357], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.54200000000006, 87, 451, 121.0, 146.90000000000003, 153.0, 182.94000000000005, 0.5696486634903057, 0.5190255889027883, 0.18691596770775656], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 164.49199999999973, 112, 539, 163.0, 188.0, 218.89999999999998, 395.5500000000004, 0.5672600206482648, 0.30634256974461954, 167.80703657692615], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.4000000000000004, 1, 23, 2.0, 3.0, 5.0, 8.980000000000018, 0.5699402132716278, 0.31716282336982854, 0.23988694523444493], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 471.45199999999994, 337, 694, 473.0, 548.9000000000001, 565.0, 628.8700000000001, 0.5697434331371897, 0.6191731270824122, 0.24592441156898226], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.840000000000002, 7, 328, 11.0, 16.0, 20.0, 44.98000000000002, 0.5664727441639146, 0.23953388498337402, 0.4121310492208168], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.171999999999999, 1, 34, 3.0, 4.0, 5.0, 9.990000000000009, 0.5699571050282756, 0.6066926215633012, 0.2326582713884953], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.059999999999999, 2, 27, 4.0, 5.0, 7.0, 12.0, 0.5677708295245374, 0.34875766774505274, 0.2849943421636838], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.178000000000004, 2, 26, 4.0, 5.0, 6.0, 11.0, 0.5677553564879108, 0.3326691541921352, 0.2689075663053093], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 524.3740000000001, 376, 769, 515.5, 637.9000000000001, 659.95, 716.96, 0.5672690307414433, 0.5178767389632137, 0.2509500692635486], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.399999999999995, 5, 116, 16.0, 26.0, 31.0, 46.0, 0.5676045385658903, 0.5027512856242798, 0.23446945294274574], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.430000000000003, 4, 36, 7.0, 9.0, 10.949999999999989, 16.0, 0.5676225809344657, 0.3785998269318751, 0.2666274037397246], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 556.3740000000004, 434, 2775, 540.5, 623.0, 650.0, 709.9300000000001, 0.5673327531410377, 0.42660763663925694, 0.3146923865079194], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.325999999999995, 8, 52, 14.0, 16.0, 17.0, 25.0, 0.569223886000394, 0.46471793818000906, 0.35242963254321263], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.081999999999995, 8, 26, 14.0, 16.0, 17.0, 23.0, 0.569245919929869, 0.47298554542297816, 0.3613377421429832], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.405999999999993, 8, 60, 14.0, 17.0, 18.94999999999999, 31.99000000000001, 0.5691953740353561, 0.46080367683135764, 0.34852099562516436], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.045999999999996, 10, 42, 17.0, 19.0, 21.0, 27.0, 0.5692037977277384, 0.5091705846861411, 0.39688624177500514], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.5, 8, 68, 14.0, 16.0, 18.0, 29.960000000000036, 0.5691189242286446, 0.4273949733709255, 0.3151273730836343], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2196.1580000000017, 1699, 2788, 2191.5, 2517.4, 2599.5, 2720.0, 0.5680146411453901, 0.47418128499680207, 0.36277497588777846], "isController": false}]}, function(index, item){
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
