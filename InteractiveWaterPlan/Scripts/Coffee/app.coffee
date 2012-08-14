
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

	controllers: ['Map', 'Data']

	launch: () ->

		return null
})
