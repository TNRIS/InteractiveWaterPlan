using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InteractiveWaterPlan.Core
{
    public static class CommonConstants
    {
        public static string[] VALID_YEARS = { "2010", "2020", "2030", "2040", "2050", "2060" };
        public static char[] VALID_REGION_LETTERS = {'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
                                                    'J', 'K', 'L', 'M', 'N', 'O', 'P'};

        public const string SWP_SESSION_NAME = "SWP_Session";
        public const string PLACES_SESSION_NAME = "Places_Session";

        public const string WWP_ENTITY_TYPE = "WWP";
    }
}