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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9101340604408089, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.977, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.793, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.71, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.57, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 203.16119063849214, 1, 3538, 14.0, 608.0, 1321.0, 2280.980000000003, 24.191473783500324, 162.64584139818857, 213.1459347838873], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.296, 4, 46, 9.0, 13.0, 15.0, 22.99000000000001, 0.5599141763550483, 5.986554255963646, 0.2034063218789824], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.830000000000002, 5, 39, 8.0, 11.0, 13.949999999999989, 26.970000000000027, 0.5598934858632494, 6.011659466903016, 0.23729860631313499], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.408000000000023, 14, 267, 20.0, 29.0, 33.0, 57.960000000000036, 0.5560671373218917, 0.2996680557223757, 6.191677245843954], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.957999999999984, 27, 72, 46.0, 55.0, 58.0, 63.0, 0.5597374159834139, 2.3280484908919528, 0.2339527480868175], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6599999999999984, 1, 13, 2.0, 4.0, 5.0, 7.0, 0.5597643615943433, 0.34985272599646455, 0.237790524700722], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.354000000000006, 24, 76, 41.0, 50.0, 52.0, 54.99000000000001, 0.5597255106095971, 2.2967549213865524, 0.20443099703905207], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 776.034, 573, 1023, 773.0, 920.0, 943.9, 990.9300000000001, 0.5593836040190593, 2.365908583014205, 0.27313652539993133], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.280000000000017, 5, 38, 9.0, 12.0, 14.0, 21.980000000000018, 0.5592691023954613, 0.8318035575666872, 0.2867346472242356], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.6820000000000004, 2, 22, 3.0, 5.0, 7.0, 17.980000000000018, 0.5570025243354403, 0.5374204043392724, 0.3056986510512866], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.82599999999999, 8, 51, 14.0, 17.0, 19.0, 26.0, 0.5597148588623012, 0.912269628360528, 0.3667662795865274], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 645.0, 1.550387596899225, 0.661640019379845, 1833.7860343992247], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.765999999999997, 2, 25, 4.0, 6.0, 8.0, 18.0, 0.557013693624644, 0.5591024949757365, 0.32800708716373084], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.134, 9, 104, 15.0, 18.0, 20.0, 26.980000000000018, 0.55969856873882, 0.8788142058213129, 0.3339607670892764], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.914000000000005, 5, 31, 9.0, 11.0, 13.0, 20.99000000000001, 0.5596973156916739, 0.8663283646204133, 0.3208421135849732], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2027.903999999999, 1475, 2987, 2014.0, 2272.7000000000003, 2350.95, 2536.0, 0.5583597623620852, 0.852807293295216, 0.30862463427435566], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.817999999999998, 12, 82, 17.0, 24.0, 29.0, 45.98000000000002, 0.5560263245103076, 0.3002759350138673, 4.484048230279414], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.270000000000024, 11, 51, 19.0, 22.0, 24.0, 30.0, 0.5597261371955929, 1.0134104085553022, 0.467896067811941], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.722000000000007, 8, 47, 14.0, 17.0, 19.0, 24.0, 0.5597217511230818, 0.9478100746556871, 0.40230000861971493], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 75.0, 75, 75, 75.0, 75.0, 75.0, 75.0, 13.333333333333334, 6.2109375, 1818.4635416666667], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 678.0, 678, 678, 678.0, 678.0, 678.0, 678.0, 1.4749262536873156, 0.6755277470501474, 2820.7158001474922], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.432000000000001, 1, 20, 2.0, 3.0, 5.0, 8.990000000000009, 0.5568716288383769, 0.46822897698226806, 0.23656167826630267], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 416.4160000000002, 314, 635, 415.0, 486.0, 498.9, 528.98, 0.5566893461906305, 0.4897344049046558, 0.25877356326830087], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3220000000000014, 1, 24, 3.0, 4.0, 6.0, 13.0, 0.556947925368978, 0.5047340573656364, 0.27303501810080755], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1186.9580000000005, 912, 1576, 1169.0, 1379.0, 1401.9, 1451.0, 0.5563901407667056, 0.526505904690369, 0.2950389125354699], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 58.0, 58, 58, 58.0, 58.0, 58.0, 58.0, 17.241379310344826, 8.065059267241379, 1135.321255387931], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 43.65000000000004, 27, 725, 41.0, 51.0, 58.94999999999999, 109.8900000000001, 0.5555882735316635, 0.3000393703740331, 25.41382298068664], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.335999999999984, 27, 195, 41.0, 50.0, 60.0, 83.98000000000002, 0.5563957130823098, 125.91006777873478, 0.17278694996110794], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.8336156031468533, 1.4409418706293708], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.5560000000000005, 1, 22, 2.0, 4.0, 5.0, 10.980000000000018, 0.5601669745717803, 0.608853362010148, 0.24124378494741713], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5799999999999974, 1, 37, 3.0, 5.0, 7.0, 13.990000000000009, 0.5601600713419866, 0.5749299169730743, 0.20732487015489548], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.284000000000001, 1, 14, 2.0, 3.0, 4.0, 7.0, 0.5599273438278649, 0.31769315113670854, 0.21817481463605284], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.744, 84, 463, 122.0, 149.0, 156.95, 186.93000000000006, 0.5598665278197678, 0.5101127641170344, 0.18370620444086128], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 173.48999999999992, 120, 628, 169.0, 194.90000000000003, 223.64999999999992, 404.8900000000001, 0.5561537297893735, 0.30034473884133156, 164.521570144333], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.5620000000000003, 1, 28, 2.0, 4.0, 5.0, 11.990000000000009, 0.5601556784661593, 0.3117178826339416, 0.23576864982315884], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 472.87199999999984, 344, 662, 475.0, 553.0, 568.0, 595.97, 0.5599681042167839, 0.608549712008404, 0.2417049824841977], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.092000000000002, 7, 368, 11.0, 17.0, 22.0, 46.8900000000001, 0.5553803022157452, 0.2348434285736501, 0.40406086440501], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.296000000000002, 1, 33, 3.0, 4.0, 6.0, 11.980000000000018, 0.5601782711330054, 0.5962835112646249, 0.2286665208335901], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.890000000000001, 2, 15, 4.0, 5.0, 6.0, 11.0, 0.5568635661988269, 0.3420577960342404, 0.2795194072521456], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.229999999999994, 2, 38, 4.0, 5.0, 7.0, 11.990000000000009, 0.5568412401077154, 0.32627416412561444, 0.26373828266820504], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 531.1859999999997, 375, 798, 536.5, 643.9000000000001, 657.95, 692.99, 0.5563480424337779, 0.5079066445203057, 0.24611881174072403], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.74200000000001, 6, 118, 16.0, 25.900000000000034, 33.94999999999999, 51.99000000000001, 0.5565121380862438, 0.49292627855881166, 0.22988733829148547], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.673999999999994, 4, 54, 7.0, 9.0, 12.0, 23.970000000000027, 0.5570205195218981, 0.3715283347982973, 0.26164733387698536], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 562.0479999999995, 368, 3538, 542.0, 631.0, 655.0, 745.97, 0.5568151952639527, 0.4186989261262144, 0.30885842862297375], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.982, 8, 58, 14.0, 17.0, 19.0, 30.0, 0.5592522126813795, 0.45657700175940746, 0.3462557644921822], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.756000000000002, 8, 38, 14.0, 17.0, 18.0, 23.0, 0.5592603446385948, 0.4646885465159199, 0.354999242202233], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.595999999999998, 8, 35, 14.0, 17.0, 18.0, 25.0, 0.5592415789403044, 0.45274537982569557, 0.34242624023004964], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 17.005999999999993, 10, 39, 17.0, 21.0, 23.0, 33.0, 0.5592465830033779, 0.5002635449522403, 0.38994341822696466], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.220000000000008, 8, 51, 14.0, 16.0, 18.0, 34.950000000000045, 0.5590127387822913, 0.4198054649644356, 0.30953146766558515], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2208.8639999999987, 1653, 2969, 2190.5, 2503.7000000000003, 2603.3999999999996, 2752.86, 0.5580039529000024, 0.46582431552445114, 0.35638143085605617], "isController": false}]}, function(index, item){
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
