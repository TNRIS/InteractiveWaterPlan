using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;

namespace InteractiveWaterPlan.Data
{

    public class BoundaryRepository : Repository
    {

        #region Constructors

        public BoundaryRepository(string sessionName) : base(sessionName) { }

        public BoundaryRepository(ISession session) : base(session) { }

        #endregion


        public IList<County> GetCounties()
        {
            return Session.GetNamedQuery("GetAllCounties")
                .List<County>()
                .OrderBy(x => x.Id)
                .ToList<County>();
        }

        public IList<PlanningRegion> GetPlanningRegions()
        {
            return Session.GetNamedQuery("GetAllPlanningRegions")
                .List<PlanningRegion>()
                .OrderBy(x => x.Id)
                .ToList<PlanningRegion>();
        }

        public IList<LegeDistrict> GetLegeDistricts()
        {
            return Session.GetNamedQuery("GetAllLegeDistricts")
                .List<LegeDistrict>()
                .OrderBy(x => x.Id)
                .ToList<LegeDistrict>();
        }

    }
}
