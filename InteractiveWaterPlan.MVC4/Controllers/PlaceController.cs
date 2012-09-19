using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class PlaceController : ApiController
    {
        // GET api/place
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/place/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/place
        public void Post([FromBody]string value)
        {
        }

        // PUT api/place/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/place/5
        public void Delete(int id)
        {
        }
    }
}
