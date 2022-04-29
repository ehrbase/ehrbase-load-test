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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9109520563508293, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.967, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.785, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.716, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.619, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 202.4023176550774, 1, 3759, 14.0, 601.0, 1306.8500000000022, 2268.0, 24.34507273650566, 163.67382255223043, 214.49926251882164], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.259999999999993, 4, 40, 8.0, 13.0, 16.0, 28.0, 0.5635021886425007, 6.0201228040319705, 0.20470977946778346], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.516, 5, 58, 8.0, 10.0, 12.0, 20.99000000000001, 0.5634767870102823, 6.050133903214974, 0.2388173101195923], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.77600000000001, 14, 257, 20.0, 29.0, 36.0, 65.96000000000004, 0.5599072793545389, 0.301737532264657, 6.234436327344191], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.09399999999996, 26, 114, 46.0, 55.0, 57.0, 65.99000000000001, 0.5632679454351076, 2.342732597273558, 0.23542839906858012], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6280000000000006, 1, 21, 2.0, 3.900000000000034, 4.0, 8.990000000000009, 0.5633053858754554, 0.3520658661721596, 0.23929476841388975], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.089999999999975, 24, 82, 41.0, 49.0, 51.0, 57.99000000000001, 0.5632596965156755, 2.311256956257252, 0.2057218032195924], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 779.5799999999994, 561, 1889, 777.0, 924.8000000000001, 942.95, 995.0, 0.5629331066589357, 2.3809211766990726, 0.27486968098580844], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.396, 5, 35, 9.0, 11.0, 14.0, 21.99000000000001, 0.5629337404470144, 0.837253990918753, 0.28861348997527597], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.589999999999999, 1, 22, 3.0, 5.0, 7.0, 10.0, 0.560475911305808, 0.5407716800489631, 0.3076049435096329], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.950000000000003, 8, 57, 14.0, 17.0, 19.0, 30.970000000000027, 0.5632292410598623, 0.9179976595008887, 0.36906916088981206], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 0.6894310379644588, 1910.810972839257], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.774000000000004, 2, 28, 4.0, 6.0, 8.0, 13.990000000000009, 0.5604740265126633, 0.5625758041120859, 0.3300447636593125], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 15.113999999999992, 9, 65, 15.0, 18.0, 21.0, 36.960000000000036, 0.5632197244053244, 0.8843429703982977, 0.3360617691520051], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.95399999999999, 5, 30, 9.0, 11.0, 13.0, 21.980000000000018, 0.5632178211130086, 0.8717775844376158, 0.3228602158138047], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2019.486000000002, 1503, 2762, 2014.5, 2268.4, 2333.0, 2452.87, 0.5619947667047325, 0.8583591944591812, 0.3106338261278111], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.66599999999999, 12, 139, 17.0, 26.0, 33.0, 58.940000000000055, 0.5598740507335469, 0.3023538574762222, 4.515078038044561], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.532000000000007, 11, 49, 19.0, 23.0, 24.0, 32.97000000000003, 0.563248909831735, 1.0197885535430047, 0.470840885562466], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.783999999999994, 8, 43, 14.0, 17.0, 18.94999999999999, 25.0, 0.5632355856748914, 0.9537602593361931, 0.4048255772038282], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 5.896459651898734, 1726.3894382911392], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.8282238924050632, 3458.3097875226035], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3820000000000014, 1, 21, 2.0, 3.0, 4.0, 9.990000000000009, 0.5604024137652766, 0.4711977326678741, 0.238061572253804], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 420.87200000000007, 312, 1502, 426.5, 487.90000000000003, 504.9, 538.96, 0.5601795263345997, 0.4928048090852156, 0.26039595169459906], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3040000000000003, 1, 48, 3.0, 4.0, 6.0, 12.0, 0.560465230978931, 0.5079216155746562, 0.2747593222181869], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1171.7540000000015, 922, 1557, 1166.5, 1353.9, 1376.95, 1446.7000000000003, 0.5598796930515572, 0.5298080298505458, 0.296889329420894], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.796223958333334, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.74999999999999, 28, 680, 42.0, 53.900000000000034, 64.0, 114.88000000000011, 0.5595344673231871, 0.30217046916965085, 25.594330517009848], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.06800000000001, 28, 182, 42.0, 50.900000000000034, 56.0, 91.97000000000003, 0.5600295695612728, 126.73239459543464, 0.1739154327348484], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 300.0, 300, 300, 300.0, 300.0, 300.0, 300.0, 3.3333333333333335, 1.748046875, 1.3736979166666667], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.547999999999999, 1, 15, 2.0, 4.0, 5.0, 11.0, 0.5637525171549891, 0.6127505386655302, 0.24278794928256855], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.631999999999998, 2, 36, 3.0, 5.0, 6.0, 15.980000000000018, 0.5637455252698932, 0.5786099092369704, 0.20865190827860305], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.307999999999999, 1, 19, 2.0, 3.0, 4.0, 8.980000000000018, 0.5635174307211671, 0.3197301047353497, 0.21957368638451724], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 125.264, 86, 450, 123.0, 148.0, 155.0, 210.80000000000018, 0.5634564673533323, 0.5133836758209561, 0.18488415335031216], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 176.89000000000004, 116, 631, 172.5, 205.80000000000007, 241.95, 407.84000000000015, 0.5598640202267673, 0.30234844061074445, 165.61914942098863], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.4520000000000013, 1, 17, 2.0, 4.0, 4.0, 9.990000000000009, 0.5637417115874854, 0.31371345403419204, 0.23727800556074824], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 478.34600000000034, 349, 1392, 487.5, 545.0, 565.9, 631.96, 0.5635402953852812, 0.612431818668512, 0.2432468853127874], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.73800000000001, 8, 330, 11.0, 18.0, 25.0, 49.99000000000001, 0.5593773458887443, 0.2365335847361585, 0.40696886981163527], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.292, 1, 34, 3.0, 4.0, 6.0, 13.990000000000009, 0.5637556953419122, 0.6000915116432464, 0.2301268365751165], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.920000000000005, 2, 12, 4.0, 5.0, 6.0, 10.990000000000009, 0.560396760906722, 0.34422808848664854, 0.2812929053770069], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.322, 2, 30, 4.0, 5.0, 6.949999999999989, 16.980000000000018, 0.5603829432881253, 0.32834938083288595, 0.2654157495065828], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 526.7459999999995, 375, 832, 527.0, 640.7, 655.0, 693.99, 0.5598627664386906, 0.5111153404077592, 0.24767366523117854], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.74800000000002, 6, 130, 16.0, 25.0, 36.94999999999999, 52.97000000000003, 0.5601387351619249, 0.49613850858580655, 0.23138543454442798], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.830000000000009, 4, 63, 7.0, 10.0, 11.0, 23.99000000000001, 0.5604847071747647, 0.3738389208987933, 0.2632745548350213], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 551.7019999999998, 377, 3759, 531.0, 617.9000000000001, 654.0, 783.6300000000003, 0.560274310302324, 0.42130001848905224, 0.3107771564958204], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 14.041999999999996, 8, 90, 14.0, 17.0, 19.0, 28.99000000000001, 0.5629147274254307, 0.459567101687168, 0.34852337615988577], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.763999999999996, 8, 37, 14.0, 17.0, 19.0, 28.980000000000018, 0.5629185299270008, 0.4677281269561419, 0.35732133247319386], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.906000000000004, 8, 41, 14.0, 17.0, 19.94999999999999, 31.960000000000036, 0.5628925471900966, 0.45570109533260755, 0.34466174520331117], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.805999999999973, 10, 74, 17.0, 21.0, 22.0, 28.99000000000001, 0.5629039539499533, 0.5035351775567942, 0.39249357726588546], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.167999999999996, 8, 37, 14.0, 16.0, 17.0, 31.950000000000045, 0.5626385497428742, 0.42252836401588895, 0.31153911885176727], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2192.760000000001, 1643, 3022, 2191.0, 2490.3, 2597.45, 2873.51, 0.5615914152889894, 0.46881914594300744, 0.3586726421865225], "isController": false}]}, function(index, item){
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
