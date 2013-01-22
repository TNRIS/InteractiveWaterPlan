using System.Web.Mvc;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/
        public ActionResult Index()
        {
            return View();
        }
    }
}
