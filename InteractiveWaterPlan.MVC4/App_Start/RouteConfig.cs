using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace InteractiveWaterPlan.MVC4
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            #region Feature Routes
            routes.MapRoute(
                "GetAllEntitiesRoute",
                "Feature/Entity/All",
                new { controller = "Feature", action = "GetAllEntities" }
            );

            routes.MapRoute(
                "GetAllProposedReservoirsRoute",
                "Feature/Reservoir/Proposed/All",
                new { controller = "Feature", action = "GetAllProposedReservoirs" }
            );

            routes.MapRoute(
                "GetProposedReservoirByLatLonRoute",
                "Feature/Reservoir/Proposed",
                new { controller = "Feature", action = "GetProposedReservoir" }
            );

            routes.MapRoute(
                "GetProposedReservoirEntitiesRoute",
                "Feature/Entity/{Year}",
                new { controller = "Feature", action = "GetEntities" }
            );

            #endregion

            #region Data Routes

            routes.MapRoute(
                "GetWaterUseDataRoute",
                "Data/WaterUse/{LocationType}/{LocationName}/{Year}",
                new { controller = "Data", action = "GetWaterUseData" }
            );
            #endregion

            #region Theme Routes
            routes.MapRoute(
                "GetThemeRoute",
                "Theme/{ThemeName}",
                new { controller = "Theme", action = "GetTheme" }
            );
            #endregion

            #region View Routes
            routes.MapRoute(
                "Viewer",
                "Viewer",
                new { controller = "Home", action = "Viewer" }
            );

            routes.MapRoute(
                "HomeViewer",
                "Home/Viewer",
                new { controller = "Home", action = "Index" }
            );

            routes.MapRoute(
                "Default", // Route name
                "{controller}/{action}", // URL with parameters
                new { controller = "Home", action = "Viewer" } // Parameter defaults
            );
            #endregion
        }
    }
}