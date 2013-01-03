
namespace InteractiveWaterPlan.Core
{
    public abstract class AbstractFeature
    {
        public virtual int Id { get; set; }
        public virtual string WktGeog { get; set; }
    }
}