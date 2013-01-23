define([
    #Could put jquery, underscore, backbone, openlayers, etc in here
    # and include this file in all define statements.
    'collections/StrategyTypeCollection'
    'collections/CountyNamesCollection'
    'collections/RegionNamesCollection'
    'collections/HouseNamesCollection'
    'collections/SenateNamesCollection'
    'collections/RegionFeatureCollection'

],
(StrategyTypeCollection, CountyNamesCollection, RegionNamesCollection,
    HouseNamesCollection, SenateNamesCollection, RegionFeatureCollection, 
    WugFeatureCollection) ->
    
    namespace = {}

    namespace.VALID_YEARS = ["2010", "2020", "2030", "2040", "2050", "2060"]
    namespace.currYear = "2010" #default year to start on

    #Preloads collections/data that will be shared throughout the app
    #returns a jQuery Promise object
    namespace.bootstrapData = () ->

        this.strategyTypes = new StrategyTypeCollection()
        this.countyNames = new CountyNamesCollection()
        this.regionNames = new RegionNamesCollection()
        this.houseNames = new HouseNamesCollection()
        this.senateNames = new SenateNamesCollection()
        this.regionFeatures = new RegionFeatureCollection()

        #Make a Promise object that ties all the fetches together
        return $.when(
            this.strategyTypes.fetch(),
            this.countyNames.fetch(),
            this.regionNames.fetch(),
            this.houseNames.fetch(),
            this.senateNames.fetch(),
            this.regionFeatures.fetch()
        )

    return namespace
)