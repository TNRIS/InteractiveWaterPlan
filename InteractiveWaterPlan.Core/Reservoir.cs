using System;

namespace InteractiveWaterPlan.Core
{
    public class Reservoir : AbstractFeature
    {
        public virtual int Id { get; set; }
        public virtual int RecommendationCode { get; set; }
    }
}