/*global dojo */
//Français
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
dojo.provide("js.Config");
dojo.declare("js.Config", null, {

    // Ce fichier contient divers options permettant de configurer l'application Mes services municipaux
    //
    // Utilisez ce fichier afin de configurer:
    //
    // 1.  Le titre de l'application                       - [ Balise(s) HTML: ApplicationName, WindowTitle ]
    // 2.  Le chemin vers l'icône                          - [ Balise(s) HTML: ApplicationIcon ]
    // 3.  Le message de l'écran de garde                  - [ Balise(s) HTML: SplashScreenMessage ]
    // 4.  L'URL pour la page d'aide                       - [ Balise(s) HTML: HelpURL ]
    //
    // 5.  Les URL pour les fonds de carte                 - [ Balise(s) HTML: BaseMapLayers ]
    // 6.  L'étendue initiale de la carte                  - [ Balise(s) HTML: DefaultExtent ]
    //
    // 7. Les fenêtres infos                               - [ Balise(s) HTML: InfoWindowHeader ]
    // 8. Les fenêtres contextuelles                       - [ Balise(s) HTML: InfoPopupHeight, InfoPopupWidth ]
    //
    // 9a. La recherche par addresse                       - [ Balise(s) HTML: LocatorSettings ]
	// 9b. Activer/désactiver le géocodage inverse         - [ Balise(s) HTML: ReverseGeocoding ]
    //
    // 10. L'URL pour le service de géométrie              - [ Balise(s) HTML: GeometryService ]
    //
    // 12. Les options de routage et de l'itinéraire       - [ Balise(s) HTML: RouteServiceURL, ArcGISOnlineClientID, UrlToProxy, RouteColor, RouteWidth,
	//                                                                        SearchforDirections, UnitConfig]
    //
    // 13. Les données dans le base de page et la couche de recouvrement
    //                                                     - [ Balise(s) HTML: InfoBoxWidth, Services, HolidayTable, ReferenceOverlayLayer]
    //
	// 14. Le niveau de zoom, les étiquettes d'adresse, les couleures, la taille l'anneau, le format de la date
    //                                                     - [ Balise(s) HTML: Zoom level, CallOutAddress, RendererColor, RippleSize, DateFormat, DateLocale]
	//
	// 15. Le bouton à bascule de la langue                - [ Balise(s) HTML: LanguageButton ]
    //
    // 16. Les URL pour le partage des cartes              - [ Balise(s) HTML: FacebookShareURL, TwitterShareURL, ShareByMailLink ]
    // 16a.L'URL pour le service TinyURL                   - [ Balise(s) HTML: MapSharingOptions (set TinyURLServiceURL, TinyURLResponseAttribute) ]
    // 16b.Les options de partage                          - [ Balise(s) HTML: TwitterStatus, TwitterHashtag, TwitterFollow, EmailSubject ]
    // 16c.L'URL des réseaux sociaux                       - [ Balise(s) HTML: FacebookShareURL, TwitterShareURL ]

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION GÉNÉRALE
    // ------------------------------------------------------------------------------------------------------------------------
    // Titre de l'application
    ApplicationName: /*Nom de l'application*/ "Mes services municipaux",
	WindowTitle: /*Titre de la fenêtre*/ "Mes services municipaux",
	//Afin de satisfaire les normes WCAG 2.0 concernant l'accès, le titre de l'application doit aussi être spécifié dans index.htm

    // Chemin vers l'icône de l'application
    ApplicationIcon: "images/appIcon.png",

    // Contenu de l'écran de garde (l'écran qui s'affiche lors du lancement de l'application)
    SplashScreenMessage: "<strong>Mes services municipaux</strong><br><hr><br>L’application <strong>Mes services municipaux</strong> permet aux résidents de localiser une installation du gouvernement ainsi que d’obtenir les horaire de la collecte des ordures.<br><br>Afin d’afficher cet information, saisissez une adresse dans la barre de recherche, cliquez sur votre position sur la carte ou utilisez votre position actuelle (bouton). Votre position sera mise en évidence sur la carte et l’information au sujet des services sera affichée au bas de la page.<br><br>",

    // L'URL de la page/du portail d'aide
    HelpURL: "help.htm",

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DES FONDS DE CARTE
    // ------------------------------------------------------------------------------------------------------------------------
    // Configurez les couches de fond de carte
    // NB: Tous les cartes de fond doivent avoir la même référence spatiale. Par default, l'application affiche le premier fond de carte.
    BaseMapLayers: [{ /*Couches de fond de carte*/
        Key: /*Clef*/ "topographic",
        ThumbnailSource: /*Imagette*/ "images/basemap_topo.png",
        Name: /*Nom*/ "Topographique",
		MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
    }, {
        Key: /*Clef*/ "imagery",
        ThumbnailSource: /*Imagette*/ "images/basemap_imagery.png",
        Name: /*Nom*/ "Imagerie",
        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    }],

    // Étendu initiale de la carte. Utilisez une virgule afin de séparer chaque valeur (ne supprimez pas la dernière virgule).
	// Les coordonnées devraient être en mètres WGS84 Web Mercator. (gauche, haut, droite, bas)
    DefaultExtent: "-8846570,5405896,-8824595,5436318",


    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DES FENÊTRES CONTEXTUELLES
    // ------------------------------------------------------------------------------------------------------------------------
    // La fenêtre contextuelle est affiché lorsqu'un point est sélectionné sur la carte

    //Champ utilisé pour le titre de la fenêtre contextuelle mobile
    InfoWindowHeader: "NAME",

    //Configurez la taille maximal de la fenêtre contextuelle en pixels
    //Hauteur: minimum de 200
    InfoPopupHeight: 200,

    //Largeur: minimum de 300
    InfoPopupWidth: 300,

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DE LA RECHERCHE PAR ADRESSE
    // ------------------------------------------------------------------------------------------------------------------------
    
	// Configurez les paramètres du service localisateur d'adresse
    LocatorSettings: {
        LocatorMarkupSymbolPath: /*Symbole de localisation*/ "images/RedPushpin.png",
        MarkupSymbolSize: { /*Taille du symbole*/
            width: /*largeur*/ 25,
            height: /*hauteur*/ 25
        },
		GenericLocationName: /*Étiquette de position générique*/ "Votre position",
        Locators: [{
            DisplayText: /*Texte d'affichage*/ "Rechercher pour une adresse",
            Example: /*Exemple*/ "Essayez de recherché une adresse tel que «12 Place Concord»",
			LocatorURL: /*URL du localisateur*/ "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
			LocatorParamaters: /*Paramètre du localisateur*/ ["SingleLine"],
			CandidateFields: /*Champs candidates*/ "Loc_name, Score, Match_addr",
			DisplayFieldCML2: /*Champ d'affichage*/ "Match_addr",
			AddressMatchScore: /*Score d'appariement minimum*/ 80,
			LocatorFieldName: /*Nom du champ du localisateur*/ 'Loc_name',
			LocatorFieldValues: /*Valeur du champ du localisateur*/ ["CAN.StreetName" , "CAN.PointAddress", "CAN.StreetAddress", "CAN.PostalExt"],
			GeocodeDisplayFields: /*Valeur d'affichage du géocodage*/ ["Address","City"],
			//Configurez l'étendue utilisé lors d'une recherche par adresse; saisissez un wkid de 0000 afin
			//de chercher l'Amérique du Nord en entier. CGS_WGS_1984: Utilisez wkid 4326 et des degrées décimaux;
			//WGS_1984_Web_Mercator: Utilisez wkid 3785 et des mètres; Aucun autre système accepté.
			SearchExtent: {xmin: -8865402.789852107, ymin: 5443102.360231639, xmax: -8807068.937666388, ymax: 5400828.978730424, wkid: 3785}
        }]
    },
	
	//Choose whether to enable Reverse Geocoding (to get a street address when a user clicks on the map or uses geolocation)
	//Activez ou désactiver le géocodade inverse (afin de trouver une adresse lors d'un clique sur la carte ou lors de la géolocalisation)
	ReverseGeocoding: true,

    // ------------------------------------------------------------------------------------------------------------------------
    // SERVICE DE GÉOMÉTRIE
    // ------------------------------------------------------------------------------------------------------------------------
    // Saisissez l'URL du service de géométrie
    GeometryService: "http://votreserveur/arcgis/rest/services/Utilities/Geometry/GeometryServer",

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DU ROUTAGE ET L'ITINÉRAIRE
    // ------------------------------------------------------------------------------------------------------------------------
    // Set URL for routing service (network analyst), to turn off the routing functionality update the "SearchforDirections" variable to false below.Set URL for routing service (network analyst), to turn off the routing functionality update the "SearchforDirections" variable to false below.
    // Saisissez l'URL pour le service de routage (Analyste de réseau), afin de désactiver le routage, changez l'option "SearchforDirections" à false.
    RouteServiceURL: "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
	
	// Le Client ID de votre compte ArcGIS Online pour organisation (configuration aussi nécessaire dans web.config)
	ArcGISOnlineClientID: "",
	UrlToProxy: /*URL vers le proxy*/ "proxy.ashx",

    // Choisissez la langue des directives (ex: 'fr' ou 'en')
    DirectionsLanguage: 'fr',

    // Choisissez la couleur utilisez pour afficher la route
    RouteColor: "#CC6633",

    // Choisissez la largeur de la route
    RouteWidth: 4,

    // Activer l'obtention d'un itinéraire
    SearchforDirections: true,
	
	//Configurez l'unité de mesure ainsi que l'étiquette utilisé pour le routage
    UnitConfig:
    {
        DirectionsLengthUnit: /*Untié de mesure*/ "KM", //Choisissez "KM" pour kilomètres ou "MI" pour miles
        DirectionsLengthLabel: /*Étiquette*/ "km"
    },

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DES BOITES DANS LE BAS DE PAGE
    // ------------------------------------------------------------------------------------------------------------------------
    // Configurez la largeur de boites
    InfoBoxWidth: 417,
	
    //Collection des couches opéationelles
	//Le premier champ inscrit pour un service de points doit être le titre
    Services: {
        CollecteOrdures: {
            Name: /*Nom*/ "Collecte du bac gris",
            Image: "images/waste_bin_grey.png",
            HasRendererImage: /*Utilise l'image de rendu*/ false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/5",
            FieldNames: /*Noms de champs*/ [{
                ServiceAvailability: /*Disponibilité du service*/ {
					ScheduleTypeDisplayText: /*Texte d'affichage du type d'horraire*/ "Fréquence:",
                    ScheduleTypeFieldName: /*Nom du champ du type d'horraire*/ "SCHEDULETYPE",
					ScheduleDisplayText: /*Texte d'affichage de l'horraire*/ "Prochains jours de collecte:",
					ScheduleFieldName: /*Nom du champ de l'horraire*/ "SCHEDULE",
					HolidayFieldName: /*Nom du champ des jours congés*/ "HOLIDAYFIELD",
					Quantity: /*Quantité*/ 3
                }
            }, {
				FieldName: /*Nom du champ*/ "DESCRIPT"
			}, {
				DisplayText: /*Texte d'affichage*/ "Agence:",
                FieldName: /*Nom du champ*/ "AGENCY"
            }, {
                Links: /*Liens*/ [{
                    DisplayText: /*Texte d'affichage*/ "Site web",
                    FieldName: /*Nom du champ*/ "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: /*Texte d'affichage*/ "Courriel",
                    FieldName: /*Nom du champ*/ "EMAIL",
                    type: "mail"
				}, {
					FieldName: /*Nom du champ*/ "CONTACT",
					type: "tag"
                }]
            }],

            Color: /*Couleur*/ "#8a93ce",
            isRendererColor: /*Est une couleur rendu*/ false
        },
        CollecteRecyclage: {
            Name: "Collecte du bac bleu",
            Image: "images/waste_bin_blue.png",
            HasRendererImage: false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/6",
            FieldNames: [{
                ServiceAvailability: {
					ScheduleTypeDisplayText: "Fréquence:",
                    ScheduleTypeFieldName: "SCHEDULETYPE",
					ScheduleDisplayText: "Prochains jours de collecte:",
					ScheduleFieldName: "SCHEDULE",
					HolidayFieldName: "HOLIDAYFIELD",
					Quantity: 3
                }
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Agence:",
                FieldName: "AGENCY"
            }, {
                Links: [{
                    DisplayText: "Site web",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Courriel",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "CONTACT",
					type: "tag"
                }]
            }],

            Color: "#8a93ce",
            isRendererColor: false
        },
        CollecteComposte: {
            Name: "Collecte du bac vert",
            Image: "images/waste_bin_green.png",
            HasRendererImage: false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/7",
            FieldNames: [{
                ServiceAvailability: {
					ScheduleTypeDisplayText: "Fréquence:",
                    ScheduleTypeFieldName: "SCHEDULETYPE",
					ScheduleDisplayText: "Prochains jours de collecte:",
					ScheduleFieldName: "SCHEDULE",
					HolidayFieldName: "HOLIDAYFIELD",
					Quantity: 6
                }
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Agence:",
                FieldName: "AGENCY"
            }, {
                Links: [{
                    DisplayText: "Site web",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Courriel",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "CONTACT",
					type: "tag"
                }]
            }],

            Color: "#8a93ce",
            isRendererColor: false
        },
        CollecteRésiduesVert: {
            Name: "Collecte des résidues vert",
            Image: "images/waste_bag_orange.png",
            HasRendererImage: false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/8",
            FieldNames: [{
                ServiceAvailability: {
					ScheduleTypeDisplayText: "Fréquence:",
                    ScheduleTypeFieldName: "SCHEDULETYPE",
					ScheduleDisplayText: "Prochains jours de collecte:",
					ScheduleFieldName: "SCHEDULE",
					HolidayFieldName: "HOLIDAYFIELD",
					Quantity: 3
                }
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Agence:",
                FieldName: "AGENCY"
            }, {
                Links: [{
                    DisplayText: "Site web",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Courriel",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "CONTACT",
					type: "tag"
                }]
            }],

            Color: "#8a93ce",
            isRendererColor: false
        },
        CollecteAbresNoel: {
            Name: "Collecte des arbres de Noël",
            Image: "images/waste_treeCycle.png",
            HasRendererImage: false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/9",
            FieldNames: [{
                ServiceAvailability: {
					ScheduleTypeDisplayText: "Fréquence:",
                    ScheduleTypeFieldName: "SCHEDULETYPE",
					ScheduleDisplayText: "Prochains jours de collecte:",
					ScheduleFieldName: "SCHEDULE",
					HolidayFieldName: "HOLIDAYFIELD",
					Quantity: 2
                }
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Agence:",
                FieldName: "AGENCY"
            }, {
                Links: [{
                    DisplayText: "Site web",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Courriel",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "CONTACT",
					type: "tag"
                }]
            }],

            Color: "#8a93ce",
            isRendererColor: false
        },
        TransportPublique: {
            Name: "Stations GO Transit",
            Image: "images/transit.png",
            HasRendererImage: false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/0",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				DisplayText: "Adresse:",
                FieldName: "FULLADDR"
            }, {
				DisplayText: "Billetterie:",
				FieldName: "OPERHOURS",
				BreakOn: ", "
			}, {
                Links: [{
                    DisplayText: "Site web",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Courriel",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "PHONE",
					type: "tag"
                }]
            }],
            ShowBeyondBuffer: true
        },
        Ecocentres: {
            Name: "Ecocentres",
            Image: "images/recycle.png",
            HasRendererImage: false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/1",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				DisplayText: "Adresse:",
                FieldName: "FULLADDR"
			}, {
				DisplayText: "Heures d'ouvertures:",
				FieldName: "OPERHOURS",
				BreakOn: ", "
			}, {
				DisplayText: "Services:",
				FieldName: "NOTES",
				BreakOn: ", "
			}, {
				Links: [{
                    DisplayText: "Site web",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Courriel",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "CONTACT",
					type: "tag"
                }]
            }],
            ShowBeyondBuffer: true
        },
        PointsDInteret: {
            Name: "Point d'intérêt",
            Image: "images/poi.png",
            HasRendererImage: false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/2",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Adresse:",
                FieldName: "FULLADDR"
			}, {
				DisplayText: "Heures d'ouvertures:",
				FieldName: "OPERHOURS",
				BreakOn: ", "
            }, {
				FieldName: "NOTES"
			}, {
				Links: [{
                    DisplayText: "Site web",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Courriel",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "PHONE",
					type: "tag"
                }]
			}],
            ShowBeyondBuffer: true
        },
        Bibliotheque: {
            Name: "Bilbiothèque",
            Image: "images/library.png",
            HasRendererImage: false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/3",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				DisplayText: "Adresse:",
                FieldName: "FULLADDR"
			}, {
				DisplayText: "Heures d'ouvertures:",
				FieldName: "OPERHOURS",
				BreakOn: ", "
			}, {
				FieldName: "NOTES"
			}, {
				Links: [{
                    DisplayText: "Site web",
                    FieldName: "AGENCYURL",
                    type: "web"
				}, {
					FieldName: "PHONE",
					type: "tag"
                }]
            }],
            ShowBeyondBuffer: true
        },
        PostePolice: {
            Name: "Poste de police",
            Image: "images/police.png",
            HasRendererImage: false,
            ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/4",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				DisplayText: "Adresse:",
                FieldName: "FULLADDR"
			}, {
				DisplayText: "Heures d'ouvertures:",
				FieldName: "OPERHOURS"
			}, {
				FieldName: "NOTES"
			}, {
				Links: [{
                    DisplayText: "Site web",
                    FieldName: "AGENCYURL",
                    type: "web"
				}, {
					DisplayText: "Courriel",
					FieldName: "EMAIL",
					type: "mail"
				}, {
					FieldName: "PHONE",
					type: "tag"
                }]
            }],
            ShowBeyondBuffer: /*Afficher au délà du tampon*/ true
        }
    },
	
	//Configuration de la table de jours congés/fériés
	HolidayTable: {
		ServiceUrl: "http://votreserveur/arcgis/rest/services/MunicipalServices/MapServer/10",
		DateFieldName: /*Champ de la date*/ "HOLIDAYDATE"
	},

    // Couche de recouvrement
    // Le ServiceURL est les point de terminaison REST du service
    // DisplayOnLoad détermine s'il faut afficher la couche de recouvrement
    ReferenceOverlayLayer: {
        ServiceUrl: "http://votreserveur/ArcGIS/rest/services/votrecarte/MapServer",
        DisplayOnLoad: false
    },

    //Configurez le niveau de zoom lors d'une recherche
    ZoomLevel: 16,

    //Configurez le format de l'address sur les fenêtres info mobile
    CallOutAddress: "Adresse: ${Address}",

    //Configurez la couleur rendu des services sélectionnez
    RendererColor: "#CC6633",

    //Taille de l'anneau de sélection
    RippleSize: 25,
	
	//Configurez le format des dates (pour l'horraire des collectes d'ordures)
	DateFormat: "EEE 'le' d MMMM", //utilise le formatage des dates DOJO
	DateLocale: "fr", //Choisissez entre 'fr' ou 'en'
	
	// Le texte utilisé pour remplacer les données nulles
    ShowNullValueAs: "S.O.",
	
	// ------------------------------------------------------------------------------------------------------------------------
	// BOUTON DE BASCULE DE LA LANGUE
	// ------------------------------------------------------------------------------------------------------------------------
	// Permet d’inclure un bouton dans la barre d’outils afin de changer d’application
	LanguageButton: {
		Enabled: /*Activé*/ false,
		Image: "images/language_EN.png",
		Title: /*Titre*/ "Afficher l'application en anglais",
		AppURL: /*URL de l'application*/ "http://votreSiteWeb..."
	},

    // ------------------------------------------------------------------------------------------------------------------------
    // CONFIGURATION DU PARTAGE DE LA CARTE
    // ------------------------------------------------------------------------------------------------------------------------
    // Configurez l'URL pour le service TinyURL
    MapSharingOptions:
	{
		TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
		TinyURLResponseAttribute: /*Attribut réponse*/ "data.url",

		//Configurez les paramètres de partage par réseau sociaux; Laissez un paire de guillemets vides lorqu'un paramètre n'est
		//pas requis. Veuillez noter que la langue des interfaces est déterminé par le site web même et ne peut être changé.
		
		//FacebookText: Facebook ne permet plus de configurer le texte du bulletin. L'utilisateur seras demander de saisir son propre commentaire.
		
		TwitterText: "Mes services municipaux", //Le texte qui sera ajouté au tweet
		TwitterHashtag: "esricanada", //Le hashtag qui seras ajouté au tweet (e.g. VilleDeToronto)
		TwitterFollow: "EsriCanada", //L'utilisateur seras invité à suivre ce comptre sur Twitter (ex: le compte Twitter de la municipalité).

		EmailSubject: /*Sujet du courriel*/ "Mes services municipaux",

		FacebookShareURL: /*URL de partage de Facebook*/ "http://www.facebook.com/sharer.php",
		TwitterShareURL: /*URL de partage Twitter*/ "http://twitter.com/share"
	}
});
