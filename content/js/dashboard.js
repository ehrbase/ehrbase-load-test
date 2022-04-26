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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9100886162235855, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.968, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.795, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.7, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.586, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 202.2466712110887, 1, 3384, 15.0, 610.0, 1317.9500000000007, 2263.9900000000016, 24.405473569332393, 164.0856706171213, 215.03144142159525], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.356000000000003, 4, 89, 8.0, 12.0, 15.0, 32.960000000000036, 0.5645602922164072, 6.037299704593827, 0.2050941686567417], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.424000000000003, 5, 43, 8.0, 10.900000000000034, 12.0, 20.99000000000001, 0.5645367073057824, 6.061514424759677, 0.23926653415108357], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.887999999999966, 13, 266, 20.0, 28.0, 33.0, 50.0, 0.5617245392735329, 0.3027168649928773, 6.254671090621897], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 44.466000000000015, 27, 86, 45.0, 55.0, 57.0, 65.98000000000002, 0.5643793125634221, 2.347354972858999, 0.23589291579799285], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.605999999999999, 1, 9, 2.0, 4.0, 4.0, 6.990000000000009, 0.564427732366431, 0.3527673327290194, 0.23977154646425536], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.61599999999999, 24, 88, 40.0, 48.0, 50.0, 55.0, 0.5643691199792312, 2.315809319427278, 0.20612700280491453], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 772.7880000000001, 580, 1043, 770.0, 908.8000000000001, 930.8499999999999, 989.99, 0.5640584229152118, 2.3856806930134598, 0.2754191518140683], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.892000000000003, 6, 49, 10.0, 12.0, 14.0, 23.0, 0.5642016321224814, 0.8391397321509172, 0.28926353209404565], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.6499999999999986, 2, 50, 3.0, 5.0, 7.0, 12.0, 0.562186229810487, 0.5424218701687121, 0.3085436144077087], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 14.962, 9, 32, 15.0, 19.0, 20.0, 25.99000000000001, 0.5643557427711673, 0.9198337252783967, 0.3698073275385286], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 630.0, 630, 630, 630.0, 630.0, 630.0, 630.0, 1.5873015873015872, 0.6773933531746031, 1877.4476066468253], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.758000000000002, 2, 23, 4.0, 6.0, 8.0, 13.980000000000018, 0.5621950794437867, 0.5643033109917008, 0.3310582352584017], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 16.345999999999997, 10, 50, 16.0, 20.0, 22.0, 34.0, 0.5643359966230134, 0.8860956921976034, 0.3367278261100207], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 9.626000000000003, 6, 28, 10.0, 12.0, 15.0, 22.99000000000001, 0.5643321749474889, 0.873502438761494, 0.3234990104435312], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1981.0979999999997, 1570, 2465, 1960.5, 2242.8, 2303.7, 2376.99, 0.5631930794834393, 0.8601894299922843, 0.3112961747926042], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.190000000000015, 12, 98, 17.0, 26.0, 31.0, 50.99000000000001, 0.5616885706486268, 0.3033337691100494, 4.529711148844101], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 19.67599999999999, 12, 42, 20.0, 24.0, 26.0, 34.98000000000002, 0.5643716680907644, 1.0218213600002708, 0.47177944129462346], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 14.887999999999998, 9, 37, 15.0, 18.0, 20.0, 28.980000000000018, 0.5643646608394134, 0.9556721893511161, 0.4056370999783284], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 4.852294921875, 1420.6746419270833], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 589.0, 589, 589, 589.0, 589.0, 589.0, 589.0, 1.697792869269949, 0.7776023981324279, 3246.9360144312395], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3959999999999995, 1, 19, 2.0, 3.0, 4.0, 8.0, 0.562448676558264, 0.472918271988931, 0.23893083428012193], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 420.36800000000017, 311, 627, 423.0, 490.90000000000003, 508.9, 559.96, 0.5622405962449075, 0.4946179870324829, 0.2613540271607187], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.223999999999998, 1, 16, 3.0, 4.0, 6.949999999999989, 11.0, 0.5624973984495322, 0.5097632673448885, 0.27575556056803235], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1181.314000000001, 925, 1719, 1173.0, 1359.9, 1391.9, 1451.98, 0.561586999934856, 0.5314236356805424, 0.29779466891076833], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 68.0, 68, 68, 68.0, 68.0, 68.0, 68.0, 14.705882352941176, 6.879021139705882, 968.362247242647], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.36400000000001, 27, 748, 42.0, 53.0, 63.0, 88.99000000000001, 0.5612289567202677, 0.30308555963506645, 25.671840168727872], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.937999999999995, 28, 199, 42.0, 51.0, 61.0, 89.99000000000001, 0.5620200348902038, 127.18282873535375, 0.17453356552254373], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 313.0, 313, 313, 313.0, 313.0, 313.0, 313.0, 3.1948881789137378, 1.6754442891373802, 1.3166433706070289], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3779999999999992, 1, 19, 2.0, 3.900000000000034, 4.0, 7.0, 0.5648153900897492, 0.6139057902049715, 0.2432456904585736], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.5660000000000043, 2, 31, 3.0, 5.0, 6.0, 17.0, 0.5648090098333249, 0.5797014348972895, 0.20904552219417005], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3019999999999996, 1, 21, 2.0, 3.0, 4.0, 7.990000000000009, 0.5645762290824508, 0.32033084872744516, 0.21998624551161897], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.05799999999994, 83, 456, 120.0, 148.90000000000003, 153.0, 174.95000000000005, 0.5645143990687771, 0.5143475921202822, 0.18523128719444248], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 175.76400000000004, 123, 609, 173.0, 199.90000000000003, 228.84999999999997, 385.73000000000025, 0.5617882844671157, 0.3033876184671045, 166.18838586990108], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.4079999999999977, 1, 20, 2.0, 3.0, 4.0, 7.990000000000009, 0.5648039057319689, 0.3143045484788136, 0.237725081416483], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 475.75599999999974, 343, 703, 479.0, 547.0, 564.95, 602.9100000000001, 0.5646055552669793, 0.6135894981672904, 0.24370669475391105], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.992000000000008, 7, 384, 11.0, 17.0, 23.0, 43.930000000000064, 0.5610079292860726, 0.23722307947350527, 0.40815518292785546], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.281999999999998, 2, 44, 3.0, 4.0, 5.0, 13.970000000000027, 0.5648185802720167, 0.6012229028286115, 0.23056070952510055], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.063999999999994, 2, 40, 4.0, 5.0, 7.0, 13.990000000000009, 0.56244108429642, 0.345483830100047, 0.28231905989097644], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.389999999999998, 2, 40, 4.0, 5.0, 7.0, 16.980000000000018, 0.5624183087406555, 0.32954197777772776, 0.2663797653703299], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 535.982, 381, 787, 533.0, 645.0, 661.95, 708.8100000000002, 0.5619473949804611, 0.5130184596909514, 0.24859586906850475], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 15.266000000000005, 5, 136, 15.0, 24.0, 30.94999999999999, 48.99000000000001, 0.5621407218111724, 0.4979117526198568, 0.23221242707629486], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 8.469999999999999, 5, 49, 8.0, 10.0, 12.0, 20.99000000000001, 0.562205193651579, 0.37498647193752777, 0.264082713033603], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 561.3300000000005, 454, 3384, 541.0, 630.8000000000001, 674.8, 736.8800000000001, 0.5618949795807364, 0.422518685817546, 0.31167612148618973], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 15.219999999999995, 10, 78, 15.0, 18.0, 19.0, 35.960000000000036, 0.5641723478822098, 0.4605938308882104, 0.3493020200755088], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 14.79600000000001, 9, 40, 15.0, 18.0, 19.0, 27.0, 0.5641876262369814, 0.4687826170971418, 0.3581269111855839], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 15.08, 9, 44, 15.0, 19.0, 20.0, 31.99000000000001, 0.5641538876408551, 0.456722239115497, 0.3454340698738439], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 18.023999999999994, 11, 70, 18.0, 22.0, 24.94999999999999, 35.0, 0.5641634358907238, 0.504661823511624, 0.39337177072849294], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 14.537999999999998, 9, 39, 15.0, 18.0, 20.0, 25.99000000000001, 0.5640342436470003, 0.42357649742631176, 0.31231192983188394], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2201.9839999999963, 1692, 2878, 2186.0, 2555.9, 2620.9, 2746.9300000000003, 0.562922332479943, 0.46993020185268997, 0.35952266156433865], "isController": false}]}, function(index, item){
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
