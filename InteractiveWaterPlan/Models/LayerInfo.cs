using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace InteractiveWaterPlan.Models
{

    public abstract class BaseLayerInfo
    {
        public string Name { get; set; }
        public string Url { get; set; }
        public string ServiceType { get; set; }

        public BaseLayerInfo(string Name, string Url, string ServiceType)
        {
            this.Name = Name;
            this.Url = Url;
            this.ServiceType = ServiceType;
        }
    }
}