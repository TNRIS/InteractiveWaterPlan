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
        public IList<RegionStrategySummary> GetStrategiesInRegion(int regionId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInRegion(regionId, year);
        }

        // GET api/strategies/region
        public IList<RegionStrategySummary> GetStrategiesInRegion(char regionLetter, string year)
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
        public IList<DistrictStrategy> GetStrategiesInHouseDistrict(int districtId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInHouseDistrict(districtId, year);
        }

        // GET api/strategies/district/senate
        public IList<DistrictStrategy> GetStrategiesInSenateDistrict(int districtId, string year)
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
        public IList<EntityStrategy> GetStrategiesForEntity(int entityId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            var strategies = _repo.GetStrategiesForEntity(entityId, year);

            //Strategy Details are not valid for WWP-type entities
            // so throw an exception
            if (strategies != null && strategies.Count > 0)
            {
                if (CommonConstants.WWP_ENTITY_TYPE.Equals(strategies[0].RecipientEntityType))
                    throw new ArgumentException("Invalid entityId");
            }
            
            return strategies;
        }

        // GET api/strategies/project
        public IList<StrategyDetails> GetStrategiesByProjectId(int projectId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesByProjectId(projectId, year);
        }

        // GET api/strategies/source
        public IList<SourceStrategy> GetStrategiesBySource(int sourceId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesBySource(sourceId, year);
        }

    }
}
