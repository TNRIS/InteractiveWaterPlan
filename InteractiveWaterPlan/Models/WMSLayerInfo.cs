using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InteractiveWaterPlan.Models
{
    public class WMSLayerInfo : BaseLayerInfo
    {
        public string WMSLayerNames { get; set; }

        public WMSLayerInfo(string Name, string Url, string WMSLayerNames)
            : base(Name, Url, "WMS")
        {
            this.WMSLayerNames = WMSLayerNames;
        }
    }
}