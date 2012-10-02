using System.Collections.Generic;
using System.Linq;
using InteractiveWaterPlan.Core;
using NHibernate;

namespace InteractiveWaterPlan.Data
{

    public class PlaceRepository : Repository<int, Entity>
    {

        #region Constructors

        public PlaceRepository() : base(typeof(PlaceRepository)) { }

        public PlaceRepository(ISession session) : base(session, typeof(PlaceRepository)) { }

        #endregion

        /// <summary>
        /// Returns a list of all Places in the specified PlaceCategory
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        public IEnumerable<Place> GetPlaces(int categoryId)
        {
            return Session.GetNamedQuery("GetPlacesByCategory")
                .SetParameter("var_CategoryID", categoryId)
                .List<Place>()
                .OrderBy(p => p.SqlId)
                .Select(p => { p.Name = p.Name.Trim(); return p; })
                .ToList<Place>();
        }

        /// <summary>
        /// Returns a list of Places contained
        /// </summary>
        /// <param name="parentPlaceId"></param>
        /// <returns></returns>
        //TODO: Need stored procedure to support this
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
        public IEnumerable<Place> GetPlacesByNamePart(string name)
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
        public IEnumerable<PlaceCategory> GetAllPlaceCategories()
        {
            return Session.GetNamedQuery("GetAllPlaceCategories")
                .List<PlaceCategory>()
                .OrderBy(pc => pc.Id)
                .ToList<PlaceCategory>();
        }

        public PlaceFeature GetPlaceFeature(int placeId)
        {
            return Session.GetNamedQuery("GetPlaceFeature")
                .SetParameter("var_PlaceID", placeId)
                .UniqueResult<PlaceFeature>();
        }

    }
}
