using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Http;
using System.Net;
using System.Net.Http;
using System.Web.Script.Serialization;

using InteractiveWaterPlan.Data;


namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class DataController : ApiController
    {
        private readonly int[] _validYears = new int[] { 2010, 2020, 2030, 2040, 2050, 2060 };

        //api/data/wateruse/{LocationType}/{LocationName}/{Year}
        public object GetWaterUseData(string LocationType, string LocationName, int Year)
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
                        return new[] 
                        {
                            new { Name="Muncipal", Value=4851201}, 
                            new { Name="Manufacturing", Value=1727808},
                            new { Name="Mining", Value=296230},
                            new { Name="Steam-electric", Value=733179},
                            new { Name="Livestock", Value=322966},
                            new { Name="Irrigation", Value=10079215}
                        };
                        
                    case 2020:
                        return new[] 
                        {
                            new { Name="Muncipal", Value=5580979}, 
                            new { Name="Manufacturing", Value=2153551},
                            new { Name="Mining", Value=313327},
                            new { Name="Steam-electric", Value=1010555},
                            new { Name="Livestock", Value=336634},
                            new { Name="Irrigation", Value=9643908}
                        };
                        
                    case 2030:
                        return new[] 
                        {
                            new { Name="Muncipal", Value=6254784}, 
                            new { Name="Manufacturing", Value=2465789},
                            new { Name="Mining", Value=296472},
                            new { Name="Steam-electric", Value=1160401},
                            new { Name="Livestock", Value=344242},
                            new { Name="Irrigation", Value=9299464}
                        };
                        
                    case 2040:
                        return new[] 
                        {
                            new { Name="Muncipal", Value=6917722}, 
                            new { Name="Manufacturing", Value=2621183},
                            new { Name="Mining", Value=285002},
                            new { Name="Steam-electric", Value=1316577},
                            new { Name="Livestock", Value=352536},
                            new { Name="Irrigation", Value=9024866}
                        };
                        
                    case 2050:
                        return new[] 
                        {
                            new { Name="Muncipal", Value=7630808}, 
                            new { Name="Manufacturing", Value=2755335},
                            new { Name="Mining", Value=284640},
                            new { Name="Steam-electric", Value=1460483},
                            new { Name="Livestock", Value=361701},
                            new { Name="Irrigation", Value=8697560}
                        };
                        
                    case 2060:
                        return new [] 
                        {
                            new { Name="Muncipal", Value=8414492}, 
                            new { Name="Manufacturing", Value=2882524},
                            new { Name="Mining", Value=292294},
                            new { Name="Steam-electric", Value=1620411},
                            new { Name="Livestock", Value=371923},
                            new { Name="Irrigation", Value=8370554}
                        };
                        
                    default:
                        break;
                }
            }

            throw new HttpResponseException(HttpStatusCode.NotFound);
        }

    }
}
