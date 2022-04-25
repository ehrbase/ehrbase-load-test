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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9043083900226757, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.93, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.99, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.99, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.71, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.63, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.55, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2205, 0, 0.0, 211.21904761904793, 2, 3216, 18.0, 618.0, 1296.6999999999998, 2321.2800000000007, 20.940966418477434, 140.51829745135143, 212.31796480279402], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 50, 0, 0.0, 12.959999999999997, 7, 30, 12.0, 17.9, 22.0, 30.0, 0.5595783017917698, 5.975028468546104, 0.20328430494779134], "isController": false}, {"data": ["Query participation #1", 50, 0, 0.0, 11.78, 7, 35, 10.5, 16.0, 26.29999999999994, 35.0, 0.5594155226619228, 6.005576935717562, 0.23709603206569774], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 50, 0, 0.0, 35.5, 22, 285, 28.5, 44.9, 48.79999999999998, 285.0, 0.531428692897987, 0.28548723043279556, 5.917333941819186], "isController": false}, {"data": ["Query ehr_id, time_created #2", 50, 0, 0.0, 44.64, 29, 56, 45.0, 52.699999999999996, 54.449999999999996, 56.0, 0.5573701048970537, 2.3182024187075703, 0.23296328603119046], "isController": false}, {"data": ["Query ehr_id, time_created #3", 50, 0, 0.0, 4.4399999999999995, 2, 10, 4.0, 7.0, 8.899999999999991, 10.0, 0.5576125262077887, 0.3485078288798679, 0.23687641494178524], "isController": false}, {"data": ["Query ehr_id, time_created #1", 50, 0, 0.0, 39.84000000000002, 25, 69, 40.0, 51.599999999999994, 55.89999999999999, 69.0, 0.5572520785502529, 2.2872368028776497, 0.20352761462675256], "isController": false}, {"data": ["Query ehr_id, time_created #4", 50, 0, 0.0, 766.1000000000001, 565, 1006, 765.0, 900.1, 930.6999999999999, 1006.0, 0.5540718742035217, 2.3434426632572776, 0.27054290732593833], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 50, 0, 0.0, 14.199999999999998, 7, 40, 12.0, 19.0, 36.0, 40.0, 0.5560250878519639, 0.8269787195298252, 0.28507145617410257], "isController": false}, {"data": ["Query start_time #5", 50, 0, 0.0, 6.7200000000000015, 2, 19, 6.0, 11.799999999999997, 15.899999999999991, 19.0, 0.536814755964012, 0.5179423621996522, 0.2946190359880613], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 50, 0, 0.0, 18.34, 11, 63, 17.0, 22.9, 28.599999999999966, 63.0, 0.5569975603506857, 0.9078407502200141, 0.3649857060501075], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 691.0, 691, 691, 691.0, 691.0, 691.0, 691.0, 1.447178002894356, 0.6175945188133141, 1711.7105530933432], "isController": false}, {"data": ["Query start_time #6", 50, 0, 0.0, 7.120000000000001, 4, 18, 7.0, 10.0, 13.449999999999996, 18.0, 0.5369012209133763, 0.5395228089061175, 0.31616351192457615], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 50, 0, 0.0, 20.5, 12, 88, 18.0, 25.699999999999996, 37.39999999999995, 88.0, 0.5569417216182498, 0.8751164356286758, 0.3323158124108893], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 50, 0, 0.0, 12.340000000000005, 7, 21, 12.0, 16.9, 19.0, 21.0, 0.5569355180057253, 0.8620535117569088, 0.3192589346380476], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 50, 0, 0.0, 2028.2200000000003, 1580, 2440, 2011.0, 2320.2, 2369.6499999999996, 2440.0, 0.5464600319132659, 0.8346323143675272, 0.30204724420205903], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 50, 0, 0.0, 28.259999999999998, 17, 77, 25.0, 42.39999999999999, 45.79999999999998, 77.0, 0.5311238580837051, 0.28682763039090714, 4.283223457085192], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 50, 0, 0.0, 24.48, 16, 57, 22.0, 31.699999999999996, 56.0, 57.0, 0.5570720294134032, 1.0086050220043452, 0.4656773995877667], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 50, 0, 0.0, 18.939999999999994, 11, 84, 17.0, 24.0, 30.499999999999957, 84.0, 0.5570161757497438, 0.9432285632324763, 0.40035537632012835], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 78.0, 78, 78, 78.0, 78.0, 78.0, 78.0, 12.82051282051282, 5.972055288461538, 1748.5226362179487], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 0.6887335526315789, 2875.8576127819547], "isController": false}, {"data": ["Query start_time #1", 50, 0, 0.0, 4.440000000000001, 2, 16, 4.0, 7.0, 8.449999999999996, 16.0, 0.5377963257755023, 0.4521900746999097, 0.22845840010971047], "isController": false}, {"data": ["Query start_time #2", 50, 0, 0.0, 425.34, 332, 572, 421.0, 505.6, 525.0, 572.0, 0.5355268513163249, 0.47020721876807403, 0.24893630979157294], "isController": false}, {"data": ["Query start_time #3", 50, 0, 0.0, 5.260000000000001, 2, 13, 4.0, 10.0, 11.449999999999996, 13.0, 0.5376517522070604, 0.4872469004376485, 0.26357537071088316], "isController": false}, {"data": ["Query start_time #4", 50, 0, 0.0, 1188.9199999999996, 956, 1465, 1212.5, 1328.5, 1392.6999999999998, 1465.0, 0.5313778627982358, 0.5028370596205962, 0.28177556591742386], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 65.0, 65, 65, 65.0, 65.0, 65.0, 65.0, 15.384615384615385, 7.1965144230769225, 1013.0558894230769], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 50, 0, 0.0, 69.23999999999998, 34, 708, 50.0, 92.1, 102.24999999999997, 708.0, 0.5272759867970093, 0.28474962958861927, 24.118757052316322], "isController": false}, {"data": ["Composition - Get composition by version ID", 50, 0, 0.0, 58.86000000000001, 37, 179, 56.5, 78.69999999999999, 94.99999999999991, 179.0, 0.5341024408481547, 120.86519170939486, 0.1658638439352668], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 309.0, 309, 309, 309.0, 309.0, 309.0, 309.0, 3.236245954692557, 1.6971328883495145, 1.333687297734628], "isController": false}, {"data": ["Query composer #2", 50, 0, 0.0, 4.119999999999999, 3, 8, 4.0, 6.0, 7.0, 8.0, 0.5619113978107932, 0.6107494001595828, 0.2419950453462498], "isController": false}, {"data": ["Query composer #1", 50, 0, 0.0, 5.76, 3, 11, 5.0, 9.899999999999999, 10.0, 11.0, 0.5618735110351958, 0.5766885352519441, 0.20795904363509687], "isController": false}, {"data": ["Query ehr_status #1", 50, 0, 0.0, 3.9199999999999986, 2, 12, 3.0, 5.899999999999999, 8.699999999999974, 12.0, 0.5596973156916739, 0.3175626371258423, 0.21808518453220496], "isController": false}, {"data": ["Query ehr_status #2", 50, 0, 0.0, 119.67999999999999, 82, 419, 111.5, 126.8, 263.3499999999988, 419.0, 0.5592278182285899, 0.5095308148508539, 0.18349662785625606], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 50, 0, 0.0, 212.11999999999998, 132, 633, 192.0, 273.8, 351.9499999999994, 633.0, 0.5320111083919432, 0.2873067802155709, 157.379692337976], "isController": false}, {"data": ["Query ehr_status #3", 50, 0, 0.0, 4.1400000000000015, 2, 10, 4.0, 5.899999999999999, 7.349999999999987, 10.0, 0.561835629368272, 0.3132892034856282, 0.2364757385329348], "isController": false}, {"data": ["Query composer #4", 50, 0, 0.0, 492.78000000000003, 350, 584, 515.5, 563.3, 576.9, 584.0, 0.5597850425436632, 0.6089848997984775, 0.2416259656291984], "isController": false}, {"data": ["Create EHR", 50, 0, 0.0, 27.0, 12, 334, 18.0, 41.69999999999998, 50.79999999999998, 334.0, 0.5256683873545213, 0.22227969894971455, 0.38244428572179523], "isController": false}, {"data": ["Query composer #3", 50, 0, 0.0, 5.0200000000000005, 2, 10, 5.0, 7.899999999999999, 9.449999999999996, 10.0, 0.5619177127701419, 0.59813506535103, 0.22937656634562437], "isController": false}, {"data": ["Query ehr_id #4", 50, 0, 0.0, 6.500000000000001, 3, 13, 6.0, 10.0, 11.449999999999996, 13.0, 0.5377442703347997, 0.33031361918026264, 0.2699224169453975], "isController": false}, {"data": ["Query ehr_id #3", 50, 0, 0.0, 6.3, 3, 30, 5.0, 9.899999999999999, 11.0, 30.0, 0.5375939445418086, 0.314996451879966, 0.25462213193630584], "isController": false}, {"data": ["Query ehr_id #2", 50, 0, 0.0, 558.5600000000001, 382, 1107, 571.0, 635.6, 690.8999999999995, 1107.0, 0.5333333333333333, 0.4875, 0.2359375], "isController": false}, {"data": ["Query ehr_id #1", 50, 0, 0.0, 26.060000000000002, 15, 113, 22.5, 35.8, 42.699999999999974, 113.0, 0.5350111282314671, 0.4738819270565828, 0.22100557347842834], "isController": false}, {"data": ["Query magnitude #1", 50, 0, 0.0, 10.200000000000001, 6, 53, 9.0, 13.899999999999999, 16.0, 53.0, 0.5369415807560138, 0.35813583950816147, 0.2522157229918385], "isController": false}, {"data": ["Query magnitude #2", 50, 0, 0.0, 635.3000000000001, 431, 3216, 546.5, 633.8, 1379.3999999999933, 3216.0, 0.5347765168935902, 0.4021268730547504, 0.29663384921441327], "isController": false}, {"data": ["Query magnitude #7", 50, 0, 0.0, 15.980000000000002, 10, 24, 16.0, 21.0, 23.0, 24.0, 0.555895269331258, 0.45383637222747236, 0.34417734448829845], "isController": false}, {"data": ["Query magnitude #8", 50, 0, 0.0, 16.620000000000005, 10, 48, 16.0, 22.9, 27.349999999999987, 48.0, 0.5559508984166519, 0.4609940506304483, 0.35289851950275747], "isController": false}, {"data": ["Query magnitude #5", 50, 0, 0.0, 17.02, 11, 34, 16.0, 23.9, 31.799999999999983, 34.0, 0.5558211145324989, 0.4499762733861734, 0.34033187383972346], "isController": false}, {"data": ["Query magnitude #6", 50, 0, 0.0, 20.58000000000001, 12, 42, 20.0, 25.0, 34.14999999999997, 42.0, 0.5558458306004247, 0.4972214656542861, 0.3875721904772492], "isController": false}, {"data": ["Query magnitude #3", 50, 0, 0.0, 16.16, 10, 55, 15.0, 21.799999999999997, 24.89999999999999, 55.0, 0.5537589155185398, 0.41585996682984094, 0.306622368260754], "isController": false}, {"data": ["Query magnitude #4", 50, 0, 0.0, 2228.3400000000006, 1723, 2755, 2204.0, 2558.6, 2703.9, 2755.0, 0.5435196156229278, 0.45434842868479125, 0.3471306920091746], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2205, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
