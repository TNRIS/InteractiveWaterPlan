﻿namespace InteractiveWaterPlan.Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    public abstract class BaseStrategy 
    {
        public virtual int Id { get; set; }
        public virtual string Description { get; set; }

        public virtual int ProjectId { get; set; }

        //public virtual string TypeName { get; set; }
        //public virtual int TypeId { get; set; }

        public virtual long Supply2010 { get; set; }
        public virtual long Supply2020 { get; set; }
        public virtual long Supply2030 { get; set; }
        public virtual long Supply2040 { get; set; }
        public virtual long Supply2050 { get; set; }
        public virtual long Supply2060 { get; set; }
    }

    /// <summary>
    /// Water Management Strategy Model Class.
    /// This base Strategy class is used for "County" Strategies and "Type" Strategies.
    /// </summary>
    public class Strategy : BaseStrategy
    {
        public virtual string RegionLetter { get; set; }
        
        public virtual string CountyName { get; set; }
        public virtual int CountyId { get; set; }

        public virtual string IsRedundantSupply { get; set; }

        //public virtual double CapitalCost { get; set; }

        public virtual string SponsorName { get; set; }
        
        public virtual string OnlineYear { get; set; }

        public virtual string SourceName { get; set; }
        public virtual int SourceId { get; set; } 

        public virtual int RecipientEntityId { get; set; }
        public virtual string RecipientEntityName { get; set; }
        public virtual string RecipientEntityType { get; set; }
        public virtual string RecipientEntityWktGeog { get; set; }

        public virtual Strategy Clone()
        {
            return (Strategy)this.MemberwiseClone();
        }
    }

    public class ProjectStrategy : Strategy
    {
        //REMOVED: public virtual double CapitalCost { get; set; }
        public virtual int SponsorId { get; set; }

        public virtual ProjectStrategy Clone()
        {
            return (ProjectStrategy)this.MemberwiseClone();
        }
    }

    public class EntityStrategy : BaseStrategy
    {
        public virtual string IsRedundantSupply { get; set; }

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

        public virtual EntityStrategy Clone()
        {
            return (EntityStrategy)this.MemberwiseClone();
        }
    }

    public class SourceStrategy : BaseStrategy
    {
        //public virtual string SourceType { get; set; }

        public virtual string SourceBasin { get; set; }
        public virtual char RegionLetter { get; set; }

        public virtual string IsRedundantSupply { get; set; }

        public virtual int RecipientEntityId { get; set; }
        public virtual string RecipientEntityName { get; set; }
        public virtual string RecipientEntityType { get; set; }
        public virtual string RecipientEntityWktGeog { get; set; }

        public virtual string SourceMappingPoint { get; set; }

        public virtual SourceStrategy Clone()
        {
            return (SourceStrategy)this.MemberwiseClone();
        }
    }

    public class DistrictStrategy : BaseStrategy
    {
        public virtual string SponsorRegionLetter { get; set; }

        public virtual string IsRedundantSupply { get; set; }

        public virtual string SponsorName { get; set; }
        public virtual int SponsorId { get; set; }

        public virtual string OnlineYear { get; set; }

        public virtual string SourceName { get; set; }
        public virtual int SourceId { get; set; }

        public virtual int RecipientEntityId { get; set; }
        public virtual string RecipientEntityName { get; set; }
        public virtual string RecipientEntityType { get; set; }
        public virtual string RecipientEntityWktGeog { get; set; }

        public virtual DistrictStrategy Clone()
        {
            return (DistrictStrategy)this.MemberwiseClone();
        }
    }

    /// <summary>
    /// Region Strategy Model Class
    /// </summary>
    public class RegionStrategy : BaseStrategy
    {
        public virtual string IsRedundantSupply { get; set; }

        public virtual double CapitalCost { get; set; }

        public virtual string OnlineYear { get; set; }

        public virtual RegionStrategy Clone()
        {
            return (RegionStrategy)this.MemberwiseClone();
        }
    }
}
