/*
 * angular-confirm
 * http://schlogen.github.io/angular-confirm/
 * Version: 1.0 - 2014-24-11
 * License: Apache
 */
'use strict';
angular.module('angular-confirm', ['ui.bootstrap'])
.controller('ConfirmModalController', function($scope, $modalInstance, data) {
  $scope.data = angular.copy(data);
  var defaultOK = "OK";
  var defaultCancel = "Cancel";
  var cancelDefaultOption = false;
  if (!$scope.data.oktext) {
	$scope.data.oktext = defaultOK;
  }
  if (!$scope.data.canceltext) {
	$scope.data.canceltext = defaultCancel;
  }
  if (!$scope.data.cancelCloseOption) {
	$scope.data.cancelCloseOption = cancelDefaultOption;
  }
  
  $scope.ok = function () {
    $modalInstance.close('ok');
  };

  $scope.cancel = function () {
    if ($scope.data.cancelCloseOption) {
        $modalInstance.close('cancel');
    }
    else {
        $modalInstance.dismiss('cancel');
    }
  };
})
.value('$confirmModalDefaults', {
    template: '<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">{{data.oktext}}</button><button class="btn btn-warning" ng-click="cancel()">{{data.canceltext}}</button></div>',
  controller: 'ConfirmModalController'
})
.factory('$confirm', ['$modal', '$confirmModalDefaults', function($modal, $confirmModalDefaults) {
  return function(data, settings) {
    settings = angular.extend($confirmModalDefaults, (settings || {}));
    data = data || {};
    
    if ('templateUrl' in settings && 'template' in settings) {
      delete settings.template;
    }
    
    settings.resolve = {data: function() { return data; }};

    return $modal.open(settings).result;
  };
}])
.directive('confirm', function($confirm) {
    return {
      priority: 1,
      restrict: 'A',
      scope: {
        confirmIf: "=",
        ngClick: '&',
        confirm: '@'
      },
      link: function(scope, element, attrs) {
        function reBind(func) {
          element.unbind("click").bind("click", function() {
            func();
          });
        }
        
        function bindConfirm() {
          $confirm({text: scope.confirm}).then(scope.ngClick);
        }
        
        if ('confirmIf' in attrs) {
          scope.$watch('confirmIf', function(newVal) {
            if (newVal) {
              reBind(bindConfirm);
           } else {
              reBind(function() {
             	  scope.$apply(scope.ngClick);
              }); 
            }
          });
        } else {
          reBind(bindConfirm);
        }
      }
    }
});
