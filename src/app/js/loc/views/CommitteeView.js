define("loc/views/CommitteeView", [
  "dojo/_base/declare",
  "dojo/dom-construct",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/CommitteeView.html",
  "loc/views/_ViewBase"
], function(declare, domConstruct, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, _ViewBase) {
  
  return declare([ _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, _ViewBase ], {

    templateString: template,

    committee: null,

    startup: function() {
      this.inherited(arguments);

      this._formatTemplate(this.committee);
    }

  });

});