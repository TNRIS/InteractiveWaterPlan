﻿
Ext.Loader.setConfig({
	enabled: true
	disableCaching: false
})

Ext.create('Ext.app.Application', {
	name: 'ISWP'
	autoCreateViewport: true
	appFolder: 'Scripts/Compiled/app'

	controllers: ['Map', 'Chart']

	launch: () ->

		#this.map = initializeMap()

		return null
})
