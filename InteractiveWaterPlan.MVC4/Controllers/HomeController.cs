﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InteractiveWaterPlan.MVC4.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return RedirectToAction("Bootstrap");
        }

        public ActionResult Bootstrap()
        {
            return View();
        }

        public ActionResult Old()
        {
            return View("Index");
        }
    }
}
