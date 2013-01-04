using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using NHibernate;
using NHibernate.Context;
using NHibernate.Cfg;

namespace InteractiveWaterPlan.Data
{
    public class HibernateConnection
    {
        public string Name { get; set; }
        public string ConnectionString { get; set; }
        
        public HibernateConnection(string name, string connectionString)
        {
            this.Name = name;
            this.ConnectionString = connectionString;
        }
    }

    public static class NHibernateSessionManager
    {
        private static readonly object _factorySyncRoot = new object();
        //private static ISessionFactory _sessionFactory;
        //public static string HibernateCfgPath;
        public static IDictionary<string, ISessionFactory> SessionFactoryDictionary;
        
        public static IDictionary<string, ISessionFactory> ConfigureFromFiles(HibernateConnection[] hibernateConnections)
        {
            SessionFactoryDictionary = new Dictionary<string, ISessionFactory>();

            foreach (var connection in hibernateConnections)
            {
                ConfigureSession(connection);
            }

            return SessionFactoryDictionary;
        }

        private static ISessionFactory ConfigureSession(HibernateConnection hibernateConnection)
        {
            if (hibernateConnection == null)
                throw new ArgumentNullException("hibernateConnection");

            if (SessionFactoryDictionary != null 
                && SessionFactoryDictionary.ContainsKey(hibernateConnection.Name))
            {
                SessionFactoryDictionary[hibernateConnection.Name].Dispose();
            }

            lock (_factorySyncRoot)
                if (!SessionFactoryDictionary.ContainsKey(hibernateConnection.Name))
                {
                    
                    var cfg = new Configuration();

                    cfg.Configure(hibernateConnection.ConnectionString);
                    cfg.AddAssembly(typeof(IRepository).Assembly);
                    //var export = new SchemaExport(cfg);
                    //export.Execute(false, true, false);
                    
                    SessionFactoryDictionary[hibernateConnection.Name] = cfg.BuildSessionFactory();
                }

            return SessionFactoryDictionary[hibernateConnection.Name];
        }

        public static ISessionFactory GetSessionFactory(string name)
        {
            return SessionFactoryDictionary[name];
        }

        public static IStatelessSession OpenStatelessSession(string name)
        {
            return GetSessionFactory(name).OpenStatelessSession();
        }

        public static ISession OpenSession(string name)
        {
            if (!SessionFactoryDictionary.ContainsKey(name))
                throw new Exception(String.Format("Session identified by \"{0}\" does not exist", name));
            
            return GetSessionFactory(name).OpenSession();
        }

        public static ISession OpenSessionTransaction(string name)
        {
            var session = GetSessionFactory(name).OpenSession();
            session.BeginTransaction();
            return session;
        }

        public static ISession GetCurrentSession(string name)
        {
            if (!CurrentSessionContext.HasBind(SessionFactoryDictionary[name]))
            {
                return BindSession(name);
            }
            else
            {
                return GetSessionFactory(name).GetCurrentSession();
            }
        }

        public static ISession BindSession(string name)
        {
            var session = OpenSession(name);
            CurrentSessionContext.Bind(session);
            return session;
        }

        public static ITransaction BeginTransaction(string name)
        {
            return GetCurrentSession(name).BeginTransaction();
        }

        public static ITransaction GetCurrentTransaction(string name)
        {
            return GetCurrentSession(name).Transaction;
        }

        public static void UnbindSession(string name, bool forceTransactionRollback)
        {
            var session = CurrentSessionContext.Unbind(SessionFactoryDictionary[name]);
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

        public static void UnbindSession(string name)
        {
            UnbindSession(name, false);
        }
    }
}
