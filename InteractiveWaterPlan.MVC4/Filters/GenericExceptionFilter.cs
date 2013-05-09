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
            //TODO: replace with generic exception mesage
            string message = context.Exception.Message;

            // If it is an argument exception, let the user know
            if (context.Exception is ArgumentException){
                message = context.Exception.Message;
            }

            context.Response = context.Request.CreateErrorResponse(
                HttpStatusCode.BadRequest, message);

            // Lastly, have Elmah log the exception
            Elmah.ErrorSignal.FromCurrentContext().Raise(context.Exception);

            base.OnException(context);
        }
    }
}