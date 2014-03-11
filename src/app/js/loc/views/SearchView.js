define("loc/views/SearchView", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/topic",
  "dojo/Deferred",
  "esri/geometry/Point",
  "esri/SpatialReference",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/SearchView.html"
], function(
  declare, 
  lang,
  topic,
  Deferred,
  Point,
  SpatialReference,
  _WidgetBase, 
  _TemplatedMixin, 
  _WidgetsInTemplateMixin, 
  template
) {

  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    startup: function() {
      this.inherited(arguments);

    },

    _doGeolocationSearch: function() {

      this._getGeolocation().then(function(location) {

        var point = new Point(location.coords.longitude, location.coords.latitude, new SpatialReference(4326));

        console.group("Geolocation Success");
        console.log(point);
        console.groupEnd("Geolocation Success");

        topic.publish("/loc/search/members/geometry", {
          geometry: point
        });

      }, function(error) {

        console.group("Geolocation Error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.log("PERMISSION_DENIED");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("POSITION_UNAVAILABLE");
            break;
          case error.TIMEOUT:
            console.log("TIMEOUT");
            break;
          default:
            console.log("UNKNOWN");
            break;
        }
        console.groupEnd("Geolocation Error");

      });

    },

    _getGeolocation: function() {
      
      var d = new Deferred();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(d.resolve, d.reject);
      } else {
        d.reject();
      }

      return d;
    },

    _doStateSearch: function() {
      // TODO
    }

  });

});
