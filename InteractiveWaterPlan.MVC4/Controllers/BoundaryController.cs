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
    [NHibernateSession]
    public class BoundaryController : ApiController
    {
        
        //api/boundary/counties/all
        public IEnumerable<County> GetAllCountyFeatures()
        {      
            var repo = new BoundaryRepository();
            return repo.GetCounties();
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
            var repo = new BoundaryRepository();
            return repo.GetPlanningRegions();
        }

        //api/boundary/legedistricts/all
        public IEnumerable<LegeDistrict> GetAllLegeDistrictFeatures()
        {
            var repo = new BoundaryRepository();
            return repo.GetLegeDistricts();
        }

        
        
    }
}
