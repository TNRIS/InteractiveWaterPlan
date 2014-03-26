'use strict';

//override pagination template from smartTable
// to place the "pagination" class on the <ul> element
angular.module("partials/pagination.html", [])
  .run(function ($templateCache) {
    $templateCache.put("partials/pagination.html",
      "<div class=\"pagination-container\">\n" +
      "  <ul class=\"pagination\">\n" +
      "    <li ng-repeat=\"page in pages\" ng-class=\"{active: page.active, disabled: page.disabled}\"><a\n" +
      "        ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
      "  </ul>\n" +
      "</div> ");
  });

//override deafaultHeader tempalte from smartTable
// to use font-awesome icons to show sort order
angular.module("partials/defaultHeader.html", [])
  .run(function ($templateCache) {
    $templateCache.put("partials/defaultHeader.html",
      "<span class=\"header-content\">" +
      "  <i class=\"fa\" ng-class=\"{'fa-caret-up':column.reverse==true,'fa-caret-down':column.reverse==false}\"></i> "+
      "  {{column.label}}" +
      "</span>");
  });


//use bootstrap table classes and move global-search to outisde of <table> element
angular.module("partials/smartTable.html", [])
  .run(function ($templateCache) {
    $templateCache.put("partials/smartTable.html",
      "<div>\n" +
      "<div class=\"smart-table-global-search pull-right\"></div>\n" +
      "<table class=\"smart-table table table-striped table-condensed table-bordered\">\n" +
      "    <thead>\n" +
      "    <tr class=\"smart-table-header-row\">\n" +
      "        <th ng-repeat=\"column in columns\" ng-include=\"column.headerTemplateUrl\"\n" +
      "            class=\"smart-table-header-cell {{column.headerClass}}\" scope=\"col\">\n" +
      "        </th>\n" +
      "    </tr>\n" +
      "    </thead>\n" +
      "    <tbody>\n" +
      "    <tr ng-repeat=\"dataRow in displayedCollection\" ng-class=\"{selected:dataRow.isSelected}\"\n" +
      "        class=\"smart-table-data-row\">\n" +
      "        <td ng-repeat=\"column in columns\" class=\"smart-table-data-cell {{column.cellClass}}\"></td>\n" +
      "    </tr>\n" +
      "    </tbody>\n" +
      "    <tfoot ng-show=\"isPaginationEnabled\">\n" +
      "    <tr class=\"smart-table-footer-row\">\n" +
      "        <td colspan=\"{{columns.length}}\">\n" +
      "            <div pagination-smart-table=\"\" num-pages=\"numberOfPages\" max-size=\"maxSize\" current-page=\"currentPage\"></div>\n" +
      "        </td>\n" +
      "    </tr>\n" +
      "    </tfoot>\n" +
      "</table>\n" +
      "</div>\n" +
      "\n" +
      "");
  });

//Fix label text
angular.module("partials/globalSearchCell.html", [])
  .run(function ($templateCache) {
    $templateCache.put("partials/globalSearchCell.html",
        "<label>Search:</label>\n" +
        "<input type=\"text\" ng-model=\"searchValue\"/>");
  });
