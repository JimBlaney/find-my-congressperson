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

    resultsLabel: "",

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

        domStyle.set(this.searchStatusNode, { display: "inline-block" });

      })); 

      topic.subscribe("/loc/search/expand", lang.hitch(this, function() {

        this.resultsLabel = "";

        if (this.resultsView !== null) {
          if (!!this.resultsView.destroyRecursive) {
            this.resultsView.destroyRecursive();
          }
        }

        domConstruct.empty(this.resultsNode);
        domConstruct.empty(this.resultsNavNode);
      }));

      topic.subscribe("/loc/app/highlight/committeeMembers", lang.hitch(this, this._doHightlightCommitteeMembers));

    },

    _subscribeResults: function() {

      topic.subscribe("/loc/results/members", lang.hitch(this, this._onMembersResults));
      topic.subscribe("/loc/results/committees", lang.hitch(this, this._onCommitteesResults));

    },

    _doHightlightMembers: function(members, method) {

      topic.publish("/loc/map/highlight/clear", {});
console.log(method);
      var districts = this._getDistrictsForMembers(members);
      if (!!districts.length && (method !== "state" && method !== "state/territory")) {
        topic.publish("/loc/map/highlight/districts", {
          districts: districts
        });
      } else {
        var states = this._getStatesForMembers(members);
        if (!!states.length) {
          topic.publish("/loc/map/highlight/states", {
            states: states
          });
        }
      }

    },

    _onMembersResults: function(e) {

      var members = [].concat(e.members || []);

      this._doHightlightMembers(members, e.method);

      domConstruct.empty(this.resultsNavNode);
      domConstruct.create("div", {
        innerHTML: this.resultsLabel,
        "class": "loc-results-nav-title"
      }, this.resultsNavNode);

      var memberIds = array.map(members, function(member) {
        return member.memberId;
      });

      if (members.length === 0) {

        console.warn("there were no members results");
        domConstruct.create("div", {
          innerHTML: "There were no results",
          "class": "loc-results-no-results"
        }, this.resultsNode);
        domStyle.set(this.searchStatusNode, { display: "none" });
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

    _doHightlightCommitteeMembers: function(e) {

      var members = [].concat(e.members || []);

      var geographies = this._getMemberGeographies(members);

      topic.publish("/loc/map/highlight/geographies", {
        geographies: geographies
      });

    },

    _onCommitteesResults: function(e) {

      domStyle.set(this.searchStatusNode, { display: "none" });
      
      var committees = [].concat(e.committees || []);

      this._doHightlightCommitteeMembers(committees[0]);
      
      domConstruct.empty(this.resultsNavNode);
      domConstruct.create("div", {
        innerHTML: this.resultsLabel,
        "class": "loc-results-nav-title"
      }, this.resultsNavNode);

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

      var roundCoord = function(coord) {
        return Math.floor(coord * 1000000) / 1000000.0;
      }

      this.resultsLabel = "Location: " + e.source; //roundCoord(geom.x) + ", " + roundCoord(geom.y);

      sunlight.getMembersAtLocation(geom).then(function(members) {

        topic.publish("/loc/results/members", {
          members: members,
          method: "geometry"
        });

      }, function(error) {

        console.error(error);
        topic.publish("/loc/app/error", {
          error: error,
          during: "Point Search"
        });

      });

    },

    _getStatesForMembers: function(members) {

      var states = [];

      array.forEach(members, function(member) {
        var state = member.get("state");
        if (array.indexOf(states, state) === -1) {
          states.push(state);
        }
      });

      return states;

    },

    _getDistrictsForMembers: function(members) {

      var districts = [];

      var filteredMembers = array.filter(members, function(member) {
        return member.get("chamber") === "house";
      });

      array.forEach(filteredMembers, function(member) {
        var district = {
          state: member.get("state"),
          district: member.get("district")
        };
        if (array.indexOf(districts, district) === -1) {
          districts.push(district);
        }
      });

      return districts;

    },

    _getMemberGeographies: function(members) {

      var states = [];
      var districts = [];

      var senateMembers = array.filter(members, function(member) {
        return member.get("chamber") === "senate";
      });

      array.forEach(senateMembers, function(member) {
        var state = member.get("state");
        if (array.indexOf(states, state) === -1) {
          states.push(state);
        }
      });

      var houseMembers = array.filter(members, function(member) {
        return member.get("chamber") === "house";
      });

      array.forEach(houseMembers, function(member) {
        var district = {
          state: member.get("state"),
          district: member.get("district")
        };
        if (array.indexOf(districts, district) === -1) {
          districts.push(district);
        }
      });

      return {
        states: states,
        districts: districts
      };

    },

    _doZIPSearch: function(e) {

      domConstruct.empty(this.resultsNode);

      var zip = e.zip || null;
      if (zip === null) {
        console.warn("could not search on null ZIP");
        return;
      }

      this.resultsLabel = "ZIP: " + zip;

      sunlight.getMembersForZIP(zip).then(function(members) {

        topic.publish("/loc/results/members", {
          members: members,
          method: "zip"
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

      this.resultsLabel = "State/Territory: " + e.stateName || "";

      sunlight.getMembersForState(state).then(function(members) {

        topic.publish("/loc/results/members", {
          members: members,
          method: "state"
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

      this.resultsLabel = "Name: " + e.memberName;

      sunlight.getMemberById(memberId).then(function(members) {

        topic.publish("/loc/results/members", {
          members: members,
          method: "member"
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

      this.resultsLabel = "Committee: " + e.committeeName || "";

      sunlight.getCommitteeById(committeeId).then(function(committees) {

        topic.publish("/loc/results/committees", {
          committees: committees,
          showMembers: true,
          method: "committee"
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

      domStyle.set(this.searchStatusNode, { display: "inline-block" });

      var memberId = e.memberId || null;
      if (memberId === null || memberId.length === 0) {
        console.warn("could not search on null MemberId");
        return;
      }

      domConstruct.empty(this.resultsNavNode);

      var navNode = domConstruct.create("a", {
        href: "#",
        innerHTML: this.resultsLabel,
        "class": "loc-results-nav"
      }, this.resultsNavNode);

      domConstruct.create("div", {
          innerHTML: "&raquo; Committees for " + e.model.get("displayName"),
          "class": "loc-results-nav-title"
      }, this.resultsNavNode);

      sunlight.getCommitteesForMembers(memberId).then(lang.hitch(this, function(committees) {

        domStyle.set(this.searchStatusNode, { display: "none" });

        domStyle.set(this.resultsView.domNode, { display: "none" });
        this.previousResultsView = this.resultsView;

        this.resultsView = new CommitteesView();
        this.resultsView.startup();
        this.resultsView.set("committees", committees);

        on(navNode, "click", lang.hitch(this, function(evt) {
          
          this._doResultsNavPrevious();

          evt.preventDefault();
          return false;
        }));

        domConstruct.place(this.resultsView.domNode, this.resultsNode);

      }));

    },

    _doResultsNavPrevious: function() {

      this.resultsView.destroyRecursive();
      this.resultsView = this.previousResultsView;
      this.previousResultsView = null;

      this._doHightlightMembers(this.resultsView.members, this.resultsLabel.substring(0, this.resultsLabel.indexOf(":")).toLowerCase());

      domConstruct.empty(this.resultsNavNode);
      domConstruct.create("div", {
        innerHTML: this.resultsLabel,
        "class": "loc-results-nav-title"
      }, this.resultsNavNode);

      domStyle.set(this.resultsView.domNode, { display: "block" });

    }

  });

});