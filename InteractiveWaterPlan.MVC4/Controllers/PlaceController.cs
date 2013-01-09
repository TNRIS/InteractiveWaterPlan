using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    [NHibernateSession(CommonConstants.PLACES_SESSION_NAME)]
    public class PlaceController : ApiController
    {
        private PlaceRepository _repo; 

        public PlaceController()
        {
            _repo = new PlaceRepository(CommonConstants.PLACES_SESSION_NAME);
        }


        //api/place/feature?placeId={placeId}
        public PlaceFeature GetPlaceFeature(int placeId)
        {
            return _repo.GetPlaceFeature(placeId);
        }

        //api/place/featurecenter?placeId={placeId}
        public PlaceFeature GetPlaceCenter(int placeId)
        {
            return _repo.GetPlaceCenter(placeId);
        }

        //api/place?categoryId={categoryId}
        public IList<Place> GetPlacesByCategory(int categoryId)
        {
            return _repo.GetPlaces(categoryId);
        }

        //api/place/rwpa
        public IList<Place> GetRegionalPlanningAreas()
        {
            return _repo.GetPlaces(PlaceCategoryCode.RWPA);
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
            return _repo.GetAllPlaceCategories();
        }

        //api/place?name={name}
        public IList<Place> GetPlacesByNamePart(string name)
        {
            return _repo.GetPlacesByNamePart(name);
        }

        

    }
}
