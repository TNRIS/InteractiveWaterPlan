namespace InteractiveWaterPlan.Data.Utils
{
    using System.Data.SqlTypes;
    using Microsoft.SqlServer.Types;

    
    public static class DataUtils
    {

        /// <summary>
        /// Removes points and lines from originalGeography and returns a MultiPolygon SqlGeography.
        /// </summary>
        /// <param name="originalGeography"></param>
        /// <returns></returns>
        public static SqlGeography CleanUpPolygonGeography(SqlGeography originalGeography)
        {
            //only need to do this if it is a MultiPolygon or GeometryCollection
            var type = originalGeography.STGeometryType().Value;
            if (!type.Equals("MultiPolygon") && !type.Equals("GeometryCollection"))
                return originalGeography;

            //else
            var cleanedGeog = SqlGeography.STGeomFromText(
                    new SqlChars(new SqlString("POINT EMPTY")), (int)originalGeography.STSrid);

            //STGeometryN is 1-based not 0-based index
            for (int i = 1; i <= originalGeography.STNumGeometries(); i++)
            {
                if (originalGeography.STGeometryN(i).STDimension() == 2) //only include polygons
                {
                    cleanedGeog = cleanedGeog.STUnion(originalGeography.STGeometryN(i));
                }
            }

            return cleanedGeog;
        }
    }
}
