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
            string message = "Sorry, an error has occurred.";
            if (context.Exception is ArgumentException){
                message = context.Exception.Message;
            }

            context.Response = context.Request.CreateErrorResponse(
                HttpStatusCode.BadRequest, message);

            base.OnException(context);
        }

  
    }
}