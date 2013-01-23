using System.Collections.Generic;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;


namespace InteractiveWaterPlan.MVC4.Controllers
{
    [NHibernateSession(CommonConstants.SWP_SESSION_NAME)]
    public class SourceController : ApiController
    {
        private SourceRepository _repo;

        public SourceController()
        {
            _repo = new SourceRepository(CommonConstants.SWP_SESSION_NAME);
        }

        //api/entity/{entityId}/sources
        public IList<Source> GetSourcesForEntity(int entityId)
        {
            return _repo.GetSourcesForEntity(entityId);
        }
    }
}