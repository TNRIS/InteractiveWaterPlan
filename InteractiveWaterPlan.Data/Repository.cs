
namespace InteractiveWaterPlan.Data
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Linq.Expressions;
    using log4net;
    using NHibernate;
    using NHibernate.Linq;


    /// <summary>
    /// Abstract class for NHibernate-based repositories
    /// </summary>
    /// <typeparam name="TKey">Key Type</typeparam>
    /// <typeparam name="TEntity">Entity Type</typeparam>
    public abstract class Repository<TKey, TEntity> : IRepository<TKey, TEntity>
    {
        protected ISession Session;

        #region Properties
        private static log4net.ILog _logger;
        protected static log4net.ILog Logger
        {
            get { return _logger; }
            set { _logger = value; }
        }
        #endregion

        #region Constructor
        public Repository(ISession session, Type logType)
        {
            this.Session = session;
            _logger = log4net.LogManager.GetLogger(logType);
        }

        public Repository(ISession session) : this(session, typeof(Repository<int, string>)) { }

        public Repository(string sessionName, Type logType) : this(NHibernateSessionManager.GetCurrentSession(sessionName), typeof(Repository<int, string>)) { }

        public Repository(string sessionName) : this(NHibernateSessionManager.GetCurrentSession(sessionName), typeof(Repository<int, string>)) { }

        ~Repository()
        {

        }
        #endregion

        #region Transaction
        protected virtual bool EnsureTransaction()
        {
            if (Session.Transaction == null || Session.Transaction.IsActive == false)
            {
                Session.BeginTransaction();
                return true;
            }

            return false;
        }
        protected virtual void RollbackTransaction()
        {
            var tr = Session.Transaction;
            if (tr != null && tr.IsActive && Session.IsConnected)
                try { tr.Rollback(); }
                catch { }
        }
        #endregion

        public virtual void Flush()
        {
            Session.Flush();
        }

        public virtual void Commit()
        {
            ITransaction transaction = Session.Transaction;
            if (transaction != null)
            {
                if (transaction.IsActive && transaction.WasCommitted == false)
                {
                    Session.Flush();
                    transaction.Commit();
                }
            }
            else
                Session.Flush();
        }

        #region Save & Update & Delete
        public virtual void Save(TEntity entity)
        {
            try
            {
                EnsureTransaction();
                Session.Save(entity);
            }
            catch
            {
                RollbackTransaction();
                throw;
            }
        }

        public virtual void Update(TEntity entity)
        {
            try
            {
                EnsureTransaction();
                Session.Update(entity);
            }
            catch
            {
                RollbackTransaction();
                throw;
            }
        }

        public virtual void SaveOrUpdate(TEntity entity)
        {
            try
            {
                EnsureTransaction();
                Session.SaveOrUpdate(entity);
            }
            catch
            {
                RollbackTransaction();
                throw;
            }
        }

        public virtual void Delete(TKey key)
        {
            try
            {
                EnsureTransaction();
                var entity = Session.Load<TEntity>(key);
                Session.Delete(entity);
            }
            catch
            {
                RollbackTransaction();
                throw;
            }
        }
        #endregion

        #region Select
        /// <summary>
        /// Executes a select command and returns null if a row is not found matching the provided Id
        /// </summary>
        /// <param name="key">entity ID</param>
        /// <returns>TEntity or null</returns>
        public virtual TEntity GetById(TKey key)
        {
            return Session.Get<TEntity>(key);
        }

        /// <summary>
        /// Returns an object proxy which will trigger a select command when accessing properties.
        /// Throws an exception if a row is not found matching the provided Id
        /// </summary>
        /// <param name="key">entity ID</param>
        /// <returns>Always returns a non-null proxy</returns>
        public virtual TEntity LoadById(TKey key)
        {
            return Session.Load<TEntity>(key);
        }

        /// <summary>
        /// Returns an IQuerable which can be used for LINQ queries (deferred)
        /// </summary>
        /// <returns></returns>
        public virtual IQueryable<TEntity> QueryAll()
        {
            return Session.Query<TEntity>();
        }

        /// <summary>
        /// Returns an IQuerable filted by a predicate which can be used for LINQ queries (deffered)
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public virtual IQueryable<TEntity> QueryAll(Expression<Func<TEntity, bool>> predicate)
        {
            return this.QueryAll().Where(predicate);
        }

        /// <summary>
        /// Returns exactly one entity querying by a custom provided predicate. 
        /// If multiple rows are returned an exception is thrown, if a row is not found the method returns null
        /// </summary>
        /// <param name="predicate"></param>
        /// <returns></returns>
        public virtual TEntity FindOne(Expression<Func<TEntity, bool>> predicate)
        {
            return this.QueryAll(predicate).SingleOrDefault();
        }

        public virtual IQueryable<TEntity> QueryAllCacheable()
        {
            return Session.Query<TEntity>().Cacheable();
        }
        #endregion
    }
}
