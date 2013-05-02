﻿using System.Net.Http.Formatting;
using System.Web.Http;
using InteractiveWaterPlan.MVC4.Formatters;

namespace InteractiveWaterPlan.MVC4
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            //Register the CSV formatter to respond when given a 
            // query string parameter for "format=csv"
            var strategyCsvFormatter = new StrategyCsvFormatter(
                new QueryStringMapping("format", "csv", "text/csv")
            );
            config.Formatters.Add(strategyCsvFormatter);

            #region Place Routes
            config.Routes.MapHttpRoute(
                "GetRegionalWaterPlanningAreas",
                "api/place/rwpa",
                new { controller = "Place", action = "GetRegionalPlanningAreas" }
            );

            config.Routes.MapHttpRoute(
                "GetAllPlaceCategoriesRoute",
                "api/place/categories",
                new { controller = "Place", action = "GetAllPlaceCategories" }
            );

            config.Routes.MapHttpRoute(
                "GetPlaceFeatureRoute",
                "api/place/feature",
                new { controller = "Place", action = "GetPlaceFeature" }
            );

            config.Routes.MapHttpRoute(
               "GetPlaceFeatureCenterRoute",
               "api/place/feature/center",
               new { controller = "Place", action = "GetPlaceCenter" }
            );

            config.Routes.MapHttpRoute(
               "GetPlaceFeatureHullRoute",
               "api/place/feature/hull",
               new { controller = "Place", action = "GetPlaceHull" }
            );

            config.Routes.MapHttpRoute(
                "GetPlacesByNamePart",
                "api/place",
                new { controller = "Place", action = "GetPlacesByNamePart" }
            );


            #endregion

            #region Strategy Routes

            config.Routes.MapHttpRoute(
                "GetStrategiesInRegion",
                "api/strategies/region/{regionLetter}",
                new { 
                    controller = "Strategy", 
                    regionLetter = RouteParameter.Optional,
                    action = "GetStrategiesInRegion" 
                }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesInCounty",
                "api/strategies/county/{countyId}",
                new { 
                    controller = "Strategy", 
                    countyId = RouteParameter.Optional,
                    action = "GetStrategiesInCounty" 
                }
            );

            /* TODO: REMOVED until data queries can be properly resolved
            config.Routes.MapHttpRoute(
                "GetStrategiesInHouseDistrict",
                "api/strategies/district/house",
                new { controller = "Strategy", action = "GetStrategiesInHouseDistrict" }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesInSenateDistrict",
                "api/strategies/district/senate",
                new { controller = "Strategy", action = "GetStrategiesInSenateDistrict" }
            );*/

            config.Routes.MapHttpRoute(
                "GetStrategiesByType",
                "api/strategies/type/{typeId}",
                new { 
                    controller = "Strategy", 
                    typeId = RouteParameter.Optional,
                    action = "GetStrategiesByType" 
                }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesForEntity",
                "api/strategies/entity/{entityId}",
                new { 
                    controller = "Strategy", 
                    entityId = RouteParameter.Optional,
                    action = "GetStrategiesForEntity" 
                }
            );
            
            config.Routes.MapHttpRoute(
                "GetStrategiesByProjectIdRoute",
                "api/strategies/project/{projectId}",
                new { 
                    controller = "Strategy", 
                    projectId = RouteParameter.Optional,
                    action = "GetStrategiesByProjectId" 
                }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesBySource",
                "api/strategies/source/{sourceId}",
                new { 
                    controller = "Strategy", 
                    sourceId = RouteParameter.Optional,
                    action = "GetStrategiesBySource" 
                }
            );

            config.Routes.MapHttpRoute(
                "GetStrategyTypesRoute",
                "api/strategy/types",
                new { 
                    controller = "Strategy", 
                    action = "GetStrategyTypes" 
                }
            );

            #endregion

            #region Supply Routes

            config.Routes.MapHttpRoute(
                "GetCountyNetSuppliesRoute",
                "api/supply/county-net",
                new { controller = "CountyNetSupply", action = "GetCountyNetSupplies" }
            );

            #endregion

            #region Boundary Routes

            config.Routes.MapHttpRoute(
                "GetAllCountyNames",
                "api/boundary/counties/names",
                new { controller = "Boundary", action = "GetAllCountyNames" }
            );

            config.Routes.MapHttpRoute(
                "GetAllCounties",
                "api/boundary/counties/all",
                new { controller = "Boundary", action = "GetAllCounties" }
            );

            config.Routes.MapHttpRoute(
                "GetAllPlanningRegionNames",
                "api/boundary/regions/names",
                new { controller = "Boundary", action = "GetAllPlanningRegionNames" }
            );

            config.Routes.MapHttpRoute(
                "GetAllPlanningRegions",
                "api/boundary/regions/all",
                new { controller = "Boundary", action = "GetAllPlanningRegions" }
            );

            config.Routes.MapHttpRoute(
                "GetPlanningRegion",
                "api/boundary/region/{regionLetter}",
                new { controller = "Boundary", action = "GetPlanningRegion" }
            );

            config.Routes.MapHttpRoute(
                "GetAllHouseDistricts",
                "api/boundary/districts/house/all",
                new { controller = "Boundary", action = "GetAllHouseDistrictFeatures" }
            );

            config.Routes.MapHttpRoute(
                "GetAllSenateDistricts",
                "api/boundary/districts/senate/all",
                new { controller = "Boundary", action = "GetAllSenateDistrictFeatures" }
            );

            config.Routes.MapHttpRoute(
                "GetAllHouseDistrictNames",
                "api/boundary/districts/house/names",
                new { controller = "Boundary", action = "GetAllHouseDistrictNames" }
            );

            config.Routes.MapHttpRoute(
                "GetAllSenateDistrictNames",
                "api/boundary/districts/senate/names",
                new { controller = "Boundary", action = "GetAllSenateDistrictNames" }
            );


            #endregion

            #region Entity Routes
            
            config.Routes.MapHttpRoute(
                "GetEntityRoute",
                "api/entity/{entityId}",
                new { controller = "Entity", action = "GetEntity" }
            );

            config.Routes.MapHttpRoute(
                "GetEntitiesAutocomplete",
                "api/entities/auto",
                new { controller = "Entity", action = "GetEntitiesAutocomplete" }
            );

            #endregion

            #region Source Routes

            config.Routes.MapHttpRoute(
                "GetSourcesForEntityRoute",
                "api/entity/{entityId}/sources", /* Note: entity route */
                new { controller = "Source", action = "GetSourcesForEntity" }
            );

            config.Routes.MapHttpRoute(
                "GetSourceByIdRoute",
                "api/source/feature/{sourceId}",
                new { controller = "Source", action = "GetSource" }
            );

            #endregion

            /*Don't need default route
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );*/
        }
    }
}
