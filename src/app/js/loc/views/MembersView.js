define("loc/views/MembersView", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/MembersView.html",
  "loc/views/MemberView"
], function(
  declare,
  lang,
  array,
  dom,
  domConstruct,
  domStyle,
  _WidgetBase,
  _TemplatedMixin,
  _WidgetsInTemplateMixin,
  template,
  MemberView
) {
  
  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    members: null,

    startup: function() {
      this.inherited(arguments);

    },

    _setMembersAttr: function(members) {

      this.members = [].concat(members);

      var senators = array.filter(this.members, function(member) { return member.get("chamber") === "senate"; });
      domStyle.set(this.senH2, { display: !!senators.length ? "block" : "none" });
      domConstruct.empty(this.senNode);
      for (var i = 0; i < senators.length; i++) {

        var memberView = new MemberView({
          member: senators[i]
        });
        memberView.startup();

        domConstruct.place(memberView.domNode, this.senNode);

      }

      var representatives = array.filter(members, function(member) { return member.get("chamber") === "house"; });
      domStyle.set(this.repH2, { display: !!representatives.length ? "block" : "none" });
      domConstruct.empty(this.repNode);
      for (var i = 0; i < representatives.length; i++) {

        var memberView = new MemberView({
          member: representatives[i]
        });
        memberView.startup();

        domConstruct.place(memberView.domNode, this.repNode);

      }
    }

  });

});