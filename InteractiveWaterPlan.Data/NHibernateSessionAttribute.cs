using System;
using System.Collections.Generic;
using System.Text;
using System.Web.Mvc;
using NHibernate;

namespace InteractiveWaterPlan.Data
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
    public class NHibernateSessionAttribute : ActionFilterAttribute
    {
        public bool RollbackOnModelStateError { get; set; }
        public ISession Session { get; private set; }
        public ITransaction Transaction { get; private set; }

        public NHibernateSessionAttribute()
        {
            this.Order = 10;
            this.RollbackOnModelStateError = false;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // this code also performs a check if the session is already bound, 
            // ... and if not it binds it to the CurrentSessionContext
            NHibernateSessionManager.BindSession();
            this.Session = NHibernateSessionManager.GetCurrentSession();
            this.Transaction = this.Session.BeginTransaction();

            base.OnActionExecuting(filterContext);
        }

        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);

            var forceTransactionRollback = ShouldRollback(filterContext) || UnhandledExeption(filterContext);
            NHibernateSessionManager.UnbindSession(forceTransactionRollback);
        }

        private bool ShouldRollback(ControllerContext context)
        {
            return RollbackOnModelStateError && !context.Controller.ViewData.ModelState.IsValid;
        }

        private bool UnhandledExeption(ActionExecutedContext context)
        {
            return context.Exception != null && context.ExceptionHandled == false;
        }
    }
}
