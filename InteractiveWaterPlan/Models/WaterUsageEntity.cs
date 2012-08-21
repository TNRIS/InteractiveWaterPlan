using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.SqlServer.Types;

namespace InteractiveWaterPlan.Models
{
    public class WaterUseEntity
    {
        public string Name;
        public int Id;
        public string Geography;
        public IDictionary<string, string> SSUsage; //TODO: What is SS?

        //TODO: Move these into a source/supply class
        public bool IsRedundantSupply;
        public string SourceName;
        public int SourceId;

        public WaterUseEntity()
        {
            this.SSUsage = new Dictionary<string, string>();
        }

        public WaterUseEntity(string Name, int Id, SqlGeography Geography, bool IsRedundantSupply, string SourceName, int SourceId)
        {
            this.Name = Name;
            this.Id = Id;
            this.Geography = new string(Geography.STAsText().Value);
            this.IsRedundantSupply = IsRedundantSupply;
            this.SourceId = SourceId;
            this.SourceName = Name;

            this.SSUsage = new Dictionary<string, string>();
        }
    }
}