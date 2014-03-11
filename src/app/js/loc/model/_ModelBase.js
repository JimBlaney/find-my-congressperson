define("loc/model/_ModelBase", [
  "dojo/_base/declare",
  "dojo/_base/lang"
], function(declare, lang) {

  // about 95% borrowed from http://svn.dojotoolkit.org/src/dijit/trunk/_WidgetBase.js

  return declare(null, {

    attributeMap: {},
    
    get: function(name){
      // summary:
      //    Get a property from a widget.
      // name:
      //    The property to get.
      // description:
      //    Get a named property from a widget. The property may
      //    potentially be retrieved via a getter method. If no getter is defined, this
      //    just retrieves the object's property.
      //
      //    For example, if the widget has properties `foo` and `bar`
      //    and a method named `_getFooAttr()`, calling:
      //    `myWidget.get("foo")` would be equivalent to calling
      //    `widget._getFooAttr()` and `myWidget.get("bar")`
      //    would be equivalent to the expression
      //    `widget.bar2`
      var names = this._getAttrNames(name);
      return this[names.g] ? this[names.g]() : this._get(name);
    },

    set: function(name, value){
      // summary:
      //    Set a property on a widget
      // name:
      //    The property to set.
      // value:
      //    The value to set in the property.
      // description:
      //    Sets named properties on a widget which may potentially be handled by a
      //    setter in the widget.
      //
      //    For example, if the widget has properties `foo` and `bar`
      //    and a method named `_setFooAttr()`, calling
      //    `myWidget.set("foo", "Howdy!")` would be equivalent to calling
      //    `widget._setFooAttr("Howdy!")` and `myWidget.set("bar", 3)`
      //    would be equivalent to the statement `widget.bar = 3;`
      //
      //    set() may also be called with a hash of name/value pairs, ex:
      //
      //  | myWidget.set({
      //  |   foo: "Howdy",
      //  |   bar: 3
      //  | });
      //
      //  This is equivalent to calling `set(foo, "Howdy")` and `set(bar, 3)`

      if(typeof name === "object"){
        for(var x in name){
          this.set(x, name[x]);
        }
        return this;
      }
      var names = this._getAttrNames(name),
         setter = this[names.s];
      if(lang.isFunction(setter)){
        // use the explicit setter
        var result = setter.apply(this, Array.prototype.slice.call(arguments, 1));
      }else{
        // Mapping from widget attribute to DOMNode/subwidget attribute/value/etc.
        // Map according to:
        //    1. attributeMap setting, if one exists (TODO: attributeMap deprecated, remove in 2.0)
        //    2. _setFooAttr: {...} type attribute in the widget (if one exists)
        //    3. apply to focusNode or domNode if standard attribute name, excluding funcs like onClick.
        // Checks if an attribute is a "standard attribute" by whether the DOMNode JS object has a similar
        // attribute name (ex: accept-charset attribute matches jsObject.acceptCharset).
        // Note also that Tree.focusNode() is a function not a DOMNode, so test for that.
        var defaultNode = this.focusNode && !lang.isFunction(this.focusNode) ? "focusNode" : "domNode",
          tag = this[defaultNode] && this[defaultNode].tagName,
          attrsForTag = tag && (tagAttrs[tag] || (tagAttrs[tag] = getAttrs(this[defaultNode]))),
          map = name in this.attributeMap ? this.attributeMap[name] :
            names.s in this ? this[names.s] :
              ((attrsForTag && names.l in attrsForTag && typeof value != "function") ||
                /^aria-|^data-|^role$/.test(name)) ? defaultNode : null;
        // if(map != null){
        //   this._attrToDom(name, value, map);
        // }
        this._set(name, value);
      }
      return result || this;
    },

    _attrPairNames: {}, // shared between all widgets

    _getAttrNames: function(name){
      // summary:
      //    Helper function for get() and set().
      //    Caches attribute name values so we don't do the string ops every time.
      // tags:
      //    private

      var apn = this._attrPairNames;
      if(apn[name]){
        return apn[name];
      }
      var uc = name.replace(/^[a-z]|-[a-zA-Z]/g, function(c){
        return c.charAt(c.length - 1).toUpperCase();
      });
      return (apn[name] = {
        n: name + "Node",
        s: "_set" + uc + "Attr", // converts dashes to camel case, ex: accept-charset --> _setAcceptCharsetAttr
        g: "_get" + uc + "Attr",
        l: uc.toLowerCase()        // lowercase name w/out dashes, ex: acceptcharset
      });
    },

    _set: function(/*String*/ name, /*anything*/ value){
      // summary:
      //    Helper function to set new value for specified property, and call handlers
      //    registered with watch() if the value has changed.
      var oldValue = this[name];
      this[name] = value;
      // if(this._created && value !== oldValue){
      //   if(this._watchCallbacks){
      //     this._watchCallbacks(name, oldValue, value);
      //   }
      //   this.emit("attrmodified-" + name, {
      //     detail: {
      //       prevValue: oldValue,
      //       newValue: value
      //     }
      //   });
      // }
    },

    _get: function(/*String*/ name){
      // summary:
      //    Helper function to get value for specified property stored by this._set(),
      //    i.e. for properties with custom setters.  Used mainly by custom getters.
      //
      //    For example, CheckBox._getValueAttr() calls this._get("value").

      // future: return name in this.props ? this.props[name] : this[name];
      return this[name];
    }
  });
});