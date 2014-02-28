using System;

namespace InteractiveWaterPlan.Core
{
    public class Entity : AbstractFeature
    {
        public virtual string Name { get; set; }
        public virtual string Type { get; set; }
        public virtual char RegionLetter { get; set; }
        public virtual string County { get; set; }
        public virtual int CountyId { get; set; }
    }

    public class EntityNameId
    {
        public virtual string Name { get; set; }
        public virtual int Id { get; set; }
    }
}