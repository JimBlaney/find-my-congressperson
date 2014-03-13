define("loc/dal/sunlight", [
  "dojo/_base/config",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/request/script",
  "dojo/Deferred",
  "loc/model/Member",
  "loc/model/Committee"
], function(config, lang, array, script, Deferred, Member, Committee) {

  // add a trailing slash if necessary
  if (config.app.sunlight.url.lastIndexOf("/") !== config.app.sunlight.url.length - 1) {
    config.app.sunlight.url = config.app.sunlight.url + "/";
  }

  var sunlight = {
    
    API_KEY: config.app.sunlight.apiKey,
    BASE_URL:  config.app.sunlight.url,

    /**
     *
     * @returns dojo/Deferred
     */
    _makeApiCall: function(methodName, data) {

      data = lang.mixin({
        apikey: this.API_KEY,
        per_page: "all"
      }, data || {});

      return script.get(this.BASE_URL + methodName, {
        jsonp: "callback",
        query: data
      }); 

    },

    _populateModel: function(T, deferred, data) {

      T.PROPERTY_MAP = T.PROPERTY_MAP || {};

      if (!!data.results.length) {

        var tArr = array.map(data.results, function(d) {

          var t = new T();

          for (var p in d) {
            if (T.PROPERTY_MAP.hasOwnProperty(p)) {
              t.set(T.PROPERTY_MAP[p], d[p]);
            } else if (t.hasOwnProperty(p)) {
              t.set(p, d[p]);
            }
          }

          return t;

        });

        if (!!T.SORT_FUNCTION) {
          tArr.sort(T.SORT_FUNCTION);
        }

        deferred.resolve(tArr);

      } else {

        deferred.resolve([]);

      }

    },

    getAllMembers: function() {

      var d = new Deferred();

      this._makeApiCall("legislators", {
        
      }).then(lang.hitch(this, this._populateModel, Member, d));

      return d;

    },

    getMemberById: function(id) {

      var d = new Deferred();

      this._makeApiCall("legislators", {
      
        bioguide_id: id
      
      }).then(lang.hitch(this, this._populateModel, Member, d));

      return d;

    },

    getMembersAtLocation: function(point) {

      var d = new Deferred();

      this._makeApiCall("legislators/locate", {
      
        latitude:  point.y,
        longitude: point.x
      
      }).then(lang.hitch(this, this._populateModel, Member, d));

      return d;

    },

    getMembersForZIP: function(zip) {

      var d = new Deferred();

      this._makeApiCall("legislators/locate", {
      
        zip: zip
      
      }).then(lang.hitch(this, this._populateModel, Member, d));

      return d;

    },

    getMembersForState: function(state) {

      var d = new Deferred();

      this._makeApiCall("legislators", {
      
        state: state
      
      }).then(lang.hitch(this, this._populateModel, Member, d));

      return d;

    },

    getAllCommittees: function() {

      var d = new Deferred();

      this._makeApiCall("committees", {
        
      }).then(lang.hitch(this, this._populateModel, Committee, d));

      return d;

    },

    getCommitteesForMembers: function(members) {

      var d = new Deferred();

      this._makeApiCall("committees", {

        member_ids: [].concat(members).join(",")
      
      }).then(lang.hitch(this, this._populateModel, Committee, d));

      return d;

    },

    getNonSubCommittees: function() {

      var d = new Deferred();

      this._makeApiCall("committees", {

        subcommittee: false
      
      }).then(lang.hitch(this, this._populateModel, Committee, d));

      return d;

    },

    getSubCommittees: function(committeeId) {

      var d = new Deferred();

      this._makeApiCall("committees", {

        subcommittee: true,
        parent_committee_id: committeeId
      
      }).then(lang.hitch(this, this._populateModel, Committee, d));

      return d;

    }

  };

  return sunlight;

});