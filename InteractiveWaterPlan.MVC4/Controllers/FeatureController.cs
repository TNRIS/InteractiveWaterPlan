using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Xml;
using System.Xml.Serialization;
using System.Web.Script.Serialization;
using InteractiveWaterPlan.Data;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class FeatureController : Controller
    {
        private readonly int[] _validYears = new int[] { 2010, 2020, 2030, 2040, 2050, 2060 };

        [NHibernateSession]
        public ActionResult GetAllProposedReservoirs()
        {
            var serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = 50000000;

            var repo = new EntityRepository();
            return new ContentResult()
            {
                Content = serializer.Serialize(repo.GetAllProposedReservoirs()),
                ContentType = "application/json"
            };
        }

        //Feature/Reservoir/Proposed?zoomLevel=Z&lat=Y&lon=X
        [NHibernateSession]
        public ActionResult GetProposedReservoir(double lat, double lon, int zoom)
        {
            var repo = new EntityRepository();
            var clickedReservoir = repo.GetReservoirByBufferedClickPoint(lat, lon, zoom);

            return Json(clickedReservoir, JsonRequestBehavior.AllowGet);
        }

        //Feature/Entity/All
        [NHibernateSession]
        public ActionResult GetAllEntities()
        {
            var repo = new EntityRepository();
            return Json(repo.GetAllEntities(), JsonRequestBehavior.AllowGet);
        }

        //Feature/Entity/{Year}?forReservoir={ReservoirId}
        [NHibernateSession]
        public ActionResult GetEntities(int Year, int forReservoirId=-1)
        {
            if (!_validYears.Contains(Year))
            {
                //TODO: Make an error class that will serialize to messages like this
                return Json(
                    new
                    {
                        Error = "Invalid Year: " + Year + ". Valid Years are " + String.Join(", ", _validYears)
                    }, JsonRequestBehavior.AllowGet);
            }
            else if (forReservoirId == -1)
            {
                return Json(
                    new
                    {
                        Error = "forReservoirId must be specified."
                    }, JsonRequestBehavior.AllowGet);
            }

            var repo = new EntityRepository();
            var relatedEntities = repo.GetEntitiesServedByReservoir(forReservoirId, Year);
            return Json(relatedEntities, JsonRequestBehavior.AllowGet);
        }

        
    }
}
