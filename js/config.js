/*global dojo */
//ENGLISH
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

    // This file contains various configuration settings for My Municipal Government Services
    //
    // Use this file to perform the following:
    //
    // 1.  Specify application title                  - [ Tag(s) to look for: ApplicationName, WindowTitle ]
    // 2.  Set path for application icon              - [ Tag(s) to look for: ApplicationIcon ]
    // 3.  Set splash screen message                  - [ Tag(s) to look for: SplashScreenMessage ]
    // 4.  Set URL for help page                      - [ Tag(s) to look for: HelpURL ]
    //
    // 5.  Specify URLs for base maps                 - [ Tag(s) to look for: BaseMapLayers ]
    // 6.  Set initial map extent                     - [ Tag(s) to look for: DefaultExtent ]
    //
    // 7. Customize info-Window settings              - [ Tag(s) to look for: InfoWindowHeader ]
    // 8. Customize info-Popup size                   - [ Tag(s) to look for: InfoPopupHeight, InfoPopupWidth ]
    //
    // 9a. Customize address search settings          - [ Tag(s) to look for: LocatorSettings ]
	// 9b. Enable/Disable Reverse Geocoding           - [ Tag(s) to look for: ReverseGeocoding ]
    //
    // 10. Set URL for geometry service               - [ Tag(s) to look for: GeometryService ]
    //
    // 12. Customize routing settings for directions  - [ Tag(s) to look for: RouteServiceURL, ArcGISOnlineClientID, UrlToProxy, RouteColor, RouteWidth,
	//                                                                        SearchforDirections, UnitConfig]
    //
    // 13. Configure data to be displayed on the bottom panel, ReferenceOverlayLayer
    //                                                - [ Tag(s) to look for: InfoBoxWidth, Services, HolidayTable, ReferenceOverlayLayer]
    //
    // 14. Customize the Zoom level, CallOutAddress, Render color, ripple size, Date formating
    //                                                - [ Tag(s) to look for: Zoom level, CallOutAddress, RendererColor, RippleSize, DateFormat, DateLocale]
	//
	// 15. Configure the Language Toggle Button       - [ Tag(s) to look for: LanguageButton ]
    //
    // 16. Specify URLs for map sharing:
    // 16a.In case of changing the TinyURL service
    //      Specify URL for the new service           - [ Tag(s) to look for: MapSharingOptions (set TinyURLServiceURL, TinyURLResponseAttribute) ]
    // 16b. Specify the share settings                - [ Tag(s) to look for: TwitterStatus, TwitterHashtag, TwitterFollow, EmailSubject ]
    // 16c. Specify the Facebook/Twitter URL in case of change to URL
    //                                                - [ Tag(s) to look for: FacebookURL, TwitterShareURL ]

    // ------------------------------------------------------------------------------------------------------------------------
    // GENERAL SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set application title.
    ApplicationName: "My Municipal Government Services",
	WindowTitle: "My Municipal Government Services",
	//to meet WCAG 2.0 accessibility standards, the Window Title must also be changed in index.htm

    // Set application icon path.
    ApplicationIcon: "images/appIcon.png",

    // Set splash window content - Message that appears when the application starts.
    SplashScreenMessage: "<strong>Welcome to My Municipal Government Services</strong><br><hr><br>The <strong>My Municipal Government Services</strong> application helps residents locate municipal facilities and get information about municipal services such as recycling and waste pickup schedules.<br><br>To get service information, enter an address in the search box, click on your location on the map, or use your current location (button).  Your location will be highlighted on the map and information about your services will be displayed.<br><br>",

    // Set URL of help page/portal.
    HelpURL: "help.htm",

    // ------------------------------------------------------------------------------------------------------------------------
    // BASEMAP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set baseMap layers.
    // Please note: All base maps need to use the same spatial reference. By default, on application start the first base map will be loaded
    BaseMapLayers: [{
        Key: "topographic",
        ThumbnailSource: "images/basemap_topo.png",
        Name: "Topographic",
		MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
    }, {
        Key: "imagery",
        ThumbnailSource: "images/basemap_imagery.png",
        Name: "Imagery",
        MapURL: "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
    }],

    // Initial map extent. Use comma (,) to separate values and don t delete the last comma.
	// Coordonates should be in WGS84 Web Mercator metres (left, top, right, bottom).
    DefaultExtent: "-8846570,5405896,-8824595,5436318",


    // ------------------------------------------------------------------------------------------------------------------------
    // INFO-POPUP SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Info-popup is a popup dialog that gets displayed on selecting a feature

    //Field for Displaying the features as info window header.
    InfoWindowHeader: "NAME",

    // Set size of the info-Popup - select maximum height and width in pixels.
    //minimum height should be 200 for the info-popup in pixels
    InfoPopupHeight: 200,

    //minimum width should be 300 for the info-popup in pixels
    InfoPopupWidth: 300,

    // ------------------------------------------------------------------------------------------------------------------------
    // ADDRESS SEARCH SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set Locator service URL

    LocatorSettings: {
        LocatorMarkupSymbolPath: "images/RedPushpin.png", // Set pushpin image path.
        MarkupSymbolSize: {
            width: 25,
            height: 25
        },
		GenericLocationName: "Your location",
        Locators: [{
            DisplayText: "Search for an address",
            Example: "Try searching for a street address such as '12 Concorde Place'",
			LocatorURL: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
			LocatorParamaters: ["SingleLine"],
			CandidateFields: "Loc_name, Score, Match_addr",
			DisplayFieldCML2: "Match_addr",
			AddressMatchScore: 80,
			LocatorFieldName: 'Loc_name',
			LocatorFieldValues: ["CAN.StreetName" , "CAN.PointAddress", "CAN.StreetAddress", "CAN.PostalExt"],
			GeocodeDisplayFields: ["Address","City"],
			//CanMod: Set the extent to be used when searching for an address, set wkid to 0000 in order to search whole of North America
			//CGS_WGS_1984: Use wkid 4326 and decimal degrees; WGS_1984_Web_Mercator: Use wkid 3785 and metres; Other systems not supported
			SearchExtent: {xmin: -8865402.789852107, ymin: 5443102.360231639, xmax: -8807068.937666388, ymax: 5400828.978730424, wkid: 3785}
        }]
    },
	
	//Choose whether to enable Reverse Geocoding (to get a street address when a user clicks on the map or uses geolocation)
	ReverseGeocoding: true,

    // ------------------------------------------------------------------------------------------------------------------------
    // GEOMETRY SERVICE SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set geometry service URL.
    GeometryService: "http://yourserver/arcgis/rest/services/Utilities/Geometry/GeometryServer",

    // ------------------------------------------------------------------------------------------------------------------------
    // DRIVING DIRECTIONS SETTINGS
    // ------------------------------------------------------------------------------------------------------------------------
    // Set URL for routing service (network analyst), to turn off the routing functionality update the "SearchforDirections" variable to false below.
    RouteServiceURL: "http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",
	
	// CanMod: ArcGIS Online subscription for Developers Client ID for Simple Routing (must also be setup in web.config)
	ArcGISOnlineClientID: "",
	UrlToProxy: "proxy.ashx",

    // CanMod: language to use with directions (e.g., 'en', or 'fr'):
    DirectionsLanguage: 'en',

    // Set color for the route symbol.
    RouteColor: "#CC6633",

    // Set width of the route.
    RouteWidth: 4,

    // Set this to true to show directions on map
    SearchforDirections: true,
	
	//CanMod: Set the unit to use for routing directions along with it's label
    UnitConfig:
    {
        DirectionsLengthUnit: "KM", //Choose between "KM" for Kilometres and "MI" for Miles
        DirectionsLengthLabel: "km"
    },

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR INFO-PODS ON THE BOTTOM PANEL
    // ------------------------------------------------------------------------------------------------------------------------
    // Set width of the boxes in the bottom panel.
    InfoBoxWidth: 417,
	
    //Operational layer collection.
	//For point services, the first field listed should be the title to display in the pod
    Services: {
        GarbagePickup: {
            Name: "Black Bin Pickup",
            Image: "images/waste_bin_grey.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/5",
            FieldNames: [{
                ServiceAvailability: {
					ScheduleTypeDisplayText: "Frequency:",
                    ScheduleTypeFieldName: "SCHEDULETYPE",
					ScheduleDisplayText: "Next service days:",
					ScheduleFieldName: "SCHEDULE",
					HolidayFieldName: "HOLIDAYFIELD",
					Quantity: 3
                }
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Agency:",
                FieldName: "AGENCY"
            }, {
                Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Email",
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
        RecyclablePickup: {
            Name: "Blue Bin Pickup",
            Image: "images/waste_bin_blue.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/6",
            FieldNames: [{
                ServiceAvailability: {
					ScheduleTypeDisplayText: "Frequency:",
                    ScheduleTypeFieldName: "SCHEDULETYPE",
					ScheduleDisplayText: "Next service days:",
					ScheduleFieldName: "SCHEDULE",
					HolidayFieldName: "HOLIDAYFIELD",
					Quantity: 3
                }
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Agency:",
                FieldName: "AGENCY"
            }, {
                Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Email",
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
        CompostPickup: {
            Name: "Green Bin Pickup",
            Image: "images/waste_bin_green.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/7",
            FieldNames: [{
                ServiceAvailability: {
					ScheduleTypeDisplayText: "Frequency:",
                    ScheduleTypeFieldName: "SCHEDULETYPE",
					ScheduleDisplayText: "Next service days:",
					ScheduleFieldName: "SCHEDULE",
					HolidayFieldName: "HOLIDAYFIELD",
					Quantity: 6
                }
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Agency:",
                FieldName: "AGENCY"
            }, {
                Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Email",
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
        YardWastePickup: {
            Name: "Yard Waste Pickup",
            Image: "images/waste_bag_orange.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/8",
            FieldNames: [{
                ServiceAvailability: {
					ScheduleTypeDisplayText: "Frequency:",
                    ScheduleTypeFieldName: "SCHEDULETYPE",
					ScheduleDisplayText: "Next service days:",
					ScheduleFieldName: "SCHEDULE",
					HolidayFieldName: "HOLIDAYFIELD",
					Quantity: 3
                }
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Agency:",
                FieldName: "AGENCY"
            }, {
                Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Email",
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
        ChristmasTreePickup: {
            Name: "Christmas Tree Pickup",
            Image: "images/waste_treeCycle.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/9",
            FieldNames: [{
                ServiceAvailability: {
					ScheduleTypeDisplayText: "Frequency:",
                    ScheduleTypeFieldName: "SCHEDULETYPE",
					ScheduleDisplayText: "Next service days:",
					ScheduleFieldName: "SCHEDULE",
					HolidayFieldName: "HOLIDAYFIELD",
					Quantity: 2
                }
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Agency:",
                FieldName: "AGENCY"
            }, {
                Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Email",
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
        TransitStations: {
            Name: "GO Transit Stations",
            Image: "images/transit.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/0",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				DisplayText: "Address:",
                FieldName: "FULLADDR"
            }, {
				DisplayText: "Ticket Counter:",
				FieldName: "OPERHOURS",
				BreakOn: ", "
			}, {
                Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Email",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "PHONE",
					type: "tag"
                }]
            }],
            ShowBeyondBuffer: true
        },
        WasteTransferStation: {
            Name: "Waste Transfer Stations",
            Image: "images/recycle.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/1",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				DisplayText: "Address:",
                FieldName: "FULLADDR"
			}, {
				DisplayText: "Operating Hours:",
				FieldName: "OPERHOURS",
				BreakOn: ", "
			}, {
				DisplayText: "Services:",
				FieldName: "NOTES",
				BreakOn: ", "
			}, {
				Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Email",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "CONTACT",
					type: "tag"
                }]
            }],
            ShowBeyondBuffer: true
        },
        PlacesOfInterest: {
            Name: "Places of Interest",
            Image: "images/poi.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/2",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				FieldName: "DESCRIPT"
			}, {
				DisplayText: "Address:",
                FieldName: "FULLADDR"
			}, {
				DisplayText: "Hours:",
				FieldName: "OPERHOURS",
				BreakOn: ", "
            }, {
				FieldName: "NOTES"
			}, {
				Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
                }, {
                    DisplayText: "Email",
                    FieldName: "EMAIL",
                    type: "mail"
				}, {
					FieldName: "PHONE",
					type: "tag"
                }]
			}],
            ShowBeyondBuffer: true
        },
        Libraries: {
            Name: "Libraries",
            Image: "images/library.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/3",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				DisplayText: "Address:",
                FieldName: "FULLADDR"
			}, {
				DisplayText: "Hours:",
				FieldName: "OPERHOURS",
				BreakOn: ", "
			}, {
				FieldName: "NOTES"
			}, {
				Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
				}, {
					FieldName: "PHONE",
					type: "tag"
                }]
            }],
            ShowBeyondBuffer: true
        },
        PoliceStations: {
            Name: "Police Stations",
            Image: "images/police.png",
            HasRendererImage: false,
            ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/4",
            distance: 4,
            FieldNames: [{
                FieldName: "NAME"
            }, {
				DisplayText: "Address:",
                FieldName: "FULLADDR"
			}, {
				DisplayText: "Hours:",
				FieldName: "OPERHOURS"
			}, {
				FieldName: "NOTES"
			}, {
				Links: [{
                    DisplayText: "Website",
                    FieldName: "AGENCYURL",
                    type: "web"
				}, {
					DisplayText: "Email",
					FieldName: "EMAIL",
					type: "mail"
				}, {
					FieldName: "PHONE",
					type: "tag"
                }]
            }],
            ShowBeyondBuffer: true
        }
    },
	
	//Settings for the Holidays table
	HolidayTable: {
		ServiceUrl: "http://yourserver/arcgis/rest/services/MunicipalServices/MapServer/10",
		DateFieldName: "HOLIDAYDATE"
	},

    // ServiceUrl is the REST end point for the reference overlay layer
    // DisplayOnLoad setting this will show the reference overlay layer on load
    ReferenceOverlayLayer: {
        ServiceUrl: "http://yourserver/ArcGIS/rest/services/yourmap/MapServer",
        DisplayOnLoad: false
    },

    //Set required zoom level.
    ZoomLevel: 16,

    //Set Address to be displayed on mobile callout.
    CallOutAddress: "Street: ${Address}",

    //Set Renderer color for selected feature.
    RendererColor: "#CC6633",

    //Set size of the ripple.
    RippleSize: 25,
	
	//Set date formating for waste pickup scheduling
	DateFormat: "EEEE, MMMM d", //uses dojo date formating
	DateLocale: "en", //Choose between "en" and "fr"
	
    // Set string value to be shown for null or blank values
    ShowNullValueAs: "N/A",
	
	// ------------------------------------------------------------------------------------------------------------------------
	// LANGUAGE TOGGLE BUTTON
	// ------------------------------------------------------------------------------------------------------------------------
	// Allows you to include a toggle button in the toolbar to switch between two version of the application
	LanguageButton: {
		Enabled: false,
		Image: "images/language_FR.png",
		Title: "Switch to French Application",
		AppURL: "http://yourwebsite..."
	},

    // ------------------------------------------------------------------------------------------------------------------------
    // SETTINGS FOR MAP SHARING
    // ------------------------------------------------------------------------------------------------------------------------
    // Set URL for TinyURL service, and URLs for social media
    MapSharingOptions:
	{
		TinyURLServiceURL: "http://api.bit.ly/v3/shorten?login=esri&apiKey=R_65fd9891cd882e2a96b99d4bda1be00e&uri=${0}&format=json",
		TinyURLResponseAttribute: "data.url",

		//Set the default settings when sharing the app; Leave an empty set of quotation marks when a setting is not required.
		//The language displayed by the APIs is determined by the website and cannot be changed

		//FacebookText: Facebook has removed the option to include text. The user will instead by prompted for his own comment.

		TwitterText: "My Municipal Government Services", //The text that will be added to the tweet
		TwitterHashtag: "esricanada", //Hashtag to append to the tweet (e.g. CityOfToronto).
		TwitterFollow: "EsriCanada", //Allows user to follow a Twitter account (e.g. the municipalities twitter account).

		EmailSubject: "My Municipal Government Services",

		FacebookShareURL: "http://www.facebook.com/sharer.php",
		TwitterShareURL: "http://twitter.com/share"
	}
});
