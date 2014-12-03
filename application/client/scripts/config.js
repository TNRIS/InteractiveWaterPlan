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
  .constant('ENTITY_MAX_RADIUS', 18)
  .constant('ENTITY_MIN_RADIUS', 4)
  .constant('REGION_STYLE', {
    stroke: false,
    color: '#ffcc00',
    weight: 3,
    opacity: 1,
    fillOpacity: 0
  })
  .constant('ENTITY_STYLES', {
    'demands': {
      color: '#000',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.75,
      fillColor: '#0AC763'
    },
    'needs': {
      color: '#000',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.75
    },
    'strategies': {
      color: '#000',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.75,
      fillColor: '#FFA84B'
    },
    'supplies': {
      color: '#000',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.75,
      fillColor: '#FFA84B'
    }
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
  .constant('DATA_VALUE_PREFIXES', {
    'needs': 'N',
    'demands': 'D',
    'strategies': 'SS',
    'supplies': 'WS'
  })
  .constant('TREE_MAP_SUBJECTS', {
    'needs': 'Water Needs',
    'demands': 'Water Demands',
    'strategies': 'Recommended Supply Strategies',
    'supplies': 'Existing Water Supplies'
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
  .constant('REGION_TABLE_COLS', [
    {map: 'WugRegion', label: 'Region', cellClass: 'text-center'},
    {map: 'EntityName', label: 'Name', cellTemplateUrl: 'templates/linkcell.html'},
    {map: 'WugCounty', label: 'County', cellTemplateUrl: 'templates/linkcell.html'},
    {map: 'WugType', label: 'Water User Type', cellTemplateUrl: 'templates/linkcell.html'}
  ])
  .constant('ISWP_VARS', ISWP_VARS) //boostrapped variables
  .constant('API_PATH', '/api/v1/')
;
