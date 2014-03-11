define("loc/Application", [
  "dojo/_base/config",
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-construct",
  "dojo/topic",
  "dojo/on",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/templates/Application.html",
  "loc/views/SearchView",
  "esri/map",
  "esri/graphic",
  "loc/dal/sunlight"
], function(
  config, 
  declare, 
  lang, 
  domConstruct, 
  topic, 
  on, 
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin, 
  template, 
  SearchView, 
  Map, 
  Graphic,
  sunlight
) {

  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    map: null,

    highlightSymbol: null,

    searchView: null,

    startup: function() {
      this.inherited(arguments);

      this.highlightSymbol = null; // TODO
      topic.subscribe("/loc/map/highlight", lang.hitch(this, this._highlightGeometries));

      topic.subscribe("/loc/search/members/geometry", lang.hitch(this, this._doGeometrySearch));
      topic.subscribe("/loc/search/members/zip", lang.hitch(this, this._doZIPSearch));
      topic.subscribe("/loc/search/members/state", lang.hitch(this, this._doStateSearch));

      // "/loc/results/members"

      this._createMap();

      this._setupViewArea();

    },

    _createMap: function() {

      this.map = new Map(this.id + "_map", {
        basemap: "streets"
      });

    },

    _setupViewArea: function() {

      var d = domConstruct.create("div", {}, this.viewAreaNode)

      this.searchView = new SearchView({}, d);
      this.searchView.startup();

    },

    _highlightGeometries: function(geom) {

        var geometries = [].concat(geom);

        var graphics = this.map.graphics;
        graphics.clear();

        for (var i = 0; i < geometries.length; i++) {
          graphics.add(new Graphic(geometries[i], this.highlightSymbol, {}, null));
        }
    },

    _doGeometrySearch: function(e) {

      var geom = e.geometry || null;
      if (geom === null) {
        console.warn("could not search on null geometry");
        return;
      }

      if (!!geom.getCentroid) {}
        geom = geom.getCentroid();
      }

      sunlight.getMembersAtLocation(geom).then(function(members) {

        topic.publish("/loc/results/members", {
          members: members
        });

      }, function(error) {

        console.error(error);
        topic.publish("/loc/app/error", {
          error: error,
          during: "Point Search"
        });

      });

    },

    _doZIPSearch: function(e) {

      var zip = e.zip || null;
      if (zip === null) {
        console.warn("could not search on null ZIP");
        return;
      }

      sunlight.getMembersForZIP(zip).then(function(members) {

        topic.publish("/loc/results/members", {
          members: members
        });

      }, function(error) {

        console.error(error);
        topic.publish("/loc/app/error", {
          error: error,
          during: "ZIP Search"
        });

      });

    },

    _doStateSearch: function(e) {

      var state = e.state || null;
      if (state === null) {
        console.warn("could not search on null State");
        return;
      }

      sunlight.getMembersForState(state).then(function(members) {

        topic.publish("/loc/results/members", {
          members: members
        });

      }, function(error) {

        console.error(error);
        topic.publish("/loc/app/error", {
          error: error,
          during: "State Search"
        });

      });

    }

  });

});