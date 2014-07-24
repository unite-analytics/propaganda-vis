/**
* Created with JetBrains WebStorm.
* User: Digvijay.Upadhyay
* Date: 4/9/14
* Time: 3:37 PM
* To change this template use File | Settings | File Templates.
*/
var color = d3.scale.category10();
function clsWordHeatChart(pConfig) {

    var me = this;
    me.renderTo = '';

    me.displayNoOfWords = 10;

    me.labelContainer = null;
    me.labelHeatMap = null;
    me.dataProvider = null;

    //-----------------------------------------------------------------------//
    me.constructor = function (pConfig) {
        for (pName in pConfig) {
            me[pName] = pConfig[pName];
        }
    };

    //-----------------------------------------------------------------------//
    me.draw = function (pSelectedDoc) {

        //me.renderTo.html('');

        if (!me.labelContainer)
            me.labelContainer = me.renderTo.append('div').attr("class", "rotate-text-container");

        if (!me.labelHeatMap)
            me.labelHeatMap = me.renderTo.append('div').attr("class", "heat-amp-box-container");

        var documentWordList = me.getDocumentWordList(pSelectedDoc);
        if (!documentWordList) {
            alert('Word list for the selected document is not present in the data.');
        }

        var sortedDocumentWordList = d3.entries(documentWordList)
                                       .sort(function (a, b) { return b.value - a.value })
                                       .slice(2, (me.displayNoOfWords + 2));

        //add titles
        me.addTitles(sortedDocumentWordList);
        //add heat chart boxes
        me.addHeatChartBoxes(sortedDocumentWordList);
    };

    //-----------------------------------------------------------------------//
    me.addTitles = function (pDataArray) {
        me.labelContainer.selectAll("div")
            .data(pDataArray)
            .enter()
            .append("div")
            .attr("class", "rotateText")
            .text(function (d) { return d.key });
    };

    //-----------------------------------------------------------------------//
    me.addHeatChartBoxes = function (pDataArray) {
        me.labelHeatMap.selectAll("div")
            .data(pDataArray)
            .enter()
            .append("div")
            .attr("class", "heat-chart-box")
            .style("opacity", function (d) {
                if (d.value != 0) { return d.value / 100 }
                else { return .2 }
            })
            .text(function (d) { return d.value })
            .on("mouseover", function (d, i) { console.log(d) });
    };

    //-----------------------------------------------------------------------//
    me.getDocumentWordList = function (pSelectedDoc) {
        var wordCountData = me.dataProvider.getWordRepeatationData();
        for (var index in wordCountData) {
            var item = wordCountData[index];
            if (item.pdf == pSelectedDoc)
                return item;
        }
    };

    //-----------------------------------------------------------------------//
    me.constructor.apply(me, arguments);
    return me;
}


/******************************************************************************
clsWordMapHint
******************************************************************************/
function clsWordMapHint(pConfig) {
    var me = this;

    //-----------------------------------------------------------------------//
    me.constructor = function (pConfig) {
        for (pName in pConfig) {
            me[pName] = pConfig[pName];
        }
        me.addHint();
    };

    //-----------------------------------------------------------------------//
    me.addHint = function () {
        me.hintContainer = d3.select('body')
            .append('div')
            .attr("class", "tooltip");

        me.title = me.hintContainer
            .append('div')
            .attr("class", "tooltip-title")
            .text('Top Keywords');

        me.chartCntnr = me.hintContainer
            .append('div');

        me.hide();
    };

    //-----------------------------------------------------------------------//
    me.show = function (pDocumentName) {
        me.hintContainer.style("display", "block");
        me.displayHeatChart(pDocumentName);
        me.updatePosition();
    };

    //-----------------------------------------------------------------------//
    me.updatePosition = function () {
        var currHeight = me.hintContainer.style("height").slice(0, -2),
            currWidth = me.hintContainer.style("width").slice(0, -2);

        me.hintContainer
            .style("top", (d3.event.pageY - currHeight - 50) + "px")
            .style("left", (d3.event.pageX - currWidth / 2) + "px");
    };

    //-----------------------------------------------------------------------//
    me.displayHeatChart = function (pDocumentName) {
        me.chartCntnr.html('');
        delete me.chart;
        me.chart = null;
        if (!me.chart) {
            me.chart = new clsWordHeatChart({
                renderTo: me.chartCntnr,
                dataProvider: global.dataProvider
            });
        }

        me.chart.draw(pDocumentName);
    };

    //-----------------------------------------------------------------------//
    me.hide = function () {
        me.hintContainer.style("display", "none");
    };

    //-----------------------------------------------------------------------//
    me.constructor.apply(me, arguments);
    return me;
}



