﻿#This is to prevent errors in IE when a console statement
# is in the remaining code
try
    console.log("IE is broken")
catch e
    console = {}
    console.log = () ->
        return null


Ext.Loader.setConfig({
	enabled: true
	disableCaching: false
})

#need to add path for TNRIS custom widgets
Ext.Loader.setPath('TNRIS', 'Scripts/Compiled/TNRIS') 

#not sure why this doesn't just get loaded, but it doesn't
Ext.require('TNRIS.proxy.ParameterProxy')

Ext.create('Ext.app.Application', {
	name: 'ISWP'
	autoCreateViewport: true
	appFolder: 'Scripts/Compiled/app'

	controllers: ['Main']

	launch: () ->

		return null
})
