using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using Microsoft.SqlServer.Types;

using InteractiveWaterPlan.Models;

namespace InteractiveWaterPlan.Repositories
{
    public class EntityRepository
    {
        SqlConnection _connection; 
        //usp_Select_WaterEntityUsage_By_ProposedReservoir_and_Year
        public EntityRepository()
        {
            _connection = new SqlConnection(ConfigurationManager.ConnectionStrings["WaterPlanDB"].ConnectionString);
        }

        public IList<WaterUseEntity> GetEntityUsage(int proposedReservoirId, int year)
        {
            if (year == 2012)
                year = 2010;

            var cmd = new SqlCommand("usp_Select_WaterEntityUsage_By_ProposedReservoir_and_Year", 
                this._connection);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Connection = this._connection;
           
            cmd.Parameters.Add(new SqlParameter("@var_DB12_ID", proposedReservoirId));
            cmd.Parameters.Add(new SqlParameter("@var_EstYear", year));


            SqlDataReader reader = null;
            var entityList = new List<WaterUseEntity>();
            try 
	        {
                this._connection.Open();
		        reader = cmd.ExecuteReader();
                foreach (IDataRecord record in reader)
                {
                    var entity = new WaterUseEntity()
                    {
                        Name = record["Entity_Name"].ToString(),
                        Id = Convert.ToInt32(record["SQL_ID"]),
                        Geography = new string(((SqlGeography)record["SQL_GEOG"]).STAsText().Value),
                        IsRedundantSupply = "Y".Equals(record["Redundant_Water"].ToString()),
                        SourceName = record["Source_Name"].ToString(),
                        SourceId = Convert.ToInt32(record["Source_ID"])
                    };
                    
                    entity.SSUsage.Add(year.ToString(), record["SS" + year.ToString()].ToString());
                    entityList.Add(entity);
                }
	        }
	        catch (Exception ex)
	        {

		        //TODO: Log the exception
                return null;
	        }
            finally
            {
                this._connection.Close();
                if (reader != null)
                    reader.Close();
            }

            return entityList;
        }
    }
}
