using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class StrategyController : ApiController
    {
        // GET api/strategy
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/strategy/5
        public string Get(int id)
        {
            return "value";
        }

        public string GetStrategiesInRegion(int regionId)
        {
            return "regionId";
        }

        public string GetStrategiesInCounty(int countyId)
        {
            return "countyId";
        }

        public string GetStrategiesInDistrict(int districtId)
        {
            return "districtId";
        }

        public string GetStrategiesByType(int typeId)
        {
            return "typeId";
        }

        
    }
}
