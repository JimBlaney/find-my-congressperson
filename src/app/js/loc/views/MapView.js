define("loc/views/MapView", [
	"dojo/_base/config",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"dojo/topic",
	"dojo/on",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"esri/map",
  "esri/graphic",
  "esri/symbols/PictureMarkerSymbol",
  "esri/geometry/Extent",
  "esri/geometry/Point",
  "esri/geometry/webMercatorUtils",
], function(
	config,
	declare,
	lang,
	domConstruct,
	topic,
	on,
	_WidgetBase,
	_TemplatedMixin,
	Map,
	Graphic,
	PictureMarkerSymbol,
	Extent,
	Point,
	webMercatorUtils
) {
	
	return declare([ _WidgetBase, _TemplatedMixin ], {

		templateString: "<div><div class='loc-map' id='${id}_map' data-dojo-attach-point='mapNode'></div></div>",

		startup: function() {
			this.inherited(arguments);

			this._createMap();

			topic.subscribe("/loc/search/members/geometry", lang.hitch(this, this._onGeometrySearch));
      
      topic.subscribe("/loc/search/expand", lang.hitch(this, function() {
        this.map.graphics.clear();
      }));

		},

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

			var symbol = new PictureMarkerSymbol({
        url: require.toUrl("loc/views/images/map-pin-blue-blank.png"),
        width: 10,
        height: 19,
        yoffset: 10
      });

      this.map.graphics.clear();
      this.map.graphics.add(new Graphic(mapGeom, symbol, {}, null));

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

      // set up map highlight functionality
      this.highlightSymbol = null; // TODO
      topic.subscribe("/loc/map/highlight", lang.hitch(this, function(e) {

        var geometries = [].concat(e.geometries || []);

        var graphics = this.map.graphics;
        graphics.clear();

        for (var i = 0; i < geometries.length; i++) {
          graphics.add(new Graphic(geometries[i], this.highlightSymbol, {}, null));
        }
      }));

      // set up click -> search
      on(this.map, "click", lang.hitch(this, function(e) {

        var geom = e.mapPoint;

        if (geom.spatialReference.isWebMercator()) {
          geom = webMercatorUtils.webMercatorToGeographic(geom);
        }

        topic.publish("/loc/search/members/geometry", {
          geometry: geom
        });

      }));

    }

	});

});