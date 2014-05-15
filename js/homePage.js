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
dojo.require("dojo.date.locale");
dojo.require("dojo.window");
dojo.require("dojo.number");
dojo.require("dojox.mobile.parser");
dojo.require("dojox.mobile.ListItem");
dojo.require("dojox.mobile.EdgeToEdgeList");
dojo.require("esri.map");
dojo.require("esri.tasks.geometry");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.locator");
dojo.require("esri.tasks.route");
dojo.require("js.Config");
dojo.require("js.date");
dojo.require("mobile.InfoWindow");
dojo.require("dojo.on");
dojo.require("esri.geometry.Extent"); //CanMod: Set extent of address search
dojo.require("esri.SpatialReference"); //CanMod: Set extent of address search
dojo.require("esri.IdentityManager"); //CanMod: Use of subscription routing

/*Global variables*/
var map; //variable to store map object
var isBrowser = false; //This variable is set to true when the app is running on desktop browsers
var isiOS = false; //flag set for ios devices(ipad, iphone)
var isMobileDevice = false; //This variable is set to true when the app is running on mobile device
var isTablet = false; //This variable is set to true when the app is running on tablets
var baseMapLayers; //Variable for storing base map layers
var fontSize; //variable for storing font sizes for all devices.
var infoBoxWidth; //variable to store the width of the carousel pod
var mapPoint; //variable to store map point
var selectedGraphic = null; //variable to store selected graphics
var mapSharingOptions; //variable for storing the tiny service URL
var geometryService; //variable to store the Geometry service
var messages; //variable used for storing the error messages
var showNullValueAs; //variable to store the default value for replacing null values
var tempGraphicsLayerId = 'tempGraphicsLayerID'; //variable to store graphics layer ID
var services; //variable to store services from the config file
var numberOfServices = 0; //number of services
var routeParams; // variable for storing the route parameters
var routeLayerId = "routeLayerId"; //variable to store graphics layer ID for routing
var routeSymbol; //Symbol to mark the route.
var routeTask; //Route Task to find the route.
var routeLayer; //variable for storing the particular layer id when you click on directions button
var rendererColor; //variable to set renderer color
var holidayTable; //variable to store the holiday table configuration info
var referenceOverlayLayer; //variable to store the reference overlay layer
var intervalIDs = []; //Array of IntervalID of glow-effect.
var highlightPollLayerId = "highlightPollLayerId"; //Graphics layer object for displaying selected service
var infoWindowHeader; //variable used to store the info window header
var searchforDirections; //variable used to store directions to be displayed on map
var locatorSettings; //variable used to store address search setting
var firstClick = true; //check for the first click on the map used in order to destroy the Dom elements
var selectedMapPoint; // variable to store selected map point
var lastSearchTime; //variable for store the time of last search
var lastSearchString; //variable for store the last search string
var searchDisplayString; //variable to store the address to display in the tab
var lastSearchResults; //variable to store the last search candidates
var infoPopupHeight; //variable used for storing the info window height
var shareFlag = false; //variable to store sharing flag
var infoPopupWidth; //variable used for storing the info window width
var zoomLevel; //variable to set required zoom level.
var rippleSize; //variable to set ripple Size
var dateFormat; //variable to set the date string format
var dateLocale; //variable to set the date string locale
var callOutAddress; //variable to set Address to be displayed on mobile callout.
var featureLayerID; //variable to store ID for feature layer
var startExtent; //variable to store current extent of map
var selectedFieldName;
var timeouts = {}; //object to store timeout objects
var focus = {mapTab: false, onMap: false, mapClick: false}; //Keep track of various focus related values
var directionsLanguage; //CanMod: variable to store the language directions
var unitConfig; //CanMod: variable to store the distance unit configuration
var reverseGeocoding; //CanMod: whether or not to reverse geocode on map click
var displayedLayer = null; //CanMod: Store the key to the point layer being displayed

//This initialization function is called when the DOM elements are ready

