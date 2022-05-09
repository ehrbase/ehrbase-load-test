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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.910838445807771, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.976, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.999, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.818, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.715, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.576, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 203.59850034083192, 1, 3584, 15.0, 604.0, 1312.9500000000007, 2293.9900000000016, 24.132285060355386, 162.2473833472565, 212.62443552194497], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.469999999999995, 4, 60, 7.0, 11.0, 15.0, 28.950000000000045, 0.5584289829109562, 5.970148986758532, 0.20286677894812083], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.915999999999994, 4, 43, 7.0, 9.900000000000034, 11.0, 27.980000000000018, 0.5584084020361805, 5.995713901409646, 0.2366691860192405], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.57400000000001, 14, 302, 20.0, 27.0, 32.0, 47.99000000000001, 0.5547339329637326, 0.2989495835612365, 6.1768323277856245], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.04400000000001, 25, 97, 43.0, 53.0, 54.0, 61.99000000000001, 0.5582949226426555, 2.322048901889717, 0.23334983094829745], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5720000000000005, 1, 33, 2.0, 4.0, 5.0, 8.0, 0.558326093704985, 0.3489538085656156, 0.23717954175944186], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.38400000000002, 23, 70, 38.0, 46.0, 48.0, 56.0, 0.5582731049698588, 2.290795179088429, 0.20390052857297578], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 767.0500000000001, 577, 1139, 759.0, 909.0, 930.9, 991.9100000000001, 0.5579840260333028, 2.3599890788576507, 0.2724531377115736], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.576000000000006, 6, 31, 9.0, 12.0, 13.949999999999989, 21.99000000000001, 0.557964723238338, 0.8298635483320203, 0.2860658981446557], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.8000000000000003, 1, 54, 3.0, 5.0, 7.0, 18.0, 0.5556327267676067, 0.5360987637171829, 0.3049468676205028], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 15.014000000000001, 9, 61, 15.0, 18.0, 19.94999999999999, 26.0, 0.5582382002400423, 0.9098628478521785, 0.36579866441510595], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.6773933531746031, 1877.4476066468253], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.622000000000001, 2, 24, 4.0, 6.0, 8.0, 11.990000000000009, 0.555641371278453, 0.5577250264207472, 0.3271989715633859], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.951999999999982, 10, 70, 16.0, 19.0, 21.94999999999999, 30.99000000000001, 0.5582294747395581, 0.8765074986965342, 0.33308418854088867], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.377999999999995, 6, 33, 10.0, 12.0, 13.0, 17.99000000000001, 0.5582244888617467, 0.8640486473104186, 0.3199978271111771], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2021.1860000000006, 1504, 2520, 2010.0, 2274.8, 2337.95, 2434.9700000000003, 0.5570428599917335, 0.8507959306904992, 0.30789673706574333], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.918000000000017, 11, 160, 17.0, 24.0, 33.0, 50.98000000000002, 0.5546963924765419, 0.2995577197651637, 4.473323055733674], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 19.491999999999972, 12, 36, 20.0, 24.0, 25.0, 29.99000000000001, 0.5582787150657094, 1.0107897829412356, 0.46668611337524146], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.940000000000003, 9, 70, 15.0, 19.0, 20.0, 27.970000000000027, 0.5582475492932586, 0.9453137211665141, 0.40124042605452964], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 4.903371710526316, 1435.6291118421052], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 650.0, 650, 650, 650.0, 650.0, 650.0, 650.0, 1.5384615384615385, 0.7046274038461539, 2942.2235576923076], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2860000000000023, 1, 23, 2.0, 3.0, 4.0, 10.0, 0.5555314825246461, 0.46710215473996125, 0.23599237783029403], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 416.82599999999996, 309, 801, 418.0, 484.0, 498.95, 541.96, 0.5553494592006966, 0.48855567072886286, 0.25815072517532384], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.425999999999996, 1, 31, 3.0, 5.0, 7.0, 18.99000000000001, 0.5556222302231822, 0.503532646139759, 0.2723851167695679], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1187.1739999999998, 938, 1905, 1176.0, 1363.9, 1395.95, 1488.7900000000002, 0.5550510757999951, 0.5252387621583938, 0.2943288419525365], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 56.0, 56, 56, 56.0, 56.0, 56.0, 56.0, 17.857142857142858, 8.353097098214285, 1175.868443080357], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 43.801999999999985, 27, 738, 42.0, 51.0, 56.0, 94.95000000000005, 0.5542524464702987, 0.29931797158015155, 25.352719328778118], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 44.00399999999994, 30, 177, 44.0, 53.900000000000034, 61.0, 87.99000000000001, 0.5550837343813314, 125.613172379866, 0.17237951907545254], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 308.0, 308, 308, 308.0, 308.0, 308.0, 308.0, 3.246753246753247, 1.7026430600649352, 1.3380174512987013], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.405999999999997, 1, 29, 2.0, 3.0, 4.0, 10.990000000000009, 0.5587016667188122, 0.6072606982988652, 0.24061272951464469], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3959999999999972, 2, 20, 3.0, 4.0, 6.0, 13.970000000000027, 0.5586966724026192, 0.5734279323194851, 0.20678324105526627], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1259999999999986, 1, 11, 2.0, 3.0, 4.0, 6.990000000000009, 0.5584420806211663, 0.3168504383211891, 0.2175960841482865], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.11600000000006, 83, 503, 120.0, 149.0, 155.95, 175.0, 0.5583803396515931, 0.5087586493114612, 0.18321854894817896], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 175.13400000000001, 119, 585, 172.0, 200.90000000000003, 230.64999999999992, 326.97, 0.5548459692104875, 0.29963849704433554, 164.1347080012118], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.366, 1, 20, 2.0, 3.0, 4.0, 9.0, 0.5586929267240704, 0.31090388414496517, 0.23515297990046327], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 466.87600000000015, 349, 671, 473.5, 541.9000000000001, 554.0, 605.98, 0.5584951014394652, 0.6069489147323188, 0.24106917464476918], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.084000000000003, 7, 323, 11.0, 17.900000000000034, 23.0, 52.940000000000055, 0.554073716183496, 0.23429093662837278, 0.4031102720280317], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.979999999999998, 1, 14, 3.0, 4.0, 5.0, 9.990000000000009, 0.5587072854312605, 0.5947177159375723, 0.22806605987330753], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.8019999999999974, 2, 39, 3.0, 5.0, 6.0, 14.970000000000027, 0.5555222242221023, 0.34123386624580304, 0.27884611645523494], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.216000000000002, 2, 33, 4.0, 5.0, 7.0, 18.970000000000027, 0.5555043257121843, 0.32549081584698303, 0.26310507614297796], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 525.3460000000007, 381, 776, 518.5, 630.9000000000001, 652.0, 721.9300000000001, 0.5550276625787028, 0.5067012305518307, 0.2455346983868676], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.110000000000017, 6, 123, 15.0, 29.0, 37.94999999999999, 55.960000000000036, 0.5551878977921287, 0.49175334306392654, 0.22934031324811568], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.329999999999998, 5, 37, 8.0, 10.0, 12.0, 19.970000000000027, 0.5556512510487918, 0.37061504342414525, 0.26100415210397343], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 569.612, 381, 3584, 550.0, 637.0, 681.8499999999999, 819.6600000000003, 0.5554395304092035, 0.41766449063973304, 0.308095364523855], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 14.93, 9, 34, 15.0, 18.0, 19.0, 27.0, 0.5579522705309697, 0.4555157208631745, 0.34545091749671364], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 14.672000000000015, 9, 36, 15.0, 18.0, 19.0, 24.99000000000001, 0.5579541384016399, 0.4636032217945814, 0.35417010738385346], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 15.240000000000006, 10, 108, 16.0, 18.0, 20.0, 25.99000000000001, 0.5579385731948455, 0.45169050505715524, 0.3416284037042658], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 17.852, 11, 67, 18.0, 22.0, 23.0, 30.980000000000018, 0.5579423087652736, 0.49909683088768625, 0.38903399263516153], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 14.838000000000013, 9, 53, 15.0, 18.0, 20.0, 34.960000000000036, 0.557653572217253, 0.41878476272955806, 0.30877888227263905], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2242.0539999999996, 1705, 3184, 2219.5, 2593.8, 2705.8, 2885.4600000000005, 0.556619936567592, 0.4646689322025785, 0.35549749855000506], "isController": false}]}, function(index, item){
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