/******************************************************************************
clsTimelineComparisonChart
******************************************************************************/
function clsTimelineComparisonChart() {
    var me = this;
    me.renderTo = null;
    me.dataProvider = null;
    me.videoTimelineList = [];
    me.displayMode = "TIMELINES";

    me.currentVisibleComparisionIndex = 0;

    me.hint = new clsWordMapHint();
    me.incidentHint = new clsIncidentHint({});

    //-----------------------------------------------------------------------//
    me.constructor = function (pConfig) {
        for (var property in pConfig) {
            me[property] = pConfig[property];
        }


    };

    //-----------------------------------------------------------------------//
    me.displayLineForObj = function (d) {
        for (var index in me.videoTimelineList) {
            var obj = me.videoTimelineList[index];
            obj.displayLineForObj(d);
        }

    };

    //-----------------------------------------------------------------------//
    me.hideLines = function () {
        for (var index in me.videoTimelineList) {
            var obj = me.videoTimelineList[index];
            obj.hideLine();
        }
    };

    //-----------------------------------------------------------------------//

    me.redrawChart = function () {
        me.renderTo.html('');
        me.currentVisibleComparisionIndex = 0;
        me.displayNextNComparision(10);
    };

    //-----------------------------------------------------------------------//

    me.displayNextNComparision = function (pCount) {

        var eventData = me.dataProvider.getIncidents(),
            listOfVideos = me.dataProvider.getVideoList(),
        test = me.dataProvider.getAssocMatrixData()
        var list = [];

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

        //me.hightlightTimeLineModeDiv();
        //d3.selectAll("#display-mode-sections").on("click", me.changeModeToSections);
        //d3.selectAll("#display-mode-timeline").on("click", me.changeModeToTimeLine);

        pCount += me.currentVisibleComparisionIndex;
        for (var index = me.currentVisibleComparisionIndex; index < pCount; index++) {
            if (me.currentVisibleComparisionIndex == listOfVideos.length) {
                //all the comparison charts have been rendered
                break;
            }
            me.addVideoEvents(listOfVideos[index], eventData);
            me.currentVisibleComparisionIndex++;
        }

        if (me.currentVisibleComparisionIndex == listOfVideos.length) {
            //all the comparison charts have been rendered
            return false;
        }
    };

    //-----------------------------------------------------------------------//
    me.generateComparison = function () {
        me.displayNextNComparision(10);
    };

    //-----------------------------------------------------------------------//
    me.addVideoEvents = function (pVideo, pEventsData) {


        //add new container
        var container = me.renderTo.append('div'),
        //gnerate the video time line
            videoTimeline = new clsVideoTimeline({
                renderTo: container,
                video: pVideo,
                events: pEventsData,
                handleOnMouseHover: me.handleOnMouseHover,
                handleOnMouseOut: me.handleOnMouseOut,
                handleOnMouseMove: me.handleOnMouseMove,
                handleOnIncidentHover: me.handleOnIncidentHover,
                handleOnIncidentHoverOut: me.handleOnIncidentHoverOut,
                handleOnIncidentMove: me.handleOnIncidentMove
            });

        //add time line object to the list
        me.videoTimelineList.push(videoTimeline);
    };

    //-----------------------------------------------------------------------//
    me.changeModeToSections = function () {
        if (me.displayMode == "SECTIONS") {
            return;
        }

        me.displayMode = "SECTIONS";
        me.hightlightSectionsModeDiv();

        var changeToDate = null;
        //change mode for each section
        for (var index in me.videoTimelineList) {
            var videoTimeLine = me.videoTimelineList[index];
            if (changeToDate) {
                videoTimeLine.changeToSectionsMode(changeToDate);
            }
            else {
                changeToDate = videoTimeLine.video._timestamp;
            }
        }
    };

    //-----------------------------------------------------------------------//
    me.changeModeToTimeLine = function () {
        if (me.displayMode == "TIMELINES") {
            return;
        }

        me.displayMode = "TIMELINES";
        me.hightlightTimeLineModeDiv();
        for (var index in me.videoTimelineList) {
            var videoTimeLine = me.videoTimelineList[index];
            videoTimeLine.changeToTimelineMode();
        }
    };

    //-----------------------------------------------------------------------//
    me.hightlightTimeLineModeDiv = function () {
        d3.select("#display-mode-timeline").classed("mode-change-btn-selected", true);
        d3.select("#display-mode-sections").classed("mode-change-btn-selected", false);
    };

    //-----------------------------------------------------------------------//
    me.hightlightSectionsModeDiv = function () {
        d3.select("#display-mode-sections").classed("mode-change-btn-selected", true);
        d3.select("#display-mode-timeline").classed("mode-change-btn-selected", false);
    };

    //-----------------------------------------------------------------------//
    me.getStreamGraphData = function () {
        var StreamGraphData = [];
        for (var index in me.videoTimelineList) {
            var videoTimeline = me.videoTimelineList[index];
            var ts = videoTimeline.video._timestamp;
            var data = me.getStreamGraphDataForVideoTimeline(ts);
            StreamGraphData = StreamGraphData.concat(data);
        }

        return StreamGraphData;
    };

    //-----------------------------------------------------------------------//
    me.getStreamGraphDataForVideoTimeline = function (pDate) {
        var events = me.dataProvider.getIncidents(),
            data = [];

        //get data for the date and next 13 days
        var whileIndex = 1,
            dayTimestamp = pDate;

        while (whileIndex <= 14) {
            for (var index in events) {
                var event = events[index];
                if (GLIB.isSameDay(event._timestamp, dayTimestamp)) {
                    var obj = {
                        key: event.type,
                        value: 1,
                        date: whileIndex
                    };
                    data.push(event);
                }
            }
            dayTimestamp = +dayTimestamp + 24 * 60 * 60 * 1000;
            dayTimestamp = new Date(dayTimestamp);
            whileIndex++;
        }

        return data;
    };

    //-----------------------------------------------------------------------//
    me.handleOnMouseHover = function (pDocumentName) {
        me.hint.show(pDocumentName);
    };

    //-----------------------------------------------------------------------//
    me.handleOnMouseOut = function () {
        me.hint.hide();
    };

    //-----------------------------------------------------------------------//
    me.handleOnMouseMove = function () {
        me.hint.updatePosition();
    };

    //-----------------------------------------------------------------------//
    me.handleOnIncidentHover = function (d) {
        me.incidentHint.show(d);
    };

    //-----------------------------------------------------------------------//
    me.handleOnIncidentHoverOut = function (d) {
        me.incidentHint.hide();
    };

    //-----------------------------------------------------------------------//
    me.handleOnIncidentMove = function (d) {
        me.incidentHint.updatePosition();
    };

    //-----------------------------------------------------------------------//

    me.constructor.apply(me, arguments);
    return me;
}

