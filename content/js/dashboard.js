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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9109520563508293, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.977, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.793, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.71, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.61, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 201.5221540558955, 1, 4051, 13.0, 599.0, 1292.9500000000007, 2257.0, 24.34054866616448, 163.64026993860662, 214.4594018964169], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.110000000000001, 4, 38, 8.0, 13.0, 16.0, 27.970000000000027, 0.5637175594637468, 6.019226362477155, 0.20478801964893925], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.21000000000001, 5, 37, 8.0, 10.0, 11.0, 17.99000000000001, 0.5636972224383061, 6.052500751126549, 0.23891073685373523], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 23.86400000000001, 14, 278, 21.0, 31.0, 47.849999999999966, 82.96000000000004, 0.5595764230308226, 0.3015592317239542, 6.230752319724061], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.32800000000002, 27, 78, 45.0, 55.0, 57.0, 63.98000000000002, 0.5635307682164139, 2.343825724446979, 0.2355382507779542], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.657999999999999, 1, 16, 2.0, 4.0, 5.0, 9.980000000000018, 0.5635631619049337, 0.3522269761905835, 0.23940427287953725], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.15399999999996, 23, 85, 41.0, 49.0, 50.94999999999999, 60.98000000000002, 0.5635218764827669, 2.3123327748831537, 0.20581756035601056], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 770.5559999999997, 573, 1830, 765.5, 914.9000000000001, 936.95, 1047.5200000000004, 0.5632038640290704, 2.382066342880765, 0.2750018867329445], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.009999999999994, 5, 44, 9.0, 11.0, 13.949999999999989, 21.0, 0.5631017446018252, 0.8375038642857223, 0.28869962491792794], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4199999999999986, 2, 17, 3.0, 5.0, 6.0, 9.990000000000009, 0.5605180083225714, 0.5408122970924809, 0.3076280475364112], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.333999999999989, 8, 31, 14.0, 17.0, 18.0, 21.99000000000001, 0.5635174307211671, 0.9184673748765897, 0.36925800391982727], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 700.0, 700, 700, 700.0, 700.0, 700.0, 700.0, 1.4285714285714286, 0.6096540178571429, 1689.702845982143], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.5220000000000065, 2, 27, 4.0, 6.0, 7.0, 11.0, 0.5605261771329982, 0.562628150297247, 0.3300754734484355], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.338000000000003, 9, 57, 14.0, 17.0, 19.0, 33.99000000000001, 0.5635136201241984, 0.8848044325981359, 0.33623713075770045], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.81000000000001, 5, 36, 9.0, 12.0, 13.949999999999989, 20.0, 0.5635104446660919, 0.8722305222614801, 0.32302795997948824], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2013.7940000000017, 1527, 3278, 1999.0, 2274.9, 2354.0, 2605.5800000000004, 0.56214830596608, 0.85859370169038, 0.31071869255546997], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 20.550000000000008, 12, 179, 17.0, 27.0, 38.0, 78.93000000000006, 0.5595382242942545, 0.3021724980807839, 4.5123697814667505], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.43599999999999, 11, 62, 19.0, 22.0, 24.0, 41.0, 0.5635237818306408, 1.0202862221816484, 0.4710706613740513], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.490000000000004, 8, 43, 14.0, 17.0, 18.0, 22.99000000000001, 0.5635218764827669, 0.9542450525596854, 0.4050313487219887], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 4.753268494897959, 1391.681281887755], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 0.7447281504065041, 3109.667174796748], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3539999999999996, 1, 18, 2.0, 3.0, 4.0, 9.990000000000009, 0.56042251374156, 0.4712146331362141, 0.23807011081794788], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 414.636, 309, 629, 416.5, 484.0, 499.95, 533.97, 0.5602335053250195, 0.4928522958369048, 0.26042104349092704], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1260000000000012, 1, 26, 3.0, 4.0, 5.0, 10.990000000000009, 0.5604828223224615, 0.5079375577297307, 0.27476794609948796], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1160.250000000001, 918, 2080, 1142.5, 1344.9, 1365.95, 1439.7800000000002, 0.5599166843973616, 0.5298430343564877, 0.29690894494899156], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 69.0, 69, 69, 69.0, 69.0, 69.0, 69.0, 14.492753623188406, 6.77932518115942, 954.3280117753623], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.95599999999998, 27, 686, 42.0, 54.0, 68.0, 116.93000000000006, 0.5591171316843851, 0.30194509162252436, 25.575240671969333], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.746000000000016, 28, 227, 41.0, 50.900000000000034, 62.94999999999999, 123.91000000000008, 0.5598771853406237, 126.69791067131514, 0.17386811029132648], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.8465283890845072, 1.4510893485915495], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.480000000000001, 1, 20, 2.0, 4.0, 5.0, 12.970000000000027, 0.5639839828548869, 0.6130021219897355, 0.24288763324121596], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.6300000000000026, 2, 32, 3.0, 5.0, 7.949999999999989, 15.0, 0.5639782575102166, 0.5788487779719117, 0.20873804648083208], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3239999999999985, 1, 17, 2.0, 3.0, 4.0, 10.980000000000018, 0.5637315420199853, 0.3198515878062613, 0.2196571145175529], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 124.60799999999996, 81, 487, 121.0, 151.0, 154.0, 187.9000000000001, 0.5636654487735204, 0.5135740856500922, 0.18495272537881136], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 168.6000000000001, 105, 673, 166.0, 199.90000000000003, 254.95, 391.9100000000001, 0.5596647384350879, 0.30224082065879254, 165.56019781909845], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.278, 1, 15, 2.0, 3.0, 4.0, 8.0, 0.5639738045447265, 0.3138426101384443, 0.23737569312380577], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 476.45599999999996, 339, 1163, 482.5, 548.9000000000001, 568.95, 783.1900000000007, 0.5637760365868096, 0.6126880122610012, 0.2433486407923534], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 14.940000000000005, 7, 322, 11.0, 19.900000000000034, 32.89999999999998, 75.99000000000001, 0.5589271281988797, 0.23634320948253407, 0.4066413188556302], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.2960000000000016, 1, 40, 3.0, 4.0, 6.0, 18.99000000000001, 0.5639865274898314, 0.6003372216444494, 0.23022106297924755], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.9299999999999997, 2, 25, 4.0, 5.0, 6.949999999999989, 13.0, 0.5604130916981525, 0.3442381198028691, 0.28130110266879926], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.242, 2, 32, 4.0, 5.0, 6.0, 12.990000000000009, 0.5603942485617482, 0.3283560050166493, 0.26542110405512487], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 532.46, 379, 1316, 531.5, 642.0, 658.0, 747.7300000000002, 0.5598445871426092, 0.5110987439886687, 0.2476656230230488], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.012, 8, 126, 17.0, 26.900000000000034, 33.0, 56.940000000000055, 0.5600101249830597, 0.4960245931246437, 0.2313323074881194], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.377999999999999, 4, 43, 7.0, 9.0, 10.0, 22.980000000000018, 0.5605337177847258, 0.373871610592742, 0.26329757642036444], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 550.9100000000007, 362, 4051, 531.0, 600.9000000000001, 638.95, 824.8500000000001, 0.5603339590395876, 0.42134487154343986, 0.3108102429047712], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.552000000000001, 8, 36, 14.0, 16.0, 18.0, 28.99000000000001, 0.5630833543551119, 0.4597047697664781, 0.3486277799425205], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.154000000000003, 8, 63, 13.0, 16.900000000000034, 18.0, 26.99000000000001, 0.5630903298245298, 0.46787087522256143, 0.3574303851425238], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.415999999999999, 8, 83, 14.0, 16.900000000000034, 19.0, 27.99000000000001, 0.5630719403233835, 0.4558463266875829, 0.344771588459728], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.238000000000007, 10, 64, 16.0, 20.0, 21.94999999999999, 31.980000000000018, 0.5630776472814049, 0.5036905516696941, 0.3926146876551983], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.734000000000014, 8, 42, 13.0, 16.0, 17.0, 30.99000000000001, 0.5628836755853709, 0.422712447778467, 0.3116748477118216], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2194.168, 1710, 3064, 2171.0, 2510.8, 2587.9, 2717.95, 0.5618286849500703, 0.46901721976827937, 0.3588241796458457], "isController": false}]}, function(index, item){
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
