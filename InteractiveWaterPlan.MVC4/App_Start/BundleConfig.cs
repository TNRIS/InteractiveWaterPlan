using System.Web.Optimization;

namespace InteractiveWaterPlan.MVC4
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/js/modernizr.js").Include(
                "~/Scripts/vendor/modernizr/modernizr-{version}.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/js/bootstrap.js").Include(
                "~/Scripts/vendor/jquery/jquery-{version}.js",
                "~/Content/bootstrap/js/bootstrap.js"
            ));

            //Note: Openlayers has to be included separately because of how it loads its css
            bundles.Add(new ScriptBundle("~/bundles/js/lib.js").Include(
                "~/Scripts/vendor/jquery/jquery-{version}.js",
                "~/Scripts/vendor/jquery/jquery.number.js",
                "~/Scripts/vendor/OpenLayers/tile.stamen.js",
                "~/Scripts/Compiled/OpenLayers/*.js",
                "~/Scripts/vendor/OpenLayers/OpenLayers.Format.TopoJSON.js",
                "~/Scripts/vendor/jquery/jquery.dataTables.js",
                "~/Scripts/vendor/jquery/DT_bootstrap.js",
                "~/Scripts/vendor/jquery/chosen.jquery.js",
                "~/Scripts/vendor/jquery/ajax-chosen.jquery.js",
                "~/Content/bootstrap/js/bootstrap.js",
                "~/Scripts/tnris.place_typeahead.js",
                "~/Scripts/vendor/backbone/underscore.js",
                "~/Scripts/vendor/backbone/backbone.js",
                "~/Scripts/vendor/backbone/backbone.routefilter.js",
                "~/Scripts/vendor/knockout/knockout-{version}.js",
                "~/Scripts/vendor/knockout/knockback.js",
                "~/Scripts/require.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/js/iswp-app.js").Include(
                "~/Scripts/iswp-app.js"
            ));

            bundles.Add(new StyleBundle("~/bundles/css/cosmo.css").Include(
                "~/Content/bootstrap/css/cosmo.bootstrap.css"
            ));

        }
    }
}