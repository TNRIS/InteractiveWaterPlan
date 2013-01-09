namespace InteractiveWaterPlan.Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    public class LegeDistrict : AbstractFeature
    {
        public virtual string DistrictType { get; set; }

        public virtual string Name
        {
            get
            {
                return this.DistrictType + " District " + this.Id;
            }
        }
    }
}
