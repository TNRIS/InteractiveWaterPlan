using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;

namespace InteractiveWaterPlan.Data
{

    public class BoundaryRepository : AbstractHibernateRepository
    {

        #region Constructors

        public BoundaryRepository(string sessionName) : base(sessionName) { }

        public BoundaryRepository(ISession session) : base(session) { }

        #endregion

        public IEnumerable<object> GetCountyNames()
        {
            return Session.GetNamedQuery("GetAllCounties")
                .List<County>()
                .OrderBy(x => x.Name)
                .Select(x => new { id = x.Id, name = x.Name })
                .ToList();
        }

        public IList<County> GetCounties()
        {
            return Session.GetNamedQuery("GetAllCounties")
                .List<County>()
                .OrderBy(x => x.Name)
                .ToList<County>();
        }

        public IEnumerable<object> GetPlanningRegionNames()
        {
            return Session.GetNamedQuery("GetAllPlanningRegions")
                .List<PlanningRegion>()
                .OrderBy(x => x.Letter)
                .Select(x => new { letter = x.Letter, name = x.Name })
                .ToList();
        }

        public IList<PlanningRegion> GetPlanningRegions()
        {
            return Session.GetNamedQuery("GetAllPlanningRegions")
                .List<PlanningRegion>()
                .OrderBy(x => x.Letter)
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
