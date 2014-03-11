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
    "district": "district",
    "first_name": "firstName",
    "gender": "gender",
    "in_office": "inOffice",
    "last_name": "lastName",
    "middle_name": "middleName",
    "name_suffix": "nameSuffix",
    "nickname": "nickname",
    "party": "party",
    "senate_class": "senateClass",
    "state": "state",
    "state_name": "stateName",
    "state_rank": "stateRank",
    "term_end": "termEnd",
    "term_start": "termStart",
    "title": "title"
  };

  var Member = declare([ _ModelBase ], {

    /* String */
    memberId: null,

    /* String ("house" | "senate") */
    chamber: null,

    /* Number (1 | 2 | 3) (will be -1 if chamber === "house") */
    senateClass: -1,

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

    /* String ("junior" | "senior") (will only be populated if chamber === "senate") */
    stateRank: null,

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

    /* String */
    _getAvatarAttr: function() {

      return ""; // TODO
    }

  });

  lang.mixin(Member, {
    PROPERTY_MAP: PROPERTY_MAP
  });

  return Member;

});