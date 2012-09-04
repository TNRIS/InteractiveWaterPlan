using System;
using System.Collections.Generic;

namespace InteractiveWaterPlan.Core
{
    public class WaterUseEntity : Entity
    {
        public virtual int SourceId { get; set; }
        public virtual int SourceSupply { get; set; }
        public virtual string IsRedundantSupply { get; set; }
        public virtual string SourceName { get; set; }
    }
}