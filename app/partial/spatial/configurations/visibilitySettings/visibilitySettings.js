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
angular.module('unionvmsWeb').controller('VisibilitysettingsCtrl',function($scope, locale, $anchorScroll, spatialConfigRestService, spatialConfigAlertService, SpatialConfig, $location, loadingStatus){
    
    $scope.status = {
        isOpen: false
    };
    
    $scope.selectedMenu = 'POSITIONS';

    var setMenus = function(){
        return [
            {
                'menu': 'POSITIONS',
                'title': locale.getString('spatial.tab_movements')
            },
            {
                'menu': 'SEGMENTS',
                'title': locale.getString('spatial.tab_segments')
            },
            {
                'menu': 'TRACKS',
                'title': locale.getString('spatial.tab_tracks')
            }
        ];
    };
    
    $scope.selectAll = {
    	positions: {
    		table: true,
    		popup: true,
    		label: true
    	},
    	segments: {
    		table: true,
    		popup: true,
    		label: true
    	},
    	tracks: {
    		table: true
    	}
    };
        
    locale.ready('spatial').then(function(){
       $scope.headerMenus = setMenus();
    });
    
    $scope.selectMenu = function(menu){
       $scope.selectedMenu = menu;
    };
    
    $scope.isMenuSelected = function(menu){
       return $scope.selectedMenu === menu;
    };
    
    $scope.dropItem = function(item, list){
 	   var itemIndex = list.indexOf(item);
 	   if(itemIndex !== 1){
 		   list.splice(itemIndex, 1);
 	   }
 	   return item;
    };
    
	$scope.selectAllChange = function(visibilityType,contentType,isListItem,newVal){
		var currentVisibilities = $scope.configModel.visibilitySettings[visibilityType][contentType.toLowerCase() === 'label' ? contentType.toLowerCase() + 's' : contentType.toLowerCase()];
		if(isListItem){
			var checked = this.checked === true ? 1 : -1;
			if(angular.isDefined(currentVisibilities.values) && currentVisibilities.values.length + checked === currentVisibilities.order.length){
				$scope.selectAll[visibilityType][contentType] = true;
			}else{
				$scope.selectAll[visibilityType][contentType] = false;
			}
		}else{
			currentVisibilities.values = [];
			if($scope.selectAll[visibilityType][contentType]){
				angular.forEach(currentVisibilities.order, function(item) {
					currentVisibilities.values.push(item);
				});
			}
			
		}
	};
});