/******************************************************************************
clsVideoTimeline
******************************************************************************/
function clsVideoTimeline() {
    var me = this;
    me.renderTo = null;
    me.events = null;
    me.video = null;
    me.svgVideoTimeline = null;



    //-----------------------------------------------------------------------//
    me.constructor = function (pConfig) {
        for (var property in pConfig) {
            me[property] = pConfig[property];
        }

        me.draw();
    };

    //-----------------------------------------------------------------------//
    me.displayLineForObj = function (d) {
        me.svgVideoTimeline.displayLineForObj(d);
    };

    //-----------------------------------------------------------------------//
    me.hideLine = function () {
        me.svgVideoTimeline.hideLine();
    };

    //-----------------------------------------------------------------------//
    me.draw = function () {
        var table = me.renderTo.append('table')
                .attr("cellspacing", 0)
                .attr("cellpadding", 0),

            tr = table.append('tr'),
            tdSVGChart = tr.append('td').append('div'),
            tdVideoDataContainer = tr.append('td')
                .attr("class", "vis-time-line-video-data")
                .append('div');

        me.renderSVGVideoTimeline(me.video, tdSVGChart);
        me.renderVideoInfo(me.video, tdVideoDataContainer);
    };

    //-----------------------------------------------------------------------//
    me.renderVideoInfo = function (pVideo, pRenderTo) {
        var videoTitle = pRenderTo.append('div')
            .attr("class", "event-info-name")
            .text(pVideo.pdf)
            .on("mouseover", function () { me.handleOnMouseHover(pVideo.pdf); })
            .on("mouseout", me.handleOnMouseOut)
            .on("mousemove", me.handleOnMouseMove)
            .on("click", function (d) {
                console.log(pVideo.pdf);
                onChartBarClick(pVideo.pdf);
            });

        var videoDate = pRenderTo.append('div')
            .attr("class", "event-info-date")
            .text(pVideo.timestamp);

    };

    //-----------------------------------------------------------------------//
    me.renderSVGVideoTimeline = function (pVideo, pRenderTo) {
        me.svgVideoTimeline = new clsSVGVideoTimeline({
            renderTo: pRenderTo,
            video: pVideo,
            events: me.events,
            handleOnIncidentHover: me.handleOnIncidentHover,
            handleOnIncidentHoverOut: me.handleOnIncidentHoverOut,
            handleOnIncidentMove: me.handleOnIncidentMove
        });
    };

    //-----------------------------------------------------------------------//
    me.changeToSectionsMode = function (pDate) {

        me.svgVideoTimeline.changeToSectionsMode(pDate)
    };

    //-----------------------------------------------------------------------//
    me.changeToTimelineMode = function () {
        me.svgVideoTimeline.changeToTimelineMode();
    };

    //-----------------------------------------------------------------------//

    me.constructor.apply(me, arguments);
    return me;
}



