//Français
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
	//Les valeurs suivantes ainsi que ceux du fichier config.js et errorMessages.xml peuvent êtres changés afin de modifier le texte fixe de l'application
	
	//Boutons divers
	var splashscreenButton = "OK"; //Bouton de l'écran de garde
	var addressSearchTooltip = "Rechercher par adresse"; //Infobulle recherche par adresse
	var geolocateTooltip = "Géolocalisation"; //Infobulle géolocalisation
	var basemapTooltip = "Changer le fond de carte"; //Infobulle fond de carte
	var shareTooltip = "Partager"; //Infobulle partager
	var shareTitle = "Partager cette carte"; //Titre partager
	var shareFacebook = "Partager sur Facebook"; //Partager Facebook
	var shareTwitter = "Partager sur Twitter"; //Partager Twitter
	var shareEmail = "Partager par courriel"; //Partager courriel
	var helpTooltip = "Aide"; //Infobulle Aide
	var closePopupTooltip = "Fermer la fenêtre contextuelle"; //Infobulle fermer la fenêtre contextuelle
	intl.hidePanel = "Cacher le panneau"; //Cacher panneau
	intl.showPanel = "Afficher le panneau"; //Afficher panneau
	
	//Fenêtres infos pour mobile
	intl.location = "Position"; //position
	intl.address = "Adresse"; //adresse
	
	//Étiquettes pour l'itinéraire
	intl.directionsTooltip = "Obtenir un itinéraire"; //Infobulle itinéraire
	intl.directionsTo = "Destination:"; //Infobulle itinéraire vers
	intl.directionsBack = "Retourner à l'information"; //Itinéraire retour
	intl.totalDist = "Distance:"; //Distance totale
	intl.duration = "Durée:"; //Durée
	intl.seconds = "secondes(s)"; //secondes
	intl.minutes = "minute(s)"; //minutes
	intl.hours = "heure(s)"; //heures
	
	//Horraire des services
	intl.weekdays = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]; //jours de la semaine
	intl.terms = ["et","1er","2e","3e","4e","5e","e","Semaine","du mois","jour de chaque mois"]; //terminologie
	
	//Naviguation de la carte avec le clavier (n'est visible que lorsque la carte est accédé avec le clavier)
	var kmnTitle = "Naviguer la carte avec le clavier"; //Titre
	var kmnAlt = "Disposition du pavé numérique"; //Text alternatif
	var kmnCaption = "Pour naviguer la carte avec le clavier, utilisez le pavé numérique. Utilisez les touches <strong>numériques</strong> afin de déplacer la carte, <strong>plus</strong> afin de faire un zoom-avant, <strong>moins</strong> afin de faire un zoom-arrière et <strong>Retour</strong> afin de faire un clique sur la carte à l'endroit du réticule."; //sous-titre
	
	//Étiquette d'accès pour les lecteures d'écrans
	var closeSplashscreen = "Fermer la fenêtre de garde"; //Fermer l'écran de garde
	var mapInfo = "Carte des services de la région. L'information est aussi disponible en format textuel après avoir faite une recherche par adresse."; //Info de la carte
	intl.toggle = "Afficher ou cacher les résultats"; //Afficher/cacher

	//----NE PAS CHANGER LE CODE CI_DESSOUS--------------------------------------------------------------------
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