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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9095660077255169, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.967, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.784, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.708, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.569, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 203.49947739150142, 1, 3940, 13.0, 615.0, 1316.9500000000007, 2283.980000000003, 24.212608821950127, 162.78377739907563, 213.3321511164428], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.208000000000016, 5, 49, 8.0, 13.0, 15.0, 25.980000000000018, 0.5607487116798349, 5.991236373806307, 0.20370949291494003], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.384, 5, 36, 8.0, 11.0, 12.0, 19.99000000000001, 0.5607304748041368, 6.020646341401871, 0.23765334576659708], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 23.106000000000016, 14, 287, 20.0, 29.0, 34.0, 65.99000000000001, 0.556740794847698, 0.3000310939733923, 6.199178264505325], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.002, 28, 69, 46.0, 55.0, 57.0, 60.0, 0.5606217070482482, 2.33172641632665, 0.2343223541178225], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5519999999999983, 1, 11, 2.0, 3.0, 4.0, 7.0, 0.5606531384802039, 0.3504082115501274, 0.23816808128797723], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.70200000000001, 24, 68, 40.0, 48.0, 50.0, 56.0, 0.5606160497647655, 2.300409123577717, 0.20475625255080304], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 784.0120000000001, 581, 1189, 782.0, 921.0, 950.0, 1069.3800000000006, 0.5602617542916051, 2.369622712731388, 0.27356530971269777], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.017999999999994, 5, 40, 9.0, 11.0, 13.0, 20.99000000000001, 0.5602008656223776, 0.8331893733817197, 0.28721235786303534], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8379999999999947, 1, 26, 3.0, 5.0, 8.0, 19.99000000000001, 0.557680939580847, 0.5380749690487078, 0.30607098441839453], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.169999999999998, 8, 45, 13.0, 17.0, 18.0, 23.0, 0.5606103925954579, 0.9137292434002141, 0.3673530990542503], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.6817217452076677, 1889.444076976837], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.932000000000001, 2, 34, 4.0, 6.900000000000034, 9.0, 17.0, 0.5576921360947273, 0.5597834816050826, 0.3284065996729693], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.063999999999993, 9, 36, 14.0, 17.0, 19.0, 24.0, 0.5606015927812454, 0.8802320946654274, 0.3344995831927158], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.416000000000002, 5, 31, 8.0, 11.0, 12.0, 17.99000000000001, 0.560600335687481, 0.867726105531892, 0.32135976274272593], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2010.8280000000009, 1521, 2802, 1996.0, 2261.000000000001, 2348.45, 2595.2200000000007, 0.559234698499797, 0.8541436215367993, 0.30910824155359873], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.62600000000001, 12, 127, 17.0, 25.0, 32.94999999999999, 60.98000000000002, 0.5567005029232344, 0.300640017691942, 4.489485110488348], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.85600000000002, 11, 46, 18.0, 22.0, 24.0, 28.980000000000018, 0.5606217070482482, 1.0150318797533713, 0.468644708235645], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.175999999999995, 8, 35, 14.0, 17.0, 18.0, 23.0, 0.5606173069290057, 0.9493265724754841, 0.4029436893552228], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 84.0, 84, 84, 84.0, 84.0, 84.0, 84.0, 11.904761904761903, 5.545479910714286, 1623.628162202381], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 707.0, 707, 707, 707.0, 707.0, 707.0, 707.0, 1.4144271570014144, 0.6478186881188119, 2705.014586280057], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5439999999999983, 1, 19, 2.0, 3.0, 5.0, 11.0, 0.5575926272872449, 0.46883520712335736, 0.23686796178706207], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 423.17399999999975, 322, 954, 422.5, 493.0, 506.95, 557.8300000000002, 0.5573955802989647, 0.49035569780910093, 0.2591018517795969], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1799999999999993, 2, 25, 3.0, 4.0, 5.0, 11.990000000000009, 0.5576436211146181, 0.5053645316351226, 0.2733760720698616], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1196.919999999999, 948, 1566, 1188.0, 1372.0, 1404.95, 1487.95, 0.5570645816110753, 0.5271441206846992, 0.2953965506004042], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 63.0, 63, 63, 63.0, 63.0, 63.0, 63.0, 15.873015873015872, 7.424975198412699, 1045.2163938492063], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.59999999999995, 28, 766, 42.0, 54.0, 62.94999999999999, 104.93000000000006, 0.556234161232259, 0.30038817496234294, 25.443367296991216], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.43400000000002, 27, 196, 40.0, 49.0, 53.0, 76.98000000000002, 0.557057754633885, 126.05988506645143, 0.17299254489606974], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.8465283890845072, 1.4510893485915495], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.405999999999997, 1, 16, 2.0, 3.0, 5.0, 9.0, 0.5610072998269854, 0.6097667233471041, 0.24160568283564504], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3820000000000014, 2, 15, 3.0, 5.0, 7.0, 10.990000000000009, 0.5610010053138015, 0.575793024008599, 0.20763611427141676], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.293999999999999, 1, 18, 2.0, 3.0, 4.0, 7.0, 0.5607625473423781, 0.31816703125578283, 0.21850025038047738], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.18999999999997, 86, 468, 122.5, 147.0, 152.95, 194.8900000000001, 0.5607028073268157, 0.5108747258163272, 0.1839806086541114], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 168.47199999999984, 112, 790, 169.0, 194.0, 216.84999999999997, 374.73000000000025, 0.5568331783480988, 0.30071166760400253, 164.7225648293028], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.402000000000001, 1, 12, 2.0, 3.0, 4.0, 8.980000000000018, 0.5609965992386154, 0.3121858419044264, 0.23612259206234693], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 483.62200000000007, 352, 674, 484.5, 556.9000000000001, 574.0, 613.98, 0.560793994569271, 0.6094472548012378, 0.24206147031212674], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.609999999999996, 7, 339, 11.0, 18.0, 24.94999999999999, 53.97000000000003, 0.5560479669218186, 0.2351257516378393, 0.4045466165593309], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.2079999999999975, 1, 20, 3.0, 4.0, 6.0, 10.0, 0.5610098176718092, 0.5971686535764376, 0.22900596072931276], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.114000000000005, 2, 25, 4.0, 6.0, 7.0, 14.0, 0.5575851655581874, 0.3425010440782225, 0.2798816163055745], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.174000000000004, 2, 29, 4.0, 5.0, 7.0, 11.0, 0.5575702426991753, 0.32670131408154796, 0.26408356221591794], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 538.1319999999998, 382, 1070, 537.0, 648.0, 670.9, 716.8400000000001, 0.5570161757497438, 0.5085166032596586, 0.24641438243616595], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.712000000000023, 5, 123, 16.0, 26.900000000000034, 31.94999999999999, 43.97000000000003, 0.5571763195606777, 0.4935145721108737, 0.23016170231852212], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.536000000000001, 4, 47, 7.0, 9.0, 11.0, 21.0, 0.5577008448052397, 0.37198210644724483, 0.2619669007337112], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 570.7060000000002, 373, 3940, 541.0, 650.0, 698.8, 870.7900000000002, 0.5574943971813083, 0.419209654130476, 0.30923517343650697], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.290000000000001, 8, 26, 14.0, 16.0, 17.0, 23.0, 0.5601663469984047, 0.4573233067291663, 0.34682174218455913], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.278000000000013, 8, 51, 13.0, 16.0, 17.94999999999999, 25.980000000000018, 0.5601751331536292, 0.4654486428637049, 0.3555799185057216], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.107999999999997, 8, 34, 14.0, 16.0, 18.0, 30.0, 0.5601506581210083, 0.4534813433421053, 0.3429828736737033], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.889999999999972, 10, 32, 16.0, 19.0, 20.0, 27.980000000000018, 0.560155050918094, 0.5010761978915764, 0.3905768616753117], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.824, 8, 50, 13.0, 16.0, 17.0, 25.0, 0.5599492909922078, 0.4205087937236404, 0.31005004686775567], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2202.3920000000003, 1714, 3587, 2160.0, 2551.8, 2663.9, 2800.84, 0.5588958899914042, 0.46656890878930857, 0.3569510859906038], "isController": false}]}, function(index, item){
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
