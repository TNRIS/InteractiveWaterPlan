/* Configuration parameters for iswpApp */
/* global ISWP_VARS */
angular.module('iswpApp.config', [])
  .constant('SWP_WMS_URL', 'http://services.tnris.org/ags/services/swp/swp/MapServer/WMSServer')
  .constant('TILES_URL', 'http://tile{s}.texasstatewaterplan.org')
  .constant('STATE_MAP_CONFIG', {
    zoom: 5,
    centerLat: 31.780548,
    centerLng: -99.022907
  })
  .constant('DEMANDS_ENTITY_STYLE', {
    color: '#000',
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.75,
    fillColor: '#0AC763'
  })
  .constant('NEEDS_ENTITY_STYLE', {
    color: '#000',
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.75
  })
  .constant('SOURCE_STYLES', {
    //TODO
    'groundwater': {

    },
    'indirect': {

    },
    'river': {

    },
    'reservoir': {

    },
    'system': {

    }
  })
  .constant('SUMMARY_TABLE_COLS', [
    {map: 'WugRegion', label: 'Region', cellTemplateUrl: 'templates/linkcell.html', headerClass: 'text-center', cellClass: 'text-center'},
    {map: 'MUNICIPAL', label: 'Municipal', formatFunction: 'number', formatParameter: 0, headerClass: 'text-center', cellClass: 'number'},
    {map: 'MANUFACTURING', label: 'Manufacturing', formatFunction: 'number', formatParameter: 0, headerClass: 'text-center', cellClass: 'number'},
    {map: 'MINING', label: 'Mining', formatFunction: 'number', formatParameter: 0, headerClass: 'text-center', cellClass: 'number'},
    {map: 'STEAMELECTRIC', label: 'Steam-Electric', formatFunction: 'number', formatParameter: 0, headerClass: 'text-center', cellClass: 'number'},
    {map: 'LIVESTOCK', label: 'Livestock', formatFunction: 'number', formatParameter: 0, headerClass: 'text-center', cellClass: 'number'},
    {map: 'IRRIGATION', label: 'Irrigation', formatFunction: 'number', formatParameter: 0, headerClass: 'text-center', cellClass: 'number'},
    {map: 'TOTAL', label: 'Total', formatFunction: 'number', formatParameter: 0, headerClass: 'text-center', cellClass: 'number'}
  ])
  .constant('ISWP_VARS', ISWP_VARS) //boostrapped variables
  .constant('API_PATH', '/api/v1/')
;