function Init() {
    var responseObject = new js.Config();
    esri.config.defaults.io.proxyUrl = responseObject.UrlToProxy; //Setting to use proxy file
    esriConfig.defaults.io.alwaysUseProxy = false;
    esriConfig.defaults.io.timeout = 180000; //esri request timeout value
	//As of 2013, detects: Mobile: iOS/iPhone, Android Mobile, Blackberry Phone, Windows Phone, Symbian OS, Firefox OS, Opera Mini/Mobile
	//                     Tablet: iOS/iPad, Android Tablet, Blackberry Playbook, Windows RT (Microsoft Surface RT, Asus VivoTab RT, Dell XPS, Lumia Tablets...)
	//                     Browser: All others including Windows 7/8 tablets
    var userAgent = window.navigator.userAgent.toLowerCase(); //used to detect the type of devices
	if (userAgent.indexOf("ipad") >= 0) {
		isiOS = true;
        fontSize = 14;
        isTablet = true;
        dojo.byId('dynamicStyleSheet').href = "styles/tablet.css";
    } else if (userAgent.indexOf("iphone") >= 0) {
        isiOS = true;
        fontSize = 15;
        isMobileDevice = true;
        dojo.byId('dynamicStyleSheet').href = "styles/mobile.css";
    } else if (userAgent.indexOf("mobile") >= 0 || userAgent.indexOf("opera mini") >= 0 || userAgent.indexOf("opera mobi") >= 0 || userAgent.indexOf("symbian") >= 0) {
        fontSize = 15;
        isMobileDevice = true;
        dojo.byId('dynamicStyleSheet').href = "styles/mobile.css";
    } else if (userAgent.indexOf("tablet") >= 0 || /*Android not mobile*/ userAgent.indexOf("android") >= 0 || (/*Windows RT*/ userAgent.indexOf("windows") >= 0 && userAgent.indexOf("arm") >= 0)) {
        fontSize = 14;
        isTablet = true;
        dojo.byId('dynamicStyleSheet').href = "styles/tablet.css";
    } else {
        fontSize = 11;
        isBrowser = true;
        dojo.byId('dynamicStyleSheet').href = "styles/browser.css";
    }
    ShowProgressIndicator();
    dojo.byId("divSplashContainer").style.fontSize = fontSize + "px";
    var eventFired = false;

    if (!Modernizr.geolocation) {
		dojo.byId("imgGeolocate").style.display = "none"; //geo location icon is made invisible for the non supported browsers
    }
	Internationalization(false);
    Initialize(responseObject);
}

//This function is called at the initialize state

