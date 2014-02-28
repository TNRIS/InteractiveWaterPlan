define(['collections/StrategyTypeCollection', 'collections/CountyNamesCollection', 'collections/RegionNamesCollection', 'collections/HouseNamesCollection', 'collections/SenateNamesCollection', 'collections/RegionFeatureCollection'], function(StrategyTypeCollection, CountyNamesCollection, RegionNamesCollection, HouseNamesCollection, SenateNamesCollection, RegionFeatureCollection) {
  var namespace;
  namespace = {};
  namespace.VALID_YEARS = ["2010", "2020", "2030", "2040", "2050", "2060"];
  namespace.currYear = "2010";
  namespace.bootstrapData = function() {
    this.strategyTypes = new StrategyTypeCollection();
    this.countyNames = new CountyNamesCollection();
    this.regionNames = new RegionNamesCollection();
    this.houseNames = new HouseNamesCollection();
    this.senateNames = new SenateNamesCollection();
    this.regionFeatures = new RegionFeatureCollection();
    return $.when(this.strategyTypes.fetch(), this.countyNames.fetch(), this.regionNames.fetch(), this.houseNames.fetch(), this.senateNames.fetch(), this.regionFeatures.fetch());
  };
  return namespace;
});
