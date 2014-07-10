/**
 * Created with JetBrains WebStorm.
 * User: Digvijay.Upadhyay
 * Date: 4/9/14
 * Time: 3:12 PM
 * To change this template use File | Settings | File Templates.
 */

function clsDataProvider(pConfig){
    var me = this;

    //me.dateParser = d3.time.format("%m/%e/%y %H:%M").parse;
    me.dateParser = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;
    me.dateParser2 = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
    me.dateParser1 = d3.time.format("%m/%e/%Y").parse;

    //-----------------------------------------------------------------------//
    me.constructor = function(pConfig){
        for(pName in pConfig){
            me[pName] = pConfig[pName];
        }
    };

    //-----------------------------------------------------------------------//
    me.loadData = function (pCallBack) {
        d3.csv("data/data.csv", function (wordRepeatation) {

            me.wordRepeatation = wordRepeatation;

            d3.csv("data/dis.csv", function (assocMatrix) {
                me.assocMatrix = assocMatrix;

                // d3.csv("data/incidents.csv", function (incidents) {
                // d3.json("http://api.crisis.net/item?apikey=53ac8c70ac72b1d11c894031&limit=500&license=cc&after=2013-01-01&before=2013-12-31&sources=vdc_syria,reliefweb,ushahidi", function (incidents) {

                d3.json("data/ushahidiVdc-all.json", function (incidents) {

                    me.incidents = incidents.data;
                    me.sortIncidentsByDate();

                    d3.csv("data/StreamgraphData2.csv", function (streamgraphData) {

                        me.streamgraphData = streamgraphData;
                        //all data is loaded callback the fucntion
                        pCallBack(me);
                    });



                    //all data is loaded callback the fucntion
                    //pCallBack(me);
                });
            });
        });
    };

    //-----------------------------------------------------------------------//
    me.getWordRepeatationData = function(){
        return me.wordRepeatation;
    };

    //-----------------------------------------------------------------------//
    me.getAssocMatrixData = function(){
        return me.assocMatrix;
    };

    //-----------------------------------------------------------------------//
    me.getIncidents = function () {
    
        return me.incidents;
    };

    //-----------------------------------------------------------------------//
    me.getVideoList = function(){
        var arr = [];
        for(var index in me.wordRepeatation){
            var obj = me.wordRepeatation[index];
            var video = {
                pdf : obj.pdf,
                timestamp : obj.timestamp,
                _timestamp : me.dateParser1(obj.timestamp)
            };
            arr.push(video);
        }
        return arr;
    };

    //-----------------------------------------------------------------------//
    me.sortIncidentsByDate = function () {
        for (var index in me.incidents) {
            var incident = me.incidents[index];
            incident._timestamp = me.dateParser(incident.publishedAt);
            if (incident._timestamp == null) {
                incident._timestamp = me.dateParser2(incident.publishedAt);
            }
           
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