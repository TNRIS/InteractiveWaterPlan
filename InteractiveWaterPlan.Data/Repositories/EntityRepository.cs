using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using Microsoft.SqlServer.Types;

using NHibernate;
using NHibernate.Spatial;

using InteractiveWaterPlan.Core;

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
            
            return Session.GetNamedQuery("GetReservoirInBufferedPoint")
                .SetParameter("var_PointGeog", clickedGeogPoint, new NHibernate.Spatial.Type.SqlGeographyType())
                .SetParameter("var_BufferPoly", bufferGeogPoly, new NHibernate.Spatial.Type.SqlGeographyType())
                .UniqueResult<Reservoir>();
        }

        /// <summary>
        /// Returns a list of all proposed Reservoirs.
        /// </summary>
        /// <returns></returns>
        public IList<Reservoir> GetAllProposedReservoirs()
        {
            return Session.GetNamedQuery("GetAllProposedReservoirs")
                .List<Reservoir>();
        }

        //TODO: Make Entity and WaterUseEntity the same.  Will need the stored proc to be updated to 
        // return the same fields/info.
        public IList<WaterUseEntity> GetEntitiesServedByReservoir(int proposedReservoirId, int year)
        {
            if (year == 2012)
                year = 2010;

            return Session.GetNamedQuery("GetEntitiesForReservoir")
                .SetParameter("var_DB12_ID", proposedReservoirId)
                .SetParameter("var_EstYear", year)
                .List<WaterUseEntity>();
        }
    }
}
