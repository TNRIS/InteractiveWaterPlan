using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;

namespace InteractiveWaterPlan.MVC4.Filters
{
    public class GenericExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            context.Response = context.Request.CreateErrorResponse(
                HttpStatusCode.BadRequest, context.Exception.Message);

            base.OnException(context);
        }

  
    }
}