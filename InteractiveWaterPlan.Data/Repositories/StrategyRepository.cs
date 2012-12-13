﻿using System;
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

        public IList<Strategy> GetAllStrategies()
        {
            return new List<Strategy>(){
                new Strategy()
                {
                    Id = new Random().Next(),
                    Description = "Strategy 1",
                    TypeName = "Reservoir",
                    TypeId = 1
                }
            };
        }

        public Strategy GetStrategy(int id)
        {
            //TODO
            return new Strategy()
                {
                    Id = id,
                    Description = "Strategy "+id,
                    TypeName = "Reservoir",
                    TypeId = 1
                };
        }

        public IList<Strategy> GetStrategiesInPlace(int placeId)
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

        public IList<Strategy> GetStrategiesInRegion(int regionId)
        {
            //TODO
            return new List<Strategy>(){
                new Strategy()
                {
                    Id = new Random().Next(),
                    Description = "Strategy in region "+regionId,
                    TypeName = "Reservoir",
                    TypeId = 1
                }
            };
        }

        public IList<Strategy> GetStrategiesInCounty(int countyId)
        {
            //TODO
            return new List<Strategy>(){
                new Strategy()
                {
                    Id = new Random().Next(),
                    Description = "Strategy in county "+countyId,
                    TypeName = "Reservoir",
                    TypeId = 1
                }
            };
        }

        public IList<Strategy> GetStrategiesInDistrict(int districtId)
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

        public IList<Strategy> GetStrategiesByType(int strategyTypeId)
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