function Initialize(responseObject) {
	
    if (isMobileDevice) {
		dojo.byId('imgSearch').style.display = "inline";
		dojo.replaceClass(dojo.byId("divAddressSearch"),"searchBlock","searchInline");
		document.getElementById("searchTitle").innerHTML = responseObject.LocatorSettings.Locators[0].DisplayText;
		document.getElementById("searchTitle").style.display = "block";
        dojo.byId('divSplashScreenContent').style.width = "95%";
        dojo.byId('divSplashScreenContent').style.height = "95%";
        dojo.byId("divHeaderTitle").style.display = "none";
    } else {
		if (dojo.isIE <= 7 || isTablet) {
			dojo.byId('imgSearch').style.display = "inline";
			dojo.replaceClass(dojo.byId("divAddressSearch"),"searchBlock","searchInline");
			document.getElementById("searchTitle").innerHTML = responseObject.LocatorSettings.Locators[0].DisplayText;
			document.getElementById("searchTitle").style.display = "block";
		}
		else {
			if (dojo.isIE <=9) {
				document.getElementById("searchInput").value = responseObject.LocatorSettings.Locators[0].DisplayText;
				dojo.on.once(dojo.byId("searchInput"),"focus",function() {document.getElementById("searchInput").value = "";});
			}
			document.getElementById("searchInput").setAttribute("placeholder", responseObject.LocatorSettings.Locators[0].DisplayText);
			dojo.byId('divAddressSearch').style.display = "inline-block";
		}
        dojo.byId("imgBaseMap").style.display = "inline";
        dojo.byId('divSplashScreenContent').style.width = "350px";
        dojo.byId('divSplashScreenContent').style.height = "290px";
    }
    infoBoxWidth = responseObject.InfoBoxWidth;
    dojo.byId("divHeaderTitle").innerHTML = "<img alt='' src='" + responseObject.ApplicationIcon + "'>" + responseObject.ApplicationName;
	document.title = responseObject.WindowTitle;
    dojo.byId('divSplashContainer').innerHTML = responseObject.SplashScreenMessage;

    dojo.xhrGet({
        url: "ErrorMessages.xml",
        handleAs: "xml",
        preventCache: true,
        load: function (xmlResponse) {
            messages = xmlResponse;
        }
    });

    var infoWindow = new mobile.InfoWindow({
        domNode: dojo.create("div", null, dojo.byId("map"))
    });
	
	var zoomExtent;
	var extent = GetQuerystring('extent');

	if (extent !== "") {
		zoomExtent = extent.split(',');
	} else {
		zoomExtent = responseObject.DefaultExtent.split(",");
	}

	if (zoomExtent[3].split("$point=").length > 0) {
		zoomExtent[3] = zoomExtent[3].split("$point=")[0];
	}
	
	map = new esri.Map("map", {
        slider: true,
        infoWindow: infoWindow,
		extent: new esri.geometry.Extent({
			xmin:Math.min(zoomExtent[0],zoomExtent[2]),
			ymin:Math.min(zoomExtent[1],zoomExtent[3]),
			xmax:Math.max(zoomExtent[0],zoomExtent[2]),
			ymax:Math.max(zoomExtent[1],zoomExtent[3]),
			spatialReference:{wkid:102100}
		})
    });

    ShowProgressIndicator();
    geometryService = new esri.tasks.GeometryService(responseObject.GeometryService);
    baseMapLayers = responseObject.BaseMapLayers;
    mapSharingOptions = responseObject.MapSharingOptions;
    showNullValueAs = responseObject.ShowNullValueAs;
    services = responseObject.Services;
    searchforDirections = responseObject.SearchforDirections;
	holidayTable = responseObject.HolidayTable;
    rendererColor = responseObject.RendererColor;
    rippleSize = responseObject.RippleSize;
	dateFormat = responseObject.DateFormat;
	dateLocale = responseObject.DateLocale;
    referenceOverlayLayer = responseObject.ReferenceOverlayLayer;
    infoPopupFieldsCollection = responseObject.InfoPopupFieldsCollection;
    infoPopupWidth = responseObject.InfoPopupWidth;
    infoPopupHeight = responseObject.InfoPopupHeight;
    callOutAddress = responseObject.CallOutAddress;
    locatorSettings = responseObject.LocatorSettings;
    zoomLevel = responseObject.ZoomLevel;
    routeSymbol = new esri.symbol.SimpleLineSymbol().setColor(responseObject.RouteColor).setWidth(responseObject.RouteWidth);
	directionsLanguage = responseObject.DirectionsLanguage;
	unitConfig = responseObject.UnitConfig;
	reverseGeocoding = responseObject.ReverseGeocoding;
    CreateBaseMapComponent();
    if (!isMobileDevice) {
        CreateCarousel();
    }
	dojo.connect(map, "onExtentChange", function (evt) {
        if (dojo.coords("divAppContainer").h > 0) {
            ShareLink(false);
        }
        if (selectedGraphic) {
            var screenPoint = map.toScreen(selectedGraphic);
            screenPoint.y = map.height - screenPoint.y;
            setTimeout(function () {
                map.infoWindow.setLocation(screenPoint);
            }, 700);
            return;
        }
    });

    dojo.connect(dojo.byId('imgHelp'), "onclick", function () {
        window.open(responseObject.HelpURL);
    });
	
	//CanAccess
	dojo.connect(dojo.byId('imgHelp'), "onkeydown", function (evt) {
		var kc = evt.keyCode;
		if (kc == dojo.keys.ENTER || kc == dojo.keys.SPACE) {
			window.open(responseObject.HelpURL);
		}
	});	
	
	if (responseObject.LanguageButton.Enabled && !isMobileDevice) {
		var langB = document.getElementById("imgLang");
		langB.src = responseObject.LanguageButton.Image;
		langB.alt = responseObject.LanguageButton.Title;
		langB.title = responseObject.LanguageButton.Title;
		
		dojo.connect(langB, "onclick", function() {
			window.location.href = responseObject.LanguageButton.AppURL;
		});
		dojo.connect(langB, "onkeydown", function (evt) {
			var kc = evt.keyCode;
			if (kc == dojo.keys.ENTER || kc == dojo.keys.SPACE) {
				window.location.href = responseObject.LanguageButton.AppURL;
			}
		});
		
		langB.style.display = "inline";
	}
	
	//------On Map Load------
    dojo.connect(map, "onLoad", function () {
        dojo.byId("divInfowindowContent").style.display = "block";
        
		MapInitFunction();
		//CanMod: Login to AGOL Subscription for Routing Service
		//Function called if token request suceeds, build object with token and gives to Identity Manager, continues map initialization
		function tokenObtained(response) {
			var params = {server:"http://www.arcgis.com/sharing/rest",ssl:false}
			params.token = response.access_token;
			params.expire = response.expires_in;
			params.userId = responseObject.ArcGISOnlineClientID;
			esri.id.registerToken(params);
			PostInitialization(responseObject,extent,zoomExtent);
			Internationalization(true); //CanMod: Launch the internationalization function in internationalization.js along with the code block
		}
		
		//Function called if token request fails, disables routing and continue map initialization
		function tokenRequestFailed(response) {
			console.error("ArcGIS Online Account Token Request Failed - Routing Disabled",response);
			searchforDirections = false;
			PostInitialization(responseObject,extent,zoomExtent);
			Internationalization(true);
		}
		
		//If a client ID is defined in config file, send request to proxy for a token
		if (responseObject.ArcGISOnlineClientID != "") {
			var curURL = responseObject.UrlToProxy;
			esri.request({
				url: curURL + "?OAuth2&appID=" + responseObject.ArcGISOnlineClientID,
				handleAs: "json",
				load: tokenObtained,
				error: tokenRequestFailed
			});
		}
		
		//If no client ID is defined in config file, disable routing and continue map initialization
		else {
			if (responseObject.RouteServiceURL == "") {
				searchforDirections = false;
			}
			PostInitialization(responseObject,extent,zoomExtent);
			Internationalization(true);
		}
	});
}
		
