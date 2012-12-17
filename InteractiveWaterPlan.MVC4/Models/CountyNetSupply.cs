using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InteractiveWaterPlan.MVC4.Models
{
    public class CountyNetSupply
    {
        public string CountyName { get; set; }
        public int CountyId { get; set; }

        public string RegionName { get; set; }
        public int RegionId { get; set; }

        public string Decade { get; set; }

        public int NetMunicipal { get; set; }
        public int NetIrrigation { get; set; }
        public int NetManufacturing { get; set; }
        public int NetLivestock { get; set; }
        public int NetSteamElectric { get; set; }
        public int NetMining { get; set; }

        public int NetSupplyTotal { 
            get {
                return NetMunicipal + NetIrrigation + NetManufacturing + NetLivestock
                    + NetSteamElectric + NetMining;
            } 
        }
    }
}