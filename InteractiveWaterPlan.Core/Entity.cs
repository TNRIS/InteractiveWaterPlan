using System;

namespace InteractiveWaterPlan.Core
{
    public class Entity : AbstractFeature
    {
        public virtual int Id { get; set; }
        public virtual string Type { get; set; }
        public virtual string RWP { get; set; }
        public virtual string County { get; set; }
        public virtual string Basin { get; set; }
    }
}