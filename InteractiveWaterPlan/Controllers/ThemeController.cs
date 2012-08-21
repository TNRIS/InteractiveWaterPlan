using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using InteractiveWaterPlan.Models;
using InteractiveWaterPlan.Repositories;

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
            var repo = new ThemeRepository();
            var theme = repo.GetThemeByName(ThemeName);

            if (theme != null)
                return Json(theme, JsonRequestBehavior.AllowGet);

            return Json("Error", JsonRequestBehavior.AllowGet);
        }

    }
}
