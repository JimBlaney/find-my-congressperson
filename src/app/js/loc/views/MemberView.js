define("loc/views/MemberView", [
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/MemberView.html"
], function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template) {
  
  return declare([ _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin ], {

    templateString: template,

    startup: function() {
      this.inherited(arguments);

      // TODO

    }

  });

});