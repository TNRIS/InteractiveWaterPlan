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
    
    mainPanel: null #reference to the main panel (for chart, data grid, etc)

    contentPanel: null

    loadTheme: null #must define this method
    unloadTheme: null #must define this method

    constructor: (config) ->
        this.mixins.observable.constructor.call(this, config)

        this.addEvents(
            'beforethemeload'
            'themeload'
            'beforethemeunload'
            'themeunload'
        )

        return null

    unload: () ->
        this.fireEvent("beforethemeunload")

        this.themeStore.each((rec) =>
            this.mapComp.removeLayersFromMap(rec.data.Layers)
            return true
        )

        this.unloadTheme()

        this.fireEvent("themeunload")
        return null

    load: () ->
        this.fireEvent("beforethemeload", this.theme)

        this.loadTheme()

        this.fireEvent("themeload", this.theme)
        return null

    updateYear: (year) ->
        return null

    showFeatureResult: (features, clickedPoint, year) ->
        return null

})