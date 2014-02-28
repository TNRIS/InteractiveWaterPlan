using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;

namespace InteractiveWaterPlan.Data
{
    public class SourceRepository : AbstractHibernateRepository
    {

        #region Constructors

        public SourceRepository(string sessionName) : base(sessionName) { }

        public SourceRepository(ISession session) : base(session) { }

        #endregion


        /// <summary>
        /// Returns details for a specific entity
        /// </summary>
        /// <returns></returns>
        public IList<Source> GetSourcesForEntity(int entityId, string year)
        {
            var sources = Session.GetNamedQuery("GetSourcesForEntity")
                .SetParameter("entityId", entityId)
                .SetParameter("year", year)
                .List<Source>()
                .ToList();

            return sources;
        }

        public IList<SourceDetail> GetSourcesForProject(int projectId, string year)
        {
            var sources = Session.GetNamedQuery("GetSourcesForProject")
                .SetParameter("projectId", projectId)
                .SetParameter("year", year)
                .List<SourceDetail>()
                .ToList();

            return sources;
        }

        public SourceDetail GetSource(int sourceId)
        {
            var source = Session.GetNamedQuery("GetSource")
                .SetParameter("sourceId", sourceId)
                .UniqueResult<SourceDetail>();

            return source;
        }
    }
}
