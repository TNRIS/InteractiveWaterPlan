using System;
using System.Collections.Generic;
using InteractiveWaterPlan.Core;

namespace InteractiveWaterPlan.MVC4.Models
{
    public class Theme
    {
        public string Name { get; set; }
        public IList<BaseLayerInfo> Layers { get; set; }
        public string ServiceUrl { get; set; }

        public Theme(string Name)
        {
            this.Name = Name;
            this.Layers = new List<BaseLayerInfo>();
        }

        public Theme(string Name, IList<BaseLayerInfo> Layers)
        {
            this.Name = Name;
            this.Layers = Layers;
        }
    }
}