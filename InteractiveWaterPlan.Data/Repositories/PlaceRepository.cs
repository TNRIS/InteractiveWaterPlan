using System;
using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;
using Microsoft.SqlServer.Types;
using System.Data.SqlTypes;

namespace InteractiveWaterPlan.Data
{

    public class PlaceRepository : AbstractHibernateRepository
    {

        #region Constructors

        public PlaceRepository(string sessionName) : base(sessionName) { }

        public PlaceRepository(ISession session) : base(session) { }

        #endregion


        /// <summary>
        /// Returns a Place specified by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public Place GetPlace(int id)
        {
            //TODO: Need stored proc to get place by id
            throw new NotImplementedException();
        }

        /// <summary>
        /// Returns a list of all Places in the specified PlaceCategory
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        public IList<Place> GetPlaces(int categoryId)
        {
            return Session.GetNamedQuery("GetPlacesByCategory")
                .SetParameter("var_CategoryID", categoryId)
                .List<Place>()
                .OrderBy(p => p.Id)
                .Select(p => { p.Name = p.Name.Trim(); return p; })
                .ToList<Place>();
        }

        /// <summary>
        /// Returns a list of all Places in the specified PlaceCategory
        /// </summary>
        /// <param name="categoryCode"></param>
        /// <returns></returns>
        public IList<Place> GetPlaces(PlaceCategoryCode categoryCode)
        {
            return Session.GetNamedQuery("GetPlacesByCategory")
                .SetParameter("var_CategoryID", categoryCode)
                .List<Place>()
                .OrderBy(p => p.Id)
                .Select(p => { p.Name = p.Name.Trim(); return p; })
                .ToList<Place>();
        }

        /// <summary>
        /// Returns a list of Places contained
        /// </summary>
        /// <param name="parentPlaceId"></param>
        /// <returns></returns>
        //TODO: Stored procedure exists - need to implement this method
        //public IEnumerable<Place> GetPlacesInParentPlace(int parentPlaceId)
        //{
        //
        //}

        /// <summary>
        /// Returns a list of Places that have names starting with the input namePart. 
        /// Useful for autocompleting UI elements.
        /// </summary>
        /// <param name="namePart"></param>
        /// <returns></returns>
        public IList<Place> GetPlacesByNamePart(string name)
        {
            return Session.GetNamedQuery("GetPlacesByNamePart")
                .SetParameter("var_NamePart", name)
                .List<Place>()
                .OrderBy(p => p.Name)
                .Select(p => { p.Name = p.Name.Trim(); return p; })
                .ToList<Place>();
        }

        /// <summary>
        /// Returns a list of all PlaceCategories
        /// </summary>
        /// <returns></returns>
        public IList<PlaceCategory> GetAllPlaceCategories()
        {
            return Session.GetNamedQuery("GetAllPlaceCategories")
                .List<PlaceCategory>()
                .OrderBy(pc => pc.Id)
                .ToList<PlaceCategory>();
        }

        /// <summary>
        /// Returns the PlaceFeature for the given placeId.  The Geography of the 
        /// returned PlaceFeature will be reduced by reduceFactor.
        /// </summary>
        /// <param name="placeId"></param>
        /// <param name="reduceFactor"></param>
        /// <returns></returns>
        public PlaceFeature GetPlaceFeature(int placeId, int reduceFactor = 200)
        {
            var placeFeature = Session.GetNamedQuery("GetPlaceFeature")
                .SetParameter("var_PlaceID", placeId)
                .UniqueResult<PlaceFeature>();

            SqlGeography geog = SqlGeography.Parse(placeFeature.WktGeog);
            SqlGeography reducedGeog = geog.Reduce(reduceFactor);

            //TODO: Would be better to have this reduction done in the Database.
            
            //Sometimes reducing the geometry of a complex polygon will leave artifacts
            //such as points and linestrings.  This is a problem for drawing.
            //So, remove those artifacts if the original was of type MultiPolygon.
            if (geog.STGeometryType().Value.Equals("MultiPolygon"))
            {
                reducedGeog = cleanUpPolygonGeography(reducedGeog);
            }
            
            placeFeature.WktGeog = reducedGeog.ToString();

            return placeFeature;
        }


        /// <summary>
        /// Returns the PlaceFeature for the given placeId.  The Geography of the 
        /// returned PlaceFeature will be the center point of the actual PlaceFeature.
        /// </summary>
        /// <param name="placeId"></param>
        /// <returns></returns>
        public PlaceFeature GetPlaceCenter(int placeId)
        {
            var placeFeature = Session.GetNamedQuery("GetPlaceFeature")
                .SetParameter("var_PlaceID", placeId)
                .UniqueResult<PlaceFeature>();

            SqlGeography geog = SqlGeography.Parse(placeFeature.WktGeog);
            var centerGeog = geog.EnvelopeCenter();

            placeFeature.WktGeog = centerGeog.ToString();

            return placeFeature;
        }


        /// <summary>
        /// Returns the PlaceFeature for the given placeId.  The Geography of the 
        /// returned PlaceFeature will be the center point of the actual PlaceFeature.
        /// </summary>
        /// <param name="placeId"></param>
        /// <returns></returns>
        public PlaceFeature GetPlaceFeatureHull(int placeId)
        {
            return Session.GetNamedQuery("GetPlaceFeatureHull")
                .SetParameter("var_PlaceID", placeId)
                .UniqueResult<PlaceFeature>();
        }


        /// <summary>
        /// Removes points and lines from originalGeography and returns a MultiPolygon SqlGeography.
        /// </summary>
        /// <param name="originalGeography"></param>
        /// <returns></returns>
        private SqlGeography cleanUpPolygonGeography(SqlGeography originalGeography)
        {
            var cleanedGeog = SqlGeography.STGeomFromText(
                    new SqlChars(new SqlString("POINT EMPTY")), (int)originalGeography.STSrid);

            //STGeometryN is 1-based not 0-based index
            for (int i = 1; i <= originalGeography.STNumGeometries(); i++)
            {
                if (originalGeography.STGeometryN(i).STDimension() == 2) //only include polygons
                {
                    cleanedGeog = cleanedGeog.STUnion(originalGeography.STGeometryN(i));
                }
            }
            return cleanedGeog;
        }

    }


}
