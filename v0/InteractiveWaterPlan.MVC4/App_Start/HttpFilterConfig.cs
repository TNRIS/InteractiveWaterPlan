using System.Web.Http.Filters;
using InteractiveWaterPlan.MVC4.Filters;

namespace InteractiveWaterPlan.MVC4
{
    public class HttpFilterConfig
    {
        public static void RegisterGlobalHttpFilters(HttpFilterCollection filters)
        {
            filters.Add(new GenericExceptionFilterAttribute());
            filters.Add(new CachedResponse());
        }
    }
}