//---------------Model Popup--------------------------------//
onChartBarClick = function (documentName) {

    var modalForm = new clsTableWindow({
        modal: $('#modal'),
        overlay: $('#overlay'),
        closeCmp: $('#close')
    });
    // $("#content").html('');
    $.ajax({
        url: "docs/" + documentName,
        dataType: "text",
        success: function (data) {

            console.log(data);
            modalForm.open();
            $("#content").text(data);

        }

    });

}


/******************************************************************************
clsSVGVideoTimeline
******************************************************************************/
function clsSVGVideoTimeline() {
    var me = this;
    me.renderTo = null;
    me.events = null;
    me.video = null;
    me.svg = null;
    me.width = 600;
    me.height = 50;
    me.padding = {
        top: 5,
        right: 20,
        bottom: 5,
        left: 20
    };

    me.circleRadius = 10;

    //-----------------------------------------------------------------------//
    me.constructor = function (pConfig) {
        for (var property in pConfig) {
            me[property] = pConfig[property];
        }

        me.actualHeight = me.height - me.padding.top - me.padding.bottom;
        me.actualWidth = me.width - me.padding.left - me.padding.right;

        me.draw();
    };

    //-----------------------------------------------------------------------//
    me.displayLineForObj = function (d) {
        if (!me.line) {
            //add a line
            me.line = me.svg.append('g')
                .attr("transform", "translate(" + me.padding.left + "," + me.padding.top + ")")
                .append("line")
                .attr("class", "stremgraph-hover-line")
                .attr("x1", 1)
                .attr("x2", 1)
                .attr("y1", 0)
                .attr("y2", me.height)
                .attr("display", "none");
        }

        me.line.attr("display", "block");

        //move the line to the same position as streamgraph line
        var x = +me.video._timestamp + 1000 * 60 * 60 * 24 * (d._day - 1);
        x = me.x(x);

        me.line
            .attr("x1", x)
            .attr("x2", x);

    };

    //-----------------------------------------------------------------------//
    me.hideLine = function () {
        if (me.line)
            me.line.attr("display", "none");
    };

    //-----------------------------------------------------------------------//
    me.draw = function () {
        me.svg = me.renderTo.append('svg')
            .attr("width", me.width)
            .attr("height", me.height - me.padding.bottom);

        me.container = me.svg.append('g')
            .attr("transform", "translate(" + me.padding.left + "," + me.padding.top + ")");

        //draw the axis
        me.drawAxis();
        me.addRectangelForAfterTwoWeeks();
        me.plotEventCirles();
    };

    //-----------------------------------------------------------------------//
    me.drawAxis = function () {

        me.x = d3.time.scale()
            .range([0, me.actualWidth]);

        //Get the scales extent
        //the min value is 7 days before the video timestamp
        //the max value is 21 days after the video timestamp
        var d1 = +me.video._timestamp - 1000 * 60 * 60 * 24 * 7;
        var d2 = +me.video._timestamp + 1000 * 60 * 60 * 24 * 21;

        me.x.domain([d1, d2]);
        //me.x.domain(d3.extent(me.events, function(d) { return d._timestamp; }));

        me.container.append("line")
            .attr("class", "time-line-axis")
            .attr("x1", 0)
            .attr("x2", me.actualWidth)
            .attr("y1", me.actualHeight / 2)
            .attr("y2", me.actualHeight / 2);
    };

    //-----------------------------------------------------------------------//
    me.addRectangelForAfterTwoWeeks = function () {
        var d1 = me.video._timestamp,
            d2 = new Date(+d1 + (1000 * 60 * 60 * 24 * 13)),
            x1 = me.x(+d1),
            x2 = me.x(+d2);

        if (!me.twoWeekRect) {
            me.twoWeekRect = me.container.append('rect')
                .attr("height", me.actualHeight)
                .attr("class", "two-week-rect");
        }

        me.adjustRectangle(x1, x2);
    };

    //-----------------------------------------------------------------------//
    me.adjustRectangle = function (x1, x2) {
        me.twoWeekRect
            .attr("width", (x2 - x1))
            .attr("y", 0)
            .attr("x", x1)
    };

    //-----------------------------------------------------------------------//
    me.plotEventCirles = function () {
        var y = me.actualHeight / 2;

        var scaleDomain = me.x.domain();
        var data = [];
        //get all the circle s in the available date range
        for (var index in me.events) {
            var event = me.events[index];
            if (+event._timestamp >= +scaleDomain[0] && +event._timestamp <= +scaleDomain[1]) {
                data.push(event);
            }
        }
        //        var rand = [];
        //        for (var i = 0; i < data.length; i++) {
        //            var test = data[Math.floor(Math.random() * data.length)];
        //            rand.push(test);
        //        }


        // data = rand.slice(0, 20);

        me.container.selectAll('.event-time-line-circle')
            .data(data)
            .exit()
            .remove();


        me.container.selectAll('.event-time-line-circle')
            .data(data)
            .enter()
            .append('circle')
            .attr("class", "event-time-line-circle");


        me.container.selectAll('.event-time-line-circle')
            .attr("class", "event-time-line-circle")
            .attr("cx", function (d) {

                return me.x(d._timestamp);
            })
            .attr("cy", y)
            .attr("r", me.circleRadius)
        //.attr("fill", function (d) { return color(d.tags[0].name) })
            .attr("fill", me.getEventCircle)
            .on("mouseover", me.handleOnIncidentHover)
            .on("mouseout", me.handleOnIncidentHoverOut)
            .on("mousemove", me.handleOnIncidentMove);
    };
    //-----------------------------------------------------------------------//

    // var color = d3.scale.category10();
    me.getEventCircle = function (pEvent) {
        //        if (pEvent.type == "suicide") { return '#F7931E'; }
        //        else if (pEvent.type == "attack") { return '#D9E021'; }
        //        else if (pEvent.type == "bomb") { return '#03A99D'; }
        //        else if (pEvent.type == "road block") { return '#D4235A'; }
        //        else { return '#0371BC'; }

        var type = pEvent.SSEVM_Event_Desc;
        return color(type);
    };


    //-----------------------------------------------------------------------//
    me.changeToSectionsMode = function (pDate) {

        var d2 = me.video._timestamp,
            d1 = pDate;

        var scaleD = d3.extent(me.events, function (d) { return d._timestamp; }),
            scaleD1 = scaleD[0],
            scaleD2 = scaleD[1];

        var delta = d2 - d1;

        //apply the difference
        scaleD1 = +scaleD1 + delta;
        scaleD2 = +scaleD2 + delta;

        me.x.domain([new Date(scaleD1), new Date(scaleD2)]);
        me.addRectangelForAfterTwoWeeks();
        me.plotEventCirles();
    };

    //-----------------------------------------------------------------------//
    me.changeToTimelineMode = function () {
        me.x.domain(d3.extent(me.events, function (d) { return d._timestamp; }));
        me.addRectangelForAfterTwoWeeks();
        me.plotEventCirles();
    };

    //-----------------------------------------------------------------------//

    me.constructor.apply(me, arguments);
    return me;
}

