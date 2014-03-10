declare("loc/model/Committee", [
  "dojo/_base/declare"
], function(declare) {

  return declare(null, {

    /* String */
    commiteeId: null,

    /* String ("house" | "senate") */
    chamber: null,

    /* String */
    name: null,

    /* Boolean */
    isSubcommittee: false,

    /* String */
    parentCommitteeId: null

  });

});