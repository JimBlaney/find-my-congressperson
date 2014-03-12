define("loc/views/MemberView", [
  "dojo/_base/declare",
  "dojo/dom-construct",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/MemberView.html",
  "loc/views/_ViewBase"
], function(declare, domConstruct, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, _ViewBase) {
  
  return declare([ _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, _ViewBase ], {

    templateString: template,

    member: null,

    startup: function() {
      this.inherited(arguments);

      // TODO
      // this.member_display_name.innerHTML = this.member.get("displayName");
      
      // domConstruct.create("img", {
      //   src: this.member.get("avatar")
      // }, this.member_avatar);

      this._formatTemplate(this.member);
    }

  });

});