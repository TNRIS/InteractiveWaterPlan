using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InteractiveWaterPlan.Models
{
    public abstract class AbstractFeature
    {
        public int Id;
        public int SqlId;
        public string Name;
        public string WKTGeog;
    }
}