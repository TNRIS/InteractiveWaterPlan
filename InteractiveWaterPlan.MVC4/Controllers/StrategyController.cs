using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    [NHibernateSession(CommonConstants.SWP_SESSION_NAME)]
    public class StrategyController : ApiController
    {
        private StrategyRepository _repo;

        public StrategyController()
        {
            _repo = new StrategyRepository(CommonConstants.SWP_SESSION_NAME);
        }

        // GET api/strategy/types
        public IList<StrategyType> GetStrategyTypes()
        {
            return _repo.GetStrategyTypes();
        }

        // GET api/strategies/region
        public IList<Strategy> GetStrategiesInRegion(int regionId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInRegion(regionId, year);
        }

        // GET api/strategies/region
        public IList<Strategy> GetStrategiesInRegion(char regionLetter, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInRegion(regionLetter, year);
        }

        // GET api/strategies/county
        public IList<Strategy> GetStrategiesInCounty(int countyId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInCounty(countyId, year);
        }

        // GET api/strategies/district/house
        public IList<Strategy> GetStrategiesInHouseDistrict(int districtId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInHouseDistrict(districtId, year);
        }

        // GET api/strategies/district/senate
        public IList<Strategy> GetStrategiesInSenateDistrict(int districtId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInSenateDistrict(districtId, year);
        }

        // GET api/strategies/type
        public IList<Strategy> GetStrategiesByType(int typeId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesByType(typeId, year);
        }

        // GET api/strategies/entity
        public IList<Strategy> GetStrategiesForEntity(int entityId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesForEntity(entityId, year);
        }


        public IList<StrategyDetails> GetStrategiesByProjectId(int projectId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesByProjectId(projectId, year);
        }

    }
}
