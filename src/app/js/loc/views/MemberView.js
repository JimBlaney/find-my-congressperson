define("loc/views/MemberView", [
  "dojo/_base/declare",
  "dojo/dom-construct",
  "dojo/topic",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/MemberView.html",
  "loc/views/_ViewBase"
], function(declare, domConstruct, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, _ViewBase) {
  
  return declare([ _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, _ViewBase ], {

    templateString: template,

    member: null,

    startup: function() {
      this.inherited(arguments);

      this._formatTemplate(this.member);
    },

    _doMemberCommitteeSearch: function(e) {

      topic.publish("/loc/search/committees/memberId", {
        memberId: this.member.get("memberId"),
        model: this.member
      });

      // kill the event
      e.preventDefault();
      return false;
    },

    _showOnMap: function() {

      
      
    }

  });

});