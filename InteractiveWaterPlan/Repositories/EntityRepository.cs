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
    public class EntityRepository : AbstractRepository
    {
 
        //usp_Select_WaterEntityUsage_By_ProposedReservoir_and_Year
        //usp_Select_ALL_tbl_GEMSS_Vector_TWDB_DB12_Recommended_Reservoirs
        //usp_Select_ALL_tbl_GEMSS_Vector_TWDB_DB12_Water_Entities

        public IList<Entity> GetAllEntities()
        {
            var cmd = new SqlCommand("usp_Select_ALL_tbl_GEMSS_Vector_TWDB_DB12_Water_Entities", 
                this._connection);
            cmd.CommandType = CommandType.StoredProcedure;

            

            try
            {
                this._connection.Open();
                var entityList = new List<Entity>();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    foreach (IDataRecord record in reader)
                    {
                        var entity = new Entity()
                        {
                            SqlId = Convert.ToInt32(record["SQL_ID"]),
                            Id = Convert.ToInt32(record["Entity_ID"]),
                            Name = record["Entity_Name"].ToString(),
                            Type = record["Entity_Type"].ToString(),
                            RWP = record["Entity_RWP"].ToString(),
                            County = record["Entity_County"].ToString(),
                            Basin = record["Entity_Basin"].ToString(),
                            WKTGeog = new string(((SqlGeography)record["SQL_GEOG"]).STAsText().Value),

                        };

                        entityList.Add(entity);
                    }

                    return entityList;
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
            }
            
        }

        public IList<Reservoir> GetAllProposedReservoirs()
        {
            var cmd = new SqlCommand("usp_Select_ALL_tbl_GEMSS_Vector_TWDB_DB12_Recommended_Reservoirs",
                this._connection);
            cmd.CommandType = CommandType.StoredProcedure;

           

            try
            {
                this._connection.Open();
                var reservoirList = new List<Reservoir>();

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    foreach (IDataRecord record in reader)
                    {
                        var reservoir = new Reservoir()
                        {
                            SqlId = Convert.ToInt32(record["SQL_ID"]),
                            Id = Convert.ToInt32(record["DB12_Id"]),
                            Name = record["Reservoir_Name"].ToString(),
                            RecommendationCode = Convert.ToInt32(record["Recommendation_Code"]),
                            WKTGeog = new string(((SqlGeography)record["SQL_GEOG"]).STAsText().Value),

                        };

                        reservoirList.Add(reservoir);
                    }

                    return reservoirList;
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
            }
        }

        public IList<WaterUseEntity> GetEntitiesServedByReservoir(int proposedReservoirId, int year)
        {
            if (year == 2012)
                year = 2010;

            var cmd = new SqlCommand("usp_Select_WaterEntityUsage_By_ProposedReservoir_and_Year", 
                this._connection);
            cmd.CommandType = CommandType.StoredProcedure;
            
            cmd.Parameters.Add(new SqlParameter("@var_DB12_ID", proposedReservoirId));
            cmd.Parameters.Add(new SqlParameter("@var_EstYear", year));

            try 
	        {
                this._connection.Open();
                var entityList = new List<WaterUseEntity>();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    foreach (IDataRecord record in reader)
                    {
                        var entity = new WaterUseEntity()
                        {
                            Name = record["Entity_Name"].ToString(),
                            Id = Convert.ToInt32(record["SQL_ID"]),
                            WKTGeog = new string(((SqlGeography)record["SQL_GEOG"]).STAsText().Value),
                            IsRedundantSupply = "Y".Equals(record["Redundant_Water"].ToString()),
                            SourceName = record["Source_Name"].ToString(),
                            SourceId = Convert.ToInt32(record["Source_ID"])
                        };

                        entity.SSUsage.Add(year.ToString(), record["SS" + year.ToString()].ToString());
                        entityList.Add(entity);
                    }

                    return entityList;
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
            }
        }
    }
}
