using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using InteractiveWaterPlan.Data;
using InteractiveWaterPlan.Core;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    [NHibernateSession]
    public class CountyNetSupplyController : ApiController
    {
        private CountyNetSupplyRepository _repo;

        public CountyNetSupplyController()
        {
            _repo = new CountyNetSupplyRepository();
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
