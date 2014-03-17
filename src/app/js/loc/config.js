if (!dojoConfig) {
  dojoConfig = {};
}

dojoConfig.app = {
  sunlight: {
    url: "//congress.api.sunlightfoundation.com/",
    apiKey: "af18bc25a8d94b829d277a09a244efcc"
  },
  selectionColor: [ 255, 255, 0 ],
  basemap: "gray",
  layers: {
    states: "http://legislator-demo.esri.com/arcgis/rest/services/Congress/Congress113/MapServer/0",
    districts: "http://legislator-demo.esri.com/arcgis/rest/services/Congress/Congress113/MapServer/1"
  }
}