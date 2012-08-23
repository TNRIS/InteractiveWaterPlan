using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;

namespace InteractiveWaterPlan.Repositories
{
    public abstract class AbstractRepository
    {
        protected SqlConnection _connection;

        public AbstractRepository()
        {
            _connection = new SqlConnection(ConfigurationManager.ConnectionStrings["WaterPlanDB"].ConnectionString);
        }
    }
}