define("loc/views/_ViewBase", [
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/query",
  "dojo/dom-attr",
  "dojo/dom-construct",
  "dojo/NodeList-data"
], function(
  declare,
  lang,
  query,
  domAttr,
  domConstruct
) {
  
  var MODEL_PROPERTY_ATTR = "data-view-model-property";
  var MODEL_ELEM_TAG_ATTR = "data-view-element-tag";
  var MODEL_ELEM_STY_ATTR = "data-view-element-style";
  var MODEL_ELEM_CLS_ATTR = "data-view-element-class";
  var MODEL_ELEM_FMT_ATTR = "data-view-element-value-format";

  return declare(null, {

    /*
     * Traverses the elements domNode for elements containing the
     * attribute MODEL_PROPERTY_ATTR. When found, it builds a new
     * node with the model property value as the element tag name
     * by the MODEL_ELEM_TAG_ATTR attribute (default: span)
     *
     */
    _formatTemplate: function(model) {

      var nodes = query("*", this.domNode);

      console.log(query("[data-view-model-property]"));

      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        
        if (domAttr.has(node, MODEL_PROPERTY_ATTR)) {
          var property = domAttr.get(node, MODEL_PROPERTY_ATTR);
          var tag = "span";
          var attrs = ["innerHTML"];

          if (domAttr.has(node, MODEL_ELEM_TAG_ATTR)) {
            tag = domAttr.get(node, MODEL_ELEM_TAG_ATTR);
          }

          if (tag === "img") {
            attrs = ["src"];
          } else if (tag === "a") {
            attrs.push("href");
          }

          var props = {};

          var format = "{value}";
          if (domAttr.has(node, MODEL_ELEM_FMT_ATTR)) {
            format = domAttr.get(node, MODEL_ELEM_FMT_ATTR);
          }

          for (var j = 0; j < attrs.length; j++) {
            var attr = attrs[j];
            props[attr] = lang.replace(format, {
              value: model.get(property)
            });
          }

          if (domAttr.has(node, MODEL_ELEM_STY_ATTR)) {
            props["style"] = domAttr.get(node, MODEL_ELEM_STY_ATTR);
          }

          if (domAttr.has(node, MODEL_ELEM_CLS_ATTR)) {
            props["class"] = domAttr.get(node, MODEL_ELEM_CLS_ATTR);
          }

          domConstruct.create(tag, props, node);
        }
      }
    }

  });

});