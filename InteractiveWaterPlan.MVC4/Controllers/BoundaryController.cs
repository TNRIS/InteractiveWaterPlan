using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;


namespace InteractiveWaterPlan.MVC4.Controllers
{
    [NHibernateSession(CommonConstants.SWP_SESSION_NAME)]
    public class BoundaryController : ApiController
    {

        private BoundaryRepository _repo;

        public BoundaryController()
        {
            _repo = new BoundaryRepository(CommonConstants.SWP_SESSION_NAME);
        }

        //api/boundary/counties/all
        public IEnumerable<County> GetAllCountyFeatures()
        {      
            return _repo.GetCounties();
        }

        /*
        public IEnumerable<object> GetAllCounties()
        {
            var repo = new BoundaryRepository();
            var countyFeatures = repo.GetCounties();

            return countyFeatures
                .Select(x => new { id = x.Id, name = x.Name })
                .ToList();
        }*/

        //api/boundary/planningregions/all
        public IEnumerable<PlanningRegion> GetAllPlanningRegionFeatures()
        {
            return _repo.GetPlanningRegions();
        }

        //api/boundary/legedistricts/all
        public IEnumerable<LegeDistrict> GetAllLegeDistrictFeatures()
        {
            return _repo.GetLegeDistricts();
        }

        
        
    }
}
