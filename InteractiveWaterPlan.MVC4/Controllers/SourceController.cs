using System.Collections.Generic;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;
using System;
using System.Linq;


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

        //api/entity/{entityId}/sources?year=20X0
        public IList<Source> GetSourcesForEntity(int entityId, string year)
        {
            if (!CommonConstants.VALID_YEARS.Contains(year))
                throw new ArgumentException("Specified year is not valid.");
            
            return _repo.GetSourcesForEntity(entityId, year);
        }

        //api/source/{sourceId}
        public Source GetSource(int sourceId)
        {
            //TODO - need stored proc
            return null;
        }
    }
}