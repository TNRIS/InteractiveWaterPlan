
namespace InteractiveWaterPlan.Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;


    public class Place
    {
        public virtual int SqlId { get; set; }
        public virtual string Name { get; set; }
        public virtual int CategoryId { get; set; }
        public virtual string CategoryName { get; set; }
    }

    public class PlaceFeature : AbstractFeature
    {

    }

    public class PlaceCategory
    {
        public virtual int Id { get; set; }
        public virtual string Name { get; set; }
    }
}
