using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InteractiveWaterPlan.Core
{
    public class CountyNetSupply
    {
        public virtual int RowId { get; set; }

        public virtual string CountyName { get; set; }
        public virtual int CountyId { get; set; }

        public virtual char RegionLetter { get; set; }

        public virtual long NetMunicipal { get; set; }
        public virtual long NetIrrigation { get; set; }
        public virtual long NetManufacturing { get; set; }
        public virtual long NetLivestock { get; set; }
        public virtual long NetSteamElectric { get; set; }
        public virtual long NetMining { get; set; }

        public virtual long NetSupplyTotal { 
            get {
                return NetMunicipal + NetIrrigation + NetManufacturing + NetLivestock
                    + NetSteamElectric + NetMining;
            } 
        }
    }
}