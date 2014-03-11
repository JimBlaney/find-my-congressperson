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
  "esri/graphic"
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
  Graphic
) {

  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    map: null,

    highlightSymbol: null,

    searchView: null,

    startup: function() {
      this.inherited(arguments);

      // TODO: create map here
      this.highlightSymbol = null; // TODO

      topic.subscribe("/loc/map/highlight", lang.hitch(this, this._highlightGeometries));

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
    }

  });

});