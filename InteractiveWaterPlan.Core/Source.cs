using System;

namespace InteractiveWaterPlan.Core
{
    //TODO: Would be best to rename this first class
    // and make SourceDetail the actual "Source"
    public class Source : AbstractFeature
    {
        public virtual int SourceId { get; set; }
        public virtual string Name { get; set; }
        public virtual string WktMappingPoint { get; set; }
        
        public virtual double SupplyInYear { get; set; }
        public virtual int SourceTypeId { get; set; }
        public virtual string SourceType { get; set; }
    }

    //basically the same thing except won't have SupplyInYear
    // and won't have GEOG_Mapping_Pt_Tx column
    public class SourceDetail : Source
    {
        public override int SourceId
        {
            get
            {
                return this.Id;
            }
            set
            {
                this.Id = value;
            }
        }
    }
}