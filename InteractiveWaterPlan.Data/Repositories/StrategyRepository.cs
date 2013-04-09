using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using System.Reflection;
using NHibernate;
using System;

namespace InteractiveWaterPlan.Data
{
    
    public class StrategyRepository : AbstractHibernateRepository
    {

        #region Constructors

        public StrategyRepository(string sessionName) : base(sessionName) { }

        public StrategyRepository(ISession session) : base(session) { }

        #endregion

        
        public IList<StrategyType> GetStrategyTypes()
        {
            return Session.GetNamedQuery("GetAllStrategyTypes")
                .List<StrategyType>()
                .OrderBy(x => x.Id)
                .ToList<StrategyType>();
        }

        public IList<RegionStrategySummary> GetStrategiesInRegion(int regionId, string year)
        {
            //first need to figure out the regionLetter of the given regionId
            var regionLetter = Session.GetNamedQuery("GetAllPlanningRegions")
                .List<PlanningRegion>()
                .Where(x => x.Id == regionId)
                .Select<PlanningRegion, char>(x => x.Letter)
                .First();

            return GetStrategiesInRegion(regionLetter, year);
        }

        public IList<RegionStrategySummary> GetStrategiesInRegion(char regionLetter, string year)
        {
            regionLetter = char.ToUpper(regionLetter);

            var allStrategiesInRegion = Session.GetNamedQuery("GetStrategiesInRegion")
                .SetParameter("regionLetter", regionLetter)
                .SetParameter("year", year)
                .List<RegionStrategySummary>();

            return allStrategiesInRegion;

        }

        public IList<Strategy> GetStrategiesInCounty(int countyId, string year)
        {
            var allStrategiesInCounty = Session.GetNamedQuery("GetStrategiesInCounty")
                .SetParameter("countyId", countyId)
                .SetParameter("year", year)
                .List<Strategy>()
                .ToList();

            return allStrategiesInCounty;
        }

        public IList<DistrictStrategy> GetStrategiesInHouseDistrict(int districtId, string year)
        {
            var allStrategiesInDistrict = Session.GetNamedQuery("GetStrategiesByHouseDistrict")
                .SetParameter("districtId", districtId)
                .SetParameter("year", year)
                .List<DistrictStrategy>()
                .ToList();

            return allStrategiesInDistrict;
        }

        public IList<DistrictStrategy> GetStrategiesInSenateDistrict(int districtId, string year)
        {
            var allStrategiesInDistrict = Session.GetNamedQuery("GetStrategiesBySenateDistrict")
                .SetParameter("districtId", districtId)
                .SetParameter("year", year)
                .List<DistrictStrategy>()
                .ToList();

            return allStrategiesInDistrict;
        }

        public IList<Strategy> GetStrategiesByType(int strategyTypeId, string year)
        {
            var allStrategiesOfType = Session.GetNamedQuery("GetStrategiesByType")
                .SetParameter("typeId", strategyTypeId)
                .SetParameter("year", year)
                .List<Strategy>()
                .ToList();

            return allStrategiesOfType;
        }

        public IList<EntityStrategy> GetStrategiesForEntity(int entityId, string year)
        {
            var strategiesForEntity = Session.GetNamedQuery("GetStrategiesForEntity")
                .SetParameter("entityId", entityId)
                .SetParameter("year", year)
                .List<EntityStrategy>()
                .ToList();

            return strategiesForEntity;
        }

        public IList<StrategyDetails> GetStrategiesByProjectId(int projectId, string year)
        {
            var strategyDetails = Session.GetNamedQuery("GetStrategyDetailsByProjectId")
                .SetParameter("projectId", projectId)
                .SetParameter("year", year)
                .List<StrategyDetails>()
                .Where(x => { //only need strategies where the SupplyYEAR != 0 and recipientId == sponsorId
                    var propertyInfo = x.GetType().GetProperty("Supply"+year);
                    var supplyVal = (long)(propertyInfo.GetValue(x, null));
                    return !(supplyVal == 0 && x.RecipientEntityId != x.SponsorId);
                })
                .ToList();

            return strategyDetails;
        }

        public IList<SourceStrategy> GetStrategiesBySource(int sourceId, string year)
        {
            var strategies = Session.GetNamedQuery("GetStrategiesForSource")
                .SetParameter("sourceId", sourceId)
                .SetParameter("year", year)
                .List<SourceStrategy>()
                .ToList();

            return strategies;
        }

    }
}
