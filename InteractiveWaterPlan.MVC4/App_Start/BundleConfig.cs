using System.Web.Optimization;

namespace InteractiveWaterPlan.MVC4
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            //Openlayers has to be included separately because of how it loads its css
            
            bundles.Add(new ScriptBundle("~/bundles/js/scripts").Include(
                "~/Content/OpenLayers/tile.stamen.js",
                "~/Scripts/Compiled/OpenLayers/OpenLayers.Layer.QuadKey.js",
                "~/Scripts/Compiled/OpenLayers/OpenLayers.Control.GetFeature.js",
                "~/Content/ExtJS/ext-all.js",
                "~/Scripts/Compiled/app.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/js/modernizr").Include(
                "~/Scripts/modernizr-{version}.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/js/app").Include(
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/jquery.number.js",
                "~/Content/OpenLayers/tile.stamen.js",
                "~/Scripts/Compiled/OpenLayers/OpenLayers.Layer.QuadKey.js",
                "~/Scripts/Compiled/OpenLayers/OpenLayers.Control.GetFeature.js",
                "~/Scripts/stupidtable.js",
                "~/Content/bootstrap/js/bootstrap.js",
                "~/Scripts/underscore.js",
                "~/Scripts/backbone.js",
                "~/Scripts/knockout-{version}.js",
                "~/Scripts/knockback.js"
            ));

            //TODO: Set to true for Release -- any way to set this based on compile flag??
            //automatically uses *.min.js versions of files
            // also overwrites the <system.web><compilation debug="true" />...</system.web> settings
            BundleTable.EnableOptimizations = false;
        }
    }
}