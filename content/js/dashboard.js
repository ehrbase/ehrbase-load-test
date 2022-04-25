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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9005524861878453, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.75, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.75, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.75, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 181, 0, 0.0, 259.7955801104971, 4, 4084, 31.0, 734.4000000000008, 1657.3, 4084.0, 7.116738096174262, 46.627681985510954, 189.6178500865018], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 4, 0, 0.0, 15.5, 12, 19, 15.5, 19.0, 19.0, 19.0, 0.4733167672464797, 5.05395071589161, 0.1719471068512602], "isController": false}, {"data": ["Query participation #1", 4, 0, 0.0, 21.25, 13, 33, 19.5, 33.0, 33.0, 33.0, 0.47214353163361666, 5.070010033050048, 0.20010770774315392], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 4, 0, 0.0, 171.0, 50, 292, 171.0, 292.0, 292.0, 292.0, 0.29059208136578274, 0.15693107519070104, 3.235674718488921], "isController": false}, {"data": ["Query ehr_id, time_created #2", 4, 0, 0.0, 45.0, 36, 54, 45.0, 54.0, 54.0, 54.0, 0.467562828755114, 1.944677819988311, 0.19542665108123905], "isController": false}, {"data": ["Query ehr_id, time_created #3", 4, 0, 0.0, 5.75, 5, 7, 5.5, 7.0, 7.0, 7.0, 0.4699248120300752, 0.29370300751879697, 0.1996262629229323], "isController": false}, {"data": ["Query ehr_id, time_created #1", 4, 0, 0.0, 43.0, 31, 53, 44.0, 53.0, 53.0, 53.0, 0.4675081813931744, 1.9188836781206173, 0.1707500584385227], "isController": false}, {"data": ["Query ehr_id, time_created #4", 4, 0, 0.0, 623.75, 595, 665, 617.5, 665.0, 665.0, 665.0, 0.43956043956043955, 1.859117445054945, 0.2146291208791209], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 4, 0, 0.0, 19.5, 15, 22, 20.5, 22.0, 22.0, 22.0, 0.46490004649000466, 0.6914480183635519, 0.2383520746164575], "isController": false}, {"data": ["Query start_time #5", 4, 0, 0.0, 11.75, 8, 18, 10.5, 18.0, 18.0, 18.0, 0.32483352281955497, 0.31341359428293, 0.17827777326620106], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 4, 0, 0.0, 21.25, 19, 26, 20.0, 26.0, 26.0, 26.0, 0.46904315196998125, 0.764485371716698, 0.3073515185272045], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 578.0, 578, 578, 578.0, 578.0, 578.0, 578.0, 1.7301038062283738, 0.7383353157439447, 2046.3529276600348], "isController": false}, {"data": ["Query start_time #6", 4, 0, 0.0, 15.0, 8, 21, 15.5, 21.0, 21.0, 21.0, 0.3250711093051605, 0.3266583705810646, 0.19142370987403495], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 4, 0, 0.0, 30.25, 20, 40, 30.5, 40.0, 40.0, 40.0, 0.46794571829667764, 0.7352779890032756, 0.27921370496022463], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 4, 0, 0.0, 17.75, 15, 20, 18.0, 20.0, 20.0, 20.0, 0.468055230517201, 0.7244800198923473, 0.2683090042124971], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 4, 0, 0.0, 1679.75, 1651, 1705, 1681.5, 1705.0, 1705.0, 1705.0, 0.39089221147268643, 0.5970267761164858, 0.21605956220072314], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 4, 0, 0.0, 62.25, 34, 88, 63.5, 88.0, 88.0, 88.0, 0.28983406999492795, 0.15652171944062024, 2.337353271502065], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 4, 0, 0.0, 35.5, 31, 43, 34.0, 43.0, 43.0, 43.0, 0.46794571829667764, 0.8472376579316799, 0.39117337388862894], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 4, 0, 0.0, 23.25, 21, 25, 23.5, 25.0, 25.0, 25.0, 0.46898815804900923, 0.7941654941962716, 0.33708523859772543], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.2339360955056184, 1532.4130969101125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 684.0, 684, 684, 684.0, 684.0, 684.0, 684.0, 1.461988304093567, 0.6696020650584795, 2795.972679093567], "isController": false}, {"data": ["Query start_time #1", 4, 0, 0.0, 10.25, 4, 16, 10.5, 16.0, 16.0, 16.0, 0.3234675723758693, 0.2719781052886948, 0.1374105409995148], "isController": false}, {"data": ["Query start_time #2", 4, 0, 0.0, 377.25, 352, 398, 379.5, 398.0, 398.0, 398.0, 0.3147375875363915, 0.27723955464631367, 0.1463038004563695], "isController": false}, {"data": ["Query start_time #3", 4, 0, 0.0, 11.25, 7, 15, 11.5, 15.0, 15.0, 15.0, 0.32470168033119573, 0.2942608978001461, 0.15917992531861352], "isController": false}, {"data": ["Query start_time #4", 4, 0, 0.0, 1017.25, 1015, 1019, 1017.5, 1019.0, 1019.0, 1019.0, 0.3002552169343943, 0.28412822774358204, 0.15921736601110945], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.1965144230769225, 1013.0558894230769], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 4, 0, 0.0, 428.25, 109, 747, 428.5, 747.0, 747.0, 747.0, 0.27569095044455166, 0.14888388241780964, 12.61070714728789], "isController": false}, {"data": ["Composition - Get composition by version ID", 4, 0, 0.0, 150.25, 64, 238, 149.5, 238.0, 238.0, 238.0, 0.3005936725031938, 68.02311518373789, 0.09334842564064026], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.6543030362776026, 1.300029574132492], "isController": false}, {"data": ["Query composer #2", 4, 0, 0.0, 7.25, 6, 8, 7.5, 8.0, 8.0, 8.0, 0.49726504226752855, 0.5404843672302336, 0.21415418324216806], "isController": false}, {"data": ["Query composer #1", 4, 0, 0.0, 9.5, 4, 12, 11.0, 12.0, 12.0, 12.0, 0.4968944099378882, 0.5099961180124223, 0.1839091614906832], "isController": false}, {"data": ["Query ehr_status #1", 4, 0, 0.0, 8.0, 6, 13, 6.5, 13.0, 13.0, 13.0, 0.4741021690174233, 0.268997422069456, 0.18473316937299988], "isController": false}, {"data": ["Query ehr_status #2", 4, 0, 0.0, 276.0, 89, 459, 278.0, 459.0, 459.0, 459.0, 0.4699248120300752, 0.4281639156484962, 0.15419407894736842], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 4, 0, 0.0, 541.5, 408, 668, 545.0, 668.0, 668.0, 668.0, 0.28768699654775604, 0.1553622159090909, 85.10365722094362], "isController": false}, {"data": ["Query ehr_status #3", 4, 0, 0.0, 7.75, 4, 10, 8.5, 10.0, 10.0, 10.0, 0.4965243296921549, 0.2768705002482622, 0.20898631454816288], "isController": false}, {"data": ["Query composer #4", 4, 0, 0.0, 455.5, 419, 489, 457.0, 489.0, 489.0, 489.0, 0.47309284447072736, 0.5146732702542874, 0.20420609107037255], "isController": false}, {"data": ["Create EHR", 4, 0, 0.0, 193.5, 26, 362, 193.0, 362.0, 362.0, 362.0, 0.2709109380291229, 0.11455511344395529, 0.19709828987470368], "isController": false}, {"data": ["Query composer #3", 4, 0, 0.0, 6.5, 6, 7, 6.5, 7.0, 7.0, 7.0, 0.49738870927629947, 0.5294469659288734, 0.2030356254663019], "isController": false}, {"data": ["Query ehr_id #4", 4, 0, 0.0, 9.75, 7, 12, 10.0, 12.0, 12.0, 12.0, 0.32323232323232326, 0.1985479797979798, 0.16224747474747475], "isController": false}, {"data": ["Query ehr_id #3", 4, 0, 0.0, 20.0, 7, 32, 20.5, 32.0, 32.0, 32.0, 0.32260666182756675, 0.1890273409145899, 0.15279710057262683], "isController": false}, {"data": ["Query ehr_id #2", 4, 0, 0.0, 684.0, 400, 958, 689.0, 958.0, 958.0, 958.0, 0.299625468164794, 0.27387640449438205, 0.1325491573033708], "isController": false}, {"data": ["Query ehr_id #1", 4, 0, 0.0, 83.75, 21, 143, 85.5, 143.0, 143.0, 143.0, 0.3056001222400489, 0.2706829207731683, 0.1262391129956452], "isController": false}, {"data": ["Query magnitude #1", 4, 0, 0.0, 25.25, 10, 40, 25.5, 40.0, 40.0, 40.0, 0.3253884324412267, 0.21703154234116978, 0.1528435898478809], "isController": false}, {"data": ["Query magnitude #2", 4, 0, 0.0, 2283.5, 482, 4084, 2284.0, 4084.0, 4084.0, 4084.0, 0.3140950137416569, 0.23618472712995683, 0.1742245779348253], "isController": false}, {"data": ["Query magnitude #7", 4, 0, 0.0, 19.5, 17, 22, 19.5, 22.0, 22.0, 22.0, 0.46425255338904364, 0.3790186861652739, 0.28743761606313833], "isController": false}, {"data": ["Query magnitude #8", 4, 0, 0.0, 20.75, 17, 24, 21.0, 24.0, 24.0, 24.0, 0.46446818392940087, 0.3864520436600093, 0.2948284370645611], "isController": false}, {"data": ["Query magnitude #5", 4, 0, 0.0, 28.25, 24, 33, 28.0, 33.0, 33.0, 33.0, 0.46376811594202894, 0.3754528985507246, 0.28396739130434784], "isController": false}, {"data": ["Query magnitude #6", 4, 0, 0.0, 31.75, 31, 32, 32.0, 32.0, 32.0, 32.0, 0.46349942062572425, 0.41461471610660483, 0.32318221320973345], "isController": false}, {"data": ["Query magnitude #3", 4, 0, 0.0, 25.25, 18, 32, 25.5, 32.0, 32.0, 32.0, 0.461361014994233, 0.34647130911188007, 0.2554606401384083], "isController": false}, {"data": ["Query magnitude #4", 4, 0, 0.0, 1749.25, 1725, 1773, 1749.5, 1773.0, 1773.0, 1773.0, 0.3859141341051616, 0.3226000964785335, 0.246472503617945], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 181, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