function PostInitialization(responseObject,extent,zoomExtent) {
    if (searchforDirections) {
        routeTask = new esri.tasks.RouteTask(responseObject.RouteServiceURL);
		dojo.connect(routeTask, "onSolveComplete", ShowRoute);
		dojo.connect(routeTask, "onError", ErrorHandler);
    }
	var url = esri.urlToObject(window.location.toString());
	if (extent !== "") {
		if (window.location.toString().split("$point=").length > 1) {
			if (window.location.toString().split("$point=")[1].split("$selectedPod=").length >= 1) {
				if (window.location.toString().split("$point=")[1].split("$selectedPod=")[1]) {
					mapPoint = new esri.geometry.Point(window.location.toString().split("$point=")[1].split(",")[0], window.location.toString().split("$point=")[1].split("$selectedPod=")[0].split(",")[1], map.spatialReference);
					if (isMobileDevice) {
						shareFlag = true;
						CreateCarousel();
						GetServices(mapPoint, true);
					}
					else {
						shareFlag = true;
						GetServices(mapPoint, true);
					}
				} else {
					mapPoint = new esri.geometry.Point(Number(window.location.toString().split("$point=")[1].split(",")[0]), Number(window.location.toString().split("$point=")[1].split(",")[1]), map.spatialReference);
					if (isMobileDevice) {
						CreateCarousel();
					}
					GetServices(mapPoint, true);
				}
			}
		}
	}
	startExtent = new esri.geometry.Extent(parseFloat(zoomExtent[0]), parseFloat(zoomExtent[1]), parseFloat(zoomExtent[2]), parseFloat(zoomExtent[3]), map.spatialReference);
	map.setExtent(startExtent);
	//CanAccess: keyboard navigation inteferes with accessibility when map isn't focused
	map.disableKeyboardNavigation();
	document.getElementById("map_gc").setAttribute("focusable",false);
	//Detect when tabbing over to map
	dojo.on(dojo.byId("accessForward"),"focus",tabToMap);
	dojo.on(dojo.byId("accessBackward"),"focus",tabToMap);
	function tabToMap(evt) {
		focus.mapTab = true;
		document.getElementById("map").focus();
	}
	
	//Activate/deactivate custom keyboard navigation
	dojo.on(dojo.byId("map"),"mousedown",function(evt){
		document.getElementById("map").focus();
		evt.preventDefault();
		focus.mapClick = true;
		setTimeout(function() {focus.mapClick = false;},500);
	});
	dojo.on(dojo.byId("map"),"focus",function(evt){
		document.getElementById("accessForward").setAttribute("tabIndex","-1");
		document.getElementById("accessBackward").setAttribute("tabIndex","-1");
		focus.onMap = true;
		if (focus.mapTab && dojo.isIE <= 8) {
			focus.mapTab = false;
		}
		else if (focus.mapTab) {
			document.getElementById("crosshair").style.display = "block";
			centerCrossHair();
			document.getElementById("mapNavigation").style.display = "block";
		}
	});
	dojo.connect(dojo.byId("map"),"onblur",function(evt){
		if (dojo.isIE <= 7 && focus.mapClick) {document.getElementById("map").focus();return;}
		focus.mapTab = false;
		focus.onMap = false;
		document.getElementById("crosshair").style.display = "none";
		document.getElementById("mapNavigation").style.display = "none";
		document.getElementById("accessForward").setAttribute("tabIndex","0");
		document.getElementById("accessBackward").setAttribute("tabIndex","0");
	});
	//Custom Keyboard Navigation
	esriConfig.defaults.map.panDuration = 0;
	dojo.on(dojo.byId("map"),"keydown",function(evt){
		if (!focus.onMap) {return;}
		kc = evt.keyCode;
		var zooms = [1565430,782715,391357,195678,97839,48919,24459,12229,6114,3057,1528,764,382,191,95,47,24,12,6,3];
		if (kc == dojo.keys.NUMPAD_PLUS) {map.setLevel(map.getLevel() + 1);}
		else if (kc == dojo.keys.NUMPAD_MINUS) {map.setLevel(map.getLevel() - 1);}
		else {
			var dx = 0;
			var dy = 0;
			var lv = map.getLevel();
			if (dojo.indexOf([dojo.keys.RIGHT_ARROW,dojo.keys.PAGE_UP,dojo.keys.PAGE_DOWN,dojo.keys.NUMPAD_6,dojo.keys.NUMPAD_9,dojo.keys.NUMPAD_3],kc) >= 0) {
				dx = zooms[lv];
			}
			else if (dojo.indexOf([dojo.keys.LEFT_ARROW,dojo.keys.HOME,dojo.keys.END,dojo.keys.NUMPAD_4,dojo.keys.NUMPAD_7,dojo.keys.NUMPAD_1],kc) >= 0) {
				dx = zooms[lv] * -1;
			}
			if (dojo.indexOf([dojo.keys.UP_ARROW,dojo.keys.HOME,dojo.keys.PAGE_UP,dojo.keys.NUMPAD_8,dojo.keys.NUMPAD_7,dojo.keys.NUMPAD_9],kc) >= 0) {
				dy = zooms[lv];
			}
			else if (dojo.indexOf([dojo.keys.DOWN_ARROW,dojo.keys.END,dojo.keys.PAGE_DOWN,dojo.keys.NUMPAD_2,dojo.keys.NUMPAD_1,dojo.keys.NUMPAD_3],kc) >= 0) {
				dy = zooms[lv] * -1;
			}
			map.setExtent(map.extent.offset(dx,dy));
		}
	});
	//CanAccess: Keyboard click on map
	dojo.on(dojo.byId("map"),"keyup",function(evt){
		if (focus.mapTab && focus.onMap && evt.keyCode == 13) {
			document.getElementById("crosshair").style.display = "none";
			var screenCoords = map.toScreen(map.extent.getCenter());
			var centerObject = document.elementFromPoint(screenCoords.x,screenCoords.y);
			HideInformationContainer();
			//Click on the map
			if (centerObject.id == "map_gc" || centerObject.className == "layerTile") {
				//If points are displayed, check if a point is under the crosshair
				if (displayedLayer != null && map.getLayer(displayedLayer).visible) {
					var extentGeom = pointToExtent(map,map.extent.getCenter(),10);
					xExtent = extentGeom;
					var filteredGraphics = dojo.filter(map.getLayer(displayedLayer).graphics, function(graphic) {
						return extentGeom.contains(graphic.geometry);
					})
				}
				if (filteredGraphics && filteredGraphics.length > 0) {
					ShowInfoWindow(filteredGraphics[0].attributes,filteredGraphics[0].geometry,map.getLayer(displayedLayer),displayedLayer);
				}
				//No points under crosshair, select location under crosshair as users location
				else {
					var evt2 = {mapPoint: map.extent.getCenter()};
					showHideSearch(true);GetServices(evt2);
				}
			}
			document.getElementById("crosshair").style.display = "block";
		}
	});
	//Center Crosshaire
	function centerCrossHair() {
		var crossBox = dojo.getContentBox(dojo.byId("crosshair"));
		var center = map.toScreen(map.extent.getCenter());
		dojo.byId("crosshair").style.top = String(center.y - (crossBox.h/2)) + "px";
		dojo.byId("crosshair").style.left = String(center.x - (crossBox.w/2)) + "px";
	}
	centerCrossHair();
	dojo.on(map,'resize',centerCrossHair);
}

