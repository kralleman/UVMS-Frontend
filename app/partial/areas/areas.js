/*
﻿Developed with the contribution of the European Commission - Directorate General for Maritime Affairs and Fisheries
© European Union, 2015-2016.

This file is part of the Integrated Fisheries Data Management (IFDM) Suite. The IFDM Suite is free software: you can
redistribute it and/or modify it under the terms of the GNU General Public License as published by the
Free Software Foundation, either version 3 of the License, or any later version. The IFDM Suite is distributed in
the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a
copy of the GNU General Public License along with the IFDM Suite. If not, see <http://www.gnu.org/licenses/>.
 */
angular.module('unionvmsWeb').controller('AreasCtrl',function($scope, $window, $interval, locale, genericMapService, areaMapService, projectionService, areaAlertService, areaHelperService, areaRestService, userService){
    //$scope.selectedTab = 'USERAREAS';
    $scope.alert = areaAlertService;
    $scope.helper = areaHelperService;
    
    var setTabs = function(){
        var context = userService.getCurrentContext();
        
        var tabs = [];
        angular.forEach(context.role.features, function(obj) {
            if (obj.applicationName === 'Spatial'){
                if (obj.featureName === 'MANAGE_USER_DEFINED_AREAS'){
                    this.splice(0, 0, {
                        'tabId': 'USERAREAS',
                        'title': locale.getString('areas.my_areas')
                    });                    
                    
                    this.splice(1, 0, {
                        'tabId': 'AREAGROUPS',
                        'title': locale.getString('areas.area_groups')
                    });
                } else if (obj.featureName === 'MANAGE_REFERENCE_DATA'){
                    this.push({
                        'tabId': 'SYSAREAS',
                        'title': locale.getString('areas.sys_areas')
                    });
                }
            }
        }, tabs);
        
        return tabs;
    };
    
    $scope.selectTab = function(tabId){
        if (tabId !== $scope.selectedTab){
            $scope.helper.tabChange(tabId);
            $scope.selectedTab = tabId;
        }
    };
    
    $scope.isAllowed = function(module, feature){
        return userService.isAllowed(feature, module, true);
    };
    
    $scope.stopInitInterval = function(){
        $interval.cancel($scope.initInterval);
        $scope.initInterval = undefined;
        areaAlertService.removeLoading();
    };
    
    locale.ready('areas').then(function(){
        areaAlertService.setLoading(locale.getString('areas.inital_loading'));
        genericMapService.setMapBasicConfigs();
        projectionService.getProjections();
        
        $scope.tabs = setTabs();
        if (!angular.isDefined($scope.selectedTab)){
            var userAreas = _.findWhere($scope.tabs, {tabId: 'USERAREAS'});
            var sysAreas = _.findWhere($scope.tabs, {tabId: 'SYSAREAS'});
            
            if (angular.isDefined(userAreas)){
                $scope.selectedTab = 'USERAREAS';
            } else if (angular.isDefined(sysAreas)){
                $scope.selectedTab = 'SYSAREAS';
            }
        }
        
        $scope.initInterval = $interval(function(){
            if (!_.isEqual(genericMapService.mapBasicConfigs, {})){
                areaMapService.setMap();
                areaHelperService.clearHelperService();
                if ($scope.selectedTab === 'USERAREAS'){
                    areaHelperService.lazyLoadUserAreas();
                }
                $scope.stopInitInterval();
            }
        }, 10);
    });

    $scope.updateContainerSize = function(){
        setTimeout(function() {
            var w = angular.element(window);
            var offset = 50;
            var minHeight = 340;
            var footerHeight = angular.element('footer')[0].offsetHeight;
            var headerHeight = angular.element('header')[0].offsetHeight;
            var newHeight = w.height() - headerHeight - footerHeight - offset;
            
            if (newHeight < minHeight) {
                newHeight = minHeight;
            }
            
            $('.areaCard').css('height', newHeight);
            
            angular.forEach($('.base-area-container'), function(item) {
            	$(item).css('height', newHeight - $('.tabMenu').height() - 30);
            });
            
            
            //USERAREAS
            //div with table list of user areas
            $('#user-areas-table .tbody').css('max-height', newHeight - $('.tabMenu').height() - 65 - 36 - 108); // .user-areas-table .thead'
            
            //User areas form
            $('.area-form-container').css('height', $($('.base-area-container')[0]).height() - 40 - 50 - 45); //.editingTools and .user-area-btns and slider
            
            //SYSAREAS
            if ($('.sysareas-radio-btns').height() === 0){
                var base = $($('.base-area-container')[0]).height();
                $('.updateMetadata').css('height', base - (Math.abs(base - newHeight)) - 15);
            } else {
                $('.updateMetadata').css('height', newHeight - $('.tabMenu').height() - 65 - $('.sysareas-radio-btns').height());
            }
            
            $('.metadata-container').css('height', $('#system-area-form-container').height() - 125);
            $('.sysarea-wizard').css('max-height', $('#system-area-form-container').height() - 80);
            
            var datasetCont = $('.dataset-form-container').height();
            if (datasetCont < 80){
                datasetCont = 80;
            }
            
            $('.dataset-table-container').css('max-height', newHeight - datasetCont - 240);
            
            //GENERIC CONTAINERS
            //$('.area-loading').css('width', $('.areaCard').width());
            $('.areaMap').css('height', newHeight);
            areaMapService.updateMapSize();
        }, 100);
    };
    
    $($window).resize($scope.updateContainerSize);
    angular.element(document).ready(function () {
        $scope.updateContainerSize();
    });
});