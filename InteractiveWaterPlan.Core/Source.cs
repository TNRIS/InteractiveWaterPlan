using System;

namespace InteractiveWaterPlan.Core
{
    public class Source : AbstractFeature
    {
        public virtual int SourceId { get; set; }
        public virtual string Name { get; set; }
        public virtual string WktMappingPoint { get; set; }
    }
}