/**
 *@class app2
 *@description
 *@time 2014-11-25 13:16
 *@author StarZou
 **/

var App = angular.module('App', ['ngAnimate']);

App.run(['$rootScope', function ($rootScope) {
    $rootScope.title = 'Angular 实践2';
    $rootScope.words = 'hello world!';
}]);

App.controller('AppCtrl', ['$scope', function ($scope) {
    /**
     * 监听作用域事件
     */
    $scope.$on('eventTriggered', function (event) {
        console.log('AppCtrl', event);
    });
}]);

App.controller('MainCtrl', ['$scope', function ($scope) {
    $scope.$on('eventTriggered', function (event) {
        console.log('MainCtrl', event);
    });

    /**
     * 向上传播
     */
    $scope.emit = function () {
        $scope.$emit('eventTriggered', {date: Date.now()});
    };

    /**
     * 向下传播
     */
    $scope.broadcast = function () {
        $scope.$parent.$broadcast('eventTriggered', {date: Date.now()});
    };
}]);

App.controller('AnimateCtrl', ['$scope', '$animate', function ($scope, $animate) {

}]);

App.controller('PrincipleCtrl', ['$scope', function ($scope) {
    $scope.$watch('user.name', function (newVal, oldVal, scope) {
        console.log(arguments);
    });
}]);

App.directive('sayHello', [function () {
    return {
        restrict: 'A',
        replace : true,
        scope   : true,
        template: '<div><h1 ng-bind="word"></h1></div>',
        link    : function postLink(scope, element, attrs) {
            scope.word = scope.$eval(attrs.sayHello);
        }
    };
}]);

App.provider('formUtils', function () {
    var me = {
        date   : Date.now(),
        version: '1.0.0'
    };


    me.getFormFields = function (formElement, ngModelAttributeName) {
        return formElement.querySelectorAll('[ ' + ngModelAttributeName + ']');
    };

    me.setFormFieldAttribute = function (formField, attributeName, attributeValue) {
        formField.setAttribute(attributeName, attributeValue);
        return formField;
    };

    me.setFormFieldsAttribute = function (formElement, ngModelAttributeName, attributeName, attributeValue) {
        var formFields = this.getFormFields(formElement),
            formField,
            index;

        for (index = 0; index < formFields.length; index++) {
            formField = formFields[index];
            this.setFormFieldAttribute(formField, attributeName, attributeValue || formField.getAttribute(ngModelAttributeName));
        }
        return formElement;
    };

    me.validate = function ($element, ngFormController) {
        if (ngFormController.$valid) { // 表单验证
            return true;
        }

        //var formElement = $element[0],
        //    formFields = this.getFormFields(formElement, 'ng-model');
        //
        //console.log(formFields);


        var formElement = $element[0],
            formFields = this.getFormFields(formElement, 'ng-model'),
            formField,
            name;

        angular.forEach(formFields, function (formField) {
            //console.log(formField);
            if (formField.nextElementSibling) {
                formField.parentNode.removeChild(formField.nextElementSibling);
            }
        });

        //console.log(formFields);
        /**
         *  type : ngModelControllers
         */
        angular.forEach(ngFormController.$error, function (ngModelControllers, type) {
            console.log(type, ngModelControllers);

            angular.forEach(ngModelControllers, function (ngModelController) {
                name = ngModelController.$name;
                formField = formElement.querySelector('[name="' + name + '"]');

                var _formField = angular.element(formField);

                _formField.after('<span>' + type + '</span>');
                console.log(name, type, formField, _formField);
            });
        });
    };

    me.initValidate = function ($element, ngFormController) {
        var formFields = this.getFormFields($element[0], 'ng-model');
        angular.forEach(formFields, function (formField) {
            formField.addEventListener('blur', function (event) {
                me.validate($element, ngFormController);
                event.stopPropagation();
            }, false);
        });
    };

    this.$get = [function () {
        return me;
    }];
});


/**
 * 表单验证指令, 该指令在 form元素上使用
 */
App.directive('validateForm', ['formUtils', function (formUtils) {
    return {
        restrict: 'A',
        compile : function ($element, $attr) {

            /**
             * 为表单添加了ng-model属性的字段 绑定 name,
             * 以便于angular 为其创建 ngModelController, 实现字段校验
             */

            var formElement = $element[0],
                ngModelAttributeName = 'ng-model',
                formFields = formElement.querySelectorAll('[ ' + ngModelAttributeName + ']'),
                formField,
                index;

            for (index = 0; index < formFields.length; index++) {
                formField = formFields[index];
                formField.name = formField.getAttribute(ngModelAttributeName); // 设置 表单字段的name 为 ng-model属性值
            }

            /**
             * 使原生浏览器的校验无效
             */
            formElement.setAttribute('novalidate', 'novalidate');


            return function ($scope, $element, $attr) {
                var ngFormController = $scope[$attr.name]; // 取得ngFormController

                $element.on('submit', function (event) {
                    console.log('submit', ngFormController);

                    formUtils.validate($element, ngFormController);
                });

                $element.on('reset', function (event) {
                    console.log('reset', event);
                });

                formUtils.initValidate($element, ngFormController);

                console.log($scope, ngFormController, $element);


                //console.log(formUtils);

            };
        }
    }
}]);