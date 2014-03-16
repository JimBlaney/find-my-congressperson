define("loc/model/Committee", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "loc/model/_ModelBase"
], function(declare, lang, _ModelBase) {

  var PROPERTY_MAP = {
    "chamber": "chamber",
    "committee_id": "committeeId",
    "member_ids": "memberIds",
    "members": "members",
    "name": "name",
    "office": "office",
    "parent_committee_id": "parentCommitteeId",
    "phone": "phone",
    "subcommittee": "isSubcommittee",
    "url": "url"
  };

  var Committee = declare([ _ModelBase ], {

    /* String */
    committeeId: null,

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

    parentCommitteeName: null,

    memberIds: null,

    members: null,

    _setMembersAttr: function(val) {

      var members = [].concat(val.legislators || val || []);

      for (var i = 0; i < members.length; i++) {

        var member = members[i];

        // TODO: hydrate model class if needed

        members[i] = member;

      }

      this.members = members;

    },

    _getChamberDisplayAttr: function() {

      var val = lang.replace("{chamber} Committee", this).replace("ate", "atorial");
      return val.substring(0, 1).toUpperCase() + val.substring(1);
      
    },

    _getDisplayNameAttr: function() {

      var name = "";

      var parentCommitteeName = this.get("parentCommitteeName");
      if (parentCommitteeName !== null && !!parentCommitteeName.length) {
        name += parentCommitteeName + " &gt; ";
      }

      name += this.get("name");
      return name;

    }

  });

  lang.mixin(Committee, {
    PROPERTY_MAP: PROPERTY_MAP
  })

  return Committee;

});