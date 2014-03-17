define("loc/Application", [
  "dojo/_base/config",
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/topic",
  "dojo/on",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/templates/Application.html",
  "loc/views/SearchView",
  "loc/views/MembersView",
  "loc/views/CommitteesView",
  "esri/map",
  "esri/graphic",
  "esri/symbols/PictureMarkerSymbol",
  "esri/geometry/Extent",
  "esri/geometry/Point",
  "esri/geometry/webMercatorUtils",
  "loc/dal/sunlight",
  "loc/views/MapView"
], function(
  config, 
  declare, 
  lang, 
  array,
  domConstruct, 
  domStyle,
  topic, 
  on,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin, 
  template, 
  SearchView, 
  MembersView,
  CommitteesView,
  Map, 
  Graphic,
  PictureMarkerSymbol,
  Extent,
  Point,
  webMercatorUtils,
  sunlight
) {

  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    map: null,

    highlightSymbol: null,

    searchView: null,

    resultsView: null,

    previousResultsView: null,

    startup: function() {
      this.inherited(arguments);

      this._setupViewArea();

      this._subscribeSearch();

      this._subscribeResults();

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
      topic.subscribe("/loc/search/committees/memberId", lang.hitch(this, this._doMemberCommitteeSearch));

      topic.subscribe("/loc/search/collapse", lang.hitch(this, function() {

        domStyle.set(this.searchStatusNode, { display: "block" });

      })); 

      topic.subscribe("/loc/search/expand", lang.hitch(this, function() {

        if (this.resultsView !== null) {
          if (!!this.resultsView.destroyRecursive) {
            this.resultsView.destroyRecursive();
          }
        }

        domConstruct.empty(this.resultsNode);
        domConstruct.empty(this.resultsNavNode);
      }));

    },

    _subscribeResults: function() {

      topic.subscribe("/loc/results/members", lang.hitch(this, this._onMembersResults));
      topic.subscribe("/loc/results/committees", lang.hitch(this, this._onCommitteesResults));

    },

    _onMembersResults: function(e) {

      var members = e.members || [];

      var memberIds = array.map(members, function(member) {
        return member.memberId;
      });

      if (members.length === 0) {

        console.warn("there were no members results");
        domConstruct.create("div", {
          innerHTML: "There were no results",
          "class": "loc-results-no-results"
        }, this.resultsNode);
        return;
      }

      sunlight.getCommitteesForMembers(memberIds, true).then(lang.hitch(this, function(errh, committees) {

        domStyle.set(this.searchStatusNode, { display: "none" });

        for (var i = 0; i < members.length; i++) {

          var memberId = members[i].memberId;

          var memberCommittees = array.filter(committees || [], function(committee) {
            return array.indexOf(committee.get("memberIds") || [], memberId) > -1;
          })

          members[i].set("committeeCount", memberCommittees.length);

        }

        this.resultsView = new MembersView();
        this.resultsView.startup();
        this.resultsView.set("members", members);

        domConstruct.empty(this.resultsNode);
        domConstruct.place(this.resultsView.domNode, this.resultsNode);  
      
      }, function(error) {

        console.error(error);
        topic.publish("/loc/app/error", {
          error: error,
          during: "Point Search"
        });

      }));

    },

    _onCommitteesResults: function(e) {

      domStyle.set(this.searchStatusNode, { display: "none" });
      
      var committees = e.committees || [];

      var committeeIds = array.map(committees, function(committee) {
        return committee.committeeId;
      });

      this.resultsView = new CommitteesView();
      this.resultsView.startup();
      this.resultsView.set("showMembers", !!e.showMembers);
      this.resultsView.set("committees", committees);

      domConstruct.empty(this.resultsNode);
      domConstruct.place(this.resultsView.domNode, this.resultsNode);  

    },

    _doGeometrySearch: function(e) {

      topic.publish("/loc/search/collapse", {});
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
          committees: committees,
          showMembers: true
        })

      }, function(error) {

        console.error(error);
        topic.publish("/loc/app/error", {
          error: error,
          during: "Committee Id Search"
        });

      });

    },

    _doMemberCommitteeSearch: function(e) {

      var memberId = e.memberId || null;
      if (memberId === null || memberId.length === 0) {
        console.warn("could not search on null MemberId");
        return;
      }

      sunlight.getCommitteesForMembers(memberId).then(lang.hitch(this, function(committees) {

        domStyle.set(this.resultsView.domNode, { display: "none" });
        this.previousResultsView = this.resultsView;

        this.resultsView = new CommitteesView();
        this.resultsView.startup();
        this.resultsView.set("committees", committees);

        var navNode = domConstruct.create("a", {
          href: "#",
          innerHTML: "&laquo; Members",
          "class": "loc-results-nav"
        }, this.resultsNavNode);
        on(navNode, "click", lang.hitch(this, function(evt) {

          this._doResultsNavPrevious();

          evt.preventDefault();
          return false;

        }));

        domConstruct.create("div", {
          innerHTML: "&laquo; Committees for " + e.model.get("displayName"),
          "class": "loc-results-nav-title"
        }, this.resultsNavNode);

        domConstruct.place(this.resultsView.domNode, this.resultsNode);

      }));

    },

    _doResultsNavPrevious: function() {

      this.resultsView.destroyRecursive();
      this.resultsView = this.previousResultsView;
      this.previousResultsView = null;

      domConstruct.empty(this.resultsNavNode);

      domStyle.set(this.resultsView.domNode, { display: "block" });

    }

  });

});