using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using Microsoft.SqlServer.Types;
using NHibernate;

namespace InteractiveWaterPlan.Data
{
    public class EntityRepository : Repository<int, Entity>
    {
        /// <summary>
        /// Lookup table that contains the data for calculating buffered 
        /// geographies around screen pixel click locations.
        /// </summary>
        private static PixelBufferTable _pixelBufferTable;

        /// <summary>
        /// Static constructor called once to instantiate the pixelBufferTable.
        /// The data does not change so we do not need to request it every time a new
        /// EntityRepository is constructed.
        /// </summary>
        static EntityRepository()
        {
            var repo = new PixelBufferRepository();
            _pixelBufferTable = repo.GetPixelBufferTable();
        }


        #region Constructors

        public EntityRepository() : base(typeof(EntityRepository)) { }

        public EntityRepository(ISession session) : base(session, typeof(EntityRepository)) { }

        #endregion


        /// <summary>
        /// Returns a list of all DB12 Entities.
        /// </summary>
        /// <returns></returns>
        public IList<Entity> GetAllEntities()
        {
            return Session.GetNamedQuery("GetAllEntities")
                .List<Entity>();
        }

        /// <summary>
        /// Returns a list of all DB12 Entities within the given polygon
        /// </summary>
        /// <param name="poly"></param>
        /// <returns></returns>
        public IList<Entity> GetEntitiesInGeography(SqlGeography poly)
        {
            return Session.GetNamedQuery("GetEntitiesInGeography")
                .SetParameter("var_SelectPoly", poly)
                .List<Entity>();
        }


        public Reservoir GetReservoirByBufferedClickPoint(double lat, double lon, int zoomLevel)
        {
            var pointGB = new SqlGeographyBuilder();
            pointGB.SetSrid(4326);
            pointGB.BeginGeography(OpenGisGeographyType.Point);
            pointGB.BeginFigure(lat, lon);
            pointGB.EndFigure();
            pointGB.EndGeography();

            var clickedGeogPoint = pointGB.ConstructedGeography;

            var bufferGeogPoly = clickedGeogPoint.STBuffer(
                _pixelBufferTable.GetBufferRadius(zoomLevel));

            var res = Session.GetNamedQuery("GetReservoirInBufferedPoint")
                .SetParameter("var_SimplifyTolerance", 100)
                .SetParameter("var_PointGeog", clickedGeogPoint, new NHibernate.Spatial.Type.SqlGeographyType())
                .SetParameter("var_BufferPoly", bufferGeogPoly, new NHibernate.Spatial.Type.SqlGeographyType())
                .UniqueResult<Reservoir>();

            //Reduce the geometry
            if (res == null) return null;
            
            return res;            
        }

        /// <summary>
        /// Returns a list of all recommended Reservoirs.
        /// </summary>
        /// <returns></returns>
        public IList<Reservoir> GetAllRecommendedReservoirs()
        {
            return Session.GetNamedQuery("GetAllRecommendedReservoirs")
                .SetParameter("var_SimplifyTolerance", 100)
                .List<Reservoir>()
                .OrderBy(r => r.Name)
                .ToList<Reservoir>();

        }

        //TODO: Make Entity and WaterUseEntity the same.  Will need the stored proc to be updated to 
        // return the same fields/info.
        public IList<WaterUseEntity> GetEntitiesServedByReservoir(int recommendedReservoirId, string year)
        {
            return Session.GetNamedQuery("GetEntitiesForReservoir")
                .SetParameter("var_DB12_ID", recommendedReservoirId)
                .SetParameter("var_EstYear", year)
                .List<WaterUseEntity>()
                .OrderBy(e => e.Name)
                .ToList<WaterUseEntity>();
        }
    }
}
