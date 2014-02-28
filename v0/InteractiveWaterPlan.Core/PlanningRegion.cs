
namespace InteractiveWaterPlan.Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;


    public class PlanningRegion : AbstractFeature
    {
        public virtual string Name { get; set; }
        public virtual char Letter { get; set; }
    }
}
