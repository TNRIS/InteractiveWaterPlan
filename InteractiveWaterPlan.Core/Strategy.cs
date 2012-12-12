// -----------------------------------------------------------------------
// <copyright file="Strategy.cs" company="">
// TODO: Update copyright text.
// </copyright>
// -----------------------------------------------------------------------

namespace InteractiveWaterPlan.Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;

    /// <summary>
    /// Water Management Strategy Model Class
    /// </summary>
    public class Strategy
    {
        public virtual int Id { get; set; }
        public virtual string Description { get; set; }
        public virtual string TypeName { get; set; }
        public virtual int TypeId { get; set; }
    }
}
