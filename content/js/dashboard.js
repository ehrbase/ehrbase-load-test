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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9114292206316746, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Query participation #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query participation #1"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Laboratory Test Report'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, time_created #1"], "isController": false}, {"data": [0.499, 500, 1500, "Query ehr_id, time_created #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #5"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query ehr_id, start_time, magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Create 'Blood Pressure'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id, start_time, magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Blood Pressure'"], "isController": false}, {"data": [0.5, 500, 1500, "Setup - Upload template 'International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #1"], "isController": false}, {"data": [0.988, 500, 1500, "Query start_time #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query start_time #3"], "isController": false}, {"data": [0.499, 500, 1500, "Query start_time #4"], "isController": false}, {"data": [1.0, 500, 1500, "Setup - Upload template 'Laboratory Test Report'"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create 'Corona Anamnese'"], "isController": false}, {"data": [1.0, 500, 1500, "Composition - Get composition by version ID"], "isController": false}, {"data": [0.5, 500, 1500, "Get existing EHR Id"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #2"], "isController": false}, {"data": [0.999, 500, 1500, "Composition - Create International Patient Summary'"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_status #3"], "isController": false}, {"data": [0.778, 500, 1500, "Query composer #4"], "isController": false}, {"data": [1.0, 500, 1500, "Create EHR"], "isController": false}, {"data": [1.0, 500, 1500, "Query composer #3"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #4"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #3"], "isController": false}, {"data": [0.713, 500, 1500, "Query ehr_id #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query ehr_id #1"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #1"], "isController": false}, {"data": [0.63, 500, 1500, "Query magnitude #2"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #7"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #8"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #5"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #6"], "isController": false}, {"data": [1.0, 500, 1500, "Query magnitude #3"], "isController": false}, {"data": [0.0, 500, 1500, "Query magnitude #4"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 22005, 0, 0.0, 200.0072256305381, 1, 3422, 13.0, 585.9000000000015, 1278.9500000000007, 2239.980000000003, 24.646128412993175, 165.70949203025913, 217.15180010959435], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Query participation #2", 500, 0, 0.0, 8.561999999999989, 4, 27, 8.0, 12.0, 14.0, 22.0, 0.570597781059349, 6.107796780031132, 0.20728747515046664], "isController": false}, {"data": ["Query participation #1", 500, 0, 0.0, 7.959999999999991, 5, 41, 7.0, 10.0, 12.0, 20.970000000000027, 0.5705769445832848, 6.126369349005941, 0.2418265565909625], "isController": false}, {"data": ["Composition - Create 'Laboratory Test Report'", 500, 0, 0.0, 22.282, 14, 300, 20.0, 27.900000000000034, 32.0, 53.98000000000002, 0.5672452189736719, 0.30569199378753037, 6.31614256517364], "isController": false}, {"data": ["Query ehr_id, time_created #2", 500, 0, 0.0, 43.10799999999999, 25, 77, 44.0, 53.0, 54.94999999999999, 61.98000000000002, 0.5704018481019878, 2.372403780338248, 0.23841014744887773], "isController": false}, {"data": ["Query ehr_id, time_created #3", 500, 0, 0.0, 2.683999999999999, 1, 46, 2.0, 4.0, 5.0, 8.0, 0.5704402429619083, 0.3565251518511927, 0.24232568914885752], "isController": false}, {"data": ["Query ehr_id, time_created #1", 500, 0, 0.0, 37.66199999999996, 22, 77, 39.0, 46.0, 48.0, 52.0, 0.5703855806525211, 2.340497019735341, 0.20832442105863563], "isController": false}, {"data": ["Query ehr_id, time_created #4", 500, 0, 0.0, 777.3020000000009, 565, 1697, 786.5, 917.0, 931.95, 968.98, 0.5700773252884022, 2.411137593578193, 0.2783580689884776], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #1", 500, 0, 0.0, 8.754000000000001, 5, 56, 8.0, 11.0, 13.0, 25.99000000000001, 0.5701325786298346, 0.8479608566926152, 0.29230430056705387], "isController": false}, {"data": ["Query start_time #5", 500, 0, 0.0, 3.4859999999999998, 1, 27, 3.0, 5.0, 6.0, 10.990000000000009, 0.5680049620913489, 0.5480360376428248, 0.31173709833529106], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #5", 500, 0, 0.0, 12.566000000000003, 7, 35, 13.0, 16.0, 17.0, 22.0, 0.5703816766027154, 0.9296552912596994, 0.3737559619144747], "isController": false}, {"data": ["Setup - Upload template 'Corona Anamnese'", 1, 0, 0.0, 641.0, 641, 641, 641.0, 641.0, 641.0, 641.0, 1.5600624024960998, 0.66576881825273, 1845.2293169851794], "isController": false}, {"data": ["Query start_time #6", 500, 0, 0.0, 4.737999999999995, 3, 32, 4.0, 6.0, 9.0, 14.980000000000018, 0.5680127053081923, 0.5701427529530981, 0.33448404423910155], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #4", 500, 0, 0.0, 13.424000000000001, 8, 37, 14.0, 16.0, 18.0, 25.99000000000001, 0.5703758206282119, 0.8955791596082658, 0.34033166640999757], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #3", 500, 0, 0.0, 8.239999999999991, 4, 73, 8.0, 10.0, 12.0, 17.99000000000001, 0.5703751699718007, 0.8828560980520548, 0.3269631101303193], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #2", 500, 0, 0.0, 1995.6540000000002, 1533, 2510, 1995.5, 2229.9, 2316.75, 2397.91, 0.5691558508083152, 0.8692966315080125, 0.3145920034741273], "isController": false}, {"data": ["Composition - Create 'Blood Pressure'", 500, 0, 0.0, 19.28399999999999, 12, 76, 17.0, 26.0, 31.94999999999999, 50.98000000000002, 0.5672085398917767, 0.3063147681251489, 4.574226682056925], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #7", 500, 0, 0.0, 17.285999999999998, 11, 41, 18.0, 21.0, 22.0, 27.0, 0.5703901354448416, 1.0327180772604847, 0.4768105038484223], "isController": false}, {"data": ["Query ehr_id, start_time, magnitude #6", 500, 0, 0.0, 12.49599999999999, 7, 48, 13.0, 16.0, 17.0, 21.980000000000018, 0.5703849299738422, 0.9658666685299241, 0.40996416841869904], "isController": false}, {"data": ["Setup - Upload template 'Blood Pressure'", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 4.753268494897959, 1391.681281887755], "isController": false}, {"data": ["Setup - Upload template 'International Patient Summary'", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 0.6918547016616314, 2888.8902001510573], "isController": false}, {"data": ["Query start_time #1", 500, 0, 0.0, 2.3399999999999985, 1, 20, 2.0, 3.0, 4.0, 8.0, 0.5680023810659814, 0.4775879395486426, 0.24129007398799016], "isController": false}, {"data": ["Query start_time #2", 500, 0, 0.0, 409.94599999999986, 316, 569, 411.0, 479.0, 490.0, 507.99, 0.5677888824665657, 0.4994989617980284, 0.26393311333406766], "isController": false}, {"data": ["Query start_time #3", 500, 0, 0.0, 3.2359999999999984, 1, 19, 3.0, 4.0, 6.0, 11.0, 0.5680223846261333, 0.5147702860674334, 0.2784640987132021], "isController": false}, {"data": ["Query start_time #4", 500, 0, 0.0, 1154.6700000000008, 925, 1815, 1150.0, 1339.0, 1373.6, 1398.99, 0.567387475715816, 0.5369125624693611, 0.30087050714227354], "isController": false}, {"data": ["Setup - Upload template 'Laboratory Test Report'", 1, 0, 0.0, 59.0, 59, 59, 59.0, 59.0, 59.0, 59.0, 16.949152542372882, 7.928363347457627, 1116.0785222457628], "isController": false}, {"data": ["Composition - Create 'Corona Anamnese'", 500, 0, 0.0, 43.611999999999995, 28, 732, 42.0, 52.0, 59.0, 88.96000000000004, 0.5667469180302598, 0.3060654742878258, 25.924243789587273], "isController": false}, {"data": ["Composition - Get composition by version ID", 500, 0, 0.0, 40.00599999999999, 27, 196, 40.0, 47.0, 52.0, 79.96000000000004, 0.5675575049263992, 128.43593549226534, 0.17625320953769036], "isController": false}, {"data": ["Get existing EHR Id", 1, 0, 0.0, 552.0, 552, 552, 552.0, 552.0, 552.0, 552.0, 1.8115942028985508, 0.9500254755434782, 0.7465749547101449], "isController": false}, {"data": ["Query composer #2", 500, 0, 0.0, 2.3740000000000006, 1, 16, 2.0, 3.0, 5.0, 7.0, 0.5708440271447752, 0.6204584005977879, 0.24584200778402918], "isController": false}, {"data": ["Query composer #1", 500, 0, 0.0, 3.4500000000000015, 2, 23, 3.0, 5.0, 6.0, 11.980000000000018, 0.5708388133859419, 0.5858902274107665, 0.21127725612624215], "isController": false}, {"data": ["Query ehr_status #1", 500, 0, 0.0, 2.3159999999999985, 1, 17, 2.0, 3.0, 4.0, 11.960000000000036, 0.570614711816746, 0.3237569800444623, 0.22233913087390783], "isController": false}, {"data": ["Query ehr_status #2", 500, 0, 0.0, 126.21200000000013, 87, 446, 124.0, 151.0, 156.0, 211.64000000000033, 0.5705463437678652, 0.5198434948588069, 0.1872105190488308], "isController": false}, {"data": ["Composition - Create International Patient Summary'", 500, 0, 0.0, 171.15800000000004, 110, 634, 169.0, 195.0, 251.89999999999998, 386.98, 0.5673218098927307, 0.3063759383502736, 167.82531509053322], "isController": false}, {"data": ["Query ehr_status #3", 500, 0, 0.0, 2.450000000000001, 1, 29, 2.0, 3.0, 4.949999999999989, 6.990000000000009, 0.570834903129317, 0.3176607042961035, 0.24026351879759336], "isController": false}, {"data": ["Query composer #4", 500, 0, 0.0, 477.1960000000001, 350, 1536, 486.5, 551.0, 563.0, 633.7800000000002, 0.5706257824706042, 0.6201320271138547, 0.24630526938672564], "isController": false}, {"data": ["Create EHR", 500, 0, 0.0, 13.148000000000003, 8, 359, 11.0, 17.0, 21.94999999999999, 42.940000000000055, 0.5665420651817976, 0.2395631974841, 0.41218148296917895], "isController": false}, {"data": ["Query composer #3", 500, 0, 0.0, 3.160000000000001, 1, 34, 3.0, 4.0, 5.0, 10.990000000000009, 0.570846634059907, 0.6076394835207993, 0.23302137991898544], "isController": false}, {"data": ["Query ehr_id #4", 500, 0, 0.0, 3.816000000000001, 2, 15, 3.0, 5.0, 6.949999999999989, 12.0, 0.5679939928955311, 0.34889474758914946, 0.28510635971513965], "isController": false}, {"data": ["Query ehr_id #3", 500, 0, 0.0, 4.120000000000001, 2, 33, 4.0, 5.0, 6.0, 9.990000000000009, 0.5679739913349887, 0.332797260547845, 0.26901111894284135], "isController": false}, {"data": ["Query ehr_id #2", 500, 0, 0.0, 528.4639999999997, 373, 803, 528.0, 637.0, 654.0, 679.97, 0.5674647490897866, 0.5180554160538048, 0.2510366516969466], "isController": false}, {"data": ["Query ehr_id #1", 500, 0, 0.0, 17.64799999999999, 7, 113, 17.0, 29.0, 34.0, 49.99000000000001, 0.567677359437409, 0.5028157861423144, 0.23449953422072656], "isController": false}, {"data": ["Query magnitude #1", 500, 0, 0.0, 6.841999999999998, 4, 40, 7.0, 9.0, 10.0, 13.990000000000009, 0.5680217393280076, 0.37886606246194254, 0.26681489903981603], "isController": false}, {"data": ["Query magnitude #2", 500, 0, 0.0, 537.4160000000004, 448, 3422, 525.5, 576.0, 612.75, 794.7700000000002, 0.5677463309393364, 0.42691862775711814, 0.3149217929429131], "isController": false}, {"data": ["Query magnitude #7", 500, 0, 0.0, 12.553999999999997, 7, 42, 13.0, 15.0, 16.94999999999999, 27.980000000000018, 0.5701124261704409, 0.46544334792821146, 0.3529797638594331], "isController": false}, {"data": ["Query magnitude #8", 500, 0, 0.0, 12.487999999999994, 7, 42, 13.0, 15.0, 16.94999999999999, 27.970000000000027, 0.5701143763461826, 0.47370714450233004, 0.36188900842286975], "isController": false}, {"data": ["Query magnitude #5", 500, 0, 0.0, 12.591999999999992, 8, 39, 13.0, 15.0, 17.0, 27.0, 0.5700987753138109, 0.46153504368666914, 0.34907415246265566], "isController": false}, {"data": ["Query magnitude #6", 500, 0, 0.0, 15.435999999999979, 10, 43, 16.0, 18.900000000000034, 21.0, 29.980000000000018, 0.5701078758122612, 0.5099793107851868, 0.39751662434565865], "isController": false}, {"data": ["Query magnitude #3", 500, 0, 0.0, 11.666000000000013, 7, 38, 12.0, 14.0, 16.0, 22.980000000000018, 0.5699558056268317, 0.42802345168655626, 0.3155907634672008], "isController": false}, {"data": ["Query magnitude #4", 500, 0, 0.0, 2184.4900000000002, 1727, 2991, 2175.0, 2477.0, 2586.85, 2683.94, 0.5687971532840073, 0.4748345297981453, 0.3632747443825593], "isController": false}]}, function(index, item){
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
