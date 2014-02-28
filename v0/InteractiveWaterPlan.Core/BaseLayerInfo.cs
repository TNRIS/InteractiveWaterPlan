using System;
using System.Collections.Generic;

namespace InteractiveWaterPlan.Core
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