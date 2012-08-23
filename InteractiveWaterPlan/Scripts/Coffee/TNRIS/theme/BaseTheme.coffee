Ext.define('TNRIS.observable.BaseTheme', {
    

    ###
    Base class that provides a common interface for publishing events. 
    Subclasses are expected to to have a property "events" with all the events defined, 
    and, optionally, a property "listeners" with configured listeners defined.
    ###
    
    mixins: {
        observable: 'Ext.util.Observable'
    }


    constructor: (config) ->
        this.mixins.observable.constructor.call(this, config)

        this.addEvents(
            'beforethemeload'
            'themeload'
            'beforethemeunload'
            'themeunload'
        )


})