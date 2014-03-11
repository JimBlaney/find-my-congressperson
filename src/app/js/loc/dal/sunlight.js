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
        apikey: this.API_KEY
      }, data || {});

      return script.get(this.BASE_URL + methodName, {
        jsonp: "callback",
        query: data
      }); 

    },

    _populateModel: function(T, deferred, data) {

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

        deferred.resolve(tArr);

      } else {

        deferred.reject();
        
      }

    },

    getAllMembers: function() {

      var d = new Deferred();

      this._makeApiCall("legislators", {
        per_page: "all"
      }).then(lang.hitch(this, this._populateModel, Member, d));

      return d;

    },

    getMemberById: function(id) {

      var d = new Deferred();

      this._makeApiCall("legislators", {
        bioguide_id: id,
        per_page: "all"
      }).then(lang.hitch(this, this._populateModel, Member, d));

      return d;

    },

    getAllCommittees: function() {

      var d = new Deferred();

      this._makeApiCall("committees", {
        per_page: "all"
      }).then(lang.hitch(this, this._populateModel, Committee, d));

      return d;

    },

    getCommitteesForMembers: function(members) {

      var d = new Deferred();

      this._makeApiCall("committees", {
        member_ids: [].concat(members).join(","),
        per_page: "all"
      }).then(lang.hitch(this, this._populateModel, Committee, d));

      return d;

    }

  };

  return sunlight;

});