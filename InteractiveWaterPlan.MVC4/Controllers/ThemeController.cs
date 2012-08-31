using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using InteractiveWaterPlan.MVC4.Models;
using InteractiveWaterPlan.Data;
using InteractiveWaterPlan.Core;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class ThemeController : Controller
    {
        /// <summary>
        /// Returns a JSON containing a description the desired theme
        /// </summary>
        /// <param name="ThemeName"></param>
        /// <returns></returns>
        public ActionResult GetTheme(string themeName)
        {
            //TODO: Themes should be described in some external source
            // and both the JS and the C# code should build components based on this source
            Theme theme = null;

            //TODO: all this should come from DB/NHibernate, not constructed here
            if ("proposed-reservoirs".Equals(themeName, StringComparison.InvariantCultureIgnoreCase))
            {

                theme = new Theme("Proposed Reservoirs");
                theme.Layers.Add(
                    new WMSLayerInfo(
                        "Proposed Reservoirs",
                        "http://services.tnris.org/ArcGIS/services/TWDB_StateWaterPlan/MapServer/WMSServer",
                        "0,1"
                    )
                );
            }
            else if ("water-use".Equals(themeName, StringComparison.InvariantCultureIgnoreCase))
            {
                theme = new Theme("Water Use");
                theme.Layers.Add(
                    new WMSLayerInfo(
                        "DB12 Entities",
                        "http://services.tnris.org/ArcGIS/services/TWDB_StateWaterPlan/MapServer/WMSServer",
                        "2"
                    )
                );
            }

            if (theme != null)
                return Json(theme, JsonRequestBehavior.AllowGet);

            return Json("Error", JsonRequestBehavior.AllowGet);
        }

    }
}
