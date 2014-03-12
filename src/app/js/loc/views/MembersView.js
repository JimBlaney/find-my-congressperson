define("loc/views/MembersView", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom",
  "dojo/dom-construct",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/MembersView.html",
  "loc/views/MemberView"
], function(
  declare,
  lang,
  dom,
  domConstruct,
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

      domConstruct.empty(this.containerNode);

      for (var i = 0; i < members.length; i++) {

        var memberView = new MemberView({
          member: this.members[i]
        });
        memberView.startup();

        domConstruct.place(memberView.domNode, this.containerNode);

      }

    }

  });

});