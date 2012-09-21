﻿#This is to prevent errors in IE when a console statement
# is in the remaining code
try
    console.log("Console is defined")
catch e
    console = {}
    console.log = () ->
        return null

#Must set the default headers to application/json so that Firefox will play
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
Ext.Loader.setPath('TNRIS', 'Scripts/Compiled/TNRIS') 

#not sure why this doesn't just get loaded, but it doesn't
Ext.require('TNRIS.proxy.ParameterProxy')
Ext.require('TNRIS.theme.InteractiveTheme')
Ext.require('TNRIS.theme.WaterUsageTheme')
Ext.require('TNRIS.theme.ProposedReservoirsTheme')

Ext.create('Ext.app.Application', {
	name: 'ISWP'
	autoCreateViewport: true
	appFolder: 'Scripts/Compiled/app'

	controllers: ['Main']

	launch: () ->

		return null
})
