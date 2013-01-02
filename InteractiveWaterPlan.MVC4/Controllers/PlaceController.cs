using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    [NHibernateSession]
    public class PlaceController : ApiController
    {
        

        //TODO: Remove this method - just for testing
        //api/place/all
        public IList<Place> GetAllPlaces()
        {
            var repo = new PlaceRepository();
            var x = repo.GetPlaces(1).OrderBy(p => p.Name);
            var y = repo.GetPlaces(5).OrderBy(p => p.Name);
            return x.Union(y).ToList<Place>(); 
        }

        //api/place/feature?placeId={placeId}
        public PlaceFeature GetPlaceFeature(int placeId)
        {
            var repo = new PlaceRepository();
            return repo.GetPlaceFeature(placeId);
        }

        //api/place?categoryId={categoryId}
        public IList<Place> GetPlacesByCategory(int categoryId)
        {
            var repo = new PlaceRepository();
            return repo.GetPlaces(categoryId);
        }

        //api/place/rwpa
        public IList<Place> GetRegionalPlanningAreas()
        {
            var repo = new PlaceRepository();
            return repo.GetPlaces(PlaceCategoryCode.RWPA);
        }

        //api/place/{id}
        public Place GetPlace(int id)
        {
            //TODO: Need stored proc to support get place by id
            throw new NotImplementedException();
        }
       
        //api/place/categories
        public IList<PlaceCategory> GetAllPlaceCategories()
        {
            var repo = new PlaceRepository();
            return repo.GetAllPlaceCategories();
        }

        //api/place?name={name}
        public IList<Place> GetPlacesByNamePart(string name)
        {
            var repo = new PlaceRepository();
            return repo.GetPlacesByNamePart(name);
        }

        

    }
}
