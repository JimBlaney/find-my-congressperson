define("loc/views/MemberSmallView", [
  "dojo/_base/declare",
  "dojo/dom-construct",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/MemberSmallView.html",
  "loc/views/_ViewBase"
], function(declare, domConstruct, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, _ViewBase) {
  
  return declare([ _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, _ViewBase ], {

    templateString: template,

    member: null,

    startup: function() {
      this.inherited(arguments);

      this._formatTemplate(this.member);
    }

  });

});