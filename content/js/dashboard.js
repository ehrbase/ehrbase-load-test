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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9114519427402863, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.979, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.803, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.714, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.611, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 200.38100431720133, 1, 3389, 13.0, 602.0, 1292.0, 2259.0, 24.528327124617945, 164.908491463295, 216.1138779906613], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.702000000000007, 4, 49, 8.0, 12.0, 16.0, 32.97000000000003, 0.5672568028272079, 6.062917155334767, 0.20607376040207165], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.838000000000001, 5, 37, 7.0, 10.0, 12.0, 18.99000000000001, 0.567239427224316, 6.090533929709959, 0.2404120228665558], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.32400000000004, 13, 261, 19.5, 29.0, 36.94999999999999, 63.99000000000001, 0.5640227910329401, 0.30395540723009534, 6.280261585310139], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 41.76799999999995, 25, 66, 42.0, 52.0, 54.0, 62.0, 0.5670290738487325, 2.3583758061735858, 0.2370004332102124], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4499999999999997, 1, 14, 2.0, 3.0, 4.0, 6.990000000000009, 0.5670663728506767, 0.35441648303167295, 0.2408924533105902], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.13399999999999, 22, 104, 38.0, 46.0, 48.0, 59.960000000000036, 0.5670129982059708, 2.3266581019353287, 0.2070926380166339], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 768.0560000000003, 578, 1487, 760.5, 914.9000000000001, 935.0, 1046.5600000000004, 0.5666987418154534, 2.3968479011745396, 0.2767083700270769], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.903999999999998, 5, 35, 9.0, 11.0, 13.0, 20.99000000000001, 0.5667591239717572, 0.8429435017665883, 0.29057474617692636], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.554000000000004, 2, 25, 3.0, 5.0, 6.0, 12.0, 0.5648906880029646, 0.5450312497528603, 0.31002789712662704], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.248000000000006, 8, 38, 13.5, 16.0, 18.0, 26.980000000000018, 0.5669949945681879, 0.9241353964202205, 0.3715367591359904], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 774.0, 774, 774, 774.0, 774.0, 774.0, 774.0, 1.2919896640826873, 0.5513666828165374, 1528.1550286660206], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.651999999999999, 2, 25, 4.0, 6.0, 7.0, 15.990000000000009, 0.5649034523509587, 0.5670218402972748, 0.33265310719494934], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.501999999999997, 9, 128, 14.0, 17.0, 20.0, 31.960000000000036, 0.5669821355268738, 0.890250543735868, 0.3383067234442577], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.542000000000002, 5, 30, 9.0, 11.0, 12.0, 18.99000000000001, 0.5669814925901189, 0.8776031892141977, 0.32501771108437477], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1987.3739999999977, 1485, 3389, 1969.0, 2236.9, 2306.9, 2485.6100000000006, 0.565820161982996, 0.8642018880287166, 0.31274825359607006], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.822, 11, 78, 17.0, 24.900000000000034, 31.94999999999999, 48.99000000000001, 0.5639808020934968, 0.30457166363057003, 4.548196741882906], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.167999999999992, 11, 92, 18.0, 22.0, 23.0, 42.99000000000001, 0.5670123551992198, 1.0266024477923372, 0.47398689067434774], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.19000000000001, 8, 54, 14.0, 16.0, 18.0, 26.980000000000018, 0.567007211197712, 0.9601469767742506, 0.4075364330483555], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 5.972055288461538, 1748.5226362179487], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.8049346441124781, 3361.0638181019335], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.518000000000001, 1, 32, 2.0, 3.0, 5.0, 17.0, 0.5648147520576201, 0.4749077163296982, 0.2399359542432273], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 412.006, 313, 803, 417.0, 478.90000000000003, 497.79999999999995, 543.96, 0.5646208570944611, 0.496711965727514, 0.2624604765400034], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1299999999999977, 1, 29, 3.0, 4.0, 6.0, 11.990000000000009, 0.5648670754797981, 0.5119107871535671, 0.27691725770591663], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1162.2960000000007, 902, 1602, 1153.0, 1350.0, 1365.95, 1426.89, 0.5642799505690763, 0.5339719454115576, 0.2992226691005942], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 53.0, 53, 53, 53.0, 53.0, 53.0, 53.0, 18.867924528301884, 8.82591391509434, 1242.4270341981132], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.06400000000002, 27, 748, 41.0, 50.900000000000034, 59.94999999999999, 129.95000000000005, 0.5635148903174618, 0.30432005307183235, 25.77640377194327], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.96799999999999, 29, 183, 42.0, 51.0, 59.94999999999999, 103.99000000000001, 0.5643640238251917, 127.7132638173244, 0.1752614839613388], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 1.2252665011682242, 0.9628723714953271], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.314, 1, 16, 2.0, 3.0, 5.0, 9.990000000000009, 0.5674789181581904, 0.6168008163184238, 0.24439277627711128], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.2939999999999987, 2, 20, 3.0, 5.0, 6.0, 11.990000000000009, 0.5674724775848371, 0.582435130802406, 0.2100313173873567], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.137999999999999, 1, 22, 2.0, 3.0, 4.0, 6.990000000000009, 0.5672690307414433, 0.321858698106229, 0.22103549147054283], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.44399999999993, 85, 529, 123.0, 149.0, 155.0, 230.4400000000005, 0.567209183343562, 0.5168028984956478, 0.1861155132846063], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 171.9779999999999, 115, 438, 170.0, 193.0, 220.95, 365.71000000000026, 0.5641055148083338, 0.30463901336817245, 166.8738696735747], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.2499999999999973, 1, 10, 2.0, 3.0, 4.0, 7.0, 0.5674679692704745, 0.31578705821199926, 0.23884638159724075], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 467.40200000000004, 341, 1351, 468.0, 541.0, 553.9, 628.96, 0.5672658128181651, 0.6164805538443037, 0.24485496998596584], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.750000000000004, 8, 315, 11.0, 17.900000000000034, 23.0, 103.55000000000041, 0.5633326761118779, 0.23820610230121397, 0.4098465270540517], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.982000000000003, 1, 25, 3.0, 4.0, 6.0, 10.990000000000009, 0.5674808503587047, 0.6040567645419805, 0.2316474564940806], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.829999999999999, 2, 38, 3.0, 5.0, 6.0, 16.99000000000001, 0.5648058197591669, 0.34693638733253507, 0.28350604624630055], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.212, 2, 33, 4.0, 5.0, 7.0, 15.970000000000027, 0.5647917838609618, 0.3309326858560323, 0.2675039210669594], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 525.4440000000003, 375, 973, 524.0, 635.0, 651.0, 731.7400000000002, 0.5642780401043689, 0.515146174815594, 0.2496269064133585], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.844000000000005, 5, 110, 16.0, 27.0, 34.0, 61.99000000000001, 0.5644767977457055, 0.49998091362827624, 0.23317742719378265], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.4520000000000035, 4, 44, 7.0, 9.0, 11.0, 18.99000000000001, 0.5649130259905185, 0.3767925749526603, 0.2653546538099994], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 549.0100000000002, 368, 2780, 533.0, 620.0, 650.8, 767.5900000000004, 0.5647063075435728, 0.4246326726646006, 0.31323552996557547], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.321999999999992, 8, 42, 14.0, 16.0, 18.0, 23.99000000000001, 0.5667385668995206, 0.46268890813281177, 0.35089087052177353], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.111999999999991, 8, 41, 14.0, 16.0, 18.0, 28.0, 0.5667482028414488, 0.47091019619689284, 0.359752277194279], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.24600000000001, 8, 41, 14.0, 16.0, 18.0, 28.950000000000045, 0.5667205806845758, 0.4588001576049935, 0.34700566805588773], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.207999999999984, 10, 80, 17.0, 20.0, 21.0, 32.98000000000002, 0.5667257194866372, 0.506953866259531, 0.39515836300142476], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.658, 8, 30, 13.0, 15.900000000000034, 17.0, 23.99000000000001, 0.5664791620640235, 0.42541257385472075, 0.3136657079006849], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2201.8639999999996, 1655, 3012, 2176.5, 2524.8, 2618.75, 2755.94, 0.5654336819797416, 0.4720266881870726, 0.36112658985815527], "isController": false}]}, function(index, item){
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
