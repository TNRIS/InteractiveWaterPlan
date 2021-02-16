/* Configuration parameters for iswpApp */
/* global ISWP_VARS */
angular.module('iswpApp.config', [])
  .constant('SWP_WMS_URL', 'https://services.tnris.org/ags/services/swp/swp/MapServer/WMSServer')
  .constant('TILES_URL', 'https://tile{s}.texasstatewaterplan.org')
  .constant('STATE_MAP_CONFIG', {
    zoom: 5,
    centerLat: 31.780548,
    centerLng: -99.022907
  })
  .constant('ENTITY_SINGLE_RADIUS', 6)
  .constant('ENTITY_MAX_RADIUS', 18)
  .constant('ENTITY_MIN_RADIUS', 4)
  .constant('REGION_STYLE', {
    stroke: false,
    color: '#ffcc00',
    weight: 3,
    opacity: 1,
    fillOpacity: 0
  })
  .constant('LINE_STYLE', {
    color: 'orange',
    weight: 1.2,
    opacity: 0.6
  })
  .constant('TREE_MAP_COLORS', {
    MAX: '#3182bd',
    MID: '#9ecae1',
    MIN: '#deebf7'
  })
  .constant('MAPSERVER_SOURCE_URL', 'https://mapserver.tnris.org?map=/tnris_mapfiles/iswp_sourcefeatures2012.map')
  .constant('MAPSERVER_POLY_TILES', '&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=PolygonSources&map.imagetype=')
  .constant('MAPSERVER_LINE_TILES', '&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=LineSources&map.imagetype=')
  .constant('MAPSERVER_POINT_TILES', '&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=PointSources&map.imagetype=')
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
      fillOpacity: 0.9,
      fillColor: '#FFA84B'
    },
    'supplies': {
      color: '#000',
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.9,
      fillColor: '#FFB90D'
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
    'strategies': 'Recommended Strategy Supply Volumes',
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
    // {map: 'WugRegion', label: 'Region', cellClass: 'text-center'},
    {map: 'EntityName', label: 'Name', cellTemplateUrl: 'templates/linkcell.html'},
    {map: 'WugCounty', label: 'County', cellTemplateUrl: 'templates/linkcell.html'},
    {map: 'WugType', label: 'Water User Type', cellTemplateUrl: 'templates/linkcell.html'}
  ])
  .constant('COUNTY_TABLE_COLS', [
      // {map: 'WugCounty', label: 'County'},
      {map: 'EntityName', label: 'Name', cellTemplateUrl: 'templates/linkcell.html'},
      {map: 'WugType', label: 'Water User Type', cellTemplateUrl: 'templates/linkcell.html'}
  ])
  .constant('TYPE_TABLE_COLS', [
    // {map: 'WugType', label: 'Water User Type'},
    {map: 'EntityName', label: 'Name', cellTemplateUrl: 'templates/linkcell.html'},
    {map: 'WugCounty', label: 'County', cellTemplateUrl: 'templates/linkcell.html'}
  ])
  .constant('ENTITY_TABLE_COLS', [
    // {map: 'EntityName', label: 'Name'},
    {map: 'WugRegion', label: 'Region', cellClass: 'text-center', cellTemplateUrl: 'templates/linkcell.html'},
    {map: 'WugCounty', label: 'County', cellTemplateUrl: 'templates/linkcell.html'},
    {map: 'WugType', label: 'Water User Type', cellTemplateUrl: 'templates/linkcell.html'}
  ])
  .constant('WMS_TABLE_ADDL_COLS', [
    {map: 'StrategyName', label: 'Strategy Name'},
    {map: 'wmsType', label: 'Strategy Type', headerClass: 'text-center', cellTemplateUrl: 'templates/linkcell.html'},
    {map: 'SourceName', label: 'Source', headerClass: 'text-center', cellTemplateUrl: 'templates/linkcell.html'}
  ])
  .constant('ISWP_VARS', ISWP_VARS) //boostrapped variables
  .constant('API_PATH', '/api/v1/')
;
