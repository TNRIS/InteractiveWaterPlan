using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Xml;
using System.Xml.Serialization;
using System.Web.Script.Serialization;
using System.Web.Http;
using System.Net.Http;
using System.Net;

using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;


namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class FeatureController : ApiController
    {
        private readonly int[] _validYears = new int[] { 2010, 2020, 2030, 2040, 2050, 2060 };

        //api/feature/reservoir/proposed/all
        [NHibernateSession]
        public IEnumerable<Reservoir> GetAllProposedReservoirs()
        {      
            var repo = new EntityRepository();
            return repo.GetAllProposedReservoirs();
        }

        //api/feature/reservoir/proposed?zoomLevel=Z&lat=Y&lon=X
        [NHibernateSession]
        public Reservoir GetProposedReservoir(double lat, double lon, int zoom)
        {
            var repo = new EntityRepository();
            var clickedReservoir = repo.GetReservoirByBufferedClickPoint(lat, lon, zoom);
            return clickedReservoir;
            //return Json(clickedReservoir, JsonRequestBehavior.AllowGet);
        }

        //api/feature/entity/all
        [NHibernateSession]
        public IEnumerable<Entity> GetAllEntities()
        {
            var repo = new EntityRepository();
            return repo.GetAllEntities();
            //return Json(repo.GetAllEntities(), JsonRequestBehavior.AllowGet);
        }

        //api/feature/entity/{Year}?forReservoir={ReservoirId}
        [NHibernateSession]
        public IEnumerable<WaterUseEntity> GetEntities(int Year, int forReservoirId=-1)
        {
            if (!_validYears.Contains(Year))
            {
                var resp = new HttpResponseMessage(HttpStatusCode.NotFound)
                {
                    Content = new StringContent(
                        "Invalid Year: " + Year + ". Valid Years are " + String.Join(", ", _validYears))
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
