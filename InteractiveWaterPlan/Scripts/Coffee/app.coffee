
Ext.Loader.setConfig({
	enabled: true
	disableCaching: false
})

#need to add path for TNRIS custom widgets
Ext.Loader.setPath('TNRIS', 'Scripts/Compiled/TNRIS') 

Ext.require('TNRIS.proxy.ParameterProxy')

Ext.create('Ext.app.Application', {
	name: 'ISWP'
	autoCreateViewport: true
	appFolder: 'Scripts/Compiled/app'

	controllers: ['Map', 'Chart', 'Data']

	launch: () ->

		return null
})
