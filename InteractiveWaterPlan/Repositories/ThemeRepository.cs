using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using InteractiveWaterPlan.Models;

namespace InteractiveWaterPlan.Repositories
{
    public static class ThemeRepository
    {
        public static Theme GetThemeByName(string name)
        {
            Theme theme = null;
            
            //TODO: all this should come from DB/NHibernate, not constructed here
            if ("proposed-reservoirs".Equals(name, StringComparison.InvariantCultureIgnoreCase))
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
            else if ("water-use".Equals(name, StringComparison.InvariantCultureIgnoreCase))
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

            return theme;
        }

    }

}