/******************************************************************************
clsIncidentHint
******************************************************************************/
function clsIncidentHint(pConfig) {
    var me = this;

    //-----------------------------------------------------------------------//
    me.constructor = function (pConfig) {
        for (pName in pConfig) {
            me[pName] = pConfig[pName];
        }
        me.addHint();
    };

    //-----------------------------------------------------------------------//
    me.addHint = function () {
        me.hintContainer = d3.select('body')
            .append('div')
            .attr("class", "incident-tooltip");

        me.type = me.hintContainer
            .append('div')
            .attr("class", "incident-tooltip-type")
            .text('Top Keywords');

        me.description = me.hintContainer
            .append('div')
            .attr("class", "incident-tooltip-desc");

        me.hide();
    };

    //-----------------------------------------------------------------------//
    me.show = function (d) {
        me.hintContainer.style("display", "block");
        me.changeContent(d);
        me.updatePosition();
    };

    //-----------------------------------------------------------------------//
    me.updatePosition = function () {

        var currHeight = me.hintContainer.style("height").slice(0, -2),
            currWidth = me.hintContainer.style("width").slice(0, -2);

        var x = d3.event.pageX - currWidth / 2;
        if (x < 0) {
            x = 0;
        }

        me.hintContainer
            .style("top", (d3.event.pageY - currHeight - 50) + "px")
            .style("left", (x) + "px");
    };

    //-----------------------------------------------------------------------//
    me.changeContent = function (d) {
        //debugger;
        // me.type.text(d.type);
        //me.description.text(d.description);

        //change by rizwan
        //        var LKeyowrdsStr = '';
        //        for (var LLoopIndex = 0; LLoopIndex < d.tags.length; LLoopIndex++) {
        //            LKeyowrdsStr += d.tags[LLoopIndex].name;

        //            if (LLoopIndex < d.tags.length - 1) {
        //                LKeyowrdsStr += ', ';
        //            }
        //        }
        //        me.type.text(LKeyowrdsStr);
        //        me.description.text(d.summary + " , " + d.content.slice(0, 500) + "...");
        // me.description.text(d.content);
        //debugger;
        //me.description.text(d.summary + " , " + d.content.slice(0, 500) + "...");
        me.description.html("<b>"+d.SSEVM_Event_Desc+"</b><br/>Incident City: " + d.IncidentCity + "<br/> Incident Country: " + d.IncidentCountry + "<br/>Reporting agency: " + d.Agency_Person + "<br/>Description: " + d.SSIM_Incident_Desc);

    };

    //-----------------------------------------------------------------------//
    me.hide = function () {
        me.hintContainer.style("display", "none");
    };

    //-----------------------------------------------------------------------//
    me.constructor.apply(me, arguments);
    return me;
}

