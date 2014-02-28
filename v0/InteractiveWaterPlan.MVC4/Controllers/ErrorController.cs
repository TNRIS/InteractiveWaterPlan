using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class ErrorController : Controller
    {
        
        public ViewResult Index()
        {
            return View("Error");
        }

        public ViewResult NotFound()
        {
            //Response.StatusCode = 404;
            return View("NotFound");
        }

    }
}
