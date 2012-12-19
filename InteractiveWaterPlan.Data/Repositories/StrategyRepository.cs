using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        public IList<Strategy> GetAllStrategies(string year = null)
        {
            //TODO
            var x = new List<Strategy>();
            var rand = new Random();
            for (int i = 0; i < 20; i++)
            {   
                x.Add(new Strategy()
                    {
                        Id = rand.Next(),
                        Description = "Strategy "+i,
                        TypeName = "Reservoir",
                        TypeId = 1
                    });
            }

            return x;
        }

        public Strategy GetStrategy(int id, string year = null)
        {
            //TODO
            return new Strategy()
            {
                Id = id,
                Description = "Strategy " + id,
                TypeName = "Reservoir",
                TypeId = 1
            };
        }

        
        public IList<StrategyType> GetStrategyTypes()
        {
            //TODO: Get list of Strategy Types (TypeId, TypeName, maybe CountOfWMS)
            throw new NotImplementedException();
        }


        public IList<Strategy> GetStrategiesInPlace(int placeId, string year = null)
        {
            //TODO
            return new List<Strategy>(){
                new Strategy()
                {
                    Id = new Random().Next(),
                    Description = "Strategy in place "+placeId,
                    TypeName = "Reservoir",
                    TypeId = 1
                }
            };
        }

        public IList<Strategy> GetStrategiesInRegion(int regionId, string year = null)
        {
            //TODO
            return new List<Strategy>(){
                new Strategy()
                {
                    Id = new Random().Next(),
                    Description = "Strategy in region " + regionId + " " + year,
                    TypeName = "Reservoir",
                    TypeId = 1
                }
            };
        }

        public IList<Strategy> GetStrategiesInCounty(int countyId, string year = null)
        {
            //TODO
            return new List<Strategy>(){
                new Strategy()
                {
                    Id = new Random().Next(),
                    Description = "Strategy in county " + countyId + " " + year,
                    TypeName = "Reservoir",
                    TypeId = 1
                }
            };
        }

        public IList<Strategy> GetStrategiesInDistrict(int districtId, string year = null)
        {
            //TODO
            return new List<Strategy>(){
                new Strategy()
                {
                    Id = new Random().Next(),
                    Description = "Strategy in district "+districtId,
                    TypeName = "Reservoir",
                    TypeId = 1
                }
            };
        }

        public IList<Strategy> GetStrategiesByType(int strategyTypeId, string year = null)
        {
            //TODO
            return new List<Strategy>(){
                new Strategy()
                {
                    Id = new Random().Next(),
                    Description = "Strategy of type "+strategyTypeId,
                    TypeName = "Type "+strategyTypeId,
                    TypeId = strategyTypeId
                }
            };
        }

    }
}
