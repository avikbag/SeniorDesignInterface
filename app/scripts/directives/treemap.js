'use strict';

/**
 * @ngdoc directive
 * @name interfaceApp.directive:treeMap
 * @description
 * # treeMap
 */
angular.module('interfaceApp').directive('treemap', function() {
  var elem;
  elem = angular.element('<div class="angular-treemap"/>');
  return {
    restrict: 'A',
    scope: {
      treemap: '=',
      name: '&',
      detail: '&',
      colorlow: '@',
      colormid: '@',
      colorhigh: '@'
    },
    compile: (function(_this) {
      return function(tElem) {
        return tElem.append(elem);
      };
    })(this),
    controller: (function(_this) {
      return function($scope) {
        $scope.find_color_range = function(d) {
          var c, i, len, ref, results;
          if (d.color < $scope.state.min_color) {
            $scope.state.min_color = d.color;
          }
          if (d.color > $scope.state.max_color) {
            $scope.state.max_color = d.color;
          }
          if (d.children) {
            ref = d.children;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              c = ref[i];
              results.push($scope.find_color_range(c));
            }
            return results;
          }
        };
        $scope.resize = function() {
          $scope.state.width = $($scope.state.parent).width();
          $scope.state.height = $scope.state.width * 0.6;
          $scope.state.host.attr({
            width: $scope.state.width,
            height: $scope.state.height + 20
          });
          $scope.treemap.dx = $scope.state.width;
          $scope.treemap.dy = $scope.state.height;
          $scope.state.x = d3.scale.linear().domain([0, $scope.state.width]).range([0, $scope.state.width]);
          $scope.state.y = d3.scale.linear().domain([0, $scope.state.height]).range([0, $scope.state.height]);
          $scope.layout($scope.treemap);
          $scope.state.svg.selectAll('rect.parent').call((function(_this) {
            return function(r) {
              return $scope.rect(r);
            };
          })(this));
          $scope.state.svg.selectAll('text.js-label').call((function(_this) {
            return function(text) {
              return $scope.text(text);
            };
          })(this));
          return $scope.state.svg.selectAll('rect.child').call((function(_this) {
            return function(r) {
              return $scope.rect(r);
            };
          })(this));
        };
        $scope.accumulate = function(d) {
          if (d.children) {
            return d.value = d.children.reduce((function(_this) {
              return function(p, v) {
                return p + $scope.accumulate(v);
              };
            })(this), 0);
          } else {
            return d.value;
          }
        };
        $scope.layout = function(d) {
          var c, i, len, ref, results;
          if (d.children) {
            $scope.state.treemap.nodes({
              children: d.children
            });
            ref = d.children;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              c = ref[i];
              c.x = d.x + c.x * d.dx;
              c.y = d.y + c.y * d.dy;
              c.dx *= d.dx;
              c.dy *= d.dy;
              c.parent = d;
              results.push($scope.layout(c));
            }
            return results;
          }
        };
        $scope.text = function(text) {
          return text.attr({
            x: function(d) {
              return $scope.state.x(d.x) + 6;
            },
            y: function(d) {
              return $scope.state.y(d.y) + 6;
            }
          });
        };
        $scope.rect = function(rect) {
          return rect.attr({
            fill: function(d) {
              return $scope.state.color(d.color);
            },
            x: function(d) {
              return $scope.state.x(d.x) + 1;
            },
            y: function(d) {
              return $scope.state.y(d.y) + 1;
            },
            width: function(d) {
              var w;
              w = $scope.state.x(d.x + d.dx) - $scope.state.x(d.x) - 2;
              if (w >= 0) {
                return w;
              } else {
                return 0;
              }
            },
            height: function(d) {
              var h;
              h = $scope.state.y(d.y + d.dy) - $scope.state.y(d.y) - 2;
              if (h >= 0) {
                return h;
              } else {
                return 0;
              }
            }
          });
        };
        $scope.transition = function(d, g1) {
          var g2, t1, t2;
          if ($scope.state.transitioning || !d) {
            return;
          }
          $scope.state.transitioning = true;
          g2 = $scope.display(d);
          t1 = g1.transition().duration(750);
          t2 = g2.transition().duration(750);
          $scope.state.x.domain([d.x, d.x + d.dx]);
          $scope.state.y.domain([d.y, d.y + d.dy]);
          $scope.state.svg.style('shape-rendering', null);
          $scope.state.svg.selectAll('.depth').sort(function(a, b) {
            return a.depth - b.depth;
          });
          g2.selectAll('text').style('fill-opacity', 0);
          t1.selectAll('text').call(function(text) {
            return $scope.text(text).style('fill-opacity', 0);
          });
          t2.selectAll('text').call(function(text) {
            return $scope.text(text).style('fill-opacity', 1);
          });
          t1.selectAll('rect').call(function(r) {
            return $scope.rect(r);
          });
          t2.selectAll('rect').call(function(r) {
            return $scope.rect(r);
          });
          return t1.remove().each('end', function() {
            $scope.state.svg.style('shape-rendering', 'crispEdges');
            return $scope.state.transitioning = false;
          });
        };
        $scope.display = function(d) {
          var g, g1;
          g1 = $scope.state.svg.insert('g', '.grandparent').datum(d).attr('class', 'depth');
          $scope.state.grandparent.datum(d.parent).on('click', function(d) {
            return $scope.transition(d, g1);
          }).select('text').text($scope.formatName(d));
          g = g1.selectAll('g').data(d.children).enter().append('g');
          g.filter(function(d) {
            return d.children;
          }).classed('children', true).on('click', function(d) {
            return $scope.transition(d, g1);
          });
          g.filter(function(d) {
            return !d.children;
          }).classed('children', true).on('click', function(d) {
            $scope.curNode = d;
            return $scope.$apply("detail({node:curNode})");
          });
          g.selectAll('.child').data(function(d) {
            return d.children || [d];
          }).enter().append('rect').attr('class', 'child').call(function(r) {
            return $scope.rect(r);
          });
          g.append('rect').attr('class', 'parent').style({
            'fill-opacity': 0.1,
            'stroke': 'black',
            'stroke-width': '1',
            'stroke-opacity': '0.8'
          }).call(function(r) {
            return $scope.rect(r);
          }).append('title').text(function(d) {
            return $scope.state.formatNumber(d.value);
          });
          g.append('text').attr('class', 'js-label').attr('dy', '.75em').text(function(d) {
            $scope.curName = d.name;
            if ($scope.name) {
              return $scope.$eval("name({name:curName})");
            } else {
              return d.name;
            }
          }).call(function(text) {
            return $scope.text(text);
          });
          return g;
        };
        $scope.formatName = function(d) {
          if (d.parent) {
            return $scope.formatName(d.parent) + '.' + d.name;
          } else {
            return d.name;
          }
        };
        $scope.state = {
          margin: {
            left: 0,
            top: 20
          },
          parent: elem
        };
        $scope.state.width = $(elem).width();
        $scope.state.height = $scope.state.width * 0.6;
        $scope.state.ratio = $scope.state.height / $scope.state.width * 0.5 * (1 + Math.sqrt(5));
        return $scope.$watch('treemap', function(oldValue, newValue) {
          var domain_range;
          if (oldValue === newValue) {
            return;
          }
          if (!newValue) {
            return;
          }
          $($scope.state.parent).empty();
          $scope.state.min_color = 10000;
          $scope.state.max_color = -10000;
          $scope.find_color_range($scope.treemap);
          domain_range = [$scope.state.min_color, $scope.state.min_color + (($scope.state.max_color - $scope.state.min_color) / 2), $scope.state.max_color];
          if ($scope.colorlow == null) {
            $scope.colorlow = 'red';
          }
          if ($scope.colormid == null) {
            $scope.colormid = 'white';
          }
          if ($scope.colorhigh == null) {
            $scope.colorhigh = 'green';
          }
          $scope.state.color = d3.scale.linear().domain(domain_range).range([$scope.colorlow, $scope.colormid, $scope.colorhigh]);
          $scope.state.treemap = d3.layout.treemap().children(function(d, depth) {
            if (depth) {
              return null;
            } else {
              return d.children;
            }
          }).sort(function(a, b) {
            return a.value - b.value;
          }).ratio($scope.state.ratio).round(false).sticky(false);
          $scope.state.host = d3.select($scope.state.parent[0]).append('svg');
          $scope.state.svg = $scope.state.host.append('g').attr('transform', "translate(" + $scope.state.margin.left + "," + $scope.state.margin.top + ")").style('shape-rendering', 'crispEdges');
          $scope.state.grandparent = $scope.state.svg.append('g').attr('class', 'grandparent');
          $scope.state.grandparent.append('rect').attr({
            y: -$scope.state.margin.top,
            width: '100%',
            height: $scope.state.margin.top + 5
          });
          $scope.state.grandparent.append('text').attr({
            x: 6,
            y: 6 - $scope.state.margin.top,
            dy: '0.75em'
          });
          $scope.treemap.x = $scope.treemap.y = 0;
          $scope.treemap.depth = 0;
          $scope.state.transitioning = void 0;
          $scope.state.formatNumber = d3.format(',d');
          $scope.treemap.dx = $scope.state.width;
          $scope.treemap.dy = $scope.state.height;
          $scope.state.x = d3.scale.linear().domain([0, $scope.state.width]).range([0, $scope.state.width]);
          $scope.state.y = d3.scale.linear().domain([0, $scope.state.height]).range([0, $scope.state.height]);
          $scope.accumulate($scope.treemap);
          $scope.layout($scope.treemap);
          $scope.display($scope.treemap);
          return $scope.resize();
        });
      };
    })(this)
  };
});

// ---
// generated by coffee-script 1.9.2
