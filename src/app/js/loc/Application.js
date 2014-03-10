declare("loc/Application", [
  "dojo/_base/config",
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/topic",
  "dojo/on",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "esri/map"
], function(config, declare, lang, topic, on, _WidgetBase, _TemplatedMixin, Map) {

  return ([ _WidgetBase, _TemplatedMixin ], {

    // TODO: load this from template (dojo/text)
    templateString: "<div class='loc-application'></div>",

    startup: function() {
      this.inherited(arguments);

      // TODO: create map here
    }

  });

});