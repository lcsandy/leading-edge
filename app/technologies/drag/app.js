/**
 *@class app2
 *@description
 *@time 2014-11-25 13:16
 *@author StarZou
 **/

var App = angular.module('App', ['ngDragDrop']);

App.run(['$rootScope', function ($rootScope) {
    $rootScope.title = 'Angular 拖动';
}]);

App.controller('AppCtrl', ['$scope', function ($scope) {
    $scope.shops = [{shopName: '店铺-1', code: 1}, {shopName: '店铺-2', code: 2}, {shopName: '店铺-3', code: 3}];
}]);

App.factory('dragDrop', function () {
    var me = {
        bindDragStart: function ($element) {
            $element.on('dragstart', function (event) {
                if ($element[0] === event.target) { // 如果选中的对象, 是允许移动的对象
                    me.target = event.target; // 放置要被移动的对象
                }
            });

            return me;
        },

        bindDragOver: function ($element) {
            $element.on('dragover', function (event) {
                event.preventDefault(); // 移动过程中, 阻止浏览器默认行为
            });

            return me;
        },

        bindDrop: function ($element) {
            $element.on('drop', function (event) {
                event.preventDefault();
                if ($element[0] === event.target && me.target) {// 如果目标地址, 是允许放置对象的地址,并且 被移动的对象,不为空, 则放置
                    event.target.appendChild(me.target);
                }
            });

            return me;
        }
    };

    return me;
});

App.directive('uiDrag', ['dragDrop', function (dragDrop) {
    return {
        restrict: 'A',
        scope   : true,
        compile : function ($element, $attr) {
            $element.attr('draggable', true);// 元素设为可拖动
            return function ($scope, $element, $attr) {
                dragDrop.bindDragStart($element).bindDragOver($element);
            };
        }
    }
}]);

App.directive('uiDrop', ['dragDrop', function (dragDrop) {
    return {
        restrict: 'A',
        scope   : true,
        compile : function ($element, $attr) {
            return function ($scope, $element, $attr) {
                dragDrop.bindDrop($element).bindDragOver($element);
            };
        }
    }
}]);