using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using InteractiveWaterPlan.Models;

namespace InteractiveWaterPlan.Controllers
{
    public class ThemeController : Controller
    {
        /// <summary>
        /// Returns a JSON containing a description the desired theme
        /// </summary>
        /// <param name="ThemeName"></param>
        /// <returns></returns>
        public ActionResult GetTheme(string ThemeName)
        {
            //TODO: Themes should be described in some external source
            // and both the JS and the C# code should build components based on this source

            if ("proposed-reservoirs".Equals(ThemeName, StringComparison.InvariantCultureIgnoreCase))
            {
                //TODO: all this should come from repository, not constructed here in the controller
                var themeData = new Theme("Proposed Reservoirs");
                themeData.Layers.Add(
                    new WMSLayerInfo(
                        "Proposed Reservoirs",
                        "http://services.tnris.org/ArcGIS/services/TWDB_StateWaterPlan/MapServer/WMSServer",
                        "0,1"
                    )
                );

                return Json(themeData, JsonRequestBehavior.AllowGet);
            }
            else if ("water-use".Equals(ThemeName, StringComparison.InvariantCultureIgnoreCase))
            {
                var themeData = new Theme("Water Use");
                themeData.Layers.Add(
                    new WMSLayerInfo(
                        "DB12 Entities",
                        "http://services.tnris.org/ArcGIS/services/TWDB_StateWaterPlan/MapServer/WMSServer",
                        "2"
                    )
                );

                return Json(themeData, JsonRequestBehavior.AllowGet);
            }

            return Json("Error", JsonRequestBehavior.AllowGet);
        }

    }
}
