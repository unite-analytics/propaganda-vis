/**
 * Created with JetBrains WebStorm.
 * User: Digvijay.Upadhyay
 * Date: 4/9/14
 * Time: 3:12 PM
 * To change this template use File | Settings | File Templates.
 */

function clsDataProvider(pConfig){
    var me = this;

    me.dateParser = d3.time.format("%m/%e/%y %H:%M").parse;
    me.dateParser1 = d3.time.format("%m/%e/%Y").parse;

    //-----------------------------------------------------------------------//
    me.constructor = function(pConfig){
        for(pName in pConfig){
            me[pName] = pConfig[pName];
        }
    };

    //-----------------------------------------------------------------------//
    me.loadData = function(pCallBack){
        d3.csv("data/data.csv", function(wordRepeatation){
            me.wordRepeatation = wordRepeatation;

            d3.csv("data/dis.csv", function(assocMatrix){
                me.assocMatrix = assocMatrix;

                d3.csv("data/incidents.csv", function(incidents){
                    me.incidents = incidents;
                    me.sortIncidentsByDate();

                    d3.csv("data/StreamgraphData.csv", function(streamgraphData){
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
    me.getIncidents = function(){
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
    me.sortIncidentsByDate = function(){
        for(var index in me.incidents){
            var incident = me.incidents[index];
            incident._timestamp = me.dateParser(incident.timestamp);
        }

        me.incidents.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return b._timestamp - a._timestamp;
        });
    };

    //-----------------------------------------------------------------------//
    me.constructor(pConfig);
    return me;
}