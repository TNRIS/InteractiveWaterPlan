using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.SqlServer.Types;

namespace InteractiveWaterPlan.Models
{
    //TODO: Make this extend a normal Entity
    // Will need the DB to return all the base Entity fields as well
    public class WaterUseEntity : Entity
    {
        public IDictionary<string, string> SSUsage; //TODO: What is SS?

        //TODO: Move these into a source/supply class
        public bool IsRedundantSupply;
        public string SourceName;
        public int SourceId;

        public WaterUseEntity() : base()
        {
            this.SSUsage = new Dictionary<string, string>();
        }
    }
}