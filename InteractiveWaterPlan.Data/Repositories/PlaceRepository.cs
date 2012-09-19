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

namespace InteractiveWaterPlan.Data.Repositories
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
        public IList<Place> GetPlacesByCategory(int categoryId)
        {
            return Session.GetNamedQuery("usp_Select_Places_by_Category_tbl_GEMSS_Vector_PlaceNames")
                .SetParameter("var_CategoryID", categoryId)
                .List<Place>();
        }

        /// <summary>
        /// Returns a list of all PlaceCategories
        /// </summary>
        /// <returns></returns>
        public IList<PlaceCategory> GetAllPlaceCategories()
        {
            return Session.GetNamedQuery("GetAllPlaceCategories").List<PlaceCategory>();
        }

        /// <summary>
        /// Returns a list of Places that have names starting with the input namePart. 
        /// Useful for autocompleting UI elements.
        /// </summary>
        /// <param name="namePart"></param>
        /// <returns></returns>
        public IList<Place> GetPlacesByNamePart(string namePart)
        {
            return Session.GetNamedQuery("GetPlacesByNamePart").List<Place>();
        }
        
        

    }
}
