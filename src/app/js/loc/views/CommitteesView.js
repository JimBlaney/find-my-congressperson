define("loc/views/CommitteesView", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/CommitteesView.html",
  "loc/views/CommitteeView"
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
  CommitteeView
) {
  
  return declare([ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

    templateString: template,

    committees: null,

    startup: function() {
      this.inherited(arguments);

    },

    _setCommitteesAttr: function(committees) {

      this.committees = [].concat(committees);

      for (var i = 0; i < this.committees.length; i++) {

        var committeeView = new CommitteeView({
          committee: this.committees[i]
        });
        committeeView.startup();

        domConstruct.place(committeeView.domNode, this.containerNode);

      }
      
    }

  });

});