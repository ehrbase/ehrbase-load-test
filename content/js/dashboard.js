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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.05, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.9, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.5, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.95, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [0.95, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.7, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.7, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.4, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 445, 0, 0.0, 232.06966292134842, 4, 3751, 22.0, 670.4000000000001, 1425.699999999999, 2365.54, 13.72821224741632, 91.35247353655716, 219.32909870044733], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 10, 0, 0.0, 16.900000000000002, 9, 28, 15.5, 27.700000000000003, 28.0, 28.0, 0.6704210244033253, 7.1585776179941005, 0.24355138777152052], "isController": false}, {"data": ["Query participation #1", 10, 0, 0.0, 16.9, 10, 35, 16.0, 33.50000000000001, 35.0, 35.0, 0.6692544505420961, 7.186642517735243, 0.2836488589211618], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 10, 0, 0.0, 82.1, 34, 375, 50.0, 344.5000000000001, 375.0, 375.0, 0.4816491667469415, 0.26010936446392446, 5.363050585203737], "isController": false}, {"data": ["Query ehr_id, time_created #2", 10, 0, 0.0, 43.2, 31, 54, 47.0, 53.9, 54.0, 54.0, 0.6598046978094484, 2.7442462968461334, 0.27577774478754286], "isController": false}, {"data": ["Query ehr_id, time_created #3", 10, 0, 0.0, 5.6, 4, 7, 6.0, 6.9, 7.0, 7.0, 0.6618571712224502, 0.41366073201403136, 0.28116002879078694], "isController": false}, {"data": ["Query ehr_id, time_created #1", 10, 0, 0.0, 37.400000000000006, 27, 53, 35.0, 52.1, 53.0, 53.0, 0.6588049278608604, 2.7040596794914027, 0.24061820607418144], "isController": false}, {"data": ["Query ehr_id, time_created #4", 10, 0, 0.0, 754.4000000000001, 567, 964, 720.5, 955.8000000000001, 964.0, 964.0, 0.6380399413003254, 2.698584947042685, 0.3115429400880495], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 10, 0, 0.0, 14.2, 11, 18, 14.5, 17.9, 18.0, 18.0, 0.6215426689042203, 0.9244233249425073, 0.31866201286593326], "isController": false}, {"data": ["Query start_time #5", 10, 0, 0.0, 12.4, 7, 24, 10.5, 23.700000000000003, 24.0, 24.0, 0.5048465266558966, 0.4870980159531502, 0.27707397263731826], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 10, 0, 0.0, 19.799999999999997, 15, 23, 20.0, 22.8, 23.0, 23.0, 0.659108884787767, 1.074270242881624, 0.4318965446216715], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 0.6636979976671851, 1839.4898789852255], "isController": false}, {"data": ["Query start_time #6", 10, 0, 0.0, 12.2, 7, 23, 11.0, 22.200000000000003, 23.0, 23.0, 0.5051780752715332, 0.5076447650921949, 0.297482792371811], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 10, 0, 0.0, 24.400000000000002, 19, 38, 23.0, 37.1, 38.0, 38.0, 0.6585012511523771, 1.0346958135782958, 0.39291432075595945], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 10, 0, 0.0, 14.3, 8, 17, 15.0, 17.0, 17.0, 17.0, 0.6588049278608604, 1.0197322369721324, 0.37765477798273933], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 10, 0, 0.0, 2085.7, 1456, 2366, 2134.5, 2365.9, 2366.0, 2366.0, 0.5705808513066302, 0.8714730971128609, 0.31537965023393816], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 10, 0, 0.0, 47.2, 34, 77, 45.5, 74.70000000000002, 77.0, 77.0, 0.48063058733057773, 0.25955929179082954, 3.8760228419686626], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 10, 0, 0.0, 24.599999999999998, 20, 27, 25.0, 27.0, 27.0, 27.0, 0.659108884787767, 1.1933475316372264, 0.5509738333772739], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 10, 0, 0.0, 19.4, 14, 25, 19.5, 24.8, 25.0, 25.0, 0.6591957811470006, 1.1162553559657218, 0.4737969676994067], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 89.0, 89, 89, 89.0, 89.0, 89.0, 89.0, 11.235955056179774, 5.2339360955056184, 1532.4130969101125], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 670.0, 670, 670, 670.0, 670.0, 670.0, 670.0, 1.492537313432836, 0.68359375, 2854.39598880597], "isController": false}, {"data": ["Query start_time #1", 10, 0, 0.0, 9.0, 5, 23, 7.0, 21.700000000000003, 23.0, 23.0, 0.507562683991473, 0.42676901456704897, 0.2156150073596589], "isController": false}, {"data": ["Query start_time #2", 10, 0, 0.0, 419.90000000000003, 334, 524, 413.5, 521.9, 524.0, 524.0, 0.49753719090502013, 0.43826029901985175, 0.23127705358475545], "isController": false}, {"data": ["Query start_time #3", 10, 0, 0.0, 8.8, 5, 13, 9.0, 12.8, 13.0, 13.0, 0.5075884472869397, 0.4600020303537891, 0.24883730521293335], "isController": false}, {"data": ["Query start_time #4", 10, 0, 0.0, 1128.4, 1006, 1355, 1131.5, 1343.0, 1355.0, 1355.0, 0.4806074878646609, 0.4547936091219302, 0.2548533846782333], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 60.0, 60, 60, 60.0, 60.0, 60.0, 60.0, 16.666666666666668, 7.796223958333334, 1097.4772135416667], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 10, 0, 0.0, 165.5, 74, 695, 115.5, 638.3000000000002, 695.0, 695.0, 0.46585297680052173, 0.251578804854188, 21.309134212242615], "isController": false}, {"data": ["Composition - Get composition by version ID", 10, 0, 0.0, 88.4, 56, 190, 75.0, 183.10000000000002, 190.0, 190.0, 0.4922955742627874, 111.40446927460248, 0.15288085216363906], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 349.0, 349, 349, 349.0, 349.0, 349.0, 349.0, 2.865329512893983, 1.5026190902578798, 1.1808291547277938], "isController": false}, {"data": ["Query composer #2", 10, 0, 0.0, 6.7, 5, 9, 6.5, 8.9, 9.0, 9.0, 0.6919457514530861, 0.752085567741489, 0.2979961683504013], "isController": false}, {"data": ["Query composer #1", 10, 0, 0.0, 9.200000000000001, 5, 12, 9.5, 11.9, 12.0, 12.0, 0.6917064397869545, 0.7099447931797744, 0.2560124420695857], "isController": false}, {"data": ["Query ehr_status #1", 10, 0, 0.0, 8.0, 5, 22, 6.0, 21.1, 22.0, 22.0, 0.6712760958582265, 0.38087051923206017, 0.26156168188225815], "isController": false}, {"data": ["Query ehr_status #2", 10, 0, 0.0, 173.2, 86, 514, 121.0, 493.9000000000001, 514.0, 514.0, 0.6679580522343197, 0.6085984987642776, 0.21917373588938616], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 10, 0, 0.0, 328.5, 239, 413, 319.5, 411.3, 413.0, 413.0, 0.4843787842092516, 0.26158346451925407, 143.28908331315088], "isController": false}, {"data": ["Query ehr_status #3", 10, 0, 0.0, 7.1, 4, 11, 5.5, 11.0, 11.0, 11.0, 0.6914672935970129, 0.3855740475038031, 0.2910375034573365], "isController": false}, {"data": ["Query composer #4", 10, 0, 0.0, 506.4, 339, 641, 534.5, 640.0, 641.0, 641.0, 0.6764984440535787, 0.7359563151129752, 0.2920042112028142], "isController": false}, {"data": ["Create EHR", 10, 0, 0.0, 72.10000000000001, 22, 359, 46.0, 328.9000000000001, 359.0, 359.0, 0.45968557506665436, 0.19437876367564585, 0.3344392123287671], "isController": false}, {"data": ["Query composer #3", 10, 0, 0.0, 7.6, 4, 10, 7.5, 10.0, 10.0, 10.0, 0.6920415224913494, 0.7366457612456748, 0.28249351211072665], "isController": false}, {"data": ["Query ehr_id #4", 10, 0, 0.0, 10.1, 6, 18, 9.5, 17.5, 18.0, 18.0, 0.5072279989855439, 0.3115687610956125, 0.25460467917829066], "isController": false}, {"data": ["Query ehr_id #3", 10, 0, 0.0, 10.8, 6, 32, 9.0, 29.900000000000006, 32.0, 32.0, 0.5066626133657597, 0.29687262501899986, 0.2399720385570249], "isController": false}, {"data": ["Query ehr_id #2", 10, 0, 0.0, 558.0, 407, 914, 542.5, 885.7, 914.0, 914.0, 0.48442571331686285, 0.44279537857869494, 0.2143016095044325], "isController": false}, {"data": ["Query ehr_id #1", 10, 0, 0.0, 38.6, 20, 132, 26.0, 124.60000000000002, 132.0, 132.0, 0.49642573471008733, 0.4397052161934075, 0.20506649002184274], "isController": false}, {"data": ["Query magnitude #1", 10, 0, 0.0, 16.3, 8, 55, 12.5, 51.100000000000016, 55.0, 55.0, 0.505510059650187, 0.3371712604893337, 0.2374515026286523], "isController": false}, {"data": ["Query magnitude #2", 10, 0, 0.0, 1171.1, 506, 3751, 624.5, 3683.8, 3751.0, 3751.0, 0.4942665085013839, 0.3716652456504547, 0.2741634539343614], "isController": false}, {"data": ["Query magnitude #7", 10, 0, 0.0, 20.400000000000002, 16, 36, 18.0, 34.900000000000006, 36.0, 36.0, 0.6201935003721162, 0.506329849913173, 0.38398699144132975], "isController": false}, {"data": ["Query magnitude #8", 10, 0, 0.0, 18.9, 17, 26, 18.0, 25.5, 26.0, 26.0, 0.620963735717834, 0.5166612332339792, 0.3941664338052658], "isController": false}, {"data": ["Query magnitude #5", 10, 0, 0.0, 20.1, 13, 35, 18.5, 34.300000000000004, 35.0, 35.0, 0.6197706848466068, 0.5017479470096063, 0.37948849550666247], "isController": false}, {"data": ["Query magnitude #6", 10, 0, 0.0, 24.200000000000003, 16, 39, 23.5, 37.900000000000006, 39.0, 39.0, 0.6197706848466068, 0.5544042454291912, 0.4321447939262473], "isController": false}, {"data": ["Query magnitude #3", 10, 0, 0.0, 22.8, 15, 42, 19.0, 41.2, 42.0, 42.0, 0.6061708189367764, 0.4552200778929502, 0.3356434124386252], "isController": false}, {"data": ["Query magnitude #4", 10, 0, 0.0, 2065.2, 1735, 2452, 2078.0, 2422.6, 2452.0, 2452.0, 0.5494807407000385, 0.4593315566789384, 0.35093789493928235], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 445, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
