using System.Web.Http;

namespace InteractiveWaterPlan.MVC4
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            #region Place Routes
            config.Routes.MapHttpRoute(
                "GetAllPlaces",
                "api/place/all",
                new { controller = "Place", action = "GetAllPlaces" }
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


            #region Feature Routes
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

            #endregion

            #region Data Routes

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

            #endregion

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
