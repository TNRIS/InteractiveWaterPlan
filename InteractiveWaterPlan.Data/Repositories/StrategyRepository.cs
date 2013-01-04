using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;

namespace InteractiveWaterPlan.Data
{
    
    public class StrategyRepository : Repository<int, Strategy>
    {

        #region Constructors

        public StrategyRepository() : base(typeof(StrategyRepository)) { }

        public StrategyRepository(ISession session) : base(session, typeof(StrategyRepository)) { }

        #endregion

        
        public IList<StrategyType> GetStrategyTypes()
        {
            return Session.GetNamedQuery("GetAllStrategyTypes")
                .List<StrategyType>()
                .OrderBy(x => x.Id)
                .ToList<StrategyType>();
        }

        public IList<Strategy> GetStrategiesInRegion(int regionId, string year = null)
        {
            //first need to figure out the regionLetter of the given regionId
            var regionLetter = Session.GetNamedQuery("GetAllPlanningRegions")
                .List<PlanningRegion>()
                .Where(x => x.Id == regionId)
                .Select<PlanningRegion, char>(x => x.Letter)
                .First();

            return GetStrategiesInRegion(regionLetter, year);
        }

        public IList<Strategy> GetStrategiesInRegion(char regionLetter, string year = null)
        {
            var allStrategiesInRegion = Session.GetNamedQuery("GetStrategiesInRegion")
                .SetParameter("regionLetter", regionLetter)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            if (year == null || year.Length == 0)
            {
                return allStrategiesInRegion;
            }
            
            //else only return those that have non-null value in SupplyYEAR
            return allStrategiesInRegion
                .Where(x =>
                {
                    long supplyVal = (long)(x.GetType().GetProperty("Supply" + year).GetValue(x, null));
                    return supplyVal != 0;
                })
                .ToList<Strategy>();
        }

        public IList<Strategy> GetStrategiesInCounty(int countyId, string year = null)
        {
            var allStrategiesInCounty = Session.GetNamedQuery("GetStrategiesInCounty")
                .SetParameter("countyId", countyId)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            if (year == null || year.Length == 0)
            {
                return allStrategiesInCounty;
            }

            //else only return those that have non-null value in SupplyYEAR
            return allStrategiesInCounty
                .Where(x =>
                {
                    long supplyVal = (long)(x.GetType().GetProperty("Supply" + year).GetValue(x, null));
                    return supplyVal != 0;
                })
                .ToList<Strategy>();
        }

        public IList<Strategy> GetStrategiesInDistrict(int districtId, string year = null)
        {
            var allStrategiesInDistrict = Session.GetNamedQuery("GetStrategiesInDistrict")
                .SetParameter("districtId", districtId)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            if (year == null || year.Length == 0)
            {
                return allStrategiesInDistrict;
            }

            //else only return those that have non-null value in SupplyYEAR
            return allStrategiesInDistrict
                .Where(x =>
                {
                    long supplyVal = (long)(x.GetType().GetProperty("Supply" + year).GetValue(x, null));
                    return supplyVal != 0;
                })
                .ToList<Strategy>();
        }

        public IList<Strategy> GetStrategiesByType(int strategyTypeId, string year = null)
        {
            var allStrategiesOfType = Session.GetNamedQuery("GetStrategiesByType")
                .SetParameter("typeId", strategyTypeId)
                .List<Strategy>()
                .OrderBy(x => x.Id)
                .ToList<Strategy>();

            if (year == null || year.Length == 0)
            {
                return allStrategiesOfType;
            }

            //else only return those that have non-null value in SupplyYEAR
            return allStrategiesOfType
                .Where(x =>
                {
                    long supplyVal = (long)(x.GetType().GetProperty("Supply" + year).GetValue(x, null));
                    return supplyVal != 0;
                })
                .ToList<Strategy>();
        }

    }
}
