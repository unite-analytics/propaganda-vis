/**
* Created with JetBrains WebStorm.
* User: Digvijay.Upadhyay
* Date: 4/9/14
* Time: 3:31 PM
* To change this template use File | Settings | File Templates.
*/

var G_NO_OF_NEXT_CHARTS = 10;
var comboSelectedValue;
var comboSelectedValueText;
var global = {};
var streamgraphData = [];
function bootstrap() {
    global.dataProvider = new clsDataProvider({});
    global.dataProvider.loadData(handleOnLoadData);
}

function handleOnLoadData() {

    //Add combo box
    var select = d3.select("#combo-box-cntnr")
        .append("select")
        .attr("id", "pdf-combo-box")
        .on("change", function () {
            if (global.streamLineChart) {
                comboSelectedValue = this.options[this.selectedIndex].label;
                comboSelectedValueText = this.options[this.selectedIndex].value;
                var data = generateDataForStreamGraph(comboSelectedValueText);
                global.streamLineChart.draw(data);
            }
        });


    options = select.selectAll("option")
        .data(global.dataProvider.getVideoList())
        .enter()
        .append("option")
        .attr("value", function (d) { return d._timestamp; })
        .text(function (d) { return d.pdf; });

    comboSelectedValue = document.getElementById("pdf-combo-box").options[0].label;
    comboSelectedValueText = document.getElementById("pdf-combo-box").options[0].value;
   

    var openSelectedVideo = d3.select("#combo-box-doc")
        .on("click", function () {
            console.log(comboSelectedValue)
            onChartBarClick(comboSelectedValue);
        })

    //$( "#pdf-combo-box" ).combobox();
    $("#pdf-combo-box").select2()
    $("#pdf-combo-box")
        .on("change", function () {
            if (global.streamLineChart) {
                comboSelectedValue = this.options[this.selectedIndex].label;
                comboSelectedValueText = this.options[this.selectedIndex].value;

                var openSelectedVideo = d3.select("#combo-box-doc")
                    .on("click", function () {
                        console.log(comboSelectedValue + "!")
                        onChartBarClick(comboSelectedValue);
                    })

                //                console.log(comboSelectedValue);
                streamgraphData = [];
                var data = generateDataForStreamGraph(comboSelectedValueText);
                d3.select("#svgId").remove();
                global.streamLineChart.draw(data);
                global.comparisonChart.redrawChart();
            }
        });

    //draw the comparison
    global.comparisonChart = new clsTimelineComparisonChart({
        renderTo: d3.select('#time-line-comparison'),
        dataProvider: global.dataProvider
    });
    global.comparisonChart.displayNextNComparision(G_NO_OF_NEXT_CHARTS);

    //Handle load more charts event
    d3.select("#load-next-charts").on("click", function () {
        var moreToLoad = global.comparisonChart.displayNextNComparision(G_NO_OF_NEXT_CHARTS);
        if (moreToLoad === false) {
            d3.select(this).style("display", "none")
        }
    });


    //create streamline graph
    global.streamLineChart = new clsStreamLineGraph({
        renderTo: d3.select('#stream-line-chart-cntnr'),
        dataProvider: global.dataProvider,
        width: 930,
        height: 200,
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        handleOnChartHover: function (d) {
            global.comparisonChart.displayLineForObj(d);
        },
        handleOnChartMouseOut: function () {
            global.comparisonChart.hideLines();
        }
    });

    var data = global.comparisonChart.getStreamGraphData();

    //global.streamLineChart.draw(global.dataProvider.streamgraphData);

    var data = generateDataForStreamGraph(comboSelectedValueText);
    global.streamLineChart.draw(data);



    function generateDataForStreamGraph(selectedItem) {
        //debugger;
        // var arr = global.dataProvider.countIncidents(selectedItem);
        //debugger;
        // return arr;
        //        function L_getDataForIncidentType(p_type){
        //            var result = [];
        //            for(index = 1; index <= 14; index++){
        //                var randomValue = Math.floor((Math.random() * 11));
        //                var obj = {
        //                    type : p_type,
        //                    date : index,
        //                    value : randomValue
        //                };
        //                result.push(obj);
        //            }
        //            return result;
        //        }

        //        var arr1 = L_getDataForIncidentType("attack");
        //        var arr2 = L_getDataForIncidentType("road block");
        //        var arr3 = L_getDataForIncidentType("suicide");
        //        var arr4 = L_getDataForIncidentType("bomb");

        //        //merge all data
        //        var arr = arr1.concat(arr2, arr3, arr4);
        //        return arr;
       
        var eventData = global.dataProvider.getIncidents(),
        listOfVideos = global.dataProvider.getVideoList(),
        test = global.dataProvider.getAssocMatrixData()
        var list = [];
        var incidentsAfterPropaganda = [];
        var incidentsAfterPropagandaData = [];
        var incident;
        for (var index in test) {
           
            incident = test[index];
            if (incident.name == comboSelectedValue) {

                break;
            }
        }

        for (var index in listOfVideos) {
        
            var video = listOfVideos[index];
            video.assocValue = incident[video.pdf];
        }

        listOfVideos.sort(function (a, b) { return d3.descending(a.assocValue, b.assocValue); })
        
        listOfVideos = listOfVideos.slice(0, 10);
        listOfVideos.forEach(function (d) {
           
            incidentsAfterPropaganda = global.dataProvider.countIncidents(d._timestamp);
            incidentsAfterPropagandaData.push(incidentsAfterPropaganda);
        });

      
        
        for (var i = 0; i < 140; i++) {
            var incident = [];
            for (var j = 0; j < incidentsAfterPropagandaData.length; j++) {
                var ii = incidentsAfterPropagandaData[j][i];
                incident.push(ii);
            }

            CountIncident(incident);

        }
      
        return streamgraphData;
    }
    
    function CountIncident(Item) {
       
       
        var date;
        var type;
        var value=0;
        Item.forEach(function (d) {
            
            date = d.date;
            type = d.type;
            value = value + d.value;
        });
        streamgraphData.push({
            "type": type,
            "date": date,
            "value": value
        })
       
    }
}