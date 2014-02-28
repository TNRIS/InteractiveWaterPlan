using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;
using System.Net.Http.Headers;

namespace InteractiveWaterPlan.MVC4.Filters
{
    public class CachedResponse : ActionFilterAttribute
    {
        public int Minutes { get; set; }
        
        public override void OnActionExecuted(HttpActionExecutedContext actionExecutedContext)
        {
            if (this.Minutes == 0)
            {
                this.Minutes = 30;
            }

            base.OnActionExecuted(actionExecutedContext);

            CacheControlHeaderValue cacheControl = new CacheControlHeaderValue();
            cacheControl.Public = true;
            cacheControl.MaxAge = TimeSpan.FromMinutes(this.Minutes);
            actionExecutedContext.Response.Headers.CacheControl = cacheControl;
        }
    }
}