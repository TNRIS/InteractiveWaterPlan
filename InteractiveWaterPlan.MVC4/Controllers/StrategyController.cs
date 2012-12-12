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
    [NHibernateSession]
    public class StrategyController : ApiController
    {
        private StrategyRepository _repo;

        public StrategyController()
        {
            _repo = new StrategyRepository();
        }

        // GET api/strategy/all
        public IList<Strategy> GetAll()
        {
            return _repo.GetAllStrategies();
        }

        // GET api/strategy/{id}
        public Strategy Get(int id)
        {
            return _repo.GetStrategy(id);
        }


        public IList<Strategy> GetStrategiesInPlace(int placeId)
        {
            //More-generic version, just get by universal placeId
            return _repo.GetStrategiesInPlace(placeId);
        }

        public IList<Strategy> GetStrategiesInRegion(int regionId)
        {
            return _repo.GetStrategiesInRegion(regionId);
        }

        public IList<Strategy> GetStrategiesInCounty(int countyId)
        {
            return _repo.GetStrategiesInCounty(countyId);
        }

        public IList<Strategy> GetStrategiesInDistrict(int districtId)
        {
            return _repo.GetStrategiesInDistrict(districtId);
        }

        public IList<Strategy> GetStrategiesByType(int typeId)
        {
            return _repo.GetStrategiesByType(typeId);
        }

        
    }
}
