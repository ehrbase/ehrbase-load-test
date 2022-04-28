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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9095887298341286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.958, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.498, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.789, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.694, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.586, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 202.8948875255628, 1, 3326, 13.0, 612.9000000000015, 1316.0, 2273.9900000000016, 24.291109155998488, 163.31937151964044, 214.02380087831045], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.124000000000002, 4, 71, 8.0, 12.0, 15.949999999999989, 28.980000000000018, 0.5618021714777532, 6.010460282412334, 0.2040921951071525], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.254000000000001, 5, 36, 8.0, 10.0, 12.0, 18.0, 0.56178323481528, 6.0319499819105795, 0.23809953506819487], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 23.037999999999993, 14, 297, 21.0, 28.0, 35.0, 62.0, 0.5585362774897592, 0.3009986907909656, 6.219170542908432], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.96000000000001, 26, 73, 45.0, 54.0, 56.0, 59.0, 0.5615396969257948, 2.335544501178672, 0.2347060451994533], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.6480000000000006, 1, 24, 2.0, 3.0, 4.0, 6.990000000000009, 0.5615693392125899, 0.3509808370078687, 0.23855728765378578], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 39.35800000000002, 24, 60, 41.0, 48.0, 49.0, 52.99000000000001, 0.561533390459997, 2.304173302119564, 0.20509129690628794], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 772.169999999999, 570, 1503, 763.5, 925.9000000000001, 946.0, 1002.8400000000001, 0.5612138381863365, 2.3736495441259993, 0.2740301944269221], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.968000000000004, 5, 23, 9.0, 11.0, 13.0, 18.0, 0.5613341790768298, 0.8348749557949334, 0.2877934023587262], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.7539999999999987, 2, 32, 3.0, 5.0, 7.0, 13.0, 0.5592647234827428, 0.5396030730478026, 0.3069402095676772], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.551999999999996, 8, 50, 14.0, 17.0, 19.0, 26.0, 0.5615207779533467, 0.9152130648477886, 0.36794965039716365], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.7042208127062707, 1951.8019673061056], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.849999999999998, 3, 27, 4.0, 6.0, 8.0, 14.990000000000009, 0.5592753581040117, 0.5613726406969018, 0.32933890716476477], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.536000000000003, 9, 57, 15.0, 18.0, 19.0, 33.940000000000055, 0.5615119495357981, 0.881661497013318, 0.33504277457653575], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.824000000000002, 5, 34, 9.0, 12.0, 13.0, 20.980000000000018, 0.5615081660132584, 0.8691312921201314, 0.3218801693845534], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1998.085999999999, 1437, 2479, 1987.0, 2230.8, 2308.95, 2426.75, 0.5604432433523024, 0.8559894849638683, 0.30977624583730784], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.281999999999965, 12, 107, 17.0, 25.0, 32.0, 56.97000000000003, 0.5584919822891022, 0.30160748652917335, 4.503932411858795], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.953999999999997, 11, 47, 18.0, 22.0, 23.0, 28.99000000000001, 0.5615359130293178, 1.0166870925355032, 0.46940892729794537], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.345999999999998, 8, 31, 14.0, 16.0, 18.0, 24.0, 0.5615321291838355, 0.9508756953171589, 0.40360121785088177], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 76.0, 76, 76, 76.0, 76.0, 76.0, 76.0, 13.157894736842104, 6.129214638157895, 1794.5363898026317], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 569.0, 569, 569, 569.0, 569.0, 569.0, 569.0, 1.757469244288225, 0.8049346441124781, 3361.0638181019335], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.5879999999999996, 1, 33, 2.0, 3.0, 5.0, 15.0, 0.5592271927577842, 0.47020958297309784, 0.23756233286097275], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 421.85200000000015, 312, 619, 421.5, 491.90000000000003, 512.0, 580.9200000000001, 0.5590258638906188, 0.4917899015890869, 0.2598596789179048], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.3100000000000036, 1, 30, 3.0, 4.0, 6.0, 10.990000000000009, 0.5592659745936653, 0.5068347894755092, 0.2741714055136914], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1190.6240000000012, 940, 1555, 1181.5, 1361.9, 1399.95, 1467.94, 0.5586635873129734, 0.5286572422912804, 0.2962444608505318], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 7.544732862903226, 1062.074722782258], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 44.15200000000001, 27, 680, 42.0, 52.0, 61.94999999999999, 96.97000000000003, 0.5580780684248359, 0.3013839568739592, 25.52771164552667], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.92400000000001, 27, 179, 41.0, 50.0, 56.94999999999999, 86.93000000000006, 0.5588615319959405, 126.46807248517898, 0.17355270231905182], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 376.0, 376, 376, 376.0, 376.0, 376.0, 376.0, 2.6595744680851063, 1.3947182513297873, 1.0960355718085106], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3899999999999992, 1, 17, 2.0, 3.0, 5.0, 7.0, 0.5620389875204863, 0.6108880792092786, 0.24204999364895943], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3799999999999972, 2, 16, 3.0, 4.900000000000034, 6.0, 12.0, 0.5620339333607606, 0.5768531874630463, 0.20801841869504714], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.402, 1, 29, 2.0, 3.0, 5.0, 8.0, 0.5618160591749618, 0.3187647757623563, 0.21891074961993143], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 122.31200000000003, 87, 437, 120.5, 149.0, 156.0, 185.95000000000005, 0.5617560944918691, 0.5118344103133925, 0.18432621850514455], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 165.09600000000012, 111, 613, 165.0, 194.0, 215.0, 376.61000000000035, 0.5586136549756276, 0.30167319453273644, 165.24926598165737], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.378000000000001, 1, 25, 2.0, 3.0, 4.0, 7.0, 0.5620314063149848, 0.3127616958735654, 0.23655814074390477], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 482.46799999999996, 354, 795, 482.5, 561.0, 582.95, 667.8600000000001, 0.5618097465002062, 0.6105511311477436, 0.24249991011044056], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.921999999999997, 8, 385, 11.0, 18.0, 25.0, 50.99000000000001, 0.5578651171405172, 0.23589413644711327, 0.40586866432586466], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.1499999999999977, 1, 17, 3.0, 4.0, 5.0, 9.990000000000009, 0.5620408828538188, 0.5982661741315063, 0.22942684475868774], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 4.2200000000000015, 2, 25, 4.0, 5.900000000000034, 7.0, 14.990000000000009, 0.5592184363134084, 0.3435042933995448, 0.28070144166512884], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.260000000000002, 2, 30, 4.0, 5.0, 6.0, 11.990000000000009, 0.5592015496593343, 0.3276571580035163, 0.264856202719509], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 536.4140000000003, 375, 814, 544.0, 644.0, 660.0, 700.98, 0.5586935510003408, 0.5100479289230064, 0.24715642441714294], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.68399999999999, 5, 112, 16.0, 28.0, 36.0, 54.98000000000002, 0.5589677430894818, 0.4951013115060156, 0.23090171418637773], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.375999999999995, 4, 36, 7.0, 9.0, 10.949999999999989, 13.0, 0.5592834907343505, 0.3730377189175404, 0.262710311565647], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 558.2959999999999, 389, 3326, 540.0, 631.0, 654.0, 718.99, 0.5590633675964636, 0.42038944633718456, 0.31010546171366343], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.276000000000002, 9, 38, 14.0, 16.0, 17.94999999999999, 21.0, 0.5613146438009533, 0.4582607834156221, 0.34753269938457465], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.44199999999999, 8, 96, 14.0, 16.0, 18.0, 25.99000000000001, 0.5613240961840065, 0.46640331445039074, 0.35630924074180104], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.508000000000006, 8, 68, 14.0, 16.0, 18.0, 27.99000000000001, 0.5613014109994869, 0.45441295870954557, 0.3436874850553499], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.339999999999993, 10, 41, 17.0, 20.0, 22.0, 27.99000000000001, 0.5613045616099114, 0.5021044711276159, 0.3913783759662858], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.113999999999992, 8, 27, 14.0, 16.0, 18.0, 25.99000000000001, 0.5611445553266086, 0.4214064092247676, 0.3107118778029171], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2226.444000000002, 1700, 3148, 2203.5, 2585.7000000000003, 2661.8, 2796.83, 0.560093558027933, 0.46756872768027175, 0.35771600288112126], "isController": false}]}, function(index, item){
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
