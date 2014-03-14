define("loc/model/Member", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "loc/model/_ModelBase"
], function(declare, lang, _ModelBase) {

  // map of sunlight -> model properties
  var PROPERTY_MAP = {
    "bioguide_id": "memberId",
    "birthday": "birthday",
    "chamber": "chamber",
    "contact_form": "contactForm",
    "district": "district",
    "facebook_id": "facebookId",
    "first_name": "firstName",
    "gender": "gender",
    "in_office": "inOffice",
    "last_name": "lastName",
    "middle_name": "middleName",
    "name_suffix": "nameSuffix",
    "nickname": "nickname",
    "office": "office",
    "party": "party",
    "phone": "phone",
    "senate_class": "senateClass",
    "state": "state",
    "state_name": "stateName",
    "state_rank": "stateRank",
    "term_end": "termEnd",
    "term_start": "termStart",
    "title": "title",
    "twitter_id": "twitterId",
    "website": "website",
    "youtube_id": "youtubeId"
  };

  var Member = declare([ _ModelBase ], {

    /* String */
    memberId: null,

    /* String ("house" | "senate") */
    chamber: null,

    /* Number (1 | 2 | 3) (will be -1 if chamber === "house") */
    senateClass: -1,

    /* String ("junior" | "senior") (will only be populated if chamber === "senate") */
    stateRank: null,

    /* String */
    title: null,

    /* String */
    firstName: null,

    /* String */
    nickname: null,

    /* String */
    middleName: null,

    /* String */
    lastName: null,

    /* String */
    nameSuffix: null,

    /* String (two-letter abbreviation) */
    state: null,

    /* String (full state name) */
    stateName: null,

    /* String (will only be populated if chamber === "house") */
    district: null,

    /* String ("D" | "I" | "R") */
    party: null,

    /* String ("F" | "M") */
    gender: null,

    /* Boolean */
    inOffice: false,

    /* String */
    birthday: null,

    /* String */
    termStart: null,

    /* String */
    termEnd: null,

    facebookId: null,

    twitterId: null,

    youtubeId: null,

    office: null,

    website: null,

    contactForm: null,

    phone: null,

    committeeCount: -1,

    _getDisplayNameAttr: function() {

      return lang.replace("{title}. {firstName} \"{nickname}\" {middleName} {lastName}, {nameSuffix}", this).replace(", null", "").replace(/null/g, "").replace("\"\" ", "").replace("  ", " ", "g").trim();

    },

    /* String */
    _getAvatarAttr: function() {

      return require.toUrl(lang.replace("loc/views/images/avatars/64/{memberId}.jpg", this)); 

    },

    _getTermAttr: function() {

      var startYear = this.termStart.substring(0, 4);
      var endYear = this.termEnd.substring(0, 4);
      return startYear + " - " + endYear;

    },

    _getFullTitleAttr: function() {

      return (this.chamber === "senate" ? "Senator" : "Representative");

    },

    _getPartyNameAttr: function() {

      return (this.party === "D" ? "Democrat" : (this.party === "R" ? "Republican" : "Independent"));

    },

    _getFacebookUrlAttr: function() {

      return lang.replace("http://facebook.com/{facebookId}", this);

    },

    _getFacebookHandleAttr: function() {

      return this.get("facebookUrl");

    },    

    _getTwitterUrlAttr: function() {

      return lang.replace("http://twitter.com/{twitterId}", this);

    },

    _getTwitterHandleAttr: function() {

      return lang.replace("@{twitterId}", this);

    },

    _getYoutubeUrlAttr: function() {

      return lang.replace("http://youtube.com/{youtubeId}", this);

    },

    _getYoutubeHandleAttr: function() {

      return lang.replace("{youtubeId}", this).replace("channel/", "Channel: ");

    },

    _getTelNoAttr: function() {

      return (this.get("phone") || "123-456-7890").replace(/(...).(...).(....)/, "($1) $2-$3");

    },

    _getContactLabelAttr: function() {

      return "Contact";

    },

    _getRankDistrictAttr: function() {

      var format = null;

      if (this.get("chamber") === "senate") {
        format = "{stateRank}, Class {senateClass}";
      } else {
        if (this.get("district") === 0) {
          format = "{stateName} at-Large";
        } else {
          format = "{stateName} District {district}";
        }
      }

      var val = lang.replace(format, this);
      return val.substring(0, 1).toUpperCase() + val.substring(1);

    }

  });

  var sortFunction = function(lhs, rhs) {
    if (lhs.chamber === rhs.chamber) {
      if (lhs.chamber === "senate") {
        if (lhs.stateRank === rhs.stateRank) {}
        else if (lhs.stateRank === "senior") {
          return -1;
        } else {
          return 1;
        }
      }
      if (lhs.lastName < rhs.lastName) {
        return -1;
      } else if (lhs.lastName > rhs.lastName) {
        return 1;
      } else {
        if (lhs.firstName < rhs.firstName) {
          return 1;
        } else if (lhs.firstName > rhs.firstName) {
          return -1;
        } else {
          return 0;
        }
      }
    } else if (lhs.chamber === "senate") {
      return -1;
    } else {
      return 1;
    }
  };

  lang.mixin(Member, {
    PROPERTY_MAP: PROPERTY_MAP,
    SORT_FUNCTION: sortFunction
  });

  return Member;

});