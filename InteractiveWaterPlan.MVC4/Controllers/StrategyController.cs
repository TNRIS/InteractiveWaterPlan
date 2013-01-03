using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;
using InteractiveWaterPlan.MVC4.Models;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    [NHibernateSession]
    public class StrategyController : ApiController
    {
        private StrategyRepository _repo;

        public StrategyController()
        {
            _repo = new StrategyRepository();
        }

        // GET api/strategy/types
        public IList<StrategyType> GetStrategyTypes()
        {
            return _repo.GetStrategyTypes();
        }

        // GET api/strategies/region
        public IList<Strategy> GetStrategiesInRegion(int regionId, string year = null)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (year != null && !CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInRegion(regionId, year);
        }

        // GET api/strategies/county
        public IList<Strategy> GetStrategiesInCounty(int countyId, string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (year != null && !CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInCounty(countyId, year);
        }

        // GET api/strategies/district
        public IList<Strategy> GetStrategiesInDistrict(int districtId, string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (year != null && !CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInDistrict(districtId, year);
        }

        // GET api/strategies/type
        public IList<Strategy> GetStrategiesByType(int typeId, string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (year != null && !CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesByType(typeId, year);
        }

        // GET api/strategies/county-net
        public IList<CountyNetSupply> GetCountyNetSupplies(string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            var netSupplyList = new List<CountyNetSupply>();

            var boundaryRepo = new BoundaryRepository();
            var counties = boundaryRepo.GetCounties();

            var rand = new Random((int)System.DateTime.Now.Ticks);
            foreach (var county in counties)
            {
                var supply = new CountyNetSupply()
                {
                    CountyId = county.Id,
                    CountyName = county.Name,
                    RegionId = 123,
                    RegionName = "A",
                    Decade = year,

                    NetMunicipal = rand.Next(0, 10000),
                    NetIrrigation = rand.Next(0, 10000),
                    NetManufacturing = rand.Next(0, 10000),
                    NetLivestock = rand.Next(0, 10000),
                    NetSteamElectric = rand.Next(0, 10000),
                    NetMining = rand.Next(0, 10000)
                };

                netSupplyList.Add(supply);
            }

            return netSupplyList;
        }

        
    }
}
