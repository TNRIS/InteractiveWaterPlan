using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Microsoft.SqlServer.Types;

using InteractiveWaterPlan.Models;
using System.Configuration;


namespace InteractiveWaterPlan.Repositories
{
    public class PixelBufferRepository
    {

        public PixelBufferTable GetPixelBufferTable()
        {
            //usp_Select_ALL_lk_GEMSS_VE_Pixel_Buffer

            try
            {
                using (var cxn = new SqlConnection(
                    ConfigurationManager.ConnectionStrings["WaterPlanDB"].ConnectionString))
                {
                    var cmd = new SqlCommand("usp_Select_ALL_lk_GEMSS_VE_Pixel_Buffer", cxn);
                    cmd.CommandType = CommandType.StoredProcedure;

                    cxn.Open();
                    PixelBufferTable pixelBufferTable = new PixelBufferTable();

                    using (var reader = cmd.ExecuteReader())
                    {
                        foreach (IDataRecord record in reader)
                        {
                            pixelBufferTable.AddPixelBufferPair(
                                Convert.ToInt32(record["VE_Zoom_Level"]),
                                Convert.ToDouble(record["Ground_Rez_M"]),
                                Convert.ToInt32(record["Buffer_Multiplier"])
                            );
                        }

                        return pixelBufferTable;
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