using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
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

        public IList<Strategy> GetStrategiesInRegion(int regionId, string year)
        {
            //first need to figure out the regionLetter of the given regionId
            var regionLetter = Session.GetNamedQuery("GetAllPlanningRegions")
                .List<PlanningRegion>()
                .Where(x => x.Id == regionId)
                .Select<PlanningRegion, char>(x => x.Letter)
                .First();

            return GetStrategiesInRegion(regionLetter, year);
        }

        public IList<Strategy> GetStrategiesInRegion(char regionLetter, string year)
        {
            var allStrategiesInRegion = Session.GetNamedQuery("GetStrategiesInRegion")
                .SetParameter("regionLetter", regionLetter)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            return allStrategiesInRegion;
        }

        public IList<Strategy> GetStrategiesInCounty(int countyId, string year)
        {
            var allStrategiesInCounty = Session.GetNamedQuery("GetStrategiesInCounty")
                .SetParameter("countyId", countyId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            return allStrategiesInCounty;
        }

        public IList<Strategy> GetStrategiesInHouseDistrict(int districtId, string year)
        {
            var allStrategiesInDistrict = Session.GetNamedQuery("GetStrategiesByHouseDistrict")
                .SetParameter("districtId", districtId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            return allStrategiesInDistrict;
        }

        public IList<Strategy> GetStrategiesInSenateDistrict(int districtId, string year)
        {
            var allStrategiesInDistrict = Session.GetNamedQuery("GetStrategiesBySenateDistrict")
                .SetParameter("districtId", districtId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            return allStrategiesInDistrict;
        }

        public IList<Strategy> GetStrategiesByType(int strategyTypeId, string year)
        {
            var allStrategiesOfType = Session.GetNamedQuery("GetStrategiesByType")
                .SetParameter("typeId", strategyTypeId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            return allStrategiesOfType;
        }

        public IList<Strategy> GetStrategiesForEntity(int entityId, string year)
        {
            var strategiesForEntity = Session.GetNamedQuery("GetStrategiesForEntity")
                .SetParameter("entityId", entityId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            return strategiesForEntity;
        }

        public IList<StrategyDetails> GetStrategiesByProjectId(int projectId, string year)
        {
            return Session.GetNamedQuery("GetStrategyDetailsByProjectId")
                .SetParameter("projectId", projectId)
                .SetParameter("year", year)
                .List<StrategyDetails>()
                .OrderBy(x => x.Id)
                .Where(x =>
                {
                    long supplyVal = (long)(x.GetType().GetProperty("Supply" + year).GetValue(x, null));
                    return supplyVal != 0;
                })
                .ToList();
        }

    }
}
