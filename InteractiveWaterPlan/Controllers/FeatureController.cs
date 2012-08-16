using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Xml;
using Spring.Rest;
using Spring.Rest.Client;
using Spring.Http.Converters.Xml;
using Spring.Http.Converters.Json;
using System.Xml.Serialization;
using Newtonsoft.Json;

namespace InteractiveWaterPlan.Controllers
{
    public class FeatureController : Controller
    {

        /* http://services.tnris.org/ArcGIS/services/TWDB_StateWaterPlan/MapServer/WMSServer?
         * QUERY_LAYERS=2&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo
         * &BBOX=-12163869.973212%2C3350308.213223%2C-9874428.102333%2C4377621.873233&FEATURE_COUNT=1
         * &HEIGHT=420&WIDTH=936&FORMAT=image%2Fpng&INFO_FORMAT=text%2Fhtml&SRS=EPSG%3A3857&X=357&Y=210
         */

        private string _createQueryString(IDictionary<string, string> dict)
        {
            return "?" + string.Join("&", Array.ConvertAll(
                dict.Keys.ToArray(), key => string.Format("{0}={1}", 
                    HttpUtility.UrlEncode(key), HttpUtility.UrlEncode(dict[key]))));
        }

        public ActionResult Info(string layers, string srs, string bbox, string height, string width, string x, string y)
        {
            //TODO: Extract this to a class so we can use in GEMSS2 as well
            string wmsServerUrl = ConfigurationManager.AppSettings["WMSServerUrl"];
            var getFeatureInfoParams = new Dictionary<string, string>();
            getFeatureInfoParams.Add("SERVICE", "WMS");
            getFeatureInfoParams.Add("VERSION", "1.1.1");
            getFeatureInfoParams.Add("REQUEST", "GetFeatureInfo");
            getFeatureInfoParams.Add("INFO_FORMAT", "text/xml");
            getFeatureInfoParams.Add("FEATURE_COUNT", "1");

            getFeatureInfoParams.Add("QUERY_LAYERS", layers);
            getFeatureInfoParams.Add("SRS", srs);
            getFeatureInfoParams.Add("BBOX", bbox);
            getFeatureInfoParams.Add("HEIGHT", height);
            getFeatureInfoParams.Add("WIDTH", width);
            getFeatureInfoParams.Add("X", x);
            getFeatureInfoParams.Add("Y", y);
            
            RestTemplate t = new RestTemplate(wmsServerUrl);

            try
            {
                var response = t.GetForObject<XmlDocument>(_createQueryString(getFeatureInfoParams));
               
                var json = JsonConvert.SerializeXmlNode(
                    response.GetElementsByTagName("FIELDS")[0], 
                    Newtonsoft.Json.Formatting.None, 
                    true
                );

                return new ContentResult { Content = json, ContentType = "application/json" };
                
            }
            catch (Exception ex)
            {
                //log the execption
                return Json(new { Error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
