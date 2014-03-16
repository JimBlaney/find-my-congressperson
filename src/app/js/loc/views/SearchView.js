define("loc/views/SearchView", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-class",
  "dojo/topic",
  "dojo/on",
  "dojo/Deferred",
  "esri/geometry/Point",
  "esri/SpatialReference",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/SearchView.html",
  "loc/dal/fixtures",
  "dojo/_base/fx",
  "dojo/fx"
], function(
  declare, 
  lang,
  domClass,
  topic,
  on,
  Deferred,
  Point,
  SpatialReference,
  _WidgetBase, 
  _TemplatedMixin, 
  _WidgetsInTemplateMixin, 
  template,
  fixtures,
  fx1,
  fx2
) {

  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    startup: function() {
      this.inherited(arguments);

      this._setupControls();

      this._subscribeTopics();
    },

    _subscribeTopics: function() {

      var anim = null;
      var animHandle = null;

      topic.subscribe("/loc/search/collapse", lang.hitch(this, function() {
          domClass.add(this.domNode, "collapsed");
      }));
      topic.subscribe("/loc/search/expand", lang.hitch(this, function() {
          domClass.remove(this.domNode, "collapsed");
      }));

      on(this.searchPlaceholderNode, "click", function() {
        topic.publish("/loc/search/expand", {});
      });

    },

    _setupControls: function() {

      // zip
      $(this.zipInput).keypress(lang.hitch(this, function (e) {
        if (e.which == 13) {
          this._doZIPSearch();
          $(this.zipInput).val("");
          return false;
        }
      }));

      // state 
      $(this.stateSelect).selectpicker();
      $(this.stateSelect).on("change", lang.hitch(this, this._doStateSearch));

      // name
      $(this.nameInput).typeahead({
        source: fixtures.MEMBERS,
        itemSelected: lang.hitch(this, function(fn, id, name) {
          topic.publish("/loc/search/collapse", {});
          topic.publish("/loc/search/members/id", {
            memberId: id
          });
          $(this.nameInput).val("");
        })
      });
      $(this.nameInput).keypress(lang.hitch(this, function (e) {
        if (e.which == 13) {
          this._doNameSearch();
          return false;
        }
      }));

      // committee
      $(this.committeeSelect).selectpicker();
      $(this.committeeSelect).on("change", lang.hitch(this, this._doCommitteeSearch));
    },

    _doZIPSearch: function(e) {
      
      var value = $(this.zipInput).val() || null;
      if (value === null || value === "") {
        return;
      }

      topic.publish("/loc/search/collapse", {});

      topic.publish("/loc/search/members/zip", {
        zip: value
      });

    },

    _doStateSearch: function(e) {

      var value = $(this.stateSelect).selectpicker("val") || null;
      if (value === null || value === "-") {
        return;
      }

      topic.publish("/loc/search/collapse", {});

      topic.publish("/loc/search/members/state", {
        state: value
      });

      $(this.stateSelect).selectpicker("val", "-");

    },

    _doGeolocationSearch: function() {

      domClass.add(this.geolocationIconNode, "fa-spin");

      this._getGeolocation().then(lang.hitch(this, function(location) {

        domClass.remove(this.geolocationIconNode, "fa-spin");

        topic.publish("/loc/search/collapse", {});

        var point = new Point(location.coords.longitude, location.coords.latitude, new SpatialReference(4326));

        console.group("Geolocation Success");
        console.log(point);
        console.groupEnd("Geolocation Success");

        topic.publish("/loc/search/members/geometry", {
          geometry: point
        });

      }), lang.hitch(this, function(error) {

        domClass.remove(this.geolocationIconNode, "fa-spin");

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

      }));

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
  
      var value = $(this.nameInput).val() || null;
      if (value === null || name.length === 0) {
        return;
      }

      topic.publish("/loc/search/collapse", {});

      topic.publish("/loc/search/members/name", {
        name: value
      });

    },

    _doCommitteeSearch: function(e) {

      var value = $(this.committeeSelect).selectpicker("val") || null;
      if (value === null || value === "-") {
        return;
      }

      topic.publish("/loc/search/collapse", {});

      topic.publish("/loc/search/committees/id", {
        committeeId: value
      });

      $(this.committeeSelect).selectpicker("val", "-");

    }

  });

});
