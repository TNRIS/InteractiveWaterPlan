using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;

namespace InteractiveWaterPlan.Data
{

    public class SourceSupplyRepository : Repository<int, WaterSourceSupplyData>
    {

        #region Constructors

        public SourceSupplyRepository() : base(typeof(SourceSupplyRepository)) { }

        public SourceSupplyRepository(ISession session) : base(session, typeof(SourceSupplyRepository)) { }

        #endregion

        /// <summary>
        /// Returns a list of total supply values for the given reservoir and planning year
        /// </summary>
        /// <param name="reservoirId"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public IEnumerable<WaterSourceSupplyData> GetReservoirSupplyTotals(int reservoirId, int year)
        {
            return Session.GetNamedQuery("GetReservoirSupplyTotals")
                .SetParameter("var_Source_ID", reservoirId)
                .SetParameter("var_EstYear", year)
                .List<WaterSourceSupplyData>();
        }


    }
}
