define("loc/model/Committee", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "loc/model/_ModelBase"
], function(declare, lang, _ModelBase) {

  var PROPERTY_MAP = {
    "chamber": "chamber",
    "committe_id": "committeeId",
    "member_ids": "memberIds"
    "name": "name",
    "office": "office",
    "parent_committee_id": "parentCommitteeId",
    "phone": "phone",
    "subcommittee": "isSubcommittee",
    "url": "url"
  };

  var Committee = declare([ _ModelBase ], {

    /* String */
    commiteeId: null,

    /* String ("house" | "senate") */
    chamber: null,

    /* String */
    name: null,

    url: null,

    office: null,

    phone: null,

    /* Boolean */
    isSubcommittee: false,

    /* String */
    parentCommitteeId: null,

    memberIds: null

  });

  lang.mixin(Committe, {
    PROPERTY_MAP: PROPERTY_MAP
  })

  return Committee;

});