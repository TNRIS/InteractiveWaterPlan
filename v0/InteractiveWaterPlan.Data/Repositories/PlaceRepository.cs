using System;
using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;
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
        /// Returns the PlaceFeature for the given placeId.
        /// </summary>
        /// <param name="placeId"></param>
        /// <returns></returns>
        public PlaceFeature GetPlaceFeature(int placeId)
        {
            var placeFeature = Session.GetNamedQuery("GetPlaceFeature")
                .SetParameter("var_PlaceID", placeId)
                .UniqueResult<PlaceFeature>();
            
            //TODO: Might want DB to reduce the place geographies before
            // they are sent to the app.

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

            //TODO: Might want DB to reduce the place geographies before
            // they are sent to the app.

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



    }


}
