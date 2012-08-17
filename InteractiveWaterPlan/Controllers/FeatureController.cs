using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Xml;
using System.Xml.Serialization;
using Newtonsoft.Json;
using InteractiveWaterPlan.Rest;

namespace InteractiveWaterPlan.Controllers
{
    public class FeatureController : Controller
    {

        /* http://services.tnris.org/ArcGIS/services/TWDB_StateWaterPlan/MapServer/WMSServer?
         * QUERY_LAYERS=2&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo
         * &BBOX=-12163869.973212%2C3350308.213223%2C-9874428.102333%2C4377621.873233&FEATURE_COUNT=1
         * &HEIGHT=420&WIDTH=936&FORMAT=image%2Fpng&INFO_FORMAT=text%2Fhtml&SRS=EPSG%3A3857&X=357&Y=210
         */

        

        public ActionResult Info(string layers, string srs, string bbox, string height, string width, string x, string y)
        {

            try
            {
                string wmsServerUrl = ConfigurationManager.AppSettings["WMSServerUrl"];
                
                var featureInfoJson = WMSService.GetFeatureInfoJson(new Uri(wmsServerUrl), layers, srs, bbox, height, width, x, y);
                return new ContentResult { Content = featureInfoJson, ContentType = "application/json" };  
            }
            catch (Exception ex)
            {
                //TODO: log the execption, return a different message to client
                return Json(new { Error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
