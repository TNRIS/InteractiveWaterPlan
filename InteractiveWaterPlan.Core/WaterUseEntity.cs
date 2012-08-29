using System;
using System.Collections.Generic;

namespace InteractiveWaterPlan.Core
{
    //TODO: Make this extend a normal Entity
    // Will need the DB to return all the base Entity fields as well
    public class WaterUseEntity : Entity
    {
        //TODO: Make properties for each SS thing
        // or perhaps have them returned a different way from the DB,
        // such as a single column with YEAR:Number, separated by commas
        // Or a field that always returns the SS for the given year to the storedproc
        //  it is unwieldy to deal with changing column names.

        //TODO: IsRedundantSupply should probably be a bool in the DB
        public virtual string IsRedundantSupply { get; set; }
        public virtual string SourceName { get; set; }
        public virtual int SourceId { get; set; }
    }
}