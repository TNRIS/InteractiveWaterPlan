using System.Web.Http;

namespace InteractiveWaterPlan.MVC4
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            #region Place Routes
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
                "GetAllProposedReservoirsRoute",
                "api/feature/reservoir/proposed/all",
                new { controller = "Feature", action = "GetAllProposedReservoirs" }
            );

            config.Routes.MapHttpRoute(
                "GetProposedReservoirByLatLonRoute",
                "api/feature/reservoir/proposed",
                new { controller = "Feature", action = "GetProposedReservoir" }
            );

            config.Routes.MapHttpRoute(
                "GetProposedReservoirEntitiesRoute",
                "api/feature/entity/{Year}",
                new { controller = "Feature", action = "GetEntities" }
            );

            #endregion

            #region Data Routes

            config.Routes.MapHttpRoute(
                "GetWaterUseDataRoute",
                "api/data/wateruse/{LocationType}/{LocationName}/{Year}",
                new { controller = "Data", action = "GetWaterUseData" }
            );

            #endregion

            #region Theme Routes

            config.Routes.MapHttpRoute(
                "GetThemeRoute",
                "api/theme/{ThemeName}",
                new { controller = "Theme", action = "GetTheme" }
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
