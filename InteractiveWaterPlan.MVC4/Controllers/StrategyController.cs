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

        // GET api/strategy/all
        public IList<Strategy> GetAll()
        {
            return _repo.GetAllStrategies();
        }

        // GET api/strategy/{id}
        public Strategy Get(int id)
        {
            return _repo.GetStrategy(id);
        }

        // GET api/strategy/county/net/all?year=???
        public IList<CountyNetSupply> GetCountyNetSupplies(string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            var netSupplyList = new List<CountyNetSupply>();

            var placeRepo = new PlaceRepository();
            var counties = placeRepo.GetPlaces(PlaceCategoryCode.COUNTY);

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

                        NetMunicipal = rand.Next(0,10000),
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

        public IList<StrategyType> GetStrategyTypes()
        {
            var list = new List<StrategyType>();

            list.Add(new StrategyType()
                {
                    Id = 1,
                    Name = "WMS Type 1"
                });

            list.Add(new StrategyType()
                {
                    Id = 2,
                    Name = "WMS Type 2"
                });

            //_repo.GetStrategyTypes

            return list;
        }


        public IList<Strategy> GetStrategiesInPlace(int placeId, string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            //More-generic version, just get by universal placeId
            return _repo.GetStrategiesInPlace(placeId, year);
        }

        public IList<Strategy> GetStrategiesInRegion(int regionId, string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInRegion(regionId, year);
        }

        public IList<Strategy> GetStrategiesInCounty(int countyId, string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInCounty(countyId, year);
        }

        public IList<Strategy> GetStrategiesInDistrict(int districtId, string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesInDistrict(districtId, year);
        }

        public IList<Strategy> GetStrategiesByType(int typeId, string year)
        {
            //TODO: Why does this give a stack trace? need to turn that off...
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");

            return _repo.GetStrategiesByType(typeId, year);
        }

        
    }
}
