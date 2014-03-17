define("loc/views/MapView", [
  "dojo/_base/config",
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/dom-construct",
  "dojo/Deferred",
  "dojo/string",
  "dojo/topic",
  "dojo/on",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "esri/map",
  "esri/graphic",
  "dojo/_base/Color",
  "esri/layers/FeatureLayer",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/renderers/SimpleRenderer",
  "esri/geometry/Extent",
  "esri/geometry/Point",
  "esri/geometry/webMercatorUtils",
  "esri/graphicsUtils",
  "esri/tasks/query"
], function(
  config,
  declare,
  lang,
  array,
  domConstruct,
  Deferred,
  string,
  topic,
  on,
  _WidgetBase,
  _TemplatedMixin,
  Map,
  Graphic,
  Color,
  FeatureLayer,
  PictureMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  SimpleRenderer,
  Extent,
  Point,
  webMercatorUtils,
  graphicsUtils,
  Query
) {
  
  return declare([ _WidgetBase, _TemplatedMixin ], {

    templateString: "<div><div class='loc-map' id='${id}_map' data-dojo-attach-point='mapNode'></div></div>",

    map: null,

    initialExtent: null,

    mapPinSymbol: null,

    selectionSymbol: null,

    emptyRenderer: null,

    statesLayer: null,

    statesBgLayer: null,

    districtsBgLayer: null,

    districtsLayer: null,

    startup: function() {
      this.inherited(arguments);

      this._createMap();

      this._createRendering();

      this._createFeatureLayers();

      this._subscribeHighlights();

      // listen for a geometry search and plot the point
      topic.subscribe("/loc/search/members/geometry", lang.hitch(this, this._onGeometrySearch));
      
      // clear the graphics when a new search is requested
      topic.subscribe("/loc/search/expand", lang.hitch(this, function() {
        this.map.setExtent(this.initialExtent);
        this._clearMap();
      }));

      //topic.subscribe("/loc/results/members", lang.hitch(this, this._onMembersResults));

    },

    _clearMap: function() {

      this.map.graphics.clear();
      this.statesLayer.clearSelection();
      this.districtsLayer.clearSelection();

    },

    _createMap: function() {

      this.initialExtent = new Extent({ // TODO: update this value with the extent of the districts layer
        xmin: -22737875.67804202,
        ymin: -2348145.508920069,
        xmax: -1604566.097761969,
        ymax: 13306157.883879967,
        spatialReference: { wkid: 102100 }
      });

      this.map = new Map(this.id + "_map", {
        basemap: config.app.basemap || "gray",
        extent: this.initialExtent,
        //slider: false,
        showAttribution: false
      });

      // set up click -> search
      on(this.map, "click", lang.hitch(this, function(e) {

        var geom = e.mapPoint;

        if (geom.spatialReference.isWebMercator()) {
          geom = webMercatorUtils.webMercatorToGeographic(geom);
        }

        this._clearMap();

        topic.publish("/loc/search/members/geometry", {
          geometry: geom,
          source: "Map Click"
        });

      }));

    },

    _createRendering: function() {

      this.mapPinSymbol = new PictureMarkerSymbol({
        url: require.toUrl("loc/views/images/map-pin-blue-blank.png"),
        width: 10,
        height: 19,
        yoffset: 10
      });

      this.selectionSymbol = new SimpleFillSymbol(
        "solid",
        new SimpleLineSymbol(
          "solid",
          new Color(config.app.selectionColor),
          3
        ),
        new Color([ 0, 0, 0, 0 ])
      );

      this.emptyRenderer = new SimpleRenderer(
        new SimpleFillSymbol(
          "solid",
          new SimpleLineSymbol(
            "solid",
            new Color([ 0, 0, 0, 0 ]),
            0
          ),
          new Color([ 0, 0, 0, 0 ])
        )
      );

    },

    _createFeatureLayers: function() {

      this.statesLayer = new FeatureLayer(config.app.layers.states, {
        outFields: ["*"],
        opacity: 0.5,
        visible: false
      }).setSelectionSymbol(this.selectionSymbol);

      this.districtsBgLayer = new FeatureLayer(config.app.layers.districts, {
        outFields: ["*"],
        opacity: 0.5,
        visible: true
      });

      this.statesLayer = new FeatureLayer(config.app.layers.states, {
        outFields: ["*"],
        opacity: 0.5,
        visible: true
      }).setSelectionSymbol(this.selectionSymbol);
      this.statesLayer.setRenderer(this.emptyRenderer)

      this.districtsLayer = new FeatureLayer(config.app.layers.districts, {
        outFields: ["*"],
        opacity: 0.5,
        visible: true
      }).setSelectionSymbol(this.selectionSymbol);
      this.districtsLayer.setRenderer(this.emptyRenderer);

      this.map.addLayers([

        this.statesBgLayer,
        this.districtsBgLayer,
        this.statesLayer,
        this.districtsLayer

      ]);

    },

    _subscribeHighlights: function() {

      topic.subscribe("/loc/map/highlight/clear", lang.hitch(this, function() {
        this.statesLayer.clearSelection();
        this.districtsLayer.clearSelection();
      }));
      topic.subscribe("/loc/map/highlight/states", lang.hitch(this, this._doSelectStates));
      topic.subscribe("/loc/map/highlight/districts", lang.hitch(this, this._doSelectDistricts));
      topic.subscribe("/loc/map/highlight/geographies", lang.hitch(this, this._doSelectGeographies));
    
    },

    /* depict the point that was searched on by a map pin graphic */
    _onGeometrySearch: function(e) {

      var geom = e.geometry || null;
      if (geom === null) {
        console.warn("could not display null geometry on map");
        return;
      }

      if (!!geom.getCentroid) {
        geom = geom.getCentroid();
      }

      var mapGeom = new Point({
        latitude: geom.getLatitude(),
        longitude: geom.getLongitude()
      })

      if (this.map.spatialReference.isWebMercator()) {
        mapGeom = webMercatorUtils.geographicToWebMercator(mapGeom);
      }

      this.map.graphics.clear();
      this.map.graphics.add(new Graphic(mapGeom, this.mapPinSymbol, {}, null));

    },

    _queryStates: function(e) {

      var d = new Deferred;

      var states = [].concat(e.states || []);

      states.sort();

      states = array.map(states, function(state) {
        return "STATE_ABBR='" + state + "'";
      });

      if (!states.length) {

        d.resolve([]);

      } else {

        var q = new Query();
        q.returnGeometry = true;
        q.outSpatialReference = this.map.spatialReference;
        q.where = states.join(" OR ");

        this.statesLayer.queryFeatures(q).then(function(results) {

          d.resolve(results.features);

        }, function() {

          d.resolve([]);

        });

      }

      return d;

    },

    _selectStates: function(e) {

      var d = new Deferred;

      var states = [].concat(e.states || []);

      states.sort();

      states = array.map(states, function(state) {
        return "STATE_ABBR='" + state + "'";
      });

      if (!states.length) {

        d.resolve([]);

      } else {

        var q = new Query();
        q.returnGeometry = true;
        q.outSpatialReference = this.map.spatialReference;
        q.where = states.join(" OR ");

        this.statesLayer.selectFeatures(q, FeatureLayer.SELECTION_NEW).then(function(features) {

          d.resolve(features);

        }, function() {

          d.resolve([]);

        });

      }

      return d;

    },

    _doSelectStates: function(e) {

      this._queryStates(e).then(lang.hitch(this, function(features) {

        if (!!features.length) {

          var extent = graphicsUtils.graphicsExtent(features);
          this.map.setExtent(extent, true).then(lang.hitch(this, function() {

            this._selectStates(e);

          }));

        } else {

          var districts = array.map(e.states, function(state) {
            return {
              state: state
            };
          });

          this._doSelectDistricts({ 
            districts: districts 
          });

        }

      }));

    },

    _queryDistricts: function(e) {

      var d = new Deferred();

      var districts = [].concat(e.districts || []);

      districts.sort();

      districts = array.map(districts, function(district) {
        var clauses = [];

        if (!!district.state) {
          clauses.push("STATE_ABBR = '" + district.state + "'");
        }
        if (!!district.district) {
          clauses.push("CD113FIPS = '" + string.pad(district.district, 2, "0") + "'");
        }

        return "(" + clauses.join(" AND ") + ")";
      });

      if (!districts.length) {

        d.resolve([]);

      } else {

        var q = new Query();
        q.returnGeometry = true;
        q.outSpatialReference = this.map.spatialReference;
        q.where = districts.join(" OR ");

        this.districtsLayer.queryFeatures(q).then(function(results) {

          d.resolve(results.features);

        }, function() {

          d.resolve([]);

        });

      }

      return d;

    },

    _selectDistricts: function(e) {

      var d = new Deferred();

      var districts = [].concat(e.districts || []);

      districts.sort();

      districts = array.map(districts, function(district) {
        var clauses = [];

        if (!!district.state) {
          clauses.push("STATE_ABBR = '" + district.state + "'");
        }
        if (!!district.district) {
          clauses.push("CD113FIPS = '" + string.pad(district.district, 2, "0") + "'");
        }

        return "(" + clauses.join(" AND ") + ")";
      });

      if (!districts.length) {

        d.resolve([]);

      } else {

        var q = new Query();
        q.returnGeometry = true;
        q.outSpatialReference = this.map.spatialReference;
        q.where = districts.join(" OR ");

        this.districtsLayer.selectFeatures(q, FeatureLayer.SELECTION_NEW).then(function(features) {

          d.resolve(features);

        }, function() {

          d.resolve([]);

        });

      }

      return d;

    },

    _doSelectDistricts: function(e) {

      this._queryDistricts(e).then(lang.hitch(this, function(features) {

        var extent = graphicsUtils.graphicsExtent(features);
        this.map.setExtent(extent, true).then(lang.hitch(this, function() {

          this._selectDistricts(e);

        }));

      }));

    },

    _doSelectGeographies: function(e) {

      var geographies = e.geographies || { states: [], districts: [] };

      this._queryDistricts(geographies).then(lang.hitch(this, function(districts) {

        this._queryStates(geographies).then(lang.hitch(this, function(states) {

          var graphics = [].concat(districts || []).concat(states || []);

          var extent = graphicsUtils.graphicsExtent(graphics);
          this.map.setExtent(extent, true).then(lang.hitch(this, function() {

            this._selectStates(geographies).then(lang.hitch(this, function() {

              this._selectDistricts(geographies);

            }));

          }));

        }));

      }));

    }

  });

});
