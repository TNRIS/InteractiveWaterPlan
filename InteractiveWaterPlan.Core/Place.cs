
namespace InteractiveWaterPlan.Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    public enum PlaceCategoryCode
    {
        COUNTY = 1,
        CITY = 2,
        GCD = 3,                  //Groundwater Conservation District
        GMA = 4,                  //Groundwater Management Area
        RWPA = 5,                 //Regional Water Planning Area
        RIVER_AUTH = 6,           //River Authority
        TX_HOUSE_DISTRICT = 7,
        TX_SENATE_DISTRICT = 8,
        US_CONG_DISTRICT = 9,
        USGS_QUAD = 10
    }

    public class Place
    {
        public virtual int Id { get; set; }
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
