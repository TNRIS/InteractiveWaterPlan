
Ext.define('TNRIS.proxy.ParameterProxy', {
    
    extend: 'Ext.data.proxy.Ajax'
    
    alias: 'proxy.parameterproxy'

    buildUrl: (request) ->
        
        console.log(request)

        return this.substituteParameters(this.callParent(arguments), request)

    substituteParameters: (url, request) ->

        for key of request.params
            url = url.replace("{#{key}}", request.params[key])
   
        return url
})