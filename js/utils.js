/** @license
 | Version 10.2
 | Copyright 2012 Esri
 |
 | ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 | My Municipal Government Services v10.2.0 / Mes services municipaux v10.2.0
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
var orientationChange = false; //variable for setting the flag on orientation
var tinyResponse; //variable for storing the response getting from tiny URL api
var tinyUrl; //variable for storing the tiny URL
var routeID; //variable to store graphics layer ID of route for sharing
var featureID; //variable to store ID for infowindow

//Refresh address container div

function RemoveChildren(parentNode) {
    if (parentNode) {
        while (parentNode.hasChildNodes()) {
            parentNode.removeChild(parentNode.lastChild);
        }
    }
}

//Trim string

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
};

//Append "..." for a long string

String.prototype.trimString = function (len) {
    return (this.length > len) ? this.substring(0, len) + "..." : this;
};

//Display the current location of the user

function ShowMyLocation() {
	showHideSearch(true);
    if (dojo.coords("divLayerContainer").h > 0) {
        dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divLayerContainer').style.height = '0px';
		showHideSearch(true);
		//CanAccess
		document.getElementById('imgBaseMap').setAttribute("aria-expanded",false);
		dojo.forEach(dojo.query(".basemapThumbnail"), function(item,i) {
			item.tabIndex = "-1";
		});
		if (timeouts.basemap != null) {clearTimeout(timeouts.basemap); timeouts.basemap = null;}
		timeouts.basemap = setTimeout(function() {
			timeouts.basemap = null;
			dojo.byId('divLayerContainer').style.display = 'none';
		},1000);
    }
    navigator.geolocation.getCurrentPosition(

    function (position) {
        ShowProgressIndicator();
        mapPoint = new esri.geometry.Point(position.coords.longitude, position.coords.latitude, new esri.SpatialReference({
            wkid: 4326
        }));
        var graphicCollection = new esri.geometry.Multipoint(new esri.SpatialReference({
            wkid: 4326
        }));
        var bmap;
        graphicCollection.addPoint(mapPoint);
        geometryService.project([graphicCollection], map.spatialReference, function (newPointCollection) {
            for (var bMap = 0; bMap < baseMapLayers.length; bMap++) {
                if (map.getLayer(baseMapLayers[bMap].Key).visible) {
                    bmap = baseMapLayers[bMap].Key;
                }
            }
            if (!map.getLayer(bmap).fullExtent.contains(newPointCollection[0].getPoint(0))) {
                map.infoWindow.hide();
                mapPoint = null;
                selectedMapPoint = null;
                HideProgressIndicator();
                if (!isMobileDevice) {
                    HideServiceLayers();
                    WipeOutResults();
                }
                alert(messages.getElementsByTagName("geoLocation")[0].childNodes[0].nodeValue);
                return;
            }
            map.getLayer(tempGraphicsLayerId).clear();
            mapPoint = newPointCollection[0].getPoint(0);
            var ext = GetExtent(mapPoint);
            map.setExtent(ext.getExtent().expand(zoomLevel));
			//CanMod: Reverse Geocode on geolocation to obtain textual address
			if (isMobileDevice) {
				map.infoWindow.setContent(locatorSettings.GenericLocationName);
				dojo.byId("tdListHeader").innerHTML = "";
			}
			else {
				SelectedPointAddress();
			}
            if (!isMobileDevice) {
                WipeInResults(true);
                ShowProgressIndicator();
                QueryService(mapPoint);
            } else {
                CreateCarousel();
                GetServices();
            }
            HideProgressIndicator();
        });
    },

    function (error) {
        HideProgressIndicator();
        switch (error.code) {
            case error.TIMEOUT:
                alert(messages.getElementsByTagName("geolocationTimeout")[0].childNodes[0].nodeValue);
                break;
            case error.POSITION_UNAVAILABLE:
                alert(messages.getElementsByTagName("geolocationPositionUnavailable")[0].childNodes[0].nodeValue);
                break;
            case error.PERMISSION_DENIED:
                alert(messages.getElementsByTagName("geolocationPermissionDenied")[0].childNodes[0].nodeValue);
                break;
            case error.UNKNOWN_ERROR:
                alert(messages.getElementsByTagName("geolocationUnKnownError")[0].childNodes[0].nodeValue);
                break;
        }
    }, {
        timeout: 10000
    });
}

//Handle orientation change event

function orientationChanged() {
    orientationChange = true;
    if (map) {
        var timeout = (isMobileDevice && isiOS) ? 100 : 500;
        map.infoWindow.hide();
        setTimeout(function () {
            if (isMobileDevice) {
                map.reposition();
                map.resize();
                setTimeout(function () {
                    SetHeightSplashScreen();
                    setTimeout(function () {
                        if (mapPoint) {
                            map.setExtent(GetBrowserMapExtent(mapPoint));
                        }
                        orientationChange = false;
                    }, 300);
                    SetMblListContainer();
                }, 300);
            } else {
                setTimeout(function () {
                    if (mapPoint) {
                        map.setExtent(GetMobileMapExtent(selectedGraphic));
                    }
                    orientationChange = false;
                }, 500);
                FixBottomPanelWidth(); //function to set width of shortcut links in ipad orientation change
            }
        }, timeout);
    }
}

//Set the height for the content div used in mobile devices in orientation change event

function SetContentHeight(content, heightReduced) {
    var height = map.height;
    if (height > 0) {
        dojo.byId(content).style.height = (height - heightReduced) + "px";
    }
}

//Set scroll bar when orientation is changed

function SetMblListContainer() {
    if ((dojo.byId("divListContainer").style.display) == "block") {
        SetContentHeight("divDataListContent", 60);
    }
    if (dojo.byId("divRepresentativeDataContainer").style.display == "block") {
        if (dojo.byId("divRepresentativeScrollContent" + selectedFieldName).style.display == "block") {
            SetContentHeight("divContent" + selectedFieldName, 80);
            SetContentHeight("divRepresentativeScrollContent" + selectedFieldName, 80);
        }
        if (dojo.byId("divRepresentativeDataPointDetails" + selectedFieldName)) {
            if ((dojo.byId("divRepresentativeDataPointDetails" + selectedFieldName).style.display) == "block") {
                SetContentHeight("divRepresentativeDataPointDetails" + selectedFieldName, 60);
            }
        }
        if (dojo.byId("divDataDirectionsContainer" + selectedFieldName) && (dojo.byId("divDataDirectionsContainer" + selectedFieldName).style.display) == "block") {
            SetContentHeight("divRouteListContent" + selectedFieldName, 150);
        }
    }
}

//Hide splash screen container

function HideSplashScreenMessage() {
    if (dojo.isIE < 9) {
        dojo.byId("divSplashScreenContent").style.display = "none";
    }
    dojo.addClass('divSplashScreenContainer', "opacityHideAnimation");
    dojo.replaceClass("divSplashScreenContent", "hideContainer", "showContainer");
	setTimeout(function() {document.getElementById("divSplashScreenContainer").style.display = "none";},1000);
}

//Set height for splash screen

function SetHeightSplashScreen() {
    var height = (isMobileDevice) ? (dojo.window.getBox().h - 110) : (dojo.coords(dojo.byId('divSplashScreenContent')).h - 80);
    dojo.byId('divSplashContainer').style.height = (height + 10) + "px";
}

//Handle resize browser event

function ResizeHandler() {
    if (map) {
        map.reposition();
        map.resize();
        FixBottomPanelWidth();
    }
}

//Create the tiny URL with current extent and selected feature

function ShareLink(ext) {
    tinyUrl = null;
    mapExtent = GetMapExtent();
    var url = esri.urlToObject(window.location.toString());
    var urlString;
    var group = dojo.byId("imgShare").getAttribute("selectedPod");
    if (mapPoint) {
        if (group !== "null" && group) {
            if (isMobileDevice) {
                if (routeID) {
                    urlString = encodeURI(url.path) + "?extent=" + mapExtent + "$point=" + mapPoint.x + "," + mapPoint.y + "$selectedPod=" + group + "$routeID=" + routeID;
                } else {
                    urlString = encodeURI(url.path) + "?extent=" + mapExtent + "$point=" + mapPoint.x + "," + mapPoint.y + "$selectedPod=" + group;
                }
            } else {
                urlString = encodeURI(url.path) + "?extent=" + mapExtent + "$point=" + mapPoint.x + "," + mapPoint.y + "$selectedPod=" + group + "$pos=" + dojo.byId("divDetailsHeader" + group).getAttribute("position");
                if (featureID && !routeID) {
                    urlString = encodeURI(url.path) + "?extent=" + mapExtent + "$point=" + mapPoint.x + "," + mapPoint.y + "$selectedPod=" + group + "$featureID=" + featureID + "$pos=" + dojo.byId("divDetailsHeader" + group).getAttribute("position");

                }
                if (routeID && !featureID) {
                    urlString = encodeURI(url.path) + "?extent=" + mapExtent + "$point=" + mapPoint.x + "," + mapPoint.y + "$selectedPod=" + group + "$routeID=" + routeID + "$pos=" + dojo.byId("divDetailsHeader" + group).getAttribute("position");
                }
                if (featureID && routeID) {
                    urlString = encodeURI(url.path) + "?extent=" + mapExtent + "$point=" + mapPoint.x + "," + mapPoint.y + "$selectedPod=" + group + "$featureID=" + featureID + "$routeID=" + routeID + "$pos=" + dojo.byId("divDetailsHeader" + group).getAttribute("position");
                }
            }
        } else {
            urlString = encodeURI(url.path) + "?extent=" + mapExtent + "$point=" + mapPoint.x + "," + mapPoint.y;
        }
    } else {
        urlString = encodeURI(url.path) + "?extent=" + mapExtent;
    }
    url = dojo.string.substitute(mapSharingOptions.TinyURLServiceURL, [urlString]);
    dojo.io.script.get({
        url: url,
        callbackParamName: "callback",
        load: function (data) {
            tinyResponse = data;
            tinyUrl = data;
            var attr = mapSharingOptions.TinyURLResponseAttribute.split(".");
            for (var x = 0; x < attr.length; x++) {
                tinyUrl = tinyUrl[attr[x]];
            }
            if (ext) {
				if (timeouts.share != null) {clearTimeout(timeouts.share); timeouts.share = null;}
				showHideSearch(true);
                if (dojo.coords("divLayerContainer").h > 0) {
                    dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
                    dojo.byId('divLayerContainer').style.height = '0px';
					//CanAccess
					document.getElementById('imgBaseMap').setAttribute("aria-expanded",false);
					dojo.forEach(dojo.query(".basemapThumbnail"), function(item,i) {
						item.tabIndex = "-1";
					});
					if (timeouts.basemap != null) {clearTimeout(timeouts.basemap); timeouts.basemap = null;}
					timeouts.basemap = setTimeout(function() {
						timeouts.basemap = null;
						dojo.byId('divLayerContainer').style.display = 'none';
					},1000);
                }
                var cellHeight = (isMobileDevice || isTablet) ? 81 : 60;
				showHideSearch(true);
                if (dojo.coords("divAppContainer").h > 0) {
                    dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
                    dojo.byId('divAppContainer').style.height = '0px';
					//CanAccess
					document.getElementById('imgShare').setAttribute("aria-expanded",false);
					document.getElementById('imgFacebook').tabIndex="-1";
					document.getElementById('imgTwitter').tabIndex="-1";
					document.getElementById('imgMail').tabIndex="-1";
					if (timeouts.share != null) {clearTimeout(timeouts.share); timeouts.share = null;}
					timeouts.share = setTimeout(function() {
						timeouts.share = null;
						dojo.byId('divAppContainer').style.display = 'none';
					},1000);
                } else {
					dojo.byId('divAppContainer').style.display = 'block';
					//CanAccess
					document.getElementById('imgShare').setAttribute("aria-expanded",true);
					document.getElementById('imgFacebook').tabIndex="0";
					document.getElementById('imgTwitter').tabIndex="0";
					document.getElementById('imgMail').tabIndex="0";
					if (timeouts.share != null) {clearTimeout(timeouts.share); timeouts.share = null;}
					timeouts.share = setTimeout(function() {
						timeouts.share = null;
						dojo.byId('divAppContainer').style.height = cellHeight + "px";
						dojo.replaceClass("divAppContainer", "showContainerHeight", "hideContainerHeight");
					},100);
                }
            }
        },
        error: function (error) {
            alert(messages.getElementsByTagName("servicesNotAvailable")[0].childNodes[0].nodeValue);
            return;
        }
    });
}

//Open login page for facebook,tweet and open Email client with shared link for Email

function Share(site) {
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
		//CanAccess
		document.getElementById('imgShare').setAttribute("aria-expanded",false);
		document.getElementById('imgFacebook').tabIndex="-1";
		document.getElementById('imgTwitter').tabIndex="-1";
		document.getElementById('imgMail').tabIndex="-1";
		if (timeouts.share != null) {clearTimeout(timeouts.share); timeouts.share = null;}
		timeouts.share = setTimeout(function() {
			timeouts.share = null;
			dojo.byId('divAppContainer').style.display = 'none';
		},1000);
    }
   //CanMod: Modified to take in strings for post/status/subject in the config file
    if (tinyUrl) {
		var ShareURL;
        switch (site) {
            case "facebook":
				ShareURL = mapSharingOptions.FacebookShareURL + "?";
				ShareURL += dojo.objectToQuery({u:tinyUrl});
                window.open(ShareURL);
                break;
            case "twitter":
				ShareURL = mapSharingOptions.TwitterShareURL + "?";
				ShareURL += dojo.objectToQuery({text:mapSharingOptions.TwitterText, url:tinyUrl, related:mapSharingOptions.TwitterFollow, hashtags:mapSharingOptions.TwitterHashtag});
				window.open(ShareURL);
                break;
            case "mail":
				ShareURL = "mailto:%20?"
				ShareURL += dojo.objectToQuery({subject: mapSharingOptions.EmailSubject, body:tinyUrl});
                parent.location = ShareURL;
                break;
        }
	//End of CanMod
    } else {
        alert(messages.getElementsByTagName("tinyURLEngine")[0].childNodes[0].nodeValue);
        return;
    }
}

//Get current map Extent
function GetMapExtent() {
    var extents = Math.round(map.extent.xmin).toString() + "," + Math.round(map.extent.ymin).toString() + "," +
                  Math.round(map.extent.xmax).toString() + "," + Math.round(map.extent.ymax).toString();
    return (extents);
}

//Get the query string value of the provided key
function GetQuerystring(key) {
    var _default;
    if (_default == null) _default = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return _default;
    else
        return qs[1];
}

//Show progress indicator

function ShowProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "block";
	
}

//Hide progress indicator

function HideProgressIndicator() {
    dojo.byId('divLoadingIndicator').style.display = "none";

}

//Clear default value

function ClearDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;
    target.style.color = "#FFF";
    target.value = '';
}

//Set changed value for address

function ResetTargetValue(target, title, color) {
    if (target.value == '' && target.getAttribute(title)) {
        target.value = target.title;
        if (target.title == "") {
            target.value = target.getAttribute(title);

        }
    }
    target.style.color = color;
    lastSearchString = dojo.byId("searchInput").value.trim();
}

//Add FeatureLayer services on map

function CreateFeatureLayerSelectionMode(featureLayerURL, featureLayerID, outFields, rendererColor, renderer, isFillColorSolid) {
    var tempLayer = new esri.layers.FeatureLayer(featureLayerURL, {
        mode: esri.layers.FeatureLayer.MODE_SELECTION,
        outFields: [outFields]
    });
    tempLayer.id = featureLayerID;
    var color;
    var symbol;
    var rederer;
    if (isFillColorSolid) {
        color = new dojo.Color([parseInt(rendererColor.substr(1, 2), 16), parseInt(rendererColor.substr(3, 2), 16), parseInt(rendererColor.substr(5, 2), 16), 0.4]);
        symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, color, 6),
        color);
        rederer = new esri.renderer.SimpleRenderer(symbol);
    }
    tempLayer.setRenderer(rederer);
    return tempLayer;
}

//Add Point FeatureLayer services on map

function CreatePointFeatureLayer(featureLayerURL, featureLayerID, outFields, rendererImage, renderer, showBeyondBuffer) {
	if (showBeyondBuffer) {
		var mode = esri.layers.FeatureLayer.MODE_ONDEMAND
	}
	else {
		var mode = esri.layers.FeatureLayer.MODE_SELECTION
	}
    var tempLayer = new esri.layers.FeatureLayer(featureLayerURL, {
        mode: mode,
        outFields: [outFields],
        id: featureLayerID,
		visible: false
    });
    tempLayer.id = featureLayerID;
    if (renderer) {
        var pictureSymbol = new esri.symbol.PictureMarkerSymbol(rendererImage, 30, 30);
        var Renderer = new esri.renderer.SimpleRenderer(pictureSymbol);
        tempLayer.setRenderer(Renderer);
    }
    dojo.connect(tempLayer, "onClick", function (evtArgs) {
        if (!isMobileDevice) {
            ShowProgressIndicator();
            selectedGraphic = evtArgs.graphic.geometry;
            map.centerAt(selectedGraphic);
            setTimeout(function () {
                ShowInfoWindow(evtArgs.graphic.attributes, selectedGraphic, tempLayer, featureLayerID);
            }, 500);

            evtArgs = (evtArgs) ? evtArgs : event;
            evtArgs.cancelBubble = true;
            if (evtArgs.stopPropagation) {
                evtArgs.stopPropagation();
            }
            setTimeout(function () {
                HideProgressIndicator();
            }, 1000);
        } else {
            routeID = evtArgs.graphic.attributes[map.getLayer(featureLayerID).objectIdField];
            map.infoWindow.hide();
            if (evtArgs.stopPropagation) {
                evtArgs.stopPropagation();
            }
            ConfigureRoute(mapPoint, evtArgs.graphic.geometry);
            selectedGraphic = evtArgs.graphic.geometry;
            map.centerAt(selectedGraphic);
            if (routeLayerId) {
                DisplayMblInfo(selectedGraphic, featureLayerID, evtArgs.graphic.attributes[infoWindowHeader]);
            }
        }
    });
    return tempLayer;
}

//show info-window

function ShowInfoWindow(attributes, geometry, layer, key) {
	var service = services[key];
    
	featureID = attributes[layer.objectIdField];
    dojo.byId("tdTitle").innerHTML = attributes[service.FieldNames[0].FieldName];
    selectedGraphic = geometry;

	if (isBrowser) {
		map.infoWindow.resize(infoPopupWidth, infoPopupHeight);
	} else {
		map.infoWindow.resize(infoPopupWidth + 95, infoPopupHeight + 30);
	}
	var screenPoint = map.toScreen(geometry);
	screenPoint.y = map.height - screenPoint.y;
	map.infoWindow.show(screenPoint);
	RemoveChildren(dojo.byId("divInfoContent"));
	
    var table = dojo.create("table");
	dojo.byId("divInfoContent").appendChild(table);
	table.style.paddingLeft = "10px";
	table.style.width = "95%";
    table.style.paddingTop = "4px";
    table.cellPadding = "0";
    table.cellSpacing = "0";
    var tbody = dojo.create("tbody");
    table.appendChild(tbody);
	
    for (var i = 0; i < service.FieldNames.length; i++) {
		if (attributes[service.FieldNames[i].FieldName] === null || attributes[service.FieldNames[i].FieldName] == showNullValueAs) {continue;} //Do not write entry if no data
		var trData = dojo.create("tr");
        table.appendChild(trData);
		if (service.FieldNames[i].Links) {
			var tdLink = dojo.create("td");
			trData.appendChild(tdLink);
			var tableLink = dojo.create("table");
			tableLink.cellSpacing = "0";
			tableLink.cellPadding = "0";
			tdLink.appendChild(tableLink);
			var tbodyLink = dojo.create("tbody");
			tableLink.appendChild(tbodyLink);
			var trLink = dojo.create("tr");
			tbodyLink.appendChild(trLink);
			for (var m = 0; m < service.FieldNames[i].Links.length; m++) {
				if (attributes[service.FieldNames[i].Links[m].FieldName] == null || attributes[service.FieldNames[i].Links[m].FieldName] == showNullValueAs) {continue;} //Do no write empty link
				// Insert separator from previous cell at end of current row
				if(m > 0) {
					var span = trLink.insertCell(-1);
					span.style.borderLeft = "1px solid dimgray";
					span.style.paddingRight = "5px";
				}

				// Create cell for link
				var tdHref = trLink.insertCell(-1);
				tdHref.style.paddingRight = "5px";
				if (service.FieldNames[i].Links[m].type == "tag") {
					var innerSpan = document.createElement("span");
					if (service.FieldNames[i].Links[m].DisplayText) {
						innerSpan.innerHTML = service.FieldNames[i].Links[m].DisplayText + " " + attributes[service.FieldNames[i].Links[m].FieldName];
					}
					else {
						innerSpan.innerHTML = attributes[service.FieldNames[i].Links[m].FieldName];
					}
					tdHref.appendChild(innerSpan);
				}
				else {
					var aLink = document.createElement("a");
					aLink.className = "focusHighlight";
					aLink.target = "_blank";
					if (service.FieldNames[i].Links[m].type == "web") {
						aLink.href = attributes[service.FieldNames[i].Links[m].FieldName];
					}
					else if (service.FieldNames[i].Links[m].type == "mail") {
						aLink.href = "mailto:" + attributes[service.FieldNames[i].Links[m].FieldName];
					}
					aLink.innerHTML = service.FieldNames[i].Links[m].DisplayText;
					tdHref.appendChild(aLink);
				}
			}
		}
		else {
			tdData = dojo.create("td");
			tdData.align = "left";
			trData.appendChild(tdData);

			var tdContent = "";
			if (service.FieldNames[i].DisplayText) {
				tdContent += service.FieldNames[i].DisplayText + " ";
			}
			if (service.FieldNames[i].BreakOn && attributes[service.FieldNames[i].FieldName].indexOf(service.FieldNames[i].BreakOn) >= 0) {
				var regex = new RegExp(service.FieldNames[i].BreakOn,'g');
				var text = attributes[service.FieldNames[i].FieldName];
				tdContent += "<ul style='margin-top:0px;'><li>" + text.replace(regex,"</li><li>") + "</li></ul>";
			}
			else {
				tdContent += attributes[service.FieldNames[i].FieldName]
			}
			tdData.innerHTML = tdContent;
		}
    }
    dojo.byId("divInfoContent").style.height = (dojo.coords("divInfoWindowContainer").h) - 60 + "px";
}

//Hide information container

function HideInformationContainer() {
    map.infoWindow.hide();
    selectedGraphic = null;
    featureID = null;
}

//CanAccess: Run function from keyboard Enter/Space instead of onclick
function accessClick(evt,fxn,params) {
	var kc = evt.keyCode;
	if (kc == dojo.keys.ENTER || kc == dojo.keys.SPACE) {
		window[fxn](params);
	}
}

//Show/Hide the IE7/Mobile/Tablet search window
function showHideSearch(closeOnly) {
	var disp = dojo.byId("divAddressSearch").style.display;
	if (disp == "block") {
		dojo.byId("divAddressSearch").style.display = "none";
		dojo.byId("imgSearch").setAttribute("aria-expanded","false");
	}
	else if (disp == "none" && !closeOnly) {
		if (dojo.coords("divAppContainer").h > 0) {
			dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
			dojo.byId('divAppContainer').style.height = '0px';
			//CanAccess
			document.getElementById('imgShare').setAttribute("aria-expanded",false);
			document.getElementById('imgFacebook').tabIndex="-1";
			document.getElementById('imgTwitter').tabIndex="-1";
			document.getElementById('imgMail').tabIndex="-1";
			if (timeouts.share != null) {clearTimeout(timeouts.share); timeouts.share = null;}
			timeouts.share = setTimeout(function() {
				timeouts.share = null;
				dojo.byId('divAppContainer').style.display = 'none';
			},1000);
		}
		if (dojo.coords("divLayerContainer").h > 0) {
			dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
			dojo.byId('divLayerContainer').style.height = '0px';
			//CanAccess
			document.getElementById('imgBaseMap').setAttribute("aria-expanded",false);
			dojo.forEach(dojo.query(".basemapThumbnail"), function(item,i) {
				item.tabIndex = "-1";
			});
			if (timeouts.basemap != null) {clearTimeout(timeouts.basemap); timeouts.basemap = null;}
			timeouts.basemap = setTimeout(function() {
				timeouts.basemap = null;
				dojo.byId('divLayerContainer').style.display = 'none';
			},1000);
		}
		dojo.byId("divAddressSearch").style.display = "block";
		dojo.byId("imgSearch").setAttribute("aria-expanded","true");
	}
}

//Zoom to feature point when selected in pods
function goToFeature(xCord,yCord,key) {
	if (!isMobileDevice) {
		ShowProgressIndicator();
		map.infoWindow.hide();
		selectedGraphic = null;
	}
	map.centerAndZoom(new esri.geometry.Point(Number(xCord), Number(yCord), map.spatialReference), zoomLevel);
	ShowServiceLayer(key);
	if (!isMobileDevice) {
		setTimeout(function () {
			HideProgressIndicator();
		}, 500);
	}
}

//---Create Regular Schedule for full year-------------------------------|
function parseScheduleDates(schedule,type,year) {
	var result = [];
	//---DAILY----------------------------------|
	if (type == "Daily") {
		var d = new Date();
		d.setFullYear(year); d.setMonth(0); d.setDate(1); d.setHours(0,0,0,0);
		if (dojo.date.isLeapYear(d)) { var numDays = 366;}
		else {var numDays = 365;}
		for (i = 0; i<numDays; i++) {
			result.push(dojo.date.add(d,"day",i));
		}
	}

	//---WEEKLY CYCLES--------------------------|
	else if (type == "Weekly" || type == "2 Week" || type == "3 Week" || type == "4 Week" || type == "5 Week") {
		var d;
		var dates = [];
		var weekdays = schedule.split('');
		//Set cycle
		switch(type) {
			case "Weekly": cycle = 1; break;
			case "2 Week": cycle = 2; break;
			case "3 Week": cycle = 3; break;
			case "4 Week": cycle = 4; break;
			case "5 Week": cycle = 5; break;
			default: cycle = 1; break;
		}
		dojo.forEach(weekdays, function(item,idx) {
			if (item == "0") {return;} //Move to next day if not scheduled
			d = new Date();
			d.setFullYear(year); d.setMonth(0); d.setDate(1); d.setHours(0,0,0,0);
			
			//Determine first date of cycle
			var gap = idx - d.getDay();
			if (gap < 0 && item == 1) {d = dojo.date.add(d,"week",cycle);}
			d = dojo.date.add(d,"day",gap);
			d = dojo.date.add(d,"week",parseInt(item) - 1);
			
			//Create all dates
			for (var i=0; i<=52; i += cycle) {
				var nd = dojo.date.add(d,"week",i);
				if (nd.getFullYear() == year) {dates.push(new Date(nd));}
			}
		});
		result = sortDateArray(dates);
	}
	
	//---MONTHLY--------------------------------|
	else if (type == "Monthly") {
		for (var i=0; i<12; i++) {
			var d = new Date();
			d.setFullYear(year); d.setMonth(i); d.setDate(1); d.setHours(0,0,0,0);
			if (schedule.length > 2) { //nth weekday of the month
				var weekdays = schedule.split('');
				dojo.forEach(weekdays, function(item,idx) {
					if (item == "0") {return;} //Move to next day if not scheduled
					else if (item == "9") { //Look for last day of the week in month
						d.setDate(dojo.date.getDaysInMonth(d));
						var gap = d.getDay() - idx;
						if (gap < 0) {gap += 7}
						d = dojo.date.add(d,"day",gap * -1);
						result.push(new Date(d));
					}
					else {
						//Determine first occurence of weekday
						d.setDate(1);
						var gap = idx - d.getDay();
						if (gap < 0) {gap += 7;}
						d = dojo.date.add(d,"day",gap);
						d = dojo.date.add(d,"week",parseInt(item) - 1);
						result.push(new Date(d));
					}
				});
			}
			else { //nth day of the month
				d.setDate(parseInt(schedule));
				result.push(new Date(d));
			}
		}
	}
	//---ANNUAL/IRREGULAR/SEASONALLY------------|
	else if (type == "Annually" || type == "Irregularly" || type == "Seasonally") {
		var breakdown = schedule.split(",");
		dojo.forEach(breakdown, function(item, i) {
			var d = new Date(); d.setHours(0,0,0,0);
			var dates = item.split("-");
			d.setFullYear(parseInt(dates[0]));
			d.setMonth(parseInt(dates[1])-1);
			d.setDate(parseInt(dates[2]));
			result.push(new Date(d));
		});
	}
	return result;
}

//---Create Schedule Pattern Description-------------------------------|
function schedulePatternDescriptor(schedule,type) {	
	var result = "";
	var weekdays = intl.weekdays;
	var terms = intl.terms;
	
	if (type == "Monthly" && schedule.length <= 2) {
		var idx = Number(schedule);
		if (idx <= 5 && idx > 0) {
			result = terms[idx] + " " + terms[9];
		}
		else {
			result = String(idx) + terms[6] + " " + terms[9];
		}
	}
	else if (type == "Weekly" || type == "2 Week" || type == "3 Week" || type == "4 Week" || type == "5 Week" || type == "Monthly") {
		dojo.forEach(schedule.split(""), function (item, i) {	
			if (item != "0") {
				if (result != "") {result += " " + terms[0] + " ";}
				if (type == "Weekly") {
					result += weekdays[i];
				}
				else if (type == "2 Week" || type == "3 Week" || type == "4 Week" || type == "5 Week") {
					result += terms[7] + " " + String(item) + ": " + weekdays[i];
				}
				else if (type == "Monthly" &&  schedule.length > 2) { //nth weekday of the month
					result += terms[item] + " " + weekdays[i] + " " + terms[8];
				}
			}
		});
	}
	
	if (result != "") {result = " | " + result};
	return result;
}

//---Adjust Regular Schedule around holidays-----------------------------|
function modForHolidays(regSched,holidaysObj) {
	//Loop through each schedule day
	var modSched = dojo.map(regSched, function(sched, si) {
		var tempSched = sched; //will store the date, until modified
		//Loop through each holiday
		dojo.forEach(holidaysObj, function (holiday, hi) {
			//--SHIFT FORWARD/BACK--------------|
			if (holiday[0] == "Shift Forw" || holiday[0] == "Shift Back") {
				dFr = dojo.date.add(holiday[1],"day",-1 * holiday[1].getDay());
				dTo = dojo.date.add(holiday[1],"day", 6 - holiday[1].getDay());
				if (sched.getTime() >= dFr.getTime() && sched.getTime() <= dTo.getTime()) {
					if (holiday[0] == "Shift Forw" && sched.getTime() >= holiday[1].getTime()) {
						tempSched = dojo.date.add(sched, "day", 1);
					}
					else if (holiday[0] == "Shift Back" && sched.getTime() <= holiday[1].getTime()) {
						tempSched = dojo.date.add(sched, "day", -1);
					}
				}
			}
			else if (holiday[1].getTime() == sched.getTime()) {
				switch (holiday[0]) {
					//--NEXT SAT----------------|
					case "Next Sat":
						if (sched.getDay() == 6) {
							tempSched = dojo.date.add(sched, "day", 7);
						}
						else {
							tempSched = dojo.date.add(sched, "day", 6 - sched.getDay());
						}
						break;
					//--PREV SAT----------------|
					case "Prev Sat":
						tempSched = dojo.date.add(sched, "day", (sched.getDay() * -1) -1);
						break;
					//--NEXT SUN----------------|
					case "Next Sun":
						tempSched = dojo.date.add(sched, "day", 7 - sched.getDay());
						break;
					//--PREV SUN----------------|
					case "Prev Sun":
						if (sched.getDay() == 0) {
							tempSched = dojo.date.add(sched, "day", -7);
						}
						else {
							tempSched = dojo.date.add(sched, "day", sched.getDay() * -1);
						}
						break;
					//--CANCEL------------------|
					case "Cancel":
						tempSched = null;
						break;
				}
			}
		});
		return tempSched;
	});
	return dojo.filter(modSched,function(item) {return item != null;});
}

//--SORT ARRAY OF DATES--------------------------------------------------|
function sortDateArray(array) {
	array.sort(function(a,b){
		return dojo.date.compare(a, b);
	});
	return array;
}

//--Point To Extent------------------------------------------------------|
function pointToExtent(map, point, toleranceInPixel) {
	var pixelWidth = map.extent.getWidth() / map.width;
	var toleranceInMapCoords = toleranceInPixel * pixelWidth;
	return new esri.geometry.Extent(point.x - toleranceInMapCoords, point.y - toleranceInMapCoords, point.x + toleranceInMapCoords, point.y + toleranceInMapCoords, map.spatialReference);
}