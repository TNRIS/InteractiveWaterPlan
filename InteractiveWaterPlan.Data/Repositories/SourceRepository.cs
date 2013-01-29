using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using Microsoft.SqlServer.Types;
using NHibernate;
using InteractiveWaterPlan.Data.Utils;

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
        public IList<Source> GetSourcesForEntity(int entityId, string year, int polygonReduceFactor = 200)
        {
            var sources = Session.GetNamedQuery("GetSourcesForEntity")
                .SetParameter("entityId", entityId)
                .SetParameter("year", year)
                .List<Source>()
                .ToList();

            foreach (var src in sources)
            {
                if (src.WktGeog.StartsWith("POLYGON") || src.WktGeog.StartsWith("MULTIPOLYGON")) //only need to reduce polygons
                {
                    SqlGeography geog = SqlGeography.Parse(src.WktGeog);
                    SqlGeography reducedGeog = geog.Reduce(polygonReduceFactor);

                    //Sometimes reducing the geometry of a complex polygon will leave artifacts
                    //such as points and linestrings.  This is a problem for drawing.
                    //So, remove those artifacts if the original was of type MultiPolygon.
                    reducedGeog = DataUtils.CleanUpPolygonGeography(reducedGeog);

                    src.WktGeog = reducedGeog.ToString();
                }
            }

            return sources;
        }
    }
}
