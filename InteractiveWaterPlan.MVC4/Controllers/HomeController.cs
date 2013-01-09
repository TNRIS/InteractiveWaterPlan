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
            JsonSerializerSettings settings = new JsonSerializerSettings();
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            var boundaryController = new BoundaryController();
            ViewData["CountyNames"] = JsonConvert.SerializeObject(
                boundaryController.GetAllCountyNames(), Formatting.None, settings);

            ViewData["RegionNames"] = JsonConvert.SerializeObject(
                boundaryController.GetAllPlanningRegionNames(), Formatting.None, settings);

            ViewData["HouseNames"] = JsonConvert.SerializeObject(
               boundaryController.GetAllHouseDistrictNames(), Formatting.None, settings);

            ViewData["SenateNames"] = JsonConvert.SerializeObject(
               boundaryController.GetAllSenateDistrictNames(), Formatting.None, settings);

            var strategyController = new StrategyController();
            ViewData["StrategyTypes"] = JsonConvert.SerializeObject(
                strategyController.GetStrategyTypes(), Formatting.None, settings);



            return View();
        }
    }
}
