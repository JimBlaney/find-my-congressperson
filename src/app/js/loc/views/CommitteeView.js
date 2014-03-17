define("loc/views/CommitteeView", [
  "dojo/_base/declare",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dojo/topic",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dojo/text!loc/views/templates/CommitteeView.html",
  "loc/views/_ViewBase",
  "loc/views/MemberSmallView"
], function(
  declare, 
  domConstruct, 
  domClass, 
  topic, 
  _WidgetBase, 
  _TemplatedMixin, 
  _WidgetsInTemplateMixin, 
  template, 
  _ViewBase, 
  MemberSmallView
) {
  
  return declare([ _WidgetBase, _TemplatedMixin,_WidgetsInTemplateMixin, _ViewBase ], {

    templateString: template,

    committee: null,

    showMembers: false,

    startup: function() {
      this.inherited(arguments);

      if (!this.showMembers) {
        domClass.add(this.committeeMembersNode, "collapsed");
        domClass.add(this.memberDisplayActionNode, "fa-angle-down");
        domClass.remove(this.memberDisplayActionNode, "fa-angle-up");
      } else {
        domClass.remove(this.committeeMembersNode, "collapsed");
        domClass.add(this.memberDisplayActionNode, "fa-angle-up");
        domClass.remove(this.memberDisplayActionNode, "fa-angle-down");
      }

      this._formatTemplate(this.committee);

      if (!!this.committee.members) {
        for (var i = 0; i < this.committee.members.length; i++) {

          var member = this.committee.members[i];

          var view = new MemberSmallView({
            member: member
          });
          view.startup();

          domConstruct.place(view.domNode, this.committeeMembersNode);
        }
      }
    },

    _toggleMemberDisplay: function() {
      this.showMembers = !this.showMembers;
      if (!this.showMembers) {
        domClass.add(this.committeeMembersNode, "collapsed");
        domClass.add(this.memberDisplayActionNode, "fa-angle-down");
        domClass.remove(this.memberDisplayActionNode, "fa-angle-up");
      } else {
        domClass.remove(this.committeeMembersNode, "collapsed");
        domClass.add(this.memberDisplayActionNode, "fa-angle-up");
        domClass.remove(this.memberDisplayActionNode, "fa-angle-down");
      }
    },

    _showOnMap: function(e) {

      topic.publish("/loc/app/highlight/committeeMembers", {
        members: this.committee.members
      });

      e.preventDefault();
      return false;
    }

  });

});