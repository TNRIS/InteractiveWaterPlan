using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace InteractiveWaterPlan.Core
{
    
    public class WaterSourceSupplyData
    {
        public virtual int SourceId { get; set; }
        public virtual string Name { get; set; }
        public virtual double Value { get; set; }
    }
}
