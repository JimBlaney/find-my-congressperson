define("loc/views/CommitteeView", [
  "dojo/_base/declare",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/CommitteeView.html",
  "loc/views/_ViewBase"
], function(declare, domConstruct, domClass, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, _ViewBase) {
  
  return declare([ _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, _ViewBase ], {

    templateString: template,

    committee: null,

    showMembers: false,

    startup: function() {
      this.inherited(arguments);

      if (!this.showMembers) {
        domClass.add(this.committeeMembersNode, "collapsed");
      }

      this._formatTemplate(this.committee);
    }

  });

});