using System;

namespace InteractiveWaterPlan.Core
{
    public class Reservoir : AbstractFeature
    {
        public virtual int ReservoirId { get; set; }
        public virtual int RecommendationCode { get; set; }
    }
}