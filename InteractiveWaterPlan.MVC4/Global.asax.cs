using System.Collections.Generic;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using InteractiveWaterPlan.Core;
using InteractiveWaterPlan.Data;
using Newtonsoft.Json.Serialization;

namespace InteractiveWaterPlan.MVC4
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            HttpFilterConfig.RegisterGlobalHttpFilters(GlobalConfiguration.Configuration.Filters);
           
            List<HibernateConnection> hibernateConnections = new List<HibernateConnection>();
            hibernateConnections.Add(new HibernateConnection(CommonConstants.PLACES_SESSION_NAME, Server.MapPath("~/PlacesDB_Hibernate.config")));
            hibernateConnections.Add(new HibernateConnection(CommonConstants.SWP_SESSION_NAME, Server.MapPath("~/WaterPlanDB_Hibernate.config")));
            
            NHibernateSessionManager.ConfigureFromFiles(hibernateConnections.ToArray());

            //Use the built-in camelCase contractResolver
            var json = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
            json.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            //Turn off XML serialization - don't need it.
            var config = GlobalConfiguration.Configuration;
            config.Formatters.Remove(config.Formatters.XmlFormatter);
        }
    }
}