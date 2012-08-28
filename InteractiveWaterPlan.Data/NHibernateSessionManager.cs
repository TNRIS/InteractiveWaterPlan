using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using NHibernate;
using NHibernate.Context;
using NHibernate.Cfg;

namespace InteractiveWaterPlan.Data
{
    public static class NHibernateSessionManager
    {
        private static readonly object _factorySyncRoot = new object();
        private static ISessionFactory _sessionFactory;
        public static string HibernateCfgPath;

        public static ISessionFactory ConfigureFromFile(string hibernateCfgPath)
        {
            if (hibernateCfgPath == null)
                throw new ArgumentNullException("hibernateCfgPath");

            if (_sessionFactory != null)
            {
                _sessionFactory.Dispose();
            }

            lock (_factorySyncRoot)
                if (_sessionFactory == null)
                {
                    HibernateCfgPath = hibernateCfgPath;

                    var cfg = new Configuration();
                    
                    cfg.Configure(hibernateCfgPath);
                    cfg.AddAssembly(typeof(IRepository).Assembly);
                    //var export = new SchemaExport(cfg);
                    //export.Execute(false, true, false);
                    
                    _sessionFactory = cfg.BuildSessionFactory();
                }

            return _sessionFactory;
        }

        public static ISessionFactory GetSessionFactory()
        {
            if (_sessionFactory == null)
                lock (_factorySyncRoot)
                    if (_sessionFactory == null)
                    {
                        var cfg = new Configuration();
                        if (!string.IsNullOrWhiteSpace(HibernateCfgPath))
                        {
                            cfg.Configure(HibernateCfgPath);
                        }
                        cfg.AddAssembly("GEMSS2.DataAccess");
                        
                        _sessionFactory = cfg.BuildSessionFactory();
                    }
            return _sessionFactory;
        }

        public static IStatelessSession OpenStatelessSession()
        {
            return GetSessionFactory().OpenStatelessSession();
        }

        public static ISession OpenSession()
        {
            return GetSessionFactory().OpenSession();
        }

        public static ISession OpenSessionTransaction()
        {
            var session = GetSessionFactory().OpenSession();
            session.BeginTransaction();
            return session;
        }

        public static ISession GetCurrentSession()
        {
            if (!CurrentSessionContext.HasBind(_sessionFactory))
            {
                return BindSession();
            }
            else
            {
                return GetSessionFactory().GetCurrentSession();
            }
        }

        public static ISession BindSession()
        {
            var session = OpenSession();
            CurrentSessionContext.Bind(session);
            return session;
        }

        public static ITransaction BeginTransaction()
        {
            return GetCurrentSession().BeginTransaction();
        }

        public static ITransaction GetCurrentTransaction()
        {
            return GetCurrentSession().Transaction;
        }

        public static void UnbindSession(bool forceTransactionRollback)
        {
            var session = CurrentSessionContext.Unbind(_sessionFactory);
            if (session != null)
            {
                var tx = session.Transaction;
                try
                {
                    if (tx != null)
                    {

                        if (tx.WasRolledBack)
                            return;

                        if (forceTransactionRollback)
                        {
                            tx.Rollback();
                            return;
                        }

                        if (tx.IsActive && tx.WasCommitted == false)
                        {
                            session.Flush();
                            tx.Commit();
                        }

                    }
                    else
                    {
                        session.Flush();
                    }
                }
                catch
                {
                    if (tx != null)
                        tx.Rollback();
                    throw;
                }
                finally
                {
                    session.Dispose();
                }
            }
        }

        public static void UnbindSession()
        {
            UnbindSession(false);
        }
    }
}
