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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9108838900249944, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.5, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.001, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.982, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.496, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [1.0, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.768, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.717, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.618, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 199.84380822540317, 1, 4213, 13.0, 595.9000000000015, 1294.8500000000022, 2240.0, 24.614451888002847, 165.50920553095293, 216.82462987786735], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 9.044000000000004, 4, 39, 8.0, 12.0, 15.0, 26.0, 0.5703276760630052, 6.1178481711445, 0.20607542982745308], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 8.162000000000003, 5, 39, 8.0, 10.0, 12.0, 17.0, 0.5703062088096341, 6.123462418816911, 0.2405979318415644], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 21.001999999999985, 13, 247, 19.0, 27.0, 31.94999999999999, 51.950000000000045, 0.5660712729018286, 0.30505934691225106, 6.301965342852388], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.96599999999997, 26, 111, 45.0, 54.0, 56.0, 63.0, 0.570148181512375, 2.3713487354113334, 0.23719055207448414], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.5760000000000005, 1, 21, 2.0, 4.0, 4.0, 8.990000000000009, 0.5701858920045113, 0.35636618250281954, 0.24110399534956387], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 38.88999999999996, 22, 69, 40.0, 48.0, 49.0, 53.0, 0.5701429804566389, 2.339501543947191, 0.20712225461901337], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 780.9839999999996, 577, 1300, 792.5, 917.9000000000001, 936.0, 975.9100000000001, 0.5698155051357471, 2.4100302272880088, 0.2771173062085958], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.411999999999988, 5, 27, 8.0, 10.0, 12.0, 17.0, 0.5697538207691221, 0.8473975283509502, 0.29099731275610435], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.497999999999998, 2, 23, 3.0, 4.0, 6.0, 15.980000000000018, 0.5670065682040861, 0.5470727435406612, 0.3100817169866096], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.525999999999991, 7, 65, 13.0, 15.0, 17.0, 23.99000000000001, 0.5701332287328903, 0.929250350346869, 0.37247961916240585], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 649.0, 649, 649, 649.0, 649.0, 649.0, 649.0, 1.5408320493066257, 0.6575621147919877, 1822.4807997881355], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.602000000000002, 3, 20, 4.0, 6.0, 8.0, 13.0, 0.5670149272349744, 0.5691412332121055, 0.3327890344416207], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.334000000000005, 8, 26, 14.0, 16.0, 17.94999999999999, 22.99000000000001, 0.5701247775088056, 0.8951849826853105, 0.3390683491238893], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.300000000000002, 5, 60, 8.0, 11.0, 12.0, 17.0, 0.5701215271047176, 0.8824634965439233, 0.3257041927307225], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1996.9539999999986, 1473, 2781, 1993.0, 2242.9, 2305.9, 2456.7300000000005, 0.5688107418770981, 0.8687695315388492, 0.3132902914244955], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 17.731999999999996, 11, 77, 16.0, 23.0, 28.0, 47.940000000000055, 0.5660302599776984, 0.3056784509449875, 4.563618971070193], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.381999999999987, 11, 68, 17.0, 21.0, 23.0, 33.97000000000003, 0.5701416802075316, 1.0322682374069956, 0.4754892528293281], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.512000000000002, 8, 68, 13.0, 15.0, 17.0, 25.970000000000027, 0.5701423303313439, 0.965455860150928, 0.40867624068672503], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 87.0, 87, 87, 87.0, 87.0, 87.0, 87.0, 11.494252873563218, 5.354256465517242, 1567.6185344827588], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 699.0, 699, 699, 699.0, 699.0, 699.0, 699.0, 1.4306151645207439, 0.6552329220314735, 2735.97047120887], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.278000000000002, 1, 18, 2.0, 3.0, 4.0, 8.0, 0.566934562145099, 0.47669009570989274, 0.23972916543830844], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 413.63000000000017, 319, 598, 417.0, 481.90000000000003, 496.9, 539.97, 0.5667199383408708, 0.49855858325682617, 0.2623293464585671], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.152000000000002, 1, 39, 3.0, 4.0, 5.0, 11.990000000000009, 0.5669776350002098, 0.5138234817189401, 0.27684454833994615], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1165.1800000000012, 946, 1911, 1152.5, 1345.0, 1383.95, 1495.7600000000002, 0.566365586720766, 0.5359455600902561, 0.2992224437655609], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 55.0, 55, 55, 55.0, 55.0, 55.0, 55.0, 18.18181818181818, 8.504971590909092, 1197.2123579545455], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 42.71199999999997, 27, 720, 40.0, 48.900000000000034, 56.94999999999999, 105.98000000000002, 0.5655769507031818, 0.30543364622935504, 25.869622282261357], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 41.52600000000001, 28, 173, 41.0, 49.900000000000034, 56.94999999999999, 100.93000000000006, 0.5663816256738525, 128.16983884035628, 0.17478182979779042], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 293.0, 293, 293, 293.0, 293.0, 293.0, 293.0, 3.4129692832764507, 1.7898090870307168, 1.3998506825938568], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3559999999999977, 1, 18, 2.0, 3.0, 5.0, 11.0, 0.5705027270030351, 0.6200874366741973, 0.24458075893977774], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.474000000000001, 2, 49, 3.0, 5.0, 7.0, 12.990000000000009, 0.5704975194767854, 0.5855399345411146, 0.21003668441674617], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.2199999999999998, 1, 13, 2.0, 3.0, 4.0, 9.0, 0.5703432896260259, 0.32360297975851665, 0.22111941990384013], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 123.64199999999995, 86, 330, 123.0, 148.90000000000003, 153.0, 169.97000000000003, 0.5702801900629818, 0.5196009934851191, 0.18600935886819914], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 163.33999999999997, 108, 666, 163.0, 191.0, 234.95, 358.9000000000001, 0.5661545987039589, 0.3057455987141497, 167.47892454121663], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.328000000000002, 1, 13, 2.0, 3.0, 4.0, 8.0, 0.570493613894486, 0.3174707821695644, 0.23900562535227982], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 476.2380000000003, 350, 739, 494.0, 547.0, 565.0, 605.96, 0.5702795396247333, 0.6197557449960821, 0.24504198968250257], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 12.697999999999986, 7, 367, 10.0, 15.0, 20.0, 60.97000000000003, 0.5653601570344372, 0.23906342577725712, 0.41021737956697935], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.026000000000001, 1, 25, 3.0, 4.0, 6.0, 11.0, 0.570505330801811, 0.6072761822011464, 0.23176779063823572], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.7840000000000025, 2, 16, 4.0, 5.0, 6.0, 10.0, 0.5669274911077423, 0.348239640533955, 0.28346374555387116], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.2299999999999995, 2, 36, 4.0, 6.0, 7.0, 11.0, 0.5669075645877788, 0.33217240112565166, 0.2673987829061496], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 528.7880000000007, 384, 986, 529.0, 639.0, 652.8499999999999, 859.7500000000002, 0.566322606805612, 0.5170127204552327, 0.24942528873958109], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 18.597999999999992, 6, 150, 16.0, 32.0, 39.0, 57.99000000000001, 0.5664875055515776, 0.5017618823586727, 0.23290160140352945], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.844000000000001, 4, 35, 7.0, 9.0, 10.0, 14.990000000000009, 0.5670213574264488, 0.37819881554908646, 0.2652375294992861], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 545.6199999999997, 367, 4213, 529.0, 592.9000000000001, 621.55, 824.5600000000004, 0.5668073104539674, 0.4262125283687059, 0.3132938844892046], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.375999999999998, 8, 25, 13.0, 15.0, 16.0, 20.0, 0.5697388886673237, 0.4651383895760573, 0.35163572034936386], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.319999999999997, 7, 42, 12.0, 15.0, 17.0, 23.0, 0.5697427839227702, 0.47339838893832986, 0.360540355451128], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.379999999999999, 8, 29, 13.0, 15.0, 17.94999999999999, 23.0, 0.5697291507617279, 0.46123580662253166, 0.34773507736921866], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.354000000000001, 9, 48, 16.0, 19.0, 20.0, 25.99000000000001, 0.5697310983162167, 0.5096422715406782, 0.39614115429799446], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.89799999999999, 7, 34, 12.0, 15.0, 16.0, 21.0, 0.5695208393370321, 0.42769680219743916, 0.31423757248576484], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2161.6920000000014, 1761, 3091, 2133.5, 2470.7000000000003, 2549.0, 2682.8, 0.5684014278243866, 0.47450417632949093, 0.3619118466225587], "isController": false}]}, function(index, item){
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
