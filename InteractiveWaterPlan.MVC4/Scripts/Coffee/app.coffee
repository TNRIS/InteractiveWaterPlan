#This is to prevent errors in IE when a console statement
# is in the remaining code
try
    console.log("Console is defined")
catch e
    console = {}
    console.log = () ->
        return null

#Must set the default headers to application/json so that browsers will play
# well with MVC4's WebApi
Ext.Ajax.defaultHeaders = {
    'Accept'         : 'application/json, application/xml',
    'Content-Type'   : 'application/json'
}

Ext.Loader.setConfig({
    enabled: true
    disableCaching: true
})

#need to add path for TNRIS custom widgets
Ext.Loader.setPath('TNRIS', "#{Ext.get("scripts_path").dom.value}/Compiled/TNRIS") 

#not sure why these don't just get loaded, but they don't
Ext.require('TNRIS.proxy.ParameterProxy')
Ext.require('TNRIS.theme.InteractiveTheme')
Ext.require('TNRIS.theme.ExistingSupplyTheme')
Ext.require('TNRIS.theme.RecommendedReservoirsTheme')

Ext.create('Ext.app.Application', {
    name: 'ISWP'
    autoCreateViewport: true
    appFolder: "#{Ext.get("scripts_path").dom.value}/Compiled/app"

    controllers: ['Main']
})

#Binds a loadMask to all AbstractView components
Ext.define("Ext.view.AbstractView.LoadMask", {
    override: "Ext.view.AbstractView",
    onRender: () -> 
        this.callParent();
        if this.loadMask and Ext.isObject(this.store)
            this.setMaskBind(this.store)
        return null
});