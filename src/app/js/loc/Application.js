define("loc/Application", [
  "dojo/_base/config",
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
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
  "esri/geometry/webMercatorUtils",
  "loc/dal/sunlight"
], function(
  config, 
  declare, 
  lang, 
  array,
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
  webMercatorUtils,
  sunlight
) {

  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    map: null,

    highlightSymbol: null,

    searchView: null,

    startup: function() {
      this.inherited(arguments);

      this._createMap();

      this._setupViewArea();

      this._subscribeSearch();

      this._subscribeResults();

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
        })

      }));

    },

    _setupViewArea: function() {

      var d = domConstruct.create("div", {}, this.searchAreaNode)

      this.searchView = new SearchView({}, d);
      this.searchView.startup();

    },

    _subscribeSearch: function() {

      topic.subscribe("/loc/search/members/geometry", lang.hitch(this, this._doGeometrySearch));
      topic.subscribe("/loc/search/members/zip", lang.hitch(this, this._doZIPSearch));
      topic.subscribe("/loc/search/members/state", lang.hitch(this, this._doStateSearch));
      topic.subscribe("/loc/search/members/id", lang.hitch(this, this._doMemberSearch));

      topic.subscribe("/loc/search/committees/id", lang.hitch(this, this._doCommitteeSearch));
      topic.subscribe("/loc/search/committees/memberId", lang.hitch(this, this._doCommitteeMemberSearch));

    },

    _subscribeResults: function() {

      topic.subscribe("/loc/results/members", lang.hitch(this, this._onMembersResults));
      topic.subscribe("/loc/results/committees", lang.hitch(this, this._onCommitteesResults));

    },

    _onMembersResults: function(e) {

      var members = e.members || [];

      var memberIds = array.map(members, function(member) {
        return member.memberId;
      })

      sunlight.getCommitteesForMembers(memberIds).then(lang.hitch(this, function(errh, committees) {

        for (var i = 0; i < members.length; i++) {

          var memberId = members[i].memberId;

          var memberCommittees = array.filter(committees || [], function(committee) {
            return array.indexOf(committee.get("memberIds") || [], memberId) > -1;
          })

          members[i].set("committeeCount", memberCommittees.length);

        }

        var view = new MembersView();
        view.startup();
        view.set("members", members);

        domConstruct.empty(this.resultsNode);
        domConstruct.place(view.domNode, this.resultsNode);  
      
      }, function(error) {

        console.error(error);
        topic.publish("/loc/app/error", {
          error: error,
          during: "Point Search"
        });

      }));

    },

    _onCommitteesResults: function(e) {
      
      console.group("oncommittees");
      console.log(e);
      console.groupEnd("oncommittees");

    },

    _doGeometrySearch: function(e) {

      domConstruct.empty(this.resultsNode);

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

      domConstruct.empty(this.resultsNode);

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

      domConstruct.empty(this.resultsNode);

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

    },

    _doMemberSearch: function(e) {

      domConstruct.empty(this.resultsNode);

      var memberId = e.memberId || null;
      if (memberId === null) {
        console.warn("could not search on null MemberId");
        return;
      }

      sunlight.getMemberById(memberId).then(function(members) {

        topic.publish("/loc/results/members", {
          members: members
        });

      }, function(error) {

        console.error(error);
        topic.publish("/loc/app/error", {
          error: error,
          during: "Member Id Search"
        });

      });

    },

    _doCommitteeSearch: function(e) {

      domConstruct.empty(this.resultsNode);

      var committeeId = e.committeeId || null;
      if (committeeId === null) {
        console.warn("could not search on null CommitteeId");
        return;
      }

      sunlight.getCommitteeById(committeeId).then(function(committees) {

        topic.publish("/loc/results/committees", {
          committees: committees
        })

      }, function(error) {

        console.error(error);
        topic.publish("/loc/app/error", {
          error: error,
          during: "Committee Id Search"
        });

      });

    },

    _doCommitteeMemberSearch: function(e) {

      console.log("_doCommitteeMemberSearch");

    }

  });

});