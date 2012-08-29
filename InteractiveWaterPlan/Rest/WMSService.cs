using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;
using Spring.Rest.Client;
using Newtonsoft.Json;
using InteractiveWaterPlan.Data;

namespace InteractiveWaterPlan.Rest
{
    public static class WMSService
    {
        public static XmlDocument GetFeatureInfo(Uri wmsServerUrl, string layers, string srs, string bbox, string height, 
            string width, string x, string y, int featureCount=1, string infoFormat = "text/xml", string version = "1.1.1")
        {
            var getFeatureInfoParams = new Dictionary<string, string>();
            //params that won't change
            getFeatureInfoParams.Add("SERVICE", "WMS");
            getFeatureInfoParams.Add("REQUEST", "GetFeatureInfo");
            getFeatureInfoParams.Add("VERSION", version);
            getFeatureInfoParams.Add("INFO_FORMAT", infoFormat);
            getFeatureInfoParams.Add("FEATURE_COUNT", featureCount.ToString());

            //params that change based on input
            getFeatureInfoParams.Add("QUERY_LAYERS", layers);
            getFeatureInfoParams.Add("SRS", srs);
            getFeatureInfoParams.Add("BBOX", bbox);
            getFeatureInfoParams.Add("HEIGHT", height);
            getFeatureInfoParams.Add("WIDTH", width);
            getFeatureInfoParams.Add("X", x);
            getFeatureInfoParams.Add("Y", y);

            RestTemplate t = new RestTemplate(wmsServerUrl);

            var xmlDoc = t.GetForObject<XmlDocument>(_createQueryString(getFeatureInfoParams));
            
            return xmlDoc;
        }

        public static string GetFeatureInfoJson(Uri wmsServerUrl, string layers, string srs, string bbox, string height, string width, string x, string y)
        {
            var xmlDoc = GetFeatureInfo(wmsServerUrl, layers, srs, bbox, height, width, x, y);

            var fieldsEl = xmlDoc.GetElementsByTagName("FIELDS")[0];
            foreach (XmlAttribute attr in fieldsEl.Attributes)
            {
                attr.Value = attr.Value.Trim();
            }

            var json = JsonConvert.SerializeXmlNode(fieldsEl, Newtonsoft.Json.Formatting.None, true);

            //Remove the @ symbols from the Json string
            json = json.Replace("@", "");

            return json;
        }

        private static string _createQueryString(IDictionary<string, string> dict)
        {
            return "?" + string.Join("&", Array.ConvertAll(
                dict.Keys.ToArray(), key => string.Format("{0}={1}",
                    HttpUtility.UrlEncode(key), HttpUtility.UrlEncode(dict[key]))));
        }

    }
}