using System;
using System.Collections.Generic;
using System.Linq;
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

        // GET api/strategy/types
        public IList<StrategyType> GetStrategyTypes()
        {
            return _repo.GetStrategyTypes();
        }

        // GET api/strategies/region
        public IList<Strategy> GetStrategiesInRegion(int regionId, string year = null)
        {
            if (year != null && !CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInRegion(regionId, year);
        }

        // GET api/strategies/region
        public IList<Strategy> GetStrategiesInRegion(char regionLetter, string year = null)
        {
            if (year != null && !CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInRegion(regionLetter, year);
        }

        // GET api/strategies/county
        public IList<Strategy> GetStrategiesInCounty(int countyId, string year)
        {
            if (year != null && !CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInCounty(countyId, year);
        }

        // GET api/strategies/district
        public IList<Strategy> GetStrategiesInDistrict(int districtId, string year)
        {
            if (year != null && !CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInDistrict(districtId, year);
        }

        // GET api/strategies/type
        public IList<Strategy> GetStrategiesByType(int typeId, string year)
        {
            if (year != null && !CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesByType(typeId, year);
        }

    }
}
