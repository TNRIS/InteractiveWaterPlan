using System;
using System.Net;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.MVC4.Models;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class ThemeController : ApiController
    {
        /// <summary>
        /// Returns an object containing a description of the desired theme
        /// </summary>
        /// <param name="ThemeName"></param>
        /// <returns></returns>
        public Theme GetTheme(string themeName)
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
                return theme;

            throw new HttpResponseException(HttpStatusCode.NotFound);
        }

    }
}
