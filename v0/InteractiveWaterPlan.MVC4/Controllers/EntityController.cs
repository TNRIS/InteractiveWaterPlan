using System.Collections.Generic;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;


namespace InteractiveWaterPlan.MVC4.Controllers
{
    [NHibernateSession(CommonConstants.SWP_SESSION_NAME)]
    public class EntityController : ApiController
    {
        private EntityRepository _repo;

        public EntityController()
        {
            _repo = new EntityRepository(CommonConstants.SWP_SESSION_NAME);
        }

        //api/entity/{entityId}
        public Entity GetEntity(int entityId)
        {
            return _repo.GetEntity(entityId);
        }

        //api/entities/auto
        public IList<EntityNameId> GetEntitiesAutocomplete(string namePart)
        {
            if (namePart.Length < 2)
                return null;

            return _repo.GetEntitiesByNamePart(namePart);
        }
    }
}