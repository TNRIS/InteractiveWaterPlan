###
Custom proxy class that can replace variables in parameterized URLS
 for Ajax requests
For example, /Path/To/Resource/{Type}/{VarId}
 would have {Type} and {VarId} replaced if those keys were specified in the request params
###
Ext.define('TNRIS.proxy.ParameterProxy', {
    
    extend: 'Ext.data.proxy.Ajax'
    
    alias: 'proxy.parameterproxy'

    buildUrl: (request) ->
        return this.substituteParameters(this.callParent(arguments), request)

    substituteParameters: (url, request) ->

        for key of request.params
            if url.indexOf("{#{key}}") != -1
                url = url.replace("{#{key}}", request.params[key])
                delete request.params[key]
   
        return url
})