//initialize map

function MapInitFunction() {
    if (dojo.query('.logo-med', dojo.byId('map')).length > 0) {
        dojo.query('.logo-med', dojo.byId('map'))[0].id = "imgesriLogo";
    } else if (dojo.query('.logo-sm', dojo.byId('map')).length > 0) {
        dojo.query('.logo-sm', dojo.byId('map'))[0].id = "imgesriLogo";
    }
    dojo.addClass("imgesriLogo", "esriLogo");
    var gLayer = new esri.layers.GraphicsLayer();
    gLayer.id = tempGraphicsLayerId;
    map.addLayer(gLayer);

    gLayer = new esri.layers.GraphicsLayer();
    gLayer.id = highlightPollLayerId;
    map.addLayer(gLayer);

	var repentignyMap = new esri.layers.ArcGISTiledMapServiceLayer("http://tiles.arcgis.com/tiles/8Pk4EchG5TkSh4AO/arcgis/rest/services/Carte_de_Base_Repentigny_juillet2013_v3/MapServer");
	repentignyMap.id="repentignyMap";
    map.addLayer(repentignyMap);
	
    routeParams = new esri.tasks.RouteParameters();
    routeParams.stops = new esri.tasks.FeatureSet();
    routeParams.returnRoutes = false;
	//CanMod: Determine unit type from config file
	if (unitConfig.DirectionsLengthUnit == "KM") {routeParams.directionsLengthUnits = esri.Units.KILOMETERS;;}
	else {routeParams.directionsLengthUnits = esri.Units.MILES;}
	routeParams.directionsLanguage = directionsLanguage; //CanMod: Directions Language now set by parameter in config.js
    routeParams.returnDirections = true;
    routeParams.outSpatialReference = map.spatialReference;

    routeLayer = new esri.layers.GraphicsLayer();
    routeLayer.id = routeLayerId;
    map.addLayer(routeLayer);

    dojo.byId('divSplashScreenContainer').style.display = "table";
    dojo.replaceClass("divSplashScreenContent", "showContainer", "hideContainer");
    SetHeightSplashScreen();

    if (referenceOverlayLayer.DisplayOnLoad) {
        var overlaymap;
        var layerType = referenceOverlayLayer.ServiceUrl.substring(((referenceOverlayLayer.ServiceUrl.lastIndexOf("/")) + 1), (referenceOverlayLayer.ServiceUrl.length));
        if (!isNaN(layerType)) {
            overlaymap = new esri.layers.FeatureLayer(referenceOverlayLayer.ServiceUrl, {
                mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
                outFields: ["*"]
            });
            map.addLayer(overlaymap);
        } else {
            var url1 = referenceOverlayLayer.ServiceUrl + "?f=json";
            esri.request({
                url: url1,
                handleAs: "json",
                load: function (data) {
                    if (!data.singleFusedMapCache) {
                        var imageParameters = new esri.layers.ImageParameters();
                        //Takes a URL to a non cached map service.
                        overlaymap = new esri.layers.ArcGISDynamicMapServiceLayer(referenceOverlayLayer.ServiceUrl, {
                            "imageParameters": imageParameters
                        });
                        map.addLayer(overlaymap);
                    } else {
                        overlaymap = new esri.layers.ArcGISTiledMapServiceLayer(referenceOverlayLayer.ServiceUrl);
                        map.addLayer(overlaymap);
                    }
                }
            });
        }
    }
    window.onresize = function () {
        if (!isMobileDevice) {
            ResizeHandler();
            ResetSlideControls();
        } else {
            orientationChanged();
        }
    };
	if (dojo.isIE <= 8) {
		document.getElementById("map").style.height = String(document.body.clientHeight - 45) + "px";
	}
	map.resize();
    HideProgressIndicator();
    if (!isMobileDevice) {
        dojo.connect(map, "onClick", function(evt) {showHideSearch(true);GetServices(evt);});
    } else {
        dojo.connect(map, "onClick", function (evt) {
			showHideSearch(true);
            map.infoWindow.hide();
            mapPoint = null;
            selectedGraphic = null;
            CreateCarousel();
            GetServices(evt);
        });
    }
    for (var i in services) {
		var featureLayer;
		if (!services[i].distance) {
			featureLayer = CreateFeatureLayerSelectionMode(services[i].ServiceUrl, i, '*', services[i].Color, services[i].HasRendererImage, services[i].isRendererColor);
		} else {
			featureLayer = CreatePointFeatureLayer(services[i].ServiceUrl, i, '*', services[i].Image, services[i].HasRendererImage,services[i].ShowBeyondBuffer);
		}
		map.addLayer(featureLayer);
    }
}