/******************************************************************************
clsIncidentHint
******************************************************************************/
function clsStreamGraphHint(pConfig) {
    var me = this;

    //-----------------------------------------------------------------------//
    me.constructor = function (pConfig) {
        for (pName in pConfig) {
            me[pName] = pConfig[pName];
        }
        me.addHint();
    };

    //-----------------------------------------------------------------------//
    me.addHint = function () {
        me.hintContainer = d3.select('#stream-line-chart-cntnr')
            .append('div')
            .attr("class", "streamgraph-tooltip");

        me.type = me.hintContainer
            .append('div')
            .attr("class", "incident-tooltip-type")
            .text('Top Keywords');

        me.description = me.hintContainer
            .append('div')
            .attr("class", "incident-tooltip-desc");

        me.hide();
    };

    //-----------------------------------------------------------------------//
    me.show = function (d) {
        me.hintContainer.style("display", "block");
        //me.changeContent(d);
        me.updatePosition();
    };

    //-----------------------------------------------------------------------//
    me.updatePosition = function () {
        var currHeight = me.hintContainer.style("height").slice(0, -2),
            currWidth = me.hintContainer.style("width").slice(0, -2);

        //var x = d3.event.pageX - currWidth/2;
        var x = d3.event.pageX + 2;
        if (x < 0) {
            x = 0;
        }

        //var y = d3.event.pageY - currHeight - 50;
        var y = 130;

        me.hintContainer
            .style("top", (y) + "px")
            .style("left", (x) + "px");
    };

    //-----------------------------------------------------------------------//
    me.changeContent = function (d) {
        me.type.text(d.type + ' (' + d.count + ')');
        me.description.text(d.day);

    };

    //-----------------------------------------------------------------------//
    me.hide = function () {
        me.hintContainer.style("display", "none");
    };

    //-----------------------------------------------------------------------//
    me.constructor.apply(me, arguments);
    return me;
}


