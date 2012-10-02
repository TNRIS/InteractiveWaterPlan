using System.Collections.Generic;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;
using System.Linq;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class PlaceController : ApiController
    {
        //api/place?category={category}
        [NHibernateSession]
        public IEnumerable<Place> GetPlacesByCategory(int category)
        {
            var repo = new PlaceRepository();
            return repo.GetPlaces(category);
        }

        //api/place/all
        [NHibernateSession]
        public IEnumerable<Place> GetAllPlaces()
        {
            //TODO: Remove - just for testing
            var repo = new PlaceRepository();
            var x = repo.GetPlaces(1).OrderBy(p => p.Name);
            var y = repo.GetPlaces(5).OrderBy(p => p.Name);
            return x.Union(y).ToList<Place>();
            
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