//Get services on map

function GetServices(evt, share) {
    newLeft = 0;
    if (!isMobileDevice) {
        dojo.byId("divCarouselDataContent").style.left = "0px";
        ResetSlideControls();
        map.infoWindow.hide();
        mapPoint = null;
        selectedGraphic = null;
    } else {
        if (!firstClick) {
            RemoveChildren(dojo.byId('divRepresentativeDataContainer'));
            dojo.byId('goBack').style.display = "none";
            dojo.byId('getDirection').style.display = "none";
            for (var i in services) {
                var thisDijit = dijit.byNode(dojo.byId("li_" + i));
                thisDijit.destroy();
            }
        }
        firstClick = false;
    }
    if (share) {
        map.getLayer(tempGraphicsLayerId).clear();
        mapPoint = new esri.geometry.Point(evt.x, evt.y, map.spatialReference);
        map.centerAndZoom(mapPoint, zoomLevel);
        SelectedPointAddress();
    } else {
        if (evt) {
            map.getLayer(tempGraphicsLayerId).clear();
            mapPoint = new esri.geometry.Point(evt.mapPoint.x, evt.mapPoint.y, map.spatialReference);
            map.centerAndZoom(mapPoint, zoomLevel);
			SelectedPointAddress();
        }
    }
    ShowProgressIndicator();
    QueryService(mapPoint);
    if (isMobileDevice) {
        CallOutAddressDisplay(evt);
        CreateListLayOut();
    }
}

