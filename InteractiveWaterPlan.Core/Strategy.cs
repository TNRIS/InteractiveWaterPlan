namespace InteractiveWaterPlan.Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Water Management Strategy Model Class
    /// </summary>
    public class Strategy
    {
        public virtual int Id { get; set; }
        public virtual string Description { get; set; }

        public virtual int ProjectId { get; set; }

        public virtual string TypeName { get; set; }
        public virtual int TypeId { get; set; }

        public virtual string RegionLetter { get; set; }
        
        public virtual string CountyName { get; set; }
        public virtual int CountyId { get; set; }

        public virtual long Supply2010 { get; set; }
        public virtual long Supply2020 { get; set; }
        public virtual long Supply2030 { get; set; }
        public virtual long Supply2040 { get; set; }
        public virtual long Supply2050 { get; set; }
        public virtual long Supply2060 { get; set; }

        public virtual double CapitalCost { get; set; }

        public virtual string SponsorName { get; set; }
        public virtual int SponsorId { get; set; } 

        public virtual string OnlineYear { get; set; }

        public virtual string SourceName { get; set; }
        public virtual int SourceId { get; set; } 

        public virtual int RecipientEntityId { get; set; }
        public virtual string RecipientEntityName { get; set; }
        public virtual string RecipientEntityType { get; set; }
        public virtual string RecipientEntityWktGeog { get; set; }
    }

    public class StrategyDetails : Strategy
    {

    }
}
