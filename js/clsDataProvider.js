/**
* Created with JetBrains WebStorm.
* User: Digvijay.Upadhyay
* Date: 4/9/14
* Time: 3:12 PM
* To change this template use File | Settings | File Templates.
*/
var propagandaList = [];
var uniqueTags = [];
var incidentsShortlist = [];
function clsDataProvider(pConfig) {
    var me = this;

    //me.dateParser = d3.time.format("%m/%e/%y %H:%M").parse;
    me.dateParser = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;
    me.dateParser2 = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
    me.dateParser1 = d3.time.format("%m/%e/%Y").parse;
    me.dateParser3 = d3.time.format("%d-%b-%Y %H:%M:%S").parse;

    //-----------------------------------------------------------------------//
    me.constructor = function (pConfig) {
        for (pName in pConfig) {
            me[pName] = pConfig[pName];
        }
    };

    //-----------------------------------------------------------------------//
    me.loadData = function (pCallBack) {
        d3.json("data/DSS.json", function (test) {

            d3.csv("data/data.csv", function (wordRepeatation) {

                me.wordRepeatation = wordRepeatation;

                d3.csv("data/dis.csv", function (assocMatrix) {
                    me.assocMatrix = assocMatrix;

                    d3.json("data/DSS.json", function (incidents) {

                        me.incidents = incidents;
                        me.sortIncidentsByDate();

                        //create a non-duplicate list of all types/tag types
                        me.incidents.forEach(function (d) {
                            var lastTag = d.SSEVM_Event_Desc;
                            uniqueTags.push(lastTag);
                        })
                        uniqueTags = uniqueTags.filter(function (elem, pos) {
                            return uniqueTags.indexOf(elem) == pos;
                        });
                        uniqueTags.sort();
                        console.log(uniqueTags);
                       
                        me.incidents.forEach(function (d) {
                       
                            incidentsShortlist.push({
                                "date": d._timestamp,
                                "tag": d.SSEVM_Event_Desc
                            })
                        });
                        console.log(incidentsShortlist);
                        
                        me.wordRepeatation.forEach(function (d) {
                            propagandaList.push({
                                "filename": d.pdf,
                                "date": d.timestamp
                            })
                        });

                        console.log(propagandaList);
                        pCallBack(me);
                    });
                });
            });
        });
    };


    me.countIncidents = function (day) {

        var streamgraphData = [];
        var incidentTest = [];
        var day1 = new Date(day);
        var day2 = new Date(day);
        var maxday = new Date(day1.setDate(day1.getDate() + 14));

        incidentTest = incidentsShortlist.filter(function (f) { return f.date > day2 && f.date < maxday });
       
        uniqueTags.forEach(function (tag) {

            for (i = 0; i < 14; i++) {
                var testday = new Date(day2.setDate(day2.getDate() + i));
                var tempCounter = 0;
                incidentTest.forEach(function (d) {
                    var indicentDate = new Date(d.date);
                    indicentDate = new Date(indicentDate.setHours(0, 0, 0, 0));
                    if (d.tag == tag && +indicentDate == +testday) {
                        tempCounter++;
                    }
                });
                // push tag, testday, and tempCounter value

                //then push tag, date, count to streamgraph;
                streamgraphData.push({
                    "type": tag,
                    "date": i + 1,
                    "value": tempCounter
                })
                testday = new Date(day2.setDate(day2.getDate() - i));

            }
        })

        return streamgraphData;
    };

    //-----------------------------------------------------------------------//
    me.getWordRepeatationData = function () {
        return me.wordRepeatation;
    };

    //-----------------------------------------------------------------------//
    me.getAssocMatrixData = function () {
        return me.assocMatrix;
    };

    //-----------------------------------------------------------------------//
    me.getIncidents = function () {

        return me.incidents;
    };

    //-----------------------------------------------------------------------//
    me.getVideoList = function () {
        var arr = [];
        for (var index in me.wordRepeatation) {
            var obj = me.wordRepeatation[index];
            var video = {
                pdf: obj.pdf,
                timestamp: obj.timestamp,
                _timestamp: me.dateParser1(obj.timestamp)
            };
            arr.push(video);
        }
       
        arr.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return b._timestamp - a._timestamp;
        });
        return arr;
    };

    //-----------------------------------------------------------------------//
    me.sortIncidentsByDate = function () {
        for (var index in me.incidents) {
            var incident = me.incidents[index];
            incident._timestamp = me.dateParser3(incident.SSIM_Incident_Date);
//            if (incident._timestamp == null) {
//                incident._timestamp = me.dateParser2(incident.publishedAt);
//            }

        }

        me.incidents.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return b._timestamp - a._timestamp;
        });
    };

    //-----------------------------------------------------------------------//
    me.constructor(pConfig);
    return me;
}