//Reverse geocoding to display address in mobile mode

function CallOutAddressDisplay(evt) {
	function successfulReverseMb(candidate) {
        if (candidate.address) {
            var infoData = new esri.Graphic(candidate.location, candidate.address, infoTemplate).symbol.Street;
            if (infoData !== null) {
                infoContent = dojo.string.substitute(infoData).trimString(16);
                map.infoWindow.setContent(infoContent);
                dojo.byId("tdListHeader").innerHTML = infoContent;
            } else {
                infoData = showNullValueAs;
                infoContent = dojo.string.substitute(infoData).trimString(16);
                map.infoWindow.setContent(infoContent);
                dojo.byId("tdListHeader").innerHTML = infoContent;
            }
        }
    }
	function failedReverseMb(error) {
		map.infoWindow.setContent(locatorSettings.GenericLocationName);
		dojo.byId("tdListHeader").innerHTML = "";
	}
	if (reverseGeocoding) {
		var locator = new esri.tasks.Locator(locatorSettings.Locators[0].LocatorURL);
		if (evt) {
			locator.locationToAddress(mapPoint, 100,successfulReverseMb,failedReverseMb);
		} else {
			locator.locationToAddress(mapPoint, 1,successfulReverseMb,failedReverseMb);
		}
	}
	else {
		failedReverseMb(null);
	}
    var infoTemplate = new esri.InfoTemplate(intl.location, callOutAddress);
}

