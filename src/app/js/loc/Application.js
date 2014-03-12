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
  "loc/views/MembersView",
  "esri/map",
  "esri/graphic",
  "esri/geometry/Extent",
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
  MembersView,
  Map, 
  Graphic,
  Extent,
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
      topic.subscribe("/loc/search/members/name", lang.hitch(this, this._doNameSearch));

      topic.subscribe("/loc/search/committees/id", lang.hitch(this, this._doCommitteeSearch));

      this._createMap();

      this._setupViewArea();

      // DEBUG ONLY
      topic.subscribe("/loc/results/members", lang.hitch(this, function(e) {

        console.group("onmembers");

        console.log(e.members);

        var view = new MembersView();
        view.startup();
        view.set("members", e.members);

        domConstruct.empty(this.resultsNode);
        domConstruct.place(view.domNode, this.resultsNode);

        console.groupEnd("onmembers");

      }));

    },

    _createMap: function() {

      this.map = new Map(this.id + "_map", {
        basemap: "gray",
        extent: new Extent({ // TODO: update this value with the extent of the districts layer
          xmin: -22737875.67804202,
          ymin: -2348145.508920069,
          xmax: -1604566.097761969,
          ymax: 13306157.883879967,
          spatialReference: { wkid: 102100 }
        }),
        slider: false,
        showAttribution: false
      });

    },

    _setupViewArea: function() {

      var d = domConstruct.create("div", {}, this.searchAreaNode)

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

      if (!!geom.getCentroid) {
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