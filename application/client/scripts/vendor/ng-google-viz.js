/* global google:false */
/**
 * Based on ng-google-chart by Nicolas Bouillon <nicolas@bouil.org>
 */
(function (document, window) {
  'use strict';

  angular.module('googleviz', ['googlechart'])
    //override the constant in googlechart
    // to also include 'treemap'
    .constant('googleChartApiConfig', {
      version: '1',
      optionalSettings: {
        packages: ['corechart', 'treemap']
      }
    })
    .directive('googleTreeMap', ['$timeout', '$window', '$rootScope', 'googleChartApiPromise',
      function ($timeout, $window, $rootScope, googleChartApiPromise) {
        return {
          restrict: 'A',
          scope: {
            treeMapConfig: '=',
            onReady: '&',
            select: '&'
          },
          link: function ($scope, $elm, $attr) {
            var dataTable;

            // Watches, to refresh the treeMap when its data, title or dimensions change
            $scope.$watch('treeMapConfig', function () {
              drawAsync();
            }, true); // true is for deep object equality checking

            // Redraw the treeMap if the window is resized
            $rootScope.$on('resizeMsg', function (e) {
              $timeout(function () {
                // Not always defined yet in IE so check
                if($scope.treeMap && $scope.treeMapConfig.options) {
                  $scope.treeMap.draw(dataTable, $scope.treeMapConfig.options);
                }
              });
            });

            function draw() {
              if (!draw.triggered && !angular.isUndefined($scope.treeMapConfig)) {
                draw.triggered = true;
                $timeout(function () {
                  draw.triggered = false;

                  if (typeof($scope.formatters) === 'undefined') {
                    $scope.formatters = {};
                  }


                  if ($scope.treeMapConfig.data instanceof google.visualization.DataTable) {
                    dataTable = $scope.treeMapConfig.data;
                  }
                  else if (Array.isArray($scope.treeMapConfig.data)) {
                    dataTable = google.visualization.arrayToDataTable($scope.treeMapConfig.data);
                  }
                  else {
                    dataTable = new google.visualization.DataTable($scope.treeMapConfig.data, 0.5);
                  }

                  // if (typeof($scope.treeMapConfig.formatters) != 'undefined') {
                  //   applyFormat("number", google.visualization.NumberFormat, dataTable);
                  //   applyFormat("arrow", google.visualization.ArrowFormat, dataTable);
                  //   applyFormat("date", google.visualization.DateFormat, dataTable);
                  //   applyFormat("bar", google.visualization.BarFormat, dataTable);
                  //   applyFormat("color", google.visualization.ColorFormat, dataTable);
                  // }

                  if (!$scope.treeMap) {
                    $scope.treeMap = new google.visualization.TreeMap($elm[0]);
                    google.visualization.events.addListener($scope.treeMap, 'ready', function () {
                      $scope.treeMapConfig.displayed = true;
                      $scope.$apply(function (scope) {
                        scope.onReady({treeMap: scope.treeMap});
                      });
                    });
                    google.visualization.events.addListener($scope.treeMap, 'error', function (err) {
                      console.log("Chart not displayed due to error: " + err.message);
                    });
                    google.visualization.events.addListener($scope.treeMap, 'select', function () {
                      var selectedItem = $scope.treeMap.getSelection()[0];
                      if (selectedItem) {
                        $scope.$apply(function () {
                          $scope.select({selectedItem: selectedItem});
                        });
                      }
                    });
                  }


                  $timeout(function () {
                    $scope.treeMap.draw(dataTable, $scope.treeMapConfig.options);
                  });
                }, 0, true);
              }
            }

            function drawAsync() {
              googleChartApiPromise.then(function () {
                draw();
              });
            }
          } //end link
        }; //end return object
      } //end directive function
    ]);
})(document, window);
