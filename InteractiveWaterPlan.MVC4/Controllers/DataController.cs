using System;
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
        private readonly int[] _validYears = new int[] { 2010, 2020, 2030, 2040, 2050, 2060 };

        //api/data/wateruse/{LocationType}/{LocationName}/{Year}
        [NHibernateSession]
        public IEnumerable<WaterSourceSupplyData> GetWaterUseData(string LocationType, string LocationName, int Year)
        {
            if (!_validYears.Contains(Year))
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound) 
                { 
                    Content = new StringContent(
                        "Invalid Year: " + Year + ". Valid Years are " + String.Join(", ", _validYears))
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
                            new WaterSourceSupplyData { Name="Muncipal", Value=4851201}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=1727808},
                            new WaterSourceSupplyData { Name="Mining", Value=296230},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=733179},
                            new WaterSourceSupplyData { Name="Livestock", Value=322966},
                            new WaterSourceSupplyData { Name="Irrigation", Value=10079215}
                        };
                        
                    case 2020:
                        return new List<WaterSourceSupplyData>()
                        {
                            new WaterSourceSupplyData { Name="Muncipal", Value=5580979}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=2153551},
                            new WaterSourceSupplyData { Name="Mining", Value=313327},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=1010555},
                            new WaterSourceSupplyData { Name="Livestock", Value=336634},
                            new WaterSourceSupplyData { Name="Irrigation", Value=9643908}
                        };
                        
                    case 2030:
                        return new List<WaterSourceSupplyData>() 
                        {
                            new WaterSourceSupplyData { Name="Muncipal", Value=6254784}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=2465789},
                            new WaterSourceSupplyData { Name="Mining", Value=296472},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=1160401},
                            new WaterSourceSupplyData { Name="Livestock", Value=344242},
                            new WaterSourceSupplyData { Name="Irrigation", Value=9299464}
                        };
                        
                    case 2040:
                        return new List<WaterSourceSupplyData>()
                        {
                            new WaterSourceSupplyData { Name="Muncipal", Value=6917722}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=2621183},
                            new WaterSourceSupplyData { Name="Mining", Value=285002},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=1316577},
                            new WaterSourceSupplyData { Name="Livestock", Value=352536},
                            new WaterSourceSupplyData { Name="Irrigation", Value=9024866}
                        };
                        
                    case 2050:
                        return new List<WaterSourceSupplyData>() 
                        {
                            new WaterSourceSupplyData { Name="Muncipal", Value=7630808}, 
                            new WaterSourceSupplyData { Name="Manufacturing", Value=2755335},
                            new WaterSourceSupplyData { Name="Mining", Value=284640},
                            new WaterSourceSupplyData { Name="Steam-electric", Value=1460483},
                            new WaterSourceSupplyData { Name="Livestock", Value=361701},
                            new WaterSourceSupplyData { Name="Irrigation", Value=8697560}
                        };
                        
                    case 2060:
                        return new List<WaterSourceSupplyData>() 
                        {
                            new WaterSourceSupplyData { Name="Muncipal", Value=8414492}, 
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
            if (!_validYears.Contains(Year))
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(
                        "Invalid Year: " + Year + ". Valid Years are " + String.Join(", ", _validYears))
                };
                throw new HttpResponseException(resp);
            }

            //TODO: Get from a repository call
            var r = new Random();
            var data = new List<WaterSourceSupplyData>
            {
                new WaterSourceSupplyData { Name = "Livestock", Value = 0 },
                new WaterSourceSupplyData { Name = "Irrigation", Value = r.Next(100, 1000) },
                new WaterSourceSupplyData { Name = "Manufacturing", Value = r.Next(100, 1000) },
                new WaterSourceSupplyData { Name = "Mining", Value = r.Next(100, 1000) },
                new WaterSourceSupplyData { Name = "Municipal", Value = r.Next(100, 1000) },
                new WaterSourceSupplyData { Name = "Steam-electric", Value = r.Next(100, 1000) }
            };

            return data;
        }
    }
}
