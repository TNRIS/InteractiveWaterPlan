
namespace InteractiveWaterPlan.Data
{
    using System;
    using System.Linq;
    using System.Linq.Expressions;
    using NHibernate;
    using NHibernate.Linq;

    /// <summary>
    /// Abstract class for NHibernate-based repositories
    /// </summary>
    /// <typeparam name="TKey">Key Type</typeparam>
    /// <typeparam name="TEntity">Entity Type</typeparam>
    public abstract class Repository
    {
        protected ISession Session;

        #region Constructor

        public Repository() { }

        public Repository(ISession session)
        {
            this.Session = session;
        }

        public Repository(string sessionName) : this(NHibernateSessionManager.GetCurrentSession(sessionName)) { }

        ~Repository()
        {

        }

        #endregion

    }
}
