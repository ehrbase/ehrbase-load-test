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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9105885026130425, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.97, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.495, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.806, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.703, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.594, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 200.98850261304202, 1, 4004, 13.0, 610.0, 1321.0, 2256.0, 24.4550268666337, 164.41305274382788, 215.46804499397098], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.371999999999991, 4, 32, 8.0, 12.0, 14.0, 20.99000000000001, 0.5658925256915207, 6.0456597458010775, 0.20557814409887276], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.912000000000004, 4, 52, 7.0, 10.0, 12.0, 16.99000000000001, 0.5658726718583598, 6.075858874467938, 0.2398327535024689], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.306, 13, 281, 20.0, 28.0, 33.0, 99.69000000000028, 0.5622595637540497, 0.3030051930293308, 6.260628462816088], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 42.07199999999999, 25, 153, 42.0, 52.0, 54.0, 58.99000000000001, 0.5657138913308871, 2.3529057257600083, 0.23645072801720673], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4980000000000007, 1, 15, 2.0, 3.0, 4.949999999999989, 7.990000000000009, 0.565749737209247, 0.3535935857557794, 0.24033314031838132], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 36.87199999999996, 22, 96, 37.0, 46.0, 47.0, 59.92000000000007, 0.5657074907591682, 2.3213011357143585, 0.20661582182024305], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 773.1959999999997, 570, 1365, 770.5, 918.0, 932.0, 1056.5600000000004, 0.5653838107999616, 2.3912864107174157, 0.27606631386716873], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.799999999999992, 5, 40, 9.0, 11.0, 13.0, 19.99000000000001, 0.5654387974700007, 0.8409797739714951, 0.2898978209685062], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5779999999999976, 2, 30, 3.0, 5.0, 7.0, 12.0, 0.5631791236257021, 0.543379857560736, 0.3090885424586373], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.158000000000012, 8, 56, 13.0, 16.0, 18.0, 30.980000000000018, 0.5656927699938453, 0.9220129229684841, 0.37068344596276387], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 0.7434805095818816, 2060.6132268074916], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.7420000000000035, 2, 24, 4.0, 6.0, 8.0, 14.0, 0.5631867358259978, 0.5652986860853454, 0.33164218916316085], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.118000000000004, 9, 62, 14.0, 17.0, 19.0, 28.980000000000018, 0.5656838099030871, 0.8882119696431441, 0.3375320389167834], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.381999999999998, 5, 30, 8.0, 11.0, 12.0, 16.0, 0.5656825299132922, 0.8755925878052423, 0.3242730908780298], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1971.2320000000004, 1452, 2920, 1950.0, 2232.5, 2309.85, 2452.75, 0.5645239595258902, 0.8622221413071214, 0.3120317979410682], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.543999999999997, 12, 123, 17.0, 26.0, 35.94999999999999, 83.96000000000004, 0.562216572570353, 0.30361891077285663, 4.533969195591772], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.448, 11, 35, 18.0, 22.0, 23.0, 29.99000000000001, 0.5657068507099622, 1.0242387707190135, 0.4728955705153589], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.996000000000002, 8, 35, 13.0, 16.0, 18.0, 22.99000000000001, 0.5656985302020788, 0.9579309095414108, 0.40659581858274413], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 5.82275390625, 1704.8095703125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.71563720703125, 2988.19580078125], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.365999999999998, 1, 20, 2.0, 3.0, 4.0, 10.990000000000009, 0.563134723224915, 0.47349511396157395, 0.23922227011995897], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 417.89200000000017, 320, 944, 415.0, 484.90000000000003, 504.0, 624.2600000000007, 0.5629026865093616, 0.49520044542489583, 0.2616617956820861], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1439999999999992, 1, 29, 3.0, 4.0, 6.0, 10.990000000000009, 0.5631397972020963, 0.5103454412143997, 0.2760704865189964], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1184.342000000001, 933, 1839, 1175.5, 1375.9, 1410.85, 1500.7300000000002, 0.56255245801671, 0.5323372381037031, 0.2983066256865953], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 57.0, 57, 57, 57.0, 57.0, 57.0, 57.0, 17.543859649122805, 8.20655153508772, 1155.2391721491229], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 43.53999999999998, 27, 818, 41.0, 52.900000000000034, 62.94999999999999, 91.93000000000006, 0.561707500929626, 0.303343992201253, 25.693729827679373], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.11199999999997, 27, 184, 41.0, 50.0, 60.0, 78.98000000000002, 0.562623988261413, 127.31950090610593, 0.17472112135461854], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 1.3446514423076923, 1.056690705128205], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.381999999999999, 1, 18, 2.0, 3.0, 4.0, 9.0, 0.566146906063773, 0.6153530336415814, 0.2438191265372304], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5499999999999994, 2, 36, 3.0, 4.0, 7.0, 17.960000000000036, 0.5661411367208199, 0.5810686862242009, 0.20953856525116285], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.206000000000001, 1, 18, 2.0, 3.0, 4.0, 7.980000000000018, 0.5659046948585295, 0.3210845973757867, 0.22050388012554029], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.41199999999994, 83, 462, 120.5, 152.0, 159.95, 208.87000000000012, 0.5658425735425593, 0.5155577354640701, 0.18566709444365226], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 169.396, 108, 748, 168.0, 194.0, 221.95, 350.8900000000001, 0.5623582154349335, 0.3036954034526545, 166.35698302690435], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3719999999999977, 1, 17, 2.0, 3.0, 4.949999999999989, 9.0, 0.5661379315810987, 0.31504691301970045, 0.23828657081196633], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 473.84400000000005, 349, 670, 479.0, 550.0, 566.9, 631.8800000000001, 0.5659322375376062, 0.6150312804895993, 0.24427934471838078], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.443999999999987, 7, 318, 11.0, 17.0, 23.0, 54.98000000000002, 0.5615239310268925, 0.23744127161586373, 0.40853059435062006], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.072, 1, 16, 3.0, 4.0, 6.0, 10.0, 0.5661507523577348, 0.602640937568292, 0.23110450633352847], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.911999999999999, 2, 18, 4.0, 5.0, 7.0, 14.970000000000027, 0.5631277466555843, 0.34590561781871343, 0.28266373220797886], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.239999999999999, 2, 29, 4.0, 5.0, 7.949999999999989, 13.980000000000018, 0.5631112572697663, 0.32994800230650373, 0.2667079685310905], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 537.3399999999997, 372, 1088, 541.5, 649.0, 669.95, 706.97, 0.5625727125230936, 0.5135893306397352, 0.24887249880172013], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.953999999999994, 6, 122, 15.0, 28.0, 35.0, 46.97000000000003, 0.5627354344373827, 0.4984385146823302, 0.232458094499036], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.2320000000000055, 4, 41, 7.0, 9.0, 10.0, 15.980000000000018, 0.5631943482320766, 0.37564623031494954, 0.2645473452144813], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 555.3980000000004, 372, 3459, 535.0, 624.8000000000001, 653.0, 702.9100000000001, 0.5629850820212966, 0.4233383917542953, 0.31228078768368794], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.316000000000008, 8, 65, 14.0, 16.0, 17.0, 23.99000000000001, 0.5654157784927146, 0.46160897541006785, 0.3500718784808409], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.238000000000007, 8, 98, 13.5, 16.0, 18.0, 24.0, 0.5654272877470775, 0.46981264990890964, 0.3589138056988285], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.281999999999996, 8, 46, 14.0, 16.0, 18.0, 28.980000000000018, 0.565399794194475, 0.45773088807345674, 0.34619694429681225], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.23599999999997, 10, 33, 17.0, 20.0, 22.0, 28.980000000000018, 0.5654081059167697, 0.5057752197458604, 0.3942396363521226], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.959999999999996, 8, 47, 13.0, 16.0, 17.0, 28.980000000000018, 0.5651767477243159, 0.4244344912109364, 0.31294454683563194], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2194.613999999998, 1653, 4004, 2184.0, 2517.9, 2604.9, 2731.96, 0.5641462492736616, 0.47095193332919627, 0.3603043427978269], "isController": false}]}, function(index, item){
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
