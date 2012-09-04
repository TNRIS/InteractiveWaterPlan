Ext.define('ISWP.store.Theme', {
    
    extend: 'Ext.data.Store'

    model: 'ISWP.model.Theme'

    storeId: 'themeStore'

    autoLoad: false

    proxy:
        type: 'parameterproxy'
        
        url: 'api/theme/{ThemeName}'

        reader:
            type: 'json'

})