//Reverse geocoding to get address

function SelectedPointAddress() {
	function successfulReverse(candidate) {
		if (candidate.address) {
			var symbol = new esri.symbol.PictureMarkerSymbol(locatorSettings.LocatorMarkupSymbolPath, locatorSettings.MarkupSymbolSize.width, locatorSettings.MarkupSymbolSize.height, locatorSettings.MarkupSymbolSize.width, locatorSettings.MarkupSymbolSize.height);
			var addValue = "";
			dojo.forEach(locatorSettings.Locators[0].GeocodeDisplayFields, function(item,i) {
				if (candidate.address[item] && candidate.address[item] != "") {
					if (addValue != "") {addValue += ", ";}
					addValue += candidate.address[item];
				}
			});
			if (addValue == "") {addValue = locatorSettings.GenericLocationName;}
			attr = {Address: addValue};
			var graphic = new esri.Graphic(mapPoint, symbol, attr, null);
			map.getLayer(tempGraphicsLayerId).add(graphic);
			document.getElementById("divAddress").innerHTML = addValue;
		}
		else {
			failedReverse(null);
		}
	}
	function failedReverse(error) {
		console.warn("Reverse geocoding unsucessful or not enabled");
		var symbol = new esri.symbol.PictureMarkerSymbol(locatorSettings.LocatorMarkupSymbolPath, locatorSettings.MarkupSymbolSize.width, locatorSettings.MarkupSymbolSize.height, locatorSettings.MarkupSymbolSize.width, locatorSettings.MarkupSymbolSize.height);
		attr = {Address: locatorSettings.GenericLocationName};
		var graphic = new esri.Graphic(mapPoint, symbol, attr, null);
		map.getLayer(tempGraphicsLayerId).add(graphic);
		document.getElementById("divAddress").innerHTML = locatorSettings.GenericLocationName;
	}
	if (reverseGeocoding) {
		var locator = new esri.tasks.Locator(locatorSettings.Locators[0].LocatorURL);
		locator.locationToAddress(mapPoint, 100,successfulReverse,failedReverse);
	}
	else {
		failedReverse(null);
	}
}

dojo.addOnLoad(Init);