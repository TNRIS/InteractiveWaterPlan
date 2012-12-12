
namespace InteractiveWaterPlan.Core
{
    public abstract class AbstractFeature
    {
        public virtual int SqlId { get; set; }
        public virtual string Name { get; set; }
        public virtual string WktGeog { get; set; }
    }
}