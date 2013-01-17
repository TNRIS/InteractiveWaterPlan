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
            /* returned list is sorted so that WWP entities are first, then
             * ordered descending by supply in the given year */
            var allStrategiesInRegion = Session.GetNamedQuery("GetStrategiesInRegion")
                .SetParameter("regionLetter", regionLetter)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.RecipientEntityType.StartsWith("WWP") ? 1 : 2)
                .ThenByDescending(x =>
                {
                    long currSupplyVal = (long)(x.GetType().GetProperty(
                        "Supply" + year).GetValue(x, null));
                    return currSupplyVal;
                })
                .ToList<Strategy>();

            return allStrategiesInRegion;
        }

        public IList<Strategy> GetStrategiesInCounty(int countyId, string year)
        {
            /* returned list is sorted so that WWP entities are first, then
             * ordered descending by supply in the given year */
            var allStrategiesInCounty = Session.GetNamedQuery("GetStrategiesInCounty")
                .SetParameter("countyId", countyId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.RecipientEntityType.StartsWith("WWP") ? 1 : 2)
                .ThenByDescending(x =>
                {
                    long currSupplyVal = (long)(x.GetType().GetProperty(
                        "Supply" + year).GetValue(x, null));
                    return currSupplyVal;
                })
                .ToList<Strategy>();

            return allStrategiesInCounty;
        }

        public IList<Strategy> GetStrategiesInHouseDistrict(int districtId, string year)
        {
            /* returned list is sorted so that WWP entities are first, then
             * ordered descending by supply in the given year */
            var allStrategiesInDistrict = Session.GetNamedQuery("GetStrategiesByHouseDistrict")
                .SetParameter("districtId", districtId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.RecipientEntityType.StartsWith("WWP") ? 1 : 2)
                .ThenByDescending(x =>
                {
                    long currSupplyVal = (long)(x.GetType().GetProperty(
                        "Supply" + year).GetValue(x, null));
                    return currSupplyVal;
                })
                .ToList<Strategy>();

            return allStrategiesInDistrict;
        }

        public IList<Strategy> GetStrategiesInSenateDistrict(int districtId, string year)
        {
            /* returned list is sorted so that WWP entities are first, then
             * ordered descending by supply in the given year */
            var allStrategiesInDistrict = Session.GetNamedQuery("GetStrategiesBySenateDistrict")
                .SetParameter("districtId", districtId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.RecipientEntityType.StartsWith("WWP") ? 1 : 2)
                .ThenByDescending(x =>
                {
                    long currSupplyVal = (long)(x.GetType().GetProperty(
                        "Supply" + year).GetValue(x, null));
                    return currSupplyVal;
                })
                .ToList<Strategy>();

            return allStrategiesInDistrict;
        }

        public IList<Strategy> GetStrategiesByType(int strategyTypeId, string year)
        {
            /* returned list is sorted so that WWP entities are first, then
             * ordered descending by supply in the given year */
            var allStrategiesOfType = Session.GetNamedQuery("GetStrategiesByType")
                .SetParameter("typeId", strategyTypeId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.RecipientEntityType.StartsWith("WWP") ? 1 : 2)
                .ThenByDescending(x =>
                {
                    long currSupplyVal = (long)(x.GetType().GetProperty(
                        "Supply" + year).GetValue(x, null));
                    return currSupplyVal;
                })
                .ToList<Strategy>();

            return allStrategiesOfType;
        }

        public IList<Strategy> GetStrategiesForEntity(int entityId, string year)
        {
            /* returned list is sorted so that WWP entities are first, then
             * ordered descending by supply in the given year */
            var strategiesForEntity = Session.GetNamedQuery("GetStrategiesForEntity")
                .SetParameter("entityId", entityId)
                .SetParameter("year", year)
                .List<Strategy>()
                .OrderBy(x => x.RecipientEntityType.StartsWith("WWP") ? 1 : 2)
                .ThenByDescending(x =>
                {
                    long currSupplyVal = (long)(x.GetType().GetProperty(
                        "Supply" + year).GetValue(x, null));
                    return currSupplyVal;
                })
                .ToList<Strategy>();

            return strategiesForEntity;
        }

        public IList<StrategyDetails> GetStrategiesByProjectId(int projectId, string year)
        {
            /* returned list is sorted so that WWP entities are first, then
             * ordered descending by supply in the given year */
            var strategyDetails = Session.GetNamedQuery("GetStrategyDetailsByProjectId")
                .SetParameter("projectId", projectId)
                .SetParameter("year", year)
                .List<StrategyDetails>()
                .OrderBy(x => x.RecipientEntityType.StartsWith("WWP") ? 1 : 2)
                .ThenByDescending(x =>
                {
                    long currSupplyVal = (long)(x.GetType().GetProperty(
                        "Supply" + year).GetValue(x, null));
                    return currSupplyVal;
                })
                .ToList();

            return strategyDetails;
        }

    }
}
