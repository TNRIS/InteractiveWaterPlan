using System.Web.Http;

namespace InteractiveWaterPlan.MVC4
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
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
                "api/strategies/region",
                new { controller = "Strategy", action = "GetStrategiesInRegion" }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesInCounty",
                "api/strategies/county",
                new { controller = "Strategy", action = "GetStrategiesInCounty" }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesInHouseDistrict",
                "api/strategies/district/house",
                new { controller = "Strategy", action = "GetStrategiesInHouseDistrict" }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesInSenateDistrict",
                "api/strategies/district/senate",
                new { controller = "Strategy", action = "GetStrategiesInSenateDistrict" }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesByType",
                "api/strategies/type",
                new { controller = "Strategy", action = "GetStrategiesByType" }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesForEntity",
                "api/strategies/entity",
                new { controller = "Strategy", action = "GetStrategiesForEntity" }
            );
            
            config.Routes.MapHttpRoute(
                "GetStrategiesByProjectIdRoute",
                "api/strategies/project",
                new { controller = "Strategy", action = "GetStrategiesByProjectId" }
            );

            config.Routes.MapHttpRoute(
                "GetStrategyTypesRoute",
                "api/strategy/types",
                new { controller = "Strategy", action = "GetStrategyTypes" }
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


            #endregion

            /*config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );*/
        }
    }
}
