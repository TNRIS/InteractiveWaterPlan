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
                "GetStrategiesInDistrict",
                "api/strategies/region",
                new { controller = "Strategy", action = "GetStrategiesInDistrict" }
            );

            config.Routes.MapHttpRoute(
                "GetStrategiesByType",
                "api/strategies/type",
                new { controller = "Strategy", action = "GetStrategiesByType" }
            );

            config.Routes.MapHttpRoute(
                "GetStrategyTypesRyoute",
                "api/strategy/types",
                new { controller = "Strategy", action = "GetStrategyTypes" }
            );

            config.Routes.MapHttpRoute(
                "GetCountyNetSuppliesRoute",
                "api/strategies/county-net",
                new { controller = "Strategy", action = "GetCountyNetSupplies" }
            );

            

            #endregion

            #region Boundary Routes
            config.Routes.MapHttpRoute(
                "GetAllCounties",
                "api/boundary/counties/all",
                new { controller = "Boundary", action = "GetAllCounties" }
            );

            config.Routes.MapHttpRoute(
                "GetAllPlanningRegions",
                "api/boundary/planningregions/all",
                new { controller = "Boundary", action = "GetAllPlanningRegions" }
            );

            config.Routes.MapHttpRoute(
                "GetAllLegeDistricts",
                "api/boundary/legedistricts/all",
                new { controller = "Boundary", action = "GetAllLegeDistricts" }
            );


            #endregion

            #region Feature Routes
            /*
            config.Routes.MapHttpRoute(
                "GetAllEntitiesRoute",
                "api/feature/entity/all",
                new { controller = "Feature", action = "GetAllEntities" }
            );

            config.Routes.MapHttpRoute(
                "GetAllRecommendedReservoirsRoute",
                "api/feature/reservoir/recommended/all",
                new { controller = "Feature", action = "GetAllRecommendedReservoirs" }
            );

            config.Routes.MapHttpRoute(
                "GetRecommendedReservoirByLatLonRoute",
                "api/feature/reservoir/recommended",
                new { controller = "Feature", action = "GetRecommendedReservoir" }
            );

            config.Routes.MapHttpRoute(
                "GetRecommendedReservoirEntitiesRoute",
                "api/feature/entity/{Year}",
                new { controller = "Feature", action = "GetEntitiesOfReservoir" }
            );
            */
            #endregion

            #region Data Routes
            /*
            config.Routes.MapHttpRoute(
                "GetWaterUseDataRoute",
                "api/data/wateruse/{LocationType}/{LocationName}/{Year}",
                new { controller = "Data", action = "GetWaterUseData" }
            );

            config.Routes.MapHttpRoute(
                "GetReservoirSupplyDataRoute",
                "api/data/reservoir/{ReservoirId}/{Year}",
                new { controller = "Data", action = "GetReservoirSupplyData" }
            );
            */
            #endregion

            /*config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );*/
        }
    }
}
