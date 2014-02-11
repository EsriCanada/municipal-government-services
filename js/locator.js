/** @license
 | Version 10.2
 | Copyright 2012 Esri
 |
 | ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 | My Municipal Government Services v10.2.0.1 / Mes services municipaux v10.2.0.1
 | This file was modified by Esri Canada - Copyright 2013 Esri Canada
 |
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */

//Get the extent based on the map point

function GetExtent(point) {
    var xmin = point.x;
    var ymin = (point.y) - 30;
    var xmax = point.x;
    var ymax = point.y;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//Query the features while sharing infowindow

function ExecuteQueryTask() {
    ShowProgressIndicator();
    var queryTask = new esri.tasks.QueryTask(services[window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[0]].ServiceUrl);
    var query = new esri.tasks.Query;
    query.outSpatialReference = map.spatialReference;
    query.where = map.getLayer(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[0]).objectIdField + "=" + featureID;
    query.outFields = ["*"];
    query.returnGeometry = true;
    queryTask.execute(query, function (fset) {
        if (fset.features.length > 0) {
            ShowInfoWindow(fset.features[0].attributes, fset.features[0].geometry, map.getLayer(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[0]), window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[0]);
        }
        HideProgressIndicator();
    },

    function (err) {
        HideProgressIndicator();
        alert(err.Message);
    });
}

//Query the features while sharing route

function ExecuteRouteQueryTask() {
    ShowProgressIndicator();
    var queryTask = new esri.tasks.QueryTask(services[window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$routeID=")[0]].ServiceUrl);
    var query = new esri.tasks.Query;
    query.outSpatialReference = map.spatialReference;
    query.where = map.getLayer(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$routeID=")[0]).objectIdField + "=" + routeID;
    query.outFields = ["*"];
    query.returnGeometry = true;
    queryTask.execute(query, function (fset) {
        if (fset.features.length > 0) {
            ShowRouteServices(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$routeID=")[0], map.getLayer(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$routeID=")[0]), fset.features[0].attributes, fset.features[0].geometry, services[window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$routeID=")[0]], true);
            if (isMobileDevice) {
                ShowMblRouteService(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$routeID=")[0], fset.features[0].geometry, fset.features[0].attributes['FacilitySitePoint.NAME']);
            }
        }
        HideProgressIndicator();
    },

    function (err) {
        HideProgressIndicator();
        alert(err.Message);
    });
}

//Query the features while sharing route with infowindow

function ExecuteRouteFeatureQueryTask() {
    ShowProgressIndicator();
    var queryTask = new esri.tasks.QueryTask(services[window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[0].split("$routeID=")[0]].ServiceUrl);
    var query = new esri.tasks.Query;
    query.outSpatialReference = map.spatialReference;
    query.where = map.getLayer(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[0].split("$routeID=")[0]).objectIdField + "=" + routeID;
    query.outFields = ["*"];
    query.returnGeometry = true;
    queryTask.execute(query, function (fset) {
        if (fset.features.length > 0) {
            ShowRouteServices(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[0].split("$routeID=")[0], map.getLayer(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[0].split("$routeID=")[0]), fset.features[0].attributes, fset.features[0].geometry, services[window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[0].split("$routeID=")[0]], true);
        }
        featureID = window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$featureID=")[1].split("$routeID")[0];
        ExecuteQueryTask();
        HideProgressIndicator();
    },

    function (err) {
        HideProgressIndicator();
        alert(err.Message);
    });
}

//--CANMOD - Locator 2.0--------------------------------------------------------------------------/
//Locate searched address on map with pushpin graphic, also handles selection of an address
function LocateAddressCML2(suggest,event) {
	
	//On selection of options with arrow keys, do not locate
	if (event) {
		var kc = event.keyCode;
		if (kc == dojo.keys.DOWN_ARROW || kc == dojo.keys.UP_ARROW || kc == dojo.keys.TAB) {
			if(timeouts.autocomplete != null) {clearTimeout(timeouts.autocomplete); timeouts.autocomplete = null;}
			return;
		}
	}
	
	//If selection made, do not proceed to new locator search
	if (!suggest && document.getElementById("autocompleteSelect") && document.getElementById("autocompleteSelect").selectedIndex >= 0) {
		var zCandidate = lastSearchResults[document.getElementById("autocompleteSelect").selectedIndex];
		lastSearchString = zCandidate.attributes[locatorSettings.Locators[0].DisplayFieldCML2];
		document.getElementById("searchInput").value = lastSearchString;
		document.getElementById("divAddress").innerHTML = lastSearchString;
		clearAutocomplete();
		mapPoint = zCandidate.location;
		LocateAddressOnMapCML2();
		return;
	}
	
	//No autocomplete on mobile devices (too unreliable due to device processing speeds)
	if ((isMobileDevice || isTablet) & suggest) {
		return;
	}

    map.infoWindow.hide();
    selectedGraphic = null;
	var currSearch = dojo.byId("searchInput").value.trim();
    if (currSearch === '' || (currSearch == lastSearchString && suggest) || (currSearch.length < 4 && suggest/*No auto-suggest for small*/)) {
		if (currSearch != lastSearchString) {
			lastSearchString = currSearch;
			clearAutocomplete();
		}
        return;
    }
	if(timeouts.autocomplete != null) {clearTimeout(timeouts.autocomplete); timeouts.autocomplete = null;}
	lastSearchString = currSearch;
	var params = [];
	//CanMod: Modify locator to search in set extent only (makes it uncessary to type city, province, etc in the search field)
	params["address"] = {};
	params["address"][locatorSettings.Locators[0].LocatorParamaters] = currSearch;
	se = locatorSettings.Locators[0].SearchExtent;
	params.outFields = [locatorSettings.Locators[0].CandidateFields];
	if (se.wkid == 4326) {
		params.searchExtent = new esri.geometry.Extent(se.xmin,se.ymin,se.xmax,se.ymax, new esri.SpatialReference({ wkid:se.wkid }));
	}
	else if (se.wkid == 3785) {
		require(["esri/geometry/webMercatorUtils"], function(webMercatorUtils) {
			var se_Original = new esri.geometry.Extent(se.xmin, se.ymin, se.xmax, se.ymax, new esri.SpatialReference({ wkid:se.wkid }));
			params.searchExtent = webMercatorUtils.webMercatorToGeographic(se_Original);
		});
	}
    var locatorCML2 = new esri.tasks.Locator(locatorSettings.Locators[0].LocatorURL);
    locatorCML2.outSpatialReference = map.spatialReference;
    locatorCML2.addressToLocations(params, function (candidates) {
		var thisSearchTime = (new Date()).getTime();
        // Discard searches made obsolete by new typing from user
        if (!lastSearchTime || thisSearchTime > lastSearchTime) {
			lastSearchTime = (new Date()).getTime();
			ShowLocatedAddressCML2(candidates,suggest);
		}
    },

    function (err) {
		console.error(err);
    });

}

//Populate candidate address list in address container

function ShowLocatedAddressCML2(candidates,suggest) {
	//Keep top 10 candidates that pass minimum score from config file
	candidates = dojo.filter(candidates, function(item) {
		if (dojo.indexOf(locatorSettings.Locators[0].LocatorFieldValues, item.attributes[locatorSettings.Locators[0].LocatorFieldName]) >= 0) {
			return item.score > locatorSettings.Locators[0].AddressMatchScore;
		}
		else {return false;}
	});
	if (candidates.length > 10) {
		candidates = candidates.slice(0,10);
	}
    if (candidates.length > 0) {
		lastSearchResults = candidates;
		
		if (suggest) {
			var sel = document.createElement("select");
			sel.setAttribute("size",String(candidates.length));
			sel.setAttribute("id","autocompleteSelect");
			sel.setAttribute("onclick","LocateAddressCML2(false);");
			sel.setAttribute("onkeyup","if (event.keyCode == dojo.keys.ENTER) {LocateAddressCML2(false);} if (event.keyCode == dojo.keys.ESCAPE) {clearAutocomplete();}");
			dojo.forEach(candidates,function(item,i) {
				var opt = document.createElement("option");
				opt.innerHTML = item.attributes[locatorSettings.Locators[0].DisplayFieldCML2];
				sel.appendChild(opt);
			});
			clearAutocomplete();
			document.getElementById("autocomplete").appendChild(sel);
		}
		else {
			var zCandidate = lastSearchResults[0];
			lastSearchString = zCandidate.attributes[locatorSettings.Locators[0].DisplayFieldCML2];
			document.getElementById("searchInput").value = lastSearchString;
			clearAutocomplete();
			mapPoint = zCandidate.location;
			if (document.getElementById("divAddress")) {
				document.getElementById("divAddress").innerHTML = lastSearchString;
			}
			LocateAddressOnMapCML2();
		}
    } else {
		var alert = document.createElement("div");
		alert.innerHTML = messages.getElementsByTagName("invalidSearch")[0].childNodes[0].nodeValue + "<hr>" + locatorSettings.Locators[0].Example;
		if(timeouts.autocomplete != null) {clearTimeout(timeouts.autocomplete); timeouts.autocomplete = null;}
		if (suggest) {
			timeouts.autocomplete = setTimeout(function() { //Reduce sporadic appearances of "No Results" as user types
				timeouts.autocomplete = null;
				clearAutocomplete();
				document.getElementById("autocomplete").appendChild(alert);
			},1000);
		}
		else {
			alert.setAttribute("role","alert"); //Alert screen reader users on form submission that no results found
			clearAutocomplete();
			document.getElementById("autocomplete").appendChild(alert);
		}
    }
}

//Clear Autocomplete
function clearAutocomplete() {
	document.getElementById("autocomplete").innerHTML = "";
}

//Change autocomplete selection from input using arrow keys
function selectAutocomplete(evt) {
	if (!(dojo.isIE < 9)) {evt.preventDefault();}
	if (document.getElementById("autocompleteSelect")) {
		var sel = document.getElementById("autocompleteSelect");
		var kc = evt.keyCode;
		if (kc == dojo.keys.DOWN_ARROW && sel.selectedIndex != sel.getAttribute("size") -1) {
			sel.selectedIndex ++;
			document.getElementById("searchInput").value = sel.options[sel.selectedIndex].text;
		}
		else if (kc == dojo.keys.UP_ARROW && sel.selectedIndex != -1) {
			sel.selectedIndex --;
			if (sel.selectedIndex == -1) {
				document.getElementById("searchInput").value = lastSearchString;
			}
			else {
				document.getElementById("searchInput").value = sel.options[sel.selectedIndex].text;
			}
		}
	}
	if (evt.keyCode == dojo.keys.ESCAPE) {
		clearAutocomplete();
	}
}

//Locate searched address on map with pushpin graphic

function LocateAddressOnMapCML2() {
	
	showHideSearch(true);
    HideServiceLayers();
    map.infoWindow.hide();
    selectedGraphic = null;
    newLeft = 0;
    if (!isMobileDevice) {
        dojo.byId("divCarouselDataContent").style.left = "0px";
        ResetSlideControls();
    }
    var symbol = new esri.symbol.PictureMarkerSymbol(locatorSettings.LocatorMarkupSymbolPath, locatorSettings.MarkupSymbolSize.width, locatorSettings.MarkupSymbolSize.height, locatorSettings.MarkupSymbolSize.width, locatorSettings.MarkupSymbolSize.height);
    var graphic = new esri.Graphic(mapPoint, symbol, null, null);
	map.getLayer(tempGraphicsLayerId).clear();
    map.getLayer(tempGraphicsLayerId).add(graphic);
	map.centerAndZoom(mapPoint,zoomLevel);
    //HideAddressContainer();
    if (!isMobileDevice) {
        WipeInResults(true);
        ShowProgressIndicator();
        QueryService(mapPoint);
    } else {
        CreateCarousel();
        GetServices();
    }
	clearAutocomplete();
}