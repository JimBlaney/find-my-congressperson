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

      // startup the bootstrap-selects
      $(".selectpicker").selectpicker();
      // manually attach to the bootstrap-select controls' events -- dojoAttachEvent won't work
      $(this.zipInput).keypress(lang.hitch(this, function (e) {
        if (e.which == 13) {
          $('form#login').submit();
          return false;    //<---- Add this line
        }
      }));



      $(this.stateSelect).on("change", lang.hitch(this, this._doStateSearch));
      $(this.committeeSelect).on("change", lang.hitch(this, this._doCommitteeSearch));
    },

    _doZIPSearch: function(e) {

      var value = $(this.zipInput).val() || null;
      if (value === null || value === "-") {
        return;
      }

      topic.publish("/loc/search/members/zip", {
        zip: value
      });

    },

    _doStateSearch: function(e) {

      var value = $(this.stateSelect).selectpicker("val") || null;
      if (value === null || value === "-") {
        return;
      }

      topic.publish("/loc/search/members/state", {
        state: value
      });

      $(this.stateSelect).selectpicker("val", "-");

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

    _doNameSearch: function(e) {

      var value = e.name || null;
      if (value === null || name.length === 0) {
        return;
      }

      topic.publish("/loc/search/members/name", {
        name: value
      });

    },

    _doCommitteeSearch: function(e) {

      var value = $(this.committeeSelect).selectpicker("val") || null;
      if (value === null || value === "-") {
        return;
      }

      topic.publish("/loc/search/committees/id", {
        committeeId: value
      });

      $(this.committeeSelect).selectpicker("val", "-");

    }

  });

});
