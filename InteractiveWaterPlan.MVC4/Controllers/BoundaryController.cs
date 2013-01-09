using System.Collections.Generic;
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
        public IEnumerable<County> GetAllCounties()
        {      
            return _repo.GetCounties();
        }

        //api/boundary/counties/names
        public IEnumerable<object> GetAllCountyNames()
        {
            return _repo.GetCountyNames();
        }

        //api/boundary/regions/names
        public IEnumerable<object> GetAllPlanningRegionNames()
        {
            return _repo.GetPlanningRegionNames();
        }

        //api/boundary/regions/all
        public IEnumerable<PlanningRegion> GetAllPlanningRegions()
        {
            return _repo.GetPlanningRegions();
        }

        //api/boundary/districts/house/all
        public IEnumerable<LegeDistrict> GetAllHouseDistrictFeatures()
        {
            return _repo.GetHouseDistricts();
        }

        //api/boundary/districts/senate/all
        public IEnumerable<LegeDistrict> GetAllSenateDistrictFeatures()
        {
            return _repo.GetSenateDistricts();
        }

        //api/boundary/districts/house/names
        public IEnumerable<object> GetAllHouseDistrictNames()
        {
            return _repo.GetHouseDistrictNames();
        }

        //api/boundary/districts/senate/names
        public IEnumerable<object> GetAllSenateDistrictNames()
        {
            return _repo.GetSenateDistrictNames();
        }

        
        
    }
}
