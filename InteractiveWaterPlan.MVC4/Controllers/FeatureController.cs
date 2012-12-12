using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;


namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class FeatureController : ApiController
    {
        
        //api/feature/reservoir/recommended/all
        [NHibernateSession]
        public IEnumerable<Reservoir> GetAllRecommendedReservoirs()
        {      
            var repo = new EntityRepository();
            return repo.GetAllRecommendedReservoirs();
        }

        //api/feature/reservoir/recommended?zoomLevel=Z&lat=Y&lon=X
        [NHibernateSession]
        public Reservoir GetRecommendedReservoir(double lat, double lon, int zoom)
        {
            var repo = new EntityRepository();
            var clickedReservoir = repo.GetReservoirByBufferedClickPoint(lat, lon, zoom);
            return clickedReservoir;
        }

        //api/feature/entity/all
        [NHibernateSession]
        public IEnumerable<Entity> GetAllEntities()
        {
            var repo = new EntityRepository();
            return repo.GetAllEntities();
        }

        //api/feature/entity/{Year}?forReservoir={ReservoirId}
        [NHibernateSession]
        public IEnumerable<WaterUseEntity> GetEntitiesOfReservoir(int Year, int forReservoirId=-1)
        {
            if (!CommonConstants.VALID_YEARS.Contains(Year))
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(
                        "Invalid Year: " + Year + ". Valid Years are " + String.Join(", ", CommonConstants.VALID_YEARS))
                };
                throw new HttpResponseException(resp);
            }
            else if (forReservoirId == -1)
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent("forReservoirId must be specified.")
                };
                throw new HttpResponseException(resp);
            }

            var repo = new EntityRepository();
            var relatedEntities = repo.GetEntitiesServedByReservoir(forReservoirId, Year);
            return relatedEntities;
        }

        
    }
}
