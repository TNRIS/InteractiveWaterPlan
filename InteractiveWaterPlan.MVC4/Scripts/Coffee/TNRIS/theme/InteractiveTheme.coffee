Ext.define('TNRIS.theme.InteractiveTheme', {
    

    ###
    Base class that provides a common interface for publishing events. 
    Subclasses are expected to to have a property "events" with all the events defined, 
    and, optionally, a property "listeners" with configured listeners defined.
    ###

    mixins: {
        observable: 'Ext.util.Observable'
    }

    themeStore: null
    
    mapComp: null #reference to the map component
    
    mainContainer: null #reference to the main panel (for chart, data grid, etc)

    contentPanel: null

    loadTheme: null #must define this method
    unloadTheme: null #must define this method


    #TODO: The events aren't really useful since so many async loads happen in each theme
    # Either figure out something better, or remove them

    constructor: (config) ->
        this.mixins.observable.constructor.call(this, config)

        return null

    unload: () ->
        this.themeStore.each((rec) =>
            this.mapComp.removeLayersFromMap(rec.data.Layers)
            return true
        )

        this.unloadTheme()

        return null

    load: () ->   
        this.loadTheme()

        return null

    updateYear: (year) ->
        return null

    showFeatureResult: (features, clickedPoint, year) ->
        return null

})