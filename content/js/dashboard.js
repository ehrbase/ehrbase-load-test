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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9112928879800045, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.976, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.809, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.714, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.601, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 199.75110202226782, 1, 3439, 14.0, 595.0, 1290.9500000000007, 2260.0, 24.746045187256886, 166.3754406624164, 218.03214557517546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.710000000000006, 4, 53, 8.0, 11.0, 15.0, 29.0, 0.5726261781783616, 6.123554745209982, 0.20802435379135795], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.123999999999999, 5, 37, 8.0, 10.0, 11.0, 24.930000000000064, 0.5726097836107628, 6.148196243393515, 0.2426881309444053], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 20.944, 13, 243, 19.0, 26.0, 30.0, 48.99000000000001, 0.5693690821201027, 0.30683655691128664, 6.339791283528722], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.462, 26, 108, 44.0, 53.0, 55.94999999999999, 66.98000000000002, 0.5723960843528662, 2.3806981672449776, 0.23924367588186204], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.4919999999999995, 1, 12, 2.0, 4.0, 4.0, 8.0, 0.5724301606582489, 0.35776885041140555, 0.2431710155140022], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.358000000000004, 24, 100, 39.0, 47.0, 49.0, 59.98000000000002, 0.572384289653925, 2.348698441054149, 0.20905441829157026], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 772.418, 576, 1193, 771.0, 910.0, 926.95, 983.98, 0.5720332923376141, 2.419410340931842, 0.2793131310242256], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 9.21999999999999, 6, 59, 9.0, 11.0, 13.0, 27.970000000000027, 0.5722185600234381, 0.8510633465973595, 0.2933737734495166], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4020000000000024, 1, 24, 3.0, 5.0, 6.0, 10.990000000000009, 0.5700623762252066, 0.5500211208110392, 0.3128662650767247], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 13.592000000000004, 9, 38, 14.0, 17.0, 18.0, 21.99000000000001, 0.5723515291515804, 0.9328659200722536, 0.37504675396553755], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 647.0, 647, 647, 647.0, 647.0, 647.0, 647.0, 1.5455950540958268, 0.6595947642967542, 1828.11745314915], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.460000000000003, 2, 22, 4.0, 6.0, 7.0, 11.0, 0.570075375366131, 0.5722131580237539, 0.3356986829548603], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 14.998000000000005, 9, 77, 15.0, 18.0, 20.0, 34.0, 0.5723318746501621, 0.8986504700561686, 0.3414988041125479], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.725999999999983, 5, 24, 9.0, 11.0, 12.0, 16.99000000000001, 0.5723305643980628, 0.8858827583700484, 0.3280840247086551], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1958.41, 1548, 2496, 1944.0, 2234.9, 2295.9, 2414.8, 0.5711700761712414, 0.8723730460271695, 0.3157053350712135], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 18.09400000000002, 12, 225, 16.0, 22.0, 27.0, 42.98000000000002, 0.5693262934239398, 0.30745843775726434, 4.591305206147358], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 18.291999999999987, 11, 36, 19.0, 22.0, 25.0, 30.0, 0.5723790477215307, 1.0363190961676934, 0.47847311020471706], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 13.771999999999997, 9, 42, 14.0, 17.0, 18.94999999999999, 29.970000000000027, 0.5723626673016076, 0.9692156885751833, 0.4113856671230305], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 5.17578125, 1515.3862847222222], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 595.0, 595, 595, 595.0, 595.0, 595.0, 595.0, 1.680672268907563, 0.7697610294117647, 3214.1938025210084], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.2520000000000007, 1, 15, 2.0, 3.0, 4.0, 8.0, 0.5699999886000002, 0.47926756853964864, 0.24213866703222667], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 416.3739999999999, 309, 574, 420.0, 484.0, 500.0, 526.99, 0.5698044658994819, 0.5012721240828997, 0.26487004469546227], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.108000000000002, 1, 13, 3.0, 4.0, 5.0, 10.990000000000009, 0.5700740754253608, 0.5166296308542332, 0.2794699080698546], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1174.7500000000007, 924, 1485, 1171.0, 1347.9, 1377.8, 1431.0, 0.569452733145338, 0.5388668929861646, 0.3019656582987486], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.796223958333334, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.403999999999975, 27, 765, 41.0, 49.0, 54.94999999999999, 101.96000000000004, 0.5688398624772748, 0.30719574604485644, 26.01997964690972], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 42.34600000000001, 28, 191, 42.0, 51.0, 57.94999999999999, 85.99000000000001, 0.5696493124902448, 128.90930296428414, 0.176902813839744], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 1.6916582661290323, 1.3293850806451613], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.212, 1, 17, 2.0, 3.0, 4.0, 7.0, 0.5728761476141427, 0.6226671409126375, 0.2467171690408564], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.3720000000000008, 2, 44, 3.0, 4.0, 6.0, 12.990000000000009, 0.5728695839477359, 0.5879745436807329, 0.2120288792150312], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.1519999999999984, 1, 15, 2.0, 3.0, 4.0, 10.990000000000009, 0.5726438853658564, 0.3249082982398072, 0.22312979517673506], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.70399999999994, 83, 435, 123.0, 147.0, 152.0, 172.93000000000006, 0.572581587150353, 0.521697871886015, 0.1878783332837096], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 162.48799999999994, 111, 526, 163.0, 189.90000000000003, 209.95, 341.85000000000014, 0.5694170649739037, 0.3075074579400085, 168.44513410341298], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.3400000000000007, 1, 19, 2.0, 3.0, 4.0, 9.980000000000018, 0.5728663021709341, 0.3187911461221534, 0.24111853148014906], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 468.5380000000002, 352, 666, 470.0, 542.9000000000001, 558.9, 598.96, 0.5726537231654465, 0.6223359075072612, 0.2471806109757103], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.667999999999987, 7, 324, 11.0, 16.0, 20.94999999999999, 45.97000000000003, 0.5686528954099476, 0.24045576534424543, 0.4137171944144638], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.0159999999999996, 2, 20, 3.0, 4.0, 5.0, 10.0, 0.5728781167433941, 0.6098019016116207, 0.23385063749876833], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.7559999999999962, 2, 16, 3.0, 5.0, 6.0, 11.990000000000009, 0.5699934906743366, 0.3501229547208571, 0.28611001387364154], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.028000000000002, 2, 24, 4.0, 5.0, 6.0, 12.970000000000027, 0.5699785460075283, 0.3339718043012861, 0.2699605418102063], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 521.5419999999997, 373, 790, 529.0, 631.8000000000001, 650.9, 700.94, 0.5694884057855466, 0.5199028723286723, 0.2519318826375514], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 16.030000000000005, 5, 114, 15.0, 26.900000000000034, 32.0, 47.99000000000001, 0.569766156574019, 0.504665921887339, 0.23536238694415038], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 7.656000000000002, 4, 51, 7.0, 9.0, 11.0, 15.0, 0.5700857751057224, 0.3802427582003988, 0.267784431470559], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 554.7180000000001, 448, 3439, 535.0, 625.8000000000001, 657.95, 744.7400000000002, 0.5697869338739472, 0.42845306551068296, 0.3160536898832051], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 13.659999999999998, 9, 43, 14.0, 16.0, 17.0, 25.99000000000001, 0.5721962953723052, 0.46714463176879606, 0.35426997193949367], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 13.505999999999997, 9, 49, 14.0, 16.0, 18.0, 22.99000000000001, 0.572206117798929, 0.4754451692070711, 0.3632167739934608], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 13.866000000000003, 9, 67, 14.0, 17.0, 18.0, 27.99000000000001, 0.5721773063036774, 0.4632177606696763, 0.35034684673086497], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 16.327999999999992, 10, 40, 17.0, 20.0, 21.0, 26.99000000000001, 0.5721877828753351, 0.5118398526502022, 0.39896687204393483], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 13.437999999999995, 8, 39, 14.0, 16.0, 18.0, 27.0, 0.5720228214224835, 0.429575732103408, 0.3167352927212384], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2189.916, 1702, 2805, 2164.0, 2506.9, 2588.85, 2699.92, 0.5708955181276454, 0.4765862546056996, 0.36461491099167975], "isController": false}]}, function(index, item){
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
