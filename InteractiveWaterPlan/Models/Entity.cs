using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InteractiveWaterPlan.Models
{
    public class Entity : AbstractFeature
    {
        public string Type;
        public string RWP;
        public string County;
        public string Basin;

        public Entity() : base()
        {

        }
    }
}