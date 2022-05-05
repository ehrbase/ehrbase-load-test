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

    var data = {"OkPercent": 99.99545557827767, "KoPercent": 0.0045444217223358325};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9106339468302659, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [0.998, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.971, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.497, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.804, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.705, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.596, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 1, 0.0045444217223358325, 201.6685753237893, 1, 3897, 13.0, 610.0, 1308.9000000000015, 2270.0, 24.465304407090212, 164.48668570762877, 215.5585982189414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.154000000000002, 5, 59, 8.0, 12.900000000000034, 17.0, 26.0, 0.5665793001385853, 6.0578182932733435, 0.20582763637847043], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.306000000000004, 5, 40, 8.0, 10.0, 12.0, 24.99000000000001, 0.5665593980872955, 6.083328626759167, 0.24012380739246703], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.821999999999992, 14, 272, 20.0, 30.0, 36.0, 67.98000000000002, 0.5627639362861182, 0.303372628442427, 6.266244532748359], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 45.02200000000002, 26, 79, 46.0, 55.0, 57.0, 68.97000000000003, 0.5664239728750888, 2.35585908249512, 0.23674751991263476], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6440000000000006, 1, 22, 2.0, 3.0, 5.0, 14.970000000000027, 0.5664573417969613, 0.35403583862310084, 0.24063373406413885], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 40.49199999999999, 24, 247, 41.0, 49.0, 51.0, 56.0, 0.566414347955131, 2.32429787100423, 0.2068739903664248], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 766.0300000000005, 561, 1214, 754.0, 914.0, 934.95, 995.99, 0.5660482024007236, 2.394000265830387, 0.27639072382847835], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.822000000000005, 5, 25, 9.0, 11.0, 13.0, 20.0, 0.566203964786643, 0.8421178109082591, 0.29029011866502696], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.5679999999999987, 2, 19, 3.0, 5.0, 6.0, 16.980000000000018, 0.5636305018791441, 0.543719593895769, 0.3093362715391396], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.182, 8, 52, 13.0, 16.0, 18.0, 35.97000000000003, 0.5663989487635511, 0.9231639116077801, 0.3711461861526785], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 640.0, 640, 640, 640.0, 640.0, 640.0, 640.0, 1.5625, 0.66680908203125, 1848.1124877929688], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.559999999999996, 2, 23, 4.0, 6.0, 7.0, 11.0, 0.5636400324205747, 0.5658494573132857, 0.3319091206539126], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.151999999999997, 9, 77, 14.0, 17.0, 20.94999999999999, 24.99000000000001, 0.5663906078843839, 0.8894179950650386, 0.33795377091538914], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.543999999999993, 5, 43, 8.0, 11.0, 12.0, 20.99000000000001, 0.5663886831010007, 0.8765893662931901, 0.3246778876760619], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 2003.5839999999994, 1592, 3089, 1989.0, 2274.9, 2333.0, 2528.4600000000005, 0.565130115557806, 0.8631479499339928, 0.3123668412165217], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, 0.2, 20.192000000000007, 12, 183, 17.0, 28.0, 34.0, 63.91000000000008, 0.5627253011424449, 0.30360129069488695, 4.5380718133147555], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.953999999999994, 11, 44, 18.0, 22.0, 24.0, 33.99000000000001, 0.5664162729129543, 1.0254269663565725, 0.4734886031381727], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.504000000000005, 8, 65, 13.0, 17.0, 18.0, 35.0, 0.5664053649916172, 0.9591278348588518, 0.40710385608772487], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 6.294869087837838, 1843.0373733108108], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.8106332964601771, 3384.8589601769913], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.402, 1, 35, 2.0, 3.0, 4.0, 11.980000000000018, 0.5636311372385456, 0.4738167356879963, 0.23943314911988997], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 418.882, 316, 664, 422.5, 485.0, 502.95, 546.99, 0.5633663165532798, 0.49570404135052426, 0.26187731121031366], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.1140000000000017, 1, 18, 3.0, 4.0, 6.0, 11.990000000000009, 0.5636527403105276, 0.5108102959064156, 0.2763219488631688], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1175.2959999999996, 910, 1881, 1173.5, 1354.9, 1379.0, 1490.8300000000002, 0.5630396030796014, 0.5327982181485681, 0.29856494577365583], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.796223958333334, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 45.02600000000003, 28, 737, 42.0, 55.0, 62.0, 112.86000000000013, 0.562267151116044, 0.3036462251632543, 25.719329451440924], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 43.19399999999995, 28, 256, 42.0, 51.0, 58.94999999999999, 108.93000000000006, 0.5630560882691769, 127.41728336557769, 0.17485530866171703], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 317.0, 317, 317, 317.0, 317.0, 317.0, 317.0, 3.1545741324921135, 1.6543030362776026, 1.300029574132492], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.242000000000004, 1, 17, 2.0, 3.0, 4.0, 6.990000000000009, 0.5668355836706005, 0.616101567016971, 0.24411571523313946], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3080000000000025, 2, 16, 3.0, 4.0, 5.0, 12.980000000000018, 0.5668298002831882, 0.5817755079078425, 0.2097934514720003], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.219999999999998, 1, 15, 2.0, 3.0, 4.0, 12.0, 0.5665921409137319, 0.32147464245202945, 0.2207717424068154], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.31600000000009, 84, 467, 120.0, 150.90000000000003, 156.0, 181.99, 0.5665253752380822, 0.5160835934392962, 0.18589113874999574], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 175.26200000000009, 122, 697, 172.0, 203.0, 222.0, 375.9200000000001, 0.5628304518290301, 0.30395042955220086, 166.4966801445799], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.353999999999999, 1, 17, 2.0, 3.0, 5.0, 11.0, 0.5668240170137897, 0.3155250246426742, 0.2385753430985775], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 468.8959999999999, 358, 1134, 465.0, 546.9000000000001, 564.0, 666.5900000000004, 0.5665927829677676, 0.6158454099043819, 0.24456446296069662], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 14.294000000000013, 8, 338, 11.0, 20.0, 27.0, 68.93000000000006, 0.5620737373294528, 0.23767375806997368, 0.4089305999125413], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 2.991999999999999, 1, 21, 3.0, 4.0, 5.0, 10.990000000000009, 0.566838154102888, 0.6032763263020839, 0.2313851058740304], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.013999999999998, 2, 23, 4.0, 5.0, 7.0, 11.0, 0.5636241483639118, 0.34621053644619193, 0.2829129025967292], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.376000000000002, 2, 46, 4.0, 5.900000000000034, 7.0, 12.0, 0.5636044533769489, 0.33023698440055593, 0.26694156239044936], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 535.3620000000004, 377, 942, 547.5, 639.0, 652.9, 709.7700000000002, 0.5630079035049493, 0.514082296765407, 0.24906501981224813], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.782000000000004, 6, 133, 15.0, 27.0, 34.0, 46.98000000000002, 0.5631696086647023, 0.49872738627634505, 0.23263744576676668], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.335999999999999, 4, 46, 7.0, 9.0, 10.0, 17.99000000000001, 0.5636514694957461, 0.3759511266265572, 0.26476206721431045], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 561.8719999999998, 441, 3897, 540.5, 631.0, 667.8499999999999, 737.0, 0.5634005958524702, 0.42365083867812703, 0.3125112680119171], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.127999999999997, 8, 70, 14.0, 16.0, 17.0, 23.0, 0.5661866536217262, 0.462142115185579, 0.35054915859001406], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.879999999999992, 8, 31, 13.0, 16.0, 17.0, 22.99000000000001, 0.5661943473421138, 0.47054620733300945, 0.35940070876208396], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.106000000000007, 8, 50, 14.0, 16.0, 18.0, 25.0, 0.566162932633405, 0.4583487022979421, 0.34666421754018056], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.915999999999986, 10, 43, 16.0, 19.0, 22.0, 28.99000000000001, 0.5661783189939238, 0.5064641994125334, 0.3947766794547476], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 12.944000000000006, 8, 35, 13.0, 16.0, 17.0, 27.99000000000001, 0.5658777952948393, 0.42486480648959973, 0.3133327245431386], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2189.075999999999, 1678, 2895, 2182.0, 2501.0, 2614.45, 2765.83, 0.5648262368564935, 0.4716155664840019, 0.3607386317423308], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 1, 100.0, 0.0045444217223358325], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 22005, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 1, "500", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
