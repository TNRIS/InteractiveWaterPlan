using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using Microsoft.SqlServer.Types;
using System.Configuration;
using NHibernate;

using InteractiveWaterPlan.Core;

namespace InteractiveWaterPlan.Data
{
    public class PixelBufferRepository : Repository<int, PixelBufferRecord>
    {

        public PixelBufferTable GetPixelBufferTable()
        {
            var pixelBufferRecords = Session.GetNamedQuery("GetPixelBufferRecords")
                .List<PixelBufferRecord>();

            PixelBufferTable table = new PixelBufferTable();
            foreach (var buff in pixelBufferRecords)
            {
                table.AddPixelBufferRecord(buff.ZoomLevel, buff);
            }

            return table;
        }
    }
}