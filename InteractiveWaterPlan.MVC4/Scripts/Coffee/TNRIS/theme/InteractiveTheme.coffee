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

    #child classes must define this method
    loadTheme: () ->
        throw new error("Must define loadTheme()")
        return null 

    #child classes must define this method
    unloadTheme: () ->
        throw new error("Must define unloadTheme()")
        return null 

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