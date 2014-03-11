if (!dojoConfig) {
  dojoConfig = {};
}

dojoConfig.app = {
  sunlight: {
    url: "//congress.api.sunlightfoundation.com/",
    apiKey: "af18bc25a8d94b829d277a09a244efcc"
  },
  layers: {
    states: "//sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
    districts: "//maps1.arcgisonline.com/ArcGIS/rest/services/USA_Congressional_Districts/MapServer/1"
  }
}