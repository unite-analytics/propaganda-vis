propaganda-vis
==============
How to change Incident Data?
1) Loading of all data files are in "me.loadData" function of clsdataProvider.js.

me.wordRepeatation => Contain the data of "data.csv".
me.assocMatrix => Contain "dis.csv" file data.
me.incidents=> contain "ushahidiVdc-all.json" file data. this contain all incident object.
We are using 3 type of date parser.

me.dateParser = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;
me.dateParser2 = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
me.dateParser1 = d3.time.format("%m/%e/%Y").parse;

2) Function that draw StreamGraph Chart.

"generateDataForStreamGraph" function in bootstrap.js load data for streamgraph.
global.streamLineChart.draw(data) function of draw the chart.

3) Function that Draw TImeLine comparison Chart.

"global.comparisonChart" is draw the comparison chart.


4) Modal Popup

"onChartBarClick" function in Chart.js shows the modal popup.

5) Legends

"createLegend" function in Chart.js shows the legends.

6) Line Chart Bubble tooltip

The data of circle tool tip is populated from "me.changeContent" on chart.js.



