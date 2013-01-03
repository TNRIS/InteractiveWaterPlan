using System;

namespace InteractiveWaterPlan.Core
{
    public class Entity : AbstractFeature
    {
        public virtual int EntityId { get; set; }
        public virtual string Name { get; set; }
        public virtual string Type { get; set; }
        public virtual string RegionName { get; set; }
        public virtual string County { get; set; }
        public virtual string Basin { get; set; }
    }
}