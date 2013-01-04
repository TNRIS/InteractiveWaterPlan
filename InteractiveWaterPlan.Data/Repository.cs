
namespace InteractiveWaterPlan.Data
{
    using NHibernate;

    /// <summary>
    /// Abstract class for NHibernate-based repositories
    /// </summary>
    public abstract class AbstractHibernateRepository
    {
        protected ISession Session;

        #region Constructor

        public AbstractHibernateRepository() { }

        public AbstractHibernateRepository(ISession session)
        {
            this.Session = session;
        }

        public AbstractHibernateRepository(string sessionName) : this(NHibernateSessionManager.GetCurrentSession(sessionName)) { }

        ~AbstractHibernateRepository()
        {

        }

        #endregion

    }
}
