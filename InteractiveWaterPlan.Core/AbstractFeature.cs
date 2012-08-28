using System;

namespace InteractiveWaterPlan.Core
{
    public abstract class AbstractFeature
    {
        public virtual int Id { get; set; }
        public virtual int SqlId { get; set; }
        public virtual string Name { get; set; }
        public virtual string WKTGeog { get; set; }
    }
}