using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace InteractiveWaterPlan.Core
{

    public class ReservoirSupplyData
    {
        //Total supply values in acre-feet
        public virtual double Municipal { get; set; }
        public virtual double Irrigation { get; set; }
        public virtual double Manufacturing { get; set; }
        public virtual double Mining { get; set; }
        public virtual double SteamElectricPower { get; set; }
        public virtual double Livestock { get; set; }
    }
}
