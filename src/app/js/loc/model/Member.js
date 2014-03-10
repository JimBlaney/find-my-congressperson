declare("loc/model/Member", [
  "dojo/_base/declare"
], function(declare) {

  return declare(null, {

    /* String */
    memberId: null,

    /* String ("house" | "senate") */
    chamber: null,

    /* String */
    name: null,

    /* String */
    state: null,

    /* String */
    district: null,

    // TODO: other properties

    /* String */
    _getAvatarAttr: function() {

      return "";
    }

  });

});