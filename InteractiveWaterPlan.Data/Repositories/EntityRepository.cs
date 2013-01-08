using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using Microsoft.SqlServer.Types;
using NHibernate;

namespace InteractiveWaterPlan.Data
{
    public class EntityRepository : AbstractHibernateRepository
    {
        
        #region Constructors

        public EntityRepository(string sessionName) : base(sessionName) { }

        public EntityRepository(ISession session) : base(session) { }

        #endregion


        /// <summary>
        /// Returns details for a specific entity
        /// </summary>
        /// <returns></returns>
        public Entity GetEntity(int entityId)
        {
            return Session.GetNamedQuery("GetEntity")
                .SetParameter("entityId", entityId)
                .List<Entity>()
                .FirstOrDefault();
        }

       
    }
}
