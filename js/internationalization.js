//ENGLISH
/**
 |
 | ArcGIS for Canadian Municipalities / ArcGIS pour les municipalités canadiennes
 | My Municipal Government Services v10.2.0.1 / Mes services municipaux v10.2.0.1
 | This file was written by Esri Canada - Copyright 2013 Esri Canada
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
 
INTERNATIONALIZATION FILE: Changes hard-coded text in the web application.
**/
var intl = {};

function Internationalization(run) {
	//The following values along with those found in the config.js file can be changed to alter the text displayed in the application
	
	//Variatious buttons
	var splashscreenButton = "OK";
	var addressSearchTooltip = "Search by Address";
	var geolocateTooltip = "Geolocation";
	var basemapTooltip = "Switch Base Maps";
	var shareTooltip = "Share";
	var shareTitle = "Share this map";
	var shareFacebook = "Share on Facebook";
	var shareTwitter = "Share on Twitter";
	var shareEmail = "Share by Email";
	var helpTooltip = "Help";
	var closePopupTooltip = "Close Popup Window";
	intl.hidePanel = "Hide Panel";
	intl.showPanel = "Show Panel";
	
	//Mobile Info Windows
	intl.location = "Location";
	intl.address = "Address";
	
	//Directions labels
	intl.directionsTooltip = "Get directions";
	intl.directionsTo = "Directions to";
	intl.directionsBack = "Back to information";
	intl.totalDist = "Total Distance:";
	intl.duration = "Duration:";
	intl.seconds = "seconds(s)";
	intl.minutes = "minute(s)";
	intl.hours = "hours(s)";
	
	//Service Schedules
	intl.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	intl.terms = ["and","1st","2nd","3rd","4th","5th","th","Week","of the month","day of each month"];
	
	//Keyboard-Map Navigation (only visible when accessing map with keyboard)
	var kmnTitle = "Map-Keyboard Navigation";
	var kmnAlt = "Layout of Keyboard Numpad";
	var kmnCaption = "To navigate the map with a keyboard, use the numeric keypad. Use the <strong>numeric</strong> keys to pan the map, the <strong>plus</strong> key to zoom-out, and the <strong>enter</strong> key to click in the location of the crosshair.";
	
	//Accessibility labels for the screen-readers
	var closeSplashscreen = "Close the splash screen";
	var mapInfo = "Map of area & services. The information also available in textual format after searching for an address.";
	intl.toggle = "Display or hide the results";

	//----DO NOT CHANGE CODE BELOW--------------------------------------------------------------------
	if (run) { //Will only execute after all other initialization code (one of the variables set above is require before the initialization code)
		//index.htm
		dojo.byId("closeSplash").setAttribute("aria-label",closeSplashscreen);
		dojo.byId("closeSplash").innerHTML = splashscreenButton;
		dojo.byId("imgSearch").title = addressSearchTooltip;
		dojo.byId("imgSearch").alt = addressSearchTooltip;
		dojo.byId("searchInput").setAttribute("aria-label",addressSearchTooltip);
		dojo.byId("imgGeolocate").title = geolocateTooltip;
		dojo.byId("imgGeolocate").alt = geolocateTooltip;
		dojo.byId("imgBaseMap").title = basemapTooltip;
		dojo.byId("imgBaseMap").alt = basemapTooltip;
		dojo.byId("imgShare").title = shareTooltip;
		dojo.byId("imgShare").alt = shareTooltip;
		dojo.byId("imgHelp").title = helpTooltip;
		dojo.byId("imgHelp").alt = helpTooltip;
		dojo.byId("imgFacebook").alt = shareFacebook;
		dojo.byId("imgFacebook").title = shareFacebook;
		dojo.byId("imgTwitter").title = shareTwitter;
		dojo.byId("imgTwitter").alt = shareTwitter;
		dojo.byId("imgMail").title = shareEmail;
		dojo.byId("imgMail").alt = shareEmail;
		dojo.byId("shareTitle").innerHTML = shareTitle;
		dojo.byId("popupClose").title = closePopupTooltip;
		dojo.byId("popupClose").alt = closePopupTooltip;
		dojo.query("#mapNavigation strong")[0].innerHTML = kmnTitle;
		dojo.query("#mapNavigation img")[0].alt = kmnAlt;
		dojo.query("#mapNavigation figcaption")[0].innerHTML = kmnCaption;
		dojo.byId("map").setAttribute("aria-label",mapInfo);
	}
}