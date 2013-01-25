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

            /* TODO: Remove after checking.  Database now performs this aggregation.
            //Group by ProjectId
            var aggregatedStrategyList = allStrategiesInRegion
                .GroupBy(x => x.ProjectId)
                .Select<IGrouping<int, Strategy>, Strategy>(
                    grp =>
                    {
                        //Create a starting Strategy from a clone of the first
                        // one in the group.
                        var start = grp.First().Clone();
                        
                        //Set the values to be aggregated to 0
                        start.Supply2010 = 0;
                        start.Supply2020 = 0;
                        start.Supply2030 = 0;
                        start.Supply2040 = 0;
                        start.Supply2050 = 0;
                        start.Supply2060 = 0;
                        start.CapitalCost = 0;

                        //Then aggregate each group into a single strategy with
                        // summed Supply and CapitalCost values
                        return grp.Aggregate(start, 
                            (aggStrategy, nextStrategy) =>
                            {
                                aggStrategy.Supply2010 += nextStrategy.Supply2010;
                                aggStrategy.Supply2020 += nextStrategy.Supply2020;
                                aggStrategy.Supply2030 += nextStrategy.Supply2030;
                                aggStrategy.Supply2040 += nextStrategy.Supply2040;
                                aggStrategy.Supply2050 += nextStrategy.Supply2050;
                                aggStrategy.Supply2060 += nextStrategy.Supply2060;

                                aggStrategy.CapitalCost += nextStrategy.CapitalCost;

                                return aggStrategy;
                            });
                    }
                ).ToList();

            return aggregatedStrategyList;
            */
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

        public IList<Strategy> GetStrategiesInHouseDistrict(int districtId, string year)
        {
            var allStrategiesInDistrict = Session.GetNamedQuery("GetStrategiesByHouseDistrict")
                .SetParameter("districtId", districtId)
                .SetParameter("year", year)
                .List<Strategy>()
                .ToList();

            return allStrategiesInDistrict;
        }

        public IList<Strategy> GetStrategiesInSenateDistrict(int districtId, string year)
        {
            var allStrategiesInDistrict = Session.GetNamedQuery("GetStrategiesBySenateDistrict")
                .SetParameter("districtId", districtId)
                .SetParameter("year", year)
                .List<Strategy>()
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

        public IList<Strategy> GetStrategiesForEntity(int entityId, string year)
        {
            var strategiesForEntity = Session.GetNamedQuery("GetStrategiesForEntity")
                .SetParameter("entityId", entityId)
                .SetParameter("year", year)
                .List<Strategy>()
                .ToList();

            return strategiesForEntity;
        }

        public IList<StrategyDetails> GetStrategiesByProjectId(int projectId, string year)
        {
            var strategyDetails = Session.GetNamedQuery("GetStrategyDetailsByProjectId")
                .SetParameter("projectId", projectId)
                .SetParameter("year", year)
                .List<StrategyDetails>()
                .ToList();

            return strategyDetails;
        }

    }
}
