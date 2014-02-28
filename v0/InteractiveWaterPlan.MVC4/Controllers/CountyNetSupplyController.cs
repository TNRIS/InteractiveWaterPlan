using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    [NHibernateSession(CommonConstants.SWP_SESSION_NAME)]
    public class CountyNetSupplyController : ApiController
    {
        private CountyNetSupplyRepository _repo;

        public CountyNetSupplyController()
        {
            _repo = new CountyNetSupplyRepository(CommonConstants.SWP_SESSION_NAME);
        }

        // GET api/supply/county-net
        public IList<CountyNetSupply> GetCountyNetSupplies(string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetCountyNetSupplies(year);
        }


        
    }
}
