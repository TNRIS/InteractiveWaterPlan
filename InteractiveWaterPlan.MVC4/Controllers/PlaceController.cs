using System.Collections.Generic;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class PlaceController : ApiController
    {
        //api/place?category={category}
        [NHibernateSession]
        public IEnumerable<Place> GetPlacesByCategory(int category)
        {
            var repo = new PlaceRepository();
            return repo.GetPlacesByCategory(category);
        }

        //api/place/categories
        [NHibernateSession]
        public IEnumerable<PlaceCategory> GetAllPlaceCategories()
        {
            var repo = new PlaceRepository();
            return repo.GetAllPlaceCategories();
        }

        //api/place?name={name}
        [NHibernateSession]
        public IEnumerable<Place> GetPlacesByNamePart(string name)
        {
            var repo = new PlaceRepository();
            return repo.GetPlacesByNamePart(name);
        }

        //api/place/feature
        [NHibernateSession]
        public PlaceFeature GetPlaceFeature(int placeId)
        {
            var repo = new PlaceRepository();
            return repo.GetPlaceFeature(placeId);
        }

    }
}
