using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using InteractiveWaterPlan.Core;
using Microsoft.SqlServer.Types;
using NHibernate;
using Moq;

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
                .SetParameter("var_Region", regionLetter)
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
            //TODO
            throw new NotImplementedException();
        }

        public IList<Strategy> GetStrategiesInDistrict(int districtId, string year = null)
        {
            //TODO
            throw new NotImplementedException();
        }

        public IList<Strategy> GetStrategiesByType(int strategyTypeId, string year = null)
        {
            //TODO
            throw new NotImplementedException();
        }

    }
}
