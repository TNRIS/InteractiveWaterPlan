﻿using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Collections.Generic;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class DataController : ApiController
    {
        
        //api/data/wateruse/{LocationType}/{LocationName}/{Year}
        [NHibernateSession]
        public IEnumerable<WaterSourceSupplyData> GetWaterUseData(string LocationType, string LocationName, int Year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(Year))
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound) 
                { 
                    Content = new StringContent(
                        "Invalid Year: " + Year + ". Valid Years are " + String.Join(", ", CommonConstants.VALID_YEARS))
                };
                throw new HttpResponseException(resp);
            }

            //TODO: Get data from stored procedure via a repository call
            if (LocationType.Equals("State", StringComparison.InvariantCultureIgnoreCase) 
                && LocationName.Equals("Texas", StringComparison.InvariantCultureIgnoreCase))
            {
                switch (Year)
                {
                    case 2010:
                        return new List<WaterSourceSupplyData> ()
                        {
                            new WaterSourceSupplyData { Name="Municipal", Value=4851201}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=1727808},
                            new WaterSourceSupplyData { Name="Mining", Value=296230},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=733179},
                            new WaterSourceSupplyData { Name="Livestock", Value=322966},
                            new WaterSourceSupplyData { Name="Irrigation", Value=10079215}
                        };
                        
                    case 2020:
                        return new List<WaterSourceSupplyData>()
                        {
                            new WaterSourceSupplyData { Name="Municipal", Value=5580979}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=2153551},
                            new WaterSourceSupplyData { Name="Mining", Value=313327},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=1010555},
                            new WaterSourceSupplyData { Name="Livestock", Value=336634},
                            new WaterSourceSupplyData { Name="Irrigation", Value=9643908}
                        };
                        
                    case 2030:
                        return new List<WaterSourceSupplyData>() 
                        {
                            new WaterSourceSupplyData { Name="Municipal", Value=6254784}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=2465789},
                            new WaterSourceSupplyData { Name="Mining", Value=296472},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=1160401},
                            new WaterSourceSupplyData { Name="Livestock", Value=344242},
                            new WaterSourceSupplyData { Name="Irrigation", Value=9299464}
                        };
                        
                    case 2040:
                        return new List<WaterSourceSupplyData>()
                        {
                            new WaterSourceSupplyData { Name="Municipal", Value=6917722}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=2621183},
                            new WaterSourceSupplyData { Name="Mining", Value=285002},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=1316577},
                            new WaterSourceSupplyData { Name="Livestock", Value=352536},
                            new WaterSourceSupplyData { Name="Irrigation", Value=9024866}
                        };
                        
                    case 2050:
                        return new List<WaterSourceSupplyData>() 
                        {
                            new WaterSourceSupplyData { Name="Municipal", Value=7630808}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=2755335},
                            new WaterSourceSupplyData { Name="Mining", Value=284640},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=1460483},
                            new WaterSourceSupplyData { Name="Livestock", Value=361701},
                            new WaterSourceSupplyData { Name="Irrigation", Value=8697560}
                        };
                        
                    case 2060:
                        return new List<WaterSourceSupplyData>() 
                        {
                            new WaterSourceSupplyData { Name="Municipal", Value=8414492}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=2882524},
                            new WaterSourceSupplyData { Name="Mining", Value=292294},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=1620411},
                            new WaterSourceSupplyData { Name="Livestock", Value=371923},
                            new WaterSourceSupplyData { Name="Irrigation", Value=8370554}
                        };
                        
                    default:
                        break;
                }
            }

            throw new HttpResponseException(HttpStatusCode.NotFound);
        }

        // api/data/reservoir/{ReservoirId}/{Year}
        [NHibernateSession]
        public IEnumerable<WaterSourceSupplyData> GetReservoirSupplyData(int ReservoirId, int Year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(Year))
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(
                        "Invalid Year: " + Year + ". Valid Years are " + String.Join(", ", CommonConstants.VALID_YEARS))
                };
                throw new HttpResponseException(resp);
            }

            var repo = new SourceSupplyRepository();
            var data = repo.GetReservoirSupplyTotals(ReservoirId, Year);


            //Don't include values of 0
            return data.Where(d => !(d.Value == 0)).ToList<WaterSourceSupplyData>();
        }
    }
}