/******************************************************************************
clsStreamLineGraph
******************************************************************************/
function clsStreamLineGraph() {
    var me = this;
    me.renderTo = null;
    me.width = 500;
    me.height = 300;
    me.margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };

    me.hint = new clsStreamGraphHint({});

    //-----------------------------------------------------------------------//
    me.constructor = function (pConfig) {
        for (var property in pConfig) {
            me[property] = pConfig[property];
        }
    };

    //-----------------------------------------------------------------------//
    me.draw = function (data) {
        for (var index in data) {

            var obj = data[index];
            obj.value = +obj.value;
        }
        // var color = d3.scale.category10();

        if (!me.svgTg) {
            //SVG has not been rendered yet
            //Add SVG and necessary tags
            me.svgTg = me.renderTo.append("svg")
                .attr("width", me.width + me.margin.left + me.margin.right)
                .attr("height", me.height + me.margin.top + me.margin.bottom);

            me.svg = me.svgTg
                .append("g")
                .attr("transform", "translate(" + me.margin.left + "," + me.margin.top + ")");

            me.lineContainer = me.svgTg
                .attr("width", me.width + me.margin.left + me.margin.right)
                .attr("height", me.height + me.margin.top + me.margin.bottom)
                .append("g")
                .attr("transform", "translate(" + me.margin.left + "," + me.margin.top + ")");

            me.line = me.lineContainer.append("line")
                .attr("class", "stremgraph-hover-line")
                .attr("y1", 0)
                .attr("y2", me.height)
                .attr("x1", 0)
                .attr("x2", 0);

            me.line
                .style("display", "none");

            var x = d3.scale.linear()
                .range([0, me.width]);

            me.xAxis = x;

            me.y = d3.scale.linear()
                .range([me.height - me.margin.top - me.margin.bottom, 0]);

            me.xAxis.domain([1, 14]);

            me.stack = d3.layout.stack()
                .offset("silhouette")
                .values(function (d) { return d.values; })
                .x(function (d) { return d.date; })
                .y(function (d) { return d.value; });

            me.nest = d3.nest()
                .key(function (d) { return d.type; });

            me.area = d3.svg.area()
                .interpolate("cardinal")
                .x(function (d) {
                    return me.xAxis(d.date);
                })
                .y0(function (d) {
                    return me.y(d.y0);
                })
                .y1(function (d) {
                    return me.y(d.y0 + d.y);
                });
        }

        var graph = function (data) {
            data.forEach(function (d) {
                d.date = d.date;
                d.value = +d.value;
            });
        };

        var layers = me.stack(me.nest.entries(data));
        var yMax = d3.max(data, function (d) {
            return d.y0 + d.y;
        });
        me.y.domain([0, yMax]);

        me.svg.selectAll(".layer")
            .data(layers)
            .exit()
            .remove();

        me.svg.selectAll(".layer")
            .data(layers)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", function (d) { return me.area(d.values); })
            .attr("title", function (d) { return d.key; })
            .style("fill", function (d, i) {
                //                if (d.key == "suicide") { return '#F7931E'; }
                //                else if (d.key == "attack") { return '#D9E021'; }
                //                else if (d.key == "bomb") { return '#03A99D'; }
                //                else if (d.key == "road block") { return '#D4235A'; }
                //                else { return '#0371BC'; }

                return color(d.key)
            })
            .on("mouseover", me.handleOnMouseHover)
            .on("mouseout", me.handleOnMouseOut)
            .on("mousemove", me.handleOnMouseMove);

        me.svg.selectAll(".layer")
            .on("mouseover", me.handleOnMouseHover)
            .on("mouseout", me.handleOnMouseOut)
            .on("mousemove", me.handleOnMouseMove);

        me.svg.selectAll(".layer")
            .transition()
            .duration(500)
            .attr("d", function (d) { return me.area(d.values); })
            .attr("title", function (d) { return d.key; })
            .style("fill", function (d, i) {
                //                if (d.key == "suicide") { return '#F7931E'; }
                //                else if (d.key == "attack") { return '#D9E021'; }
                //                else if (d.key == "bomb") { return '#03A99D'; }
                //                else if (d.key == "road block") { return '#D4235A'; }
                //                else { return '#0371BC'; }
                return color(d.key)

            });

        createLegend(data);

    };

    showLegend = function (d, i) {
        return d3.select("#legend svg g.panel").transition().duration(300).attr("transform", "translate(0,0)");
    };

    hideLegend = function (d, i) {
        return d3.select("#legend svg g.panel").transition().duration(300).attr("transform", "translate(0,0)");
    };
    //legends

    function arrayUnique(array) {
        var a = array;
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i].type === a[j].type)
                    a.splice(j--, 1);
            }
        }

        return a;
    };

    createLegend = function (data) {

        var data = arrayUnique(data);

        var keys, legend, legendG, legendHeight, legendWidth;
        legendWidth = 250;
        legendHeight = 1000;
        legend = d3.select("#legend").append("svg").attr("width", legendWidth).attr("height", legendHeight).attr("id", "svgId");
        legendG = legend.append("g").attr("transform", "translate(0,0)").attr("class", "panel");
        legendG.append("rect").attr("width", legendWidth).attr("height", legendHeight).attr("rx", 4).attr("ry", 4).attr("fill-opacity", 0.5).attr("fill", "white");
        legendG.on("mouseover", showLegend).on("mouseout", hideLegend);
        keys = legendG.selectAll("g").data(data).enter().append("g").attr("transform", function (d, i) {
            return "translate(" + 5 + "," + (10 + 20 * (i + 0)) + ")";
        });
        keys.append("rect").attr("width", 15).attr("height", 15).attr("rx", 4).attr("ry", 4).attr("fill", function (d) {
            return color(d.type);
        });
        return keys.append("text").text(function (d) {
            return d.type;
        }).attr("text-anchor", "left").attr("dx", "2.3em").attr("dy", "1.3em");

    };


    //-----------------------------------------------------------------------//
    me.handleOnMouseHover = function (d, i) {
        me.svg.selectAll(".layer")
            .attr("fill-opacity", function (d1, i1) {
                return i == i1 ? 1 : 0.5;
            });

        if (!d) {
            return
        }
        me.line
            .style("display", "block");
        var x = me.updateLinePosition(d);
        //get scale position
        me.hint.show(d);
    };

    //-----------------------------------------------------------------------//
    me.handleOnMouseOut = function (d) {
        me.svg.selectAll(".layer")
            .attr("fill-opacity", 1);

        me.line
            .style("display", "none");
        me.hint.hide();

        me.handleOnChartMouseOut();
    };

    //-----------------------------------------------------------------------//
    me.handleOnMouseMove = function (d) {
        if (!d) {
            return
        }
        me.hint.updatePosition();
        me.updateLinePosition(d);


    };


    //-----------------------------------------------------------------------//
    me.updateLinePosition = function (d) {
        var x = d3.event.pageX - me.margin.left + 2;
        if (x > (me.width + me.margin.left - 10)) {
            x = me.width + me.margin.left - 10;
        }

        me.line
            .attr("x1", x)
            .attr("x2", x);

        var day1 = me.xAxis.invert(x);
        var day = Math.floor(day1);

        var obj = {
            type: d.key,
            count: d.values[day - 1].value,
            day: 'Day ' + day,
            _day: day1
        };
        me.hint.changeContent(obj);

        me.handleOnChartHover(obj);

        return x;
    };

    //-----------------------------------------------------------------------//


    me.constructor.apply(me, arguments);
    return me;
}

/******************************************************************************
libObj
******************************************************************************/

var GLIB = {
    isSameDay: function (pDate1, pDate2) {
        pDate1 = new Date(pDate1).setHours(0, 0, 0, 0);
        pDate2 = new Date(pDate2).setHours(0, 0, 0, 0);
        return pDate1 == pDate2;
    }
};