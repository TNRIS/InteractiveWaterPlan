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

        //usp_SpatialSelect_tbl_GEMSS_Vector_TWDB_DB12_Water_Entities

        //usp_Select_WaterEntityUsage_By_ProposedReservoir_and_Year
        //usp_Select_ALL_tbl_GEMSS_Vector_TWDB_DB12_Recommended_Reservoirs
        //usp_Select_ALL_tbl_GEMSS_Vector_TWDB_DB12_Water_Entities
        
        //usp_Select_tbl_GEMSS_Vector_TWDB_DB12_Recommended_Reservoirs
            //SQLGeography @var_PointGeog
            //SQLGeography @var_BufferPoly
            //returns SQLGeography? and other attributes

        /// <summary>
        /// Lookup table that contains the data for calculating buffered 
        /// geographies around screen pixel click locations.
        /// </summary>
        private static PixelBufferTable _pixelBufferTable;

        /// <summary>
        /// Static constructor called once to instantiate the pixelBufferTable.
        /// The data does not change so we do not need to request it every time a new
        /// EntityRepository is constructed.
        /// </summary>
        static EntityRepository()
        {
            var repo = new PixelBufferRepository();
            _pixelBufferTable = repo.GetPixelBufferTable();
        }

        /// <summary>
        /// Returns a list of all DB12 Entities.
        /// </summary>
        /// <returns></returns>
        public IList<Entity> GetAllEntities()
        {
            try
            {
                using (var cxn = new SqlConnection(
                    ConfigurationManager.ConnectionStrings["WaterPlanDB"].ConnectionString))
                {
                    var cmd = new SqlCommand(
                        "usp_Select_ALL_tbl_GEMSS_Vector_TWDB_DB12_Water_Entities", cxn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cxn.Open();
                    var entityList = new List<Entity>();

                    using (var reader = cmd.ExecuteReader())
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
            }
            catch (Exception ex)
            {
                //TODO: Log the exception
                return null;
            }
        }

        /// <summary>
        /// Returns a list of all DB12 Entities within the given polygon
        /// </summary>
        /// <param name="poly"></param>
        /// <returns></returns>
        public IList<Entity> GetEntitiesInGeography(SqlGeography poly)
        {
            try
            {
                using (var cxn = new SqlConnection(
                    ConfigurationManager.ConnectionStrings["WaterPlanDB"].ConnectionString))
                {
                    var cmd = new SqlCommand("usp_SpatialSelect_tbl_GEMSS_Vector_TWDB_DB12_Water_Entities",
                        cxn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@var_SelectPoly", poly));
                    
                    cxn.Open();
                    var entityList = new List<Entity>();

                    using (var reader = cmd.ExecuteReader())
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
            }
            catch (Exception ex)
            {
                //TODO: log the exception
                return null;
            }
        }


        public Reservoir GetReservoirByBufferedClickPoint(double lat, double lon, int zoomLevel)
        {

            
            try
            {
                using (var cxn = new SqlConnection(
                    ConfigurationManager.ConnectionStrings["WaterPlanDB"].ConnectionString))
                {

                    var cmd = new SqlCommand("usp_Select_tbl_GEMSS_Vector_TWDB_DB12_Recommended_Reservoirs",
                        cxn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cxn.Open();

                    var pointGB = new SqlGeographyBuilder();
                    pointGB.SetSrid(4326);
                    pointGB.BeginGeography(OpenGisGeographyType.Point);
                    pointGB.BeginFigure(lat, lon);
                    pointGB.EndFigure();
                    pointGB.EndGeography();

                    var clickedGeogPoint = pointGB.ConstructedGeography;

                    var bufferGeogPoly = clickedGeogPoint.STBuffer(
                        _pixelBufferTable.GetBufferRadius(zoomLevel));

                    var p1 = cmd.Parameters.Add(new SqlParameter("@var_PointGeog", clickedGeogPoint));
                    p1.UdtTypeName = "Geography";

                    var p2 = cmd.Parameters.Add(new SqlParameter("@var_BufferPoly", bufferGeogPoly));
                    p2.UdtTypeName = "Geography";

                    var p3 = cmd.Parameters.Add(new SqlParameter("@var_ReturnValue",SqlDbType.Int));
                    p3.Direction = ParameterDirection.Output;

                    using (var reader = cmd.ExecuteReader())
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

                            return reservoir;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                //TODO: log the exception
                return null;
            }

            return null;
            
        }

        /// <summary>
        /// Returns a list of all proposed Reservoirs.
        /// </summary>
        /// <returns></returns>
        public IList<Reservoir> GetAllProposedReservoirs()
        {
          
            try
            {
                using (var cxn = new SqlConnection(
                    ConfigurationManager.ConnectionStrings["WaterPlanDB"].ConnectionString))
                {

                    var cmd = new SqlCommand("usp_Select_ALL_tbl_GEMSS_Vector_TWDB_DB12_Recommended_Reservoirs",
                        cxn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cxn.Open();
                    var reservoirList = new List<Reservoir>();

                    using (var reader = cmd.ExecuteReader())
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
            }
            catch (Exception ex)
            {
                //TODO: Log the exception
                return null;
            }
        }

        //TODO: Make Entity and WaterUseEntity the same.  Will need the stored proc to be updated to 
        // return the same fields/info.
        public IList<WaterUseEntity> GetEntitiesServedByReservoir(int proposedReservoirId, int year)
        {
            if (year == 2012)
                year = 2010;

            try 
	        {
                using (var cxn = new SqlConnection(
                    ConfigurationManager.ConnectionStrings["WaterPlanDB"].ConnectionString))
                {
                    var cmd = new SqlCommand("usp_Select_WaterEntityUsage_By_ProposedReservoir_and_Year",
                        cxn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@var_DB12_ID", proposedReservoirId));
                    cmd.Parameters.Add(new SqlParameter("@var_EstYear", year));

                    cxn.Open();
                    var entityList = new List<WaterUseEntity>();
                    using (var reader = cmd.ExecuteReader())
                    {
                        foreach (IDataRecord record in reader)
                        {
                            var entity = new WaterUseEntity()
                            {
                                SqlId = Convert.ToInt32(record["SQL_ID"]),
                                Id = Convert.ToInt32(record["Entity_ID"]),
                                Name = record["Entity_Name"].ToString(),
                                Type = record["Entity_Type"].ToString(),
                                RWP = record["Entity_RWP"].ToString(),
                                County = record["Entity_County"].ToString(),
                                Basin = record["Entity_Basin"].ToString(),
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
	        }
	        catch (Exception ex)
	        {
		        //TODO: Log the exception
                return null;
	        }
        }
    }
}
