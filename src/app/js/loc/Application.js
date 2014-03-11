define("loc/Application", [
  "dojo/_base/config",
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/topic",
  "dojo/on",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!./templates/Application.html",
  "esri/map"
], function(config, declare, lang, topic, on, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, Map) {

console.log(template);

  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    startup: function() {
      this.inherited(arguments);

      // TODO: create map here
    }

  });

});