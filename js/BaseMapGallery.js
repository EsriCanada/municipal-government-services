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
//Create base-map components

function CreateBaseMapComponent() {
    var layerInfo;
    for (var i = 0; i < baseMapLayers.length; i++) {
        map.addLayer(CreateBaseMapLayer(baseMapLayers[i].MapURL, baseMapLayers[i].Key, (i === 0) ? true : false));
        if (i === 0) {
            dojo.connect(map.getLayer(baseMapLayers[i].Key), "onLoad", function () { });
        }
    }
    var layerList = dojo.byId('layerList');
    for (i = 0; i < Math.ceil(baseMapLayers.length / 2); i++) {
        if (baseMapLayers[(i * 2) + 0]) {
            layerInfo = baseMapLayers[(i * 2) + 0];
            layerList.appendChild(CreateBaseMapElement(layerInfo));
        }

        if (baseMapLayers[(i * 2) + 1]) {
            layerInfo = baseMapLayers[(i * 2) + 1];
            layerList.appendChild(CreateBaseMapElement(layerInfo));
        }
    }
	var x = dojo.byId("imgThumbNail" + baseMapLayers[0].Key);
    dojo.addClass(x, "selectedBaseMap");
    dojo.addClass(dojo.byId("spanBaseMapText" + baseMapLayers[0].Key), "selectedBaseMap");
    dojo.attr(x, "alt", x.alt + " active");
}

//Create elements to toggle the maps

function CreateBaseMapElement(baseMapLayerInfo) {
    var divContainer = dojo.create("div");
    divContainer.className = "baseMapContainerNode";
    var imgThumbnail = dojo.create("img");
    imgThumbnail.src = baseMapLayerInfo.ThumbnailSource;
    imgThumbnail.className = "basemapThumbnail";
    imgThumbnail.id = "imgThumbNail" + baseMapLayerInfo.Key;
    imgThumbnail.setAttribute("layerId", baseMapLayerInfo.Key);
    imgThumbnail.onclick = function () {
        ChangeBaseMap(this);
        ShowBaseMaps();
    };
	//CanAccess
	dojo.attr(imgThumbnail,"tabindex","-1");
	dojo.attr(imgThumbnail,"alt",baseMapLayerInfo.Name + " base map");
	dojo.connect(imgThumbnail,"onkeyup", function (evt) {
		var kc = evt.keyCode
		if (kc == dojo.keys.ENTER || kc == dojo.keys.SPACE) {
			ChangeBaseMap(this);
		}
	});
	
    var spanBaseMapText = dojo.create("span");
    spanBaseMapText.id = "spanBaseMapText" + baseMapLayerInfo.Key;
    spanBaseMapText.className = "basemapLabel";
    spanBaseMapText.innerHTML = baseMapLayerInfo.Name;
    divContainer.appendChild(imgThumbnail);
    divContainer.appendChild(spanBaseMapText);
    return divContainer;
}

//Toggle Basemap

function ChangeBaseMap(spanControl) {
    HideMapLayers();
    var key = spanControl.getAttribute('layerId');
    for (var i = 0; i < baseMapLayers.length; i++) {
		var x = dojo.byId("imgThumbNail" + baseMapLayers[i].Key);
        dojo.removeClass(x, "selectedBaseMap");
		dojo.removeClass(dojo.byId("spanBaseMapText" + baseMapLayers[i].Key), "selectedBaseMap");
		dojo.attr(x, "alt", x.alt.split(" active")[0]);
        if (dojo.isIE) {
            dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginTop = "0px";
            dojo.byId("imgThumbNail" + baseMapLayers[i].Key).style.marginLeft = "0px";
            dojo.byId("spanBaseMapText" + baseMapLayers[i].Key).style.marginTop = "0px";
        }
        if (baseMapLayers[i].Key === key) {
            dojo.addClass(dojo.byId("imgThumbNail" + baseMapLayers[i].Key), "selectedBaseMap");
			dojo.addClass(dojo.byId("spanBaseMapText" + baseMapLayers[i].Key), "selectedBaseMap");
			dojo.attr(x, "alt", x.alt + " active");
            var layer = map.getLayer(baseMapLayers[i].Key);
            layer.show();
        }
    }
}

//Create basemap layer on map

function CreateBaseMapLayer(layerURL, layerId, isVisible) {
    var layer = new esri.layers.ArcGISTiledMapServiceLayer(layerURL, {
        id: layerId,
        visible: isVisible
    });
    return layer;
}

//Hide Layers

function HideMapLayers() {
    for (var i = 0; i < baseMapLayers.length; i++) {
        var layer = map.getLayer(baseMapLayers[i].Key);
        if (layer) {
            layer.hide();
        }
    }
}

//Animate base map panel with wipe-in and wipe-out animation

function ShowBaseMaps() {
	if (timeouts.basemap != null) {clearTimeout (timeouts.basemap); timeouts.basemap = null;}
	showHideSearch(true);
    if (dojo.coords("divAppContainer").h > 0) {
        dojo.replaceClass("divAppContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId('divAppContainer').style.height = '0px';
    }
    var cellHeight = (isTablet) ? 70 : 85;
    if (dojo.coords("divLayerContainer").h > 0) {
        dojo.replaceClass("divLayerContainer", "hideContainerHeight", "showContainerHeight");
        dojo.byId("divLayerContainer").style.height = "0px";
		//CanAccess
		document.getElementById('imgBaseMap').setAttribute("aria-expanded",false);
		dojo.forEach(dojo.query(".basemapThumbnail"), function(item,i) {
			item.tabIndex = "-1";
		});
		if (timeouts.basemap != null) {clearTimeout (timeouts.basemap); timeouts.basemap = null;}
		timeouts.basemap = setTimeout(function() {
			timeouts.basemap = null;
			dojo.byId('divLayerContainer').style.display = 'none';
		},1000);
    } else {
		dojo.byId('divLayerContainer').style.display = "block";
		document.getElementById('imgBaseMap').setAttribute("aria-expanded",true);
		dojo.forEach(dojo.query(".basemapThumbnail"), function(item,i) {
			item.tabIndex = "0";
		});
		timeouts.basemap = setTimeout(function() {
			dojo.byId('divLayerContainer').style.height = cellHeight + "px";
			dojo.byId('divLayerContentHolder').style.height = (cellHeight) + "px";
			dojo.byId('divLayerContentHolder').style.top = "0px";
			dojo.replaceClass("divLayerContainer", "showContainerHeight", "hideContainerHeight");
		},100);
    }
}
