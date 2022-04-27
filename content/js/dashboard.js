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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9099522835719155, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.982, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.497, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.758, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.712, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.593, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 202.10956600772596, 1, 3414, 14.0, 609.0, 1291.0, 2254.9900000000016, 24.362106931990915, 163.8276009358459, 214.64934719545153], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.196, 4, 56, 8.0, 13.0, 15.949999999999989, 29.970000000000027, 0.5640386975669627, 6.065853923918512, 0.20490468310049814], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.495999999999999, 5, 54, 8.0, 11.0, 12.0, 18.99000000000001, 0.5640189735982719, 6.055955441091038, 0.23904710404458007], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.734, 14, 346, 20.0, 28.0, 36.89999999999998, 58.950000000000045, 0.5604909901073339, 0.30205209763753044, 6.240935809769358], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.06399999999997, 27, 75, 46.0, 56.0, 58.0, 63.950000000000045, 0.563935003107282, 2.3455070099940563, 0.23570720832999673], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.603999999999999, 1, 12, 2.0, 4.0, 4.0, 7.990000000000009, 0.5639648988246972, 0.3524780617654357, 0.23957493260619458], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.242, 24, 85, 41.0, 50.0, 52.0, 60.0, 0.5639171943991744, 2.31395490636155, 0.20596194404813598], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 790.7780000000009, 585, 1300, 802.5, 932.0, 949.0, 1002.97, 0.5635777720418084, 2.3836477838994847, 0.2751844590047893], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.607999999999997, 6, 87, 9.0, 12.0, 14.0, 20.0, 0.5636590944703915, 0.8383328133578186, 0.2889853755829644], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.6019999999999994, 1, 23, 3.0, 5.0, 6.0, 13.0, 0.5614236806262793, 0.5416861293542617, 0.3081251059687197], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 14.559999999999993, 9, 66, 15.0, 18.0, 21.0, 27.99000000000001, 0.563894935095693, 0.919082662768273, 0.3695053725089941], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 638.0, 638, 638, 638.0, 638.0, 638.0, 638.0, 1.567398119122257, 0.6688993926332288, 1853.905943867555], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.722000000000006, 2, 29, 4.0, 6.0, 7.0, 12.990000000000009, 0.5614325062683939, 0.5635378781669005, 0.33060918093734526], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.619999999999997, 9, 48, 16.0, 19.0, 21.0, 41.0, 0.5638841240680406, 0.8853861816812092, 0.3364582029351296], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.462000000000003, 6, 68, 9.0, 12.0, 14.949999999999989, 25.940000000000055, 0.5638841240680406, 0.8728089225076604, 0.32324216877728496], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2008.1279999999997, 1571, 2560, 1988.5, 2267.7000000000003, 2325.9, 2439.9, 0.562651212513363, 0.8593618128622067, 0.31099666629156586], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.58199999999999, 12, 120, 17.0, 25.0, 30.0, 62.960000000000036, 0.5604470125371996, 0.30266327923151504, 4.5196986616525345], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 19.502000000000017, 12, 45, 20.0, 24.0, 26.0, 34.99000000000001, 0.5639203744431286, 1.0210042716968364, 0.4714021880110528], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.556000000000004, 9, 52, 15.0, 18.900000000000034, 20.0, 25.99000000000001, 0.5639006587487495, 0.9548864670608708, 0.4053035984756637], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.896459651898734, 1726.3894382911392], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 673.0, 673, 673, 673.0, 673.0, 673.0, 673.0, 1.4858841010401187, 0.6805465267459138, 2841.6720839524514], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.4920000000000018, 1, 25, 2.0, 3.0, 4.949999999999989, 10.990000000000009, 0.5613606483940033, 0.4720034358078485, 0.23846863481581196], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 413.6199999999995, 312, 831, 411.5, 485.0, 496.0, 521.99, 0.5611502232816739, 0.4936587569736944, 0.26084717410359054], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.269999999999997, 2, 17, 3.0, 4.0, 6.0, 12.0, 0.5613984660348315, 0.508767359844066, 0.2752168261225443], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1163.6319999999996, 942, 1767, 1148.5, 1362.0, 1388.0, 1424.95, 0.5607965104997931, 0.5306756041741205, 0.2973754933607301], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.33000000000003, 29, 850, 42.0, 50.0, 57.0, 103.99000000000001, 0.5599223275747188, 0.3023799288562691, 25.61207209335921], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.40200000000004, 28, 211, 42.0, 51.0, 60.0, 82.99000000000001, 0.5608801780458037, 126.92488380666012, 0.17417958654156795], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 1.7081891286644952, 1.3423758143322475], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.43, 1, 18, 2.0, 4.0, 4.0, 8.0, 0.5642914136289919, 0.6133362728213555, 0.24302003262732955], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5540000000000043, 2, 24, 3.0, 5.0, 7.0, 12.0, 0.564285045204875, 0.5791636547952379, 0.2088515938795387], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3440000000000003, 1, 16, 2.0, 3.0, 4.0, 8.990000000000009, 0.5640526960590766, 0.32003380508820656, 0.21978225168708163], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.65600000000006, 85, 459, 124.0, 153.0, 158.0, 166.97000000000003, 0.5639903444853024, 0.5138701087937375, 0.18505933178423986], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 170.72599999999997, 112, 550, 168.5, 199.0, 222.84999999999997, 403.7800000000002, 0.5606367936957514, 0.3027657684704595, 165.8477515100752], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.400000000000001, 1, 12, 2.0, 4.0, 5.0, 7.990000000000009, 0.5642812242194015, 0.31401368438396854, 0.2375050855845333], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 484.51600000000025, 358, 689, 497.5, 560.0, 581.0, 635.0, 0.5640609682219332, 0.6129976639415001, 0.24347162886142037], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.06000000000001, 8, 348, 11.0, 17.0, 20.0, 48.98000000000002, 0.5597217511230818, 0.2366792170276312, 0.40721943807294514], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.1579999999999995, 1, 20, 3.0, 4.0, 5.0, 9.0, 0.5642945978949555, 0.6006651481499037, 0.23034681828133924], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.077999999999999, 2, 22, 4.0, 5.0, 7.0, 13.990000000000009, 0.5613518250109183, 0.34481474407408946, 0.2817723027886836], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.332000000000001, 2, 44, 4.0, 5.0, 6.0, 13.0, 0.5613366998566346, 0.32890822257224683, 0.2658674799125662], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 531.6520000000003, 375, 828, 535.5, 640.9000000000001, 659.95, 708.9100000000001, 0.5608178968207234, 0.5119873072889503, 0.2480961984958864], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.101999999999993, 6, 117, 16.0, 26.900000000000034, 33.0, 50.97000000000003, 0.5610072998269854, 0.49690783295222235, 0.23174422639337383], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.064, 4, 51, 8.0, 10.0, 12.0, 17.0, 0.5614419626214399, 0.37447740280316744, 0.26372420314542244], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 555.7460000000008, 454, 3414, 537.0, 620.8000000000001, 652.95, 716.0, 0.5611854931305283, 0.42198518526416684, 0.31128257822083993], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 14.549999999999994, 9, 45, 15.0, 18.0, 19.0, 24.0, 0.5636432093393424, 0.4601618388746976, 0.34897440890736636], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 14.378000000000002, 9, 77, 15.0, 18.0, 19.94999999999999, 25.980000000000018, 0.5636476570857838, 0.4683339575731136, 0.35778415732984326], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 14.499999999999998, 9, 34, 15.0, 18.0, 20.0, 26.0, 0.5636305018791441, 0.4562985215408305, 0.34511359831857746], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 17.51799999999999, 11, 40, 18.0, 22.0, 23.0, 35.950000000000045, 0.563633678690476, 0.50418793914109, 0.393002389243164], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.867999999999991, 9, 38, 15.0, 17.0, 18.94999999999999, 28.980000000000018, 0.5633345801805375, 0.42305106656136066, 0.31192451851793435], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2178.5, 1748, 2826, 2169.5, 2491.8, 2561.9, 2721.87, 0.562244389644358, 0.46936425199568643, 0.35908967854239265], "isController": false}]}, function(index, item){
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
