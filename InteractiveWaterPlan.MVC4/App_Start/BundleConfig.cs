using System.Web.Optimization;

namespace InteractiveWaterPlan.MVC4
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/js/modernizr.js").Include(
                "~/Scripts/modernizr-{version}.js"
            ));

            //Note: Openlayers has to be included separately because of how it loads its css
            bundles.Add(new ScriptBundle("~/bundles/js/lib.js").Include(
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/jquery.number.js",
                "~/Scripts/OpenLayers/tile.stamen.js",
                "~/Scripts/Compiled/OpenLayers/*.js",
                "~/Scripts/stupidtable.js",
                "~/Scripts/chosen.jquery.js",
                "~/Content/bootstrap/js/bootstrap.js",
                "~/Scripts/tnris.place_typeahead.js",
                "~/Scripts/underscore.js",
                "~/Scripts/backbone.js",
                "~/Scripts/backbone.routefilter.js",
                "~/Scripts/knockout-{version}.js",
                "~/Scripts/knockback.js",
                "~/Scripts/require.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/js/iswp-app.js").Include(
              "~/Scripts/iswp-app.js"
            ));

        }
    }
}