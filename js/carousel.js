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
var horizontalPosition = 0; //variable for storing the scrolling position of scrolling container
var newLeft = 0; //variable for storing the left position of the carousel content
var touchStart = false; //flag for setting the touch events
var infoContent; //variable to store info content details
var counter = 0;

//Create Dom node elements for carousel and style carousel

function CreateCarousel() {
    var divDataContainer;
    if (!isMobileDevice) {
        var divToggle = dojo.create("div");
		divToggle.setAttribute("onclick","clearAutocomplete();");
        divToggle.id = "divtoggle";
        divToggle.className = "divtoggle";
        divToggle.style.bottom = "0px";
        document.getElementById("bodyContainer").appendChild(divToggle);

		//CanMod: Add space to hold address in toggle area
		var divAddress = dojo.create("div");
		divAddress.id = "divAddress";
		divAddress.setAttribute("aria-live","polite");
		divAddress.setAttribute("aria-atomic","true");
		divAddress.padding = "6px";
		divToggle.appendChild(divAddress);
		
        var tblToggle = dojo.create("table");
        tblToggle.cellSpacing = 0;
        tblToggle.cellPadding = 0;
        //tblToggle.style.marginLeft = "50px"; /*CanMod*/
		dojo.style(tblToggle,"cssFloat","right");
        divToggle.appendChild(tblToggle);

        var tbodyToggle = dojo.create("tbody");
        tblToggle.appendChild(tbodyToggle);

        var trToggle = dojo.create("tr");
        tbodyToggle.appendChild(trToggle);

        var tdToggle = dojo.create("td");
        tdToggle.align = "right";
        trToggle.appendChild(tdToggle);

        var divBackground = dojo.create("div");
        divBackground.id = "divImageBackground";
        divBackground.className = "divImageBackground";
        divBackground.style.display = "none";
        tdToggle.appendChild(divBackground);

        var divImgcontainer = dojo.create("div");
        divImgcontainer.id = "divImage";
        divBackground.appendChild(divImgcontainer);

        var tblImageContainer = dojo.create("table");
        tblImageContainer.style.width = "40px";
        tblImageContainer.style.height = "100%";
        divImgcontainer.appendChild(tblImageContainer);

        var tbodyImageContainer = dojo.create("tbody");
        tblImageContainer.appendChild(tbodyImageContainer);

        var trImageContainer = dojo.create("tr");
        tbodyImageContainer.appendChild(trImageContainer);

        var tdImageContainer = dojo.create("td");
        tdImageContainer.align = "center";
        trImageContainer.appendChild(tdImageContainer);

        var imgToggle = dojo.create("img");
        imgToggle.id = "imgToggleResults";
		imgToggle.alt = intl.toggle;
        imgToggle.setAttribute("state", "minimized");
        imgToggle.className = "imgShare focusHighlight";
		imgToggle.setAttribute("tabindex","0");
        imgToggle.src = "images/up.png";
        imgToggle.style.cursor = "pointer";
        imgToggle.onclick = function () {
            ShowHideResult(this);
        };
        tdImageContainer.appendChild(imgToggle);

        var divCarousel = dojo.create("div");
        divCarousel.id = "divCarouselContent";
        divCarousel.setAttribute("aria-live","off");
		divCarousel.setAttribute("onclick","clearAutocomplete();");
        divCarousel.className = "divCarouselContent hideBottomContainerHeight";
        document.getElementById("bodyContainer").appendChild(divCarousel);

        var divTransparent = dojo.create("div");
        divTransparent.className = "transparentBackground";
        divTransparent.style.height = "250px";
        divCarousel.appendChild(divTransparent);

        var tblCarousel = dojo.create("table");
        tblCarousel.style.width = "100%";
        tblCarousel.style.height = "100%";
        divTransparent.appendChild(tblCarousel);

        var tbodyCarousel = dojo.create("tbody");
        tblCarousel.appendChild(tbodyCarousel);

        var trCarousel = dojo.create("tr");
        tbodyCarousel.appendChild(trCarousel);

        var tdCarouselContainer = dojo.create("td", {}, trCarousel);

        var tableCarouselContent = dojo.create("table", {}, tdCarouselContainer);
        tableCarouselContent.style.width = "99.5%";
        tableCarouselContent.style.height = "100%";
		tableCarouselContent.style.marginRight = "0.5%";

        var trContent = tableCarouselContent.insertRow(0);

        var tdLeftArrow = trContent.insertCell(0);
        tdLeftArrow.align = "left";
        tdLeftArrow.style.width = "37px";

        var divLeftArrow = dojo.create("div");
        divLeftArrow.id = "divLeftArrow";
        divLeftArrow.style.zIndex = 1000;
        divLeftArrow.style.display = "none";
        tdLeftArrow.appendChild(divLeftArrow);

        var imgLeftArrow = dojo.create("img");
        imgLeftArrow.src = "images/arrLeft.png";
        imgLeftArrow.alt = "";
        imgLeftArrow.style.cursor = "pointer";
        imgLeftArrow.style.verticalAlign = "middle";
        imgLeftArrow.className = "imgShare";
        imgLeftArrow.onclick = function () {
            SlideLeft();
        };
        divLeftArrow.appendChild(imgLeftArrow);
        var tdDataContainer = trContent.insertCell(1);
        var divDataHolder = dojo.create("div");
        divDataHolder.id = "divCarouselDataContainer";
        divDataHolder.className = "divCarouselDataContainer";
        tdDataContainer.appendChild(divDataHolder);

        divDataContainer = dojo.create("div");
		divDataContainer.style.display = "none";
        divDataContainer.id = "divCarouselDataContent";
        divDataContainer.className = "divCarouselDataContent";
        divDataHolder.appendChild(divDataContainer);
    }
    var divDataContent = dojo.create("div");
    divDataContent.style.height = "100%";
    if (!isMobileDevice) {
        divDataContainer.appendChild(divDataContent);
    } else {
        dojo.byId("listDatacontent").appendChild(divDataContent);
    }
    var tblDataContent = dojo.create("table");
    tblDataContent.style.height = "100%";
    divDataContent.appendChild(tblDataContent);

    var tbodyDataContent = dojo.create("tbody");
    tblDataContent.appendChild(tbodyDataContent);

    var trDataContent = dojo.create("tr");
    trDataContent.id = "trDataContent";
    tbodyDataContent.appendChild(trDataContent);

    if (!isMobileDevice) {
        var tdRightArrow = trContent.insertCell(2);
        tdRightArrow.align = "right";
        tdRightArrow.style.width = "37px";

        var divRightArrow = dojo.create("div");
        divRightArrow.zIndex = 1000;
        divRightArrow.style.display = "block";
        divRightArrow.id = "divRightArrow";
        tdRightArrow.appendChild(divRightArrow);

        var imgRightArrow = dojo.create("img");
        imgRightArrow.src = "images/arrRight.png";
        imgRightArrow.alt = "";
        imgRightArrow.style.cursor = "pointer";
        imgRightArrow.style.verticalAlign = "middle";
        imgRightArrow.className = "imgShare";
        imgRightArrow.onclick = function () {
            SlideRight();
        };
        divRightArrow.appendChild(imgRightArrow);
    }
    CreateCarouselPod();
    if (!isMobileDevice) {
        dojo.connect(dojo.byId('divCarouselDataContainer'), "touchstart", function (e) {
            horizontalPosition = e.touches[0].pageX;
            touchStart = true;
        });
        dojo.connect(dojo.byId('divCarouselDataContainer'), "touchmove", function (e) {
            if (touchStart) {
                touchStart = false;
                var touch = e.touches[0];
                e.cancelBubble = true;
                if (e.stopPropagation) e.stopPropagation();
                e.preventDefault();
                if (touch.pageX - horizontalPosition >= 2) {
                    setTimeout(function () {
                        SlideLeft();
                    }, 100);
                }
                if (horizontalPosition - touch.pageX >= 2) {
                    setTimeout(function () {
                        SlideRight();
                    }, 100);
                }
            }
        });
        dojo.connect(dojo.byId('divCarouselDataContainer'), "touchend", function (e) {
            horizontalPosition = 0;
            touchStart = false;
        });
    }
}

function FixBottomPanelWidth() {
    var width = ((dojo.window.getBox().w) / numberOfServices) - 5;
    var charWidth;
    if (isBrowser) {
        charWidth = "a".getWidth(11);
    } else {
        charWidth = "a".getWidth(13.5);
    }
    var numberChar = Math.floor(width / charWidth) - 2;
}

//Display result in carousel pods

function ShowHideResult(imgToggle) {
    if (mapPoint) {
        var layerCount = 0;
        var hiddenCount = 0;
        for (var index in services) {
            layerCount++;
            if (dojo.byId('div' + index).style.display == "none") {
                hiddenCount++;
            }
        }
        if (layerCount == hiddenCount) {
            WipeOutResults();
            alert(messages.getElementsByTagName("tinyURLEngine")[0].childNodes[0].nodeValue);
            return;
        }
        if (imgToggle.getAttribute("state") == "minimized") {
            WipeInResults(false); // maximize
        } else {
            WipeOutResults(); //minimize
        }
    }
}

//Show bottom panel with Wipe-in animation

function WipeInResults(recenter) {
	dojo.byId("divAddress").className = "divAddress";
	dojo.byId('divImageBackground').style.display = "block";
	dojo.byId('imgToggleResults').setAttribute("state", "maximized");
	dojo.byId('imgToggleResults').setAttribute("aria-expanded", "true");
	dojo.byId('imgToggleResults').title = intl.hidePanel;
	dojo.byId('divtoggle').style.bottom = "250px";
	dojo.byId('divCarouselContent').style.height = "250px";
	dojo.replaceClass("divCarouselContent", "hideBottomContainer", "showBottomContainer");
	dojo.byId('imgToggleResults').src = "images/down.png";
	setTimeout(function() {
		dojo.byId('divMainContainer').style.bottom = "250px";
		map.resize();
		if (recenter) {
			dojo.on.once(map,"resize",function() {setTimeout(function(){map.centerAndZoom(mapPoint,zoomLevel);},50);});
		}
	}, 500);
}

//Hide bottom panel with Wipe-out animation

function WipeOutResults() {
    dojo.byId('imgToggleResults').setAttribute("state", "minimized");
    dojo.byId('imgToggleResults').setAttribute("aria-expanded", "false");
    dojo.byId('imgToggleResults').title = intl.showPanel;
	dojo.byId('divMainContainer').style.bottom = "0px";
    dojo.byId('divtoggle').style.bottom = "0px";
	map.resize();
    dojo.byId('divCarouselContent').style.height = "0px";
    dojo.replaceClass("divCarouselContent", "showBottomContainer", "hideBottomContainer");
    dojo.byId('imgToggleResults').src = "images/up.png";
}

//Create information pods to display in the carousel

function CreateCarouselPod() {
    for (var i in services) {
        var tdDataContent = dojo.create("td");
        tdDataContent.id = "td" + i;
        dojo.byId("trDataContent").appendChild(tdDataContent);

        var divTemplate = dojo.create("div");
        divTemplate.className = "divDetails";
        divTemplate.style.display = "block";
        divTemplate.id = "div" + i;
        divTemplate.style.width = infoBoxWidth + "px";
        divTemplate.style.marginRight = "5.1px";
        tdDataContent.appendChild(divTemplate);

        var divHeader = dojo.create("div");
        divHeader.className = "divDetailsHeader focusHighlightInset";
        divHeader.id = "divDetailsHeader" + i;
        divHeader.style.position = "relative";
		//CanMod: Make header layer button
		divHeader.setAttribute("position", numberOfServices);
		numberOfServices++;
		divHeader.setAttribute("serviceLinkId", i);
		divHeader.onclick = function (evt) {
            ShowServicePods(this, false);
        };
		//CanAccess
		divHeader.setAttribute("tabindex","0");
		divHeader.onkeyup = function (evt) {
			if (!evt) {evt = event;}//ie7&8 compatibility
			var kc = evt.keyCode;
			if (kc == dojo.keys.ENTER || kc == dojo.keys.SPACE) {
				ShowServicePods(this, false);
			}
		};
		
        divTemplate.appendChild(divHeader);

        var tblHeader = dojo.create("table");
        tblHeader.style.height = "100%";
        tblHeader.style.width = "100%";
        tblHeader.cellSpacing = "0";
        tblHeader.cellPadding = "0";
        divHeader.appendChild(tblHeader);

        var tbodyHeader = dojo.create("tbody");
        tblHeader.appendChild(tbodyHeader);

        var trHeader = dojo.create("tr");
        tbodyHeader.appendChild(trHeader);

        var tdHeaderImage = dojo.create("td");
        tdHeaderImage.className = "imgCarouselHeader";
        tdHeaderImage.style.margin = "2px";
        trHeader.appendChild(tdHeaderImage);

        var serviceImages = dojo.create("img");
        serviceImages.src = services[i].Image;
		serviceImages.alt = ""; //CanAccess
        serviceImages.className = "imgCarouselHeader";
        tdHeaderImage.appendChild(serviceImages);

        var tdHeader = dojo.create("td");
        trHeader.appendChild(tdHeader);

        var spanHeader = dojo.create("span");
        spanHeader.className = "spanHeader";
		spanHeader.innerHTML = "<h2>" + services[i].Name + "</h2>";
        tdHeader.appendChild(spanHeader);

        var divContentHolder = dojo.create("div");
        divContentHolder.id = "divContentHolder" + i;
		divContentHolder.setAttribute("aria-live","polite");
        divContentHolder.setAttribute("aria-atomic","false");
        divContentHolder.className = "divContentStyle";
        divTemplate.appendChild(divContentHolder);

        var divContent = dojo.create("div");
        divContentHolder.appendChild(divContent);
        divContent.id = "divContent" + i;
        divContent.className = "divContentStyle focusHighlightInset";
		divContent.style.overflow = "auto";

        var divDirectionsContainer = dojo.create("div");
        divDirectionsContainer.id = "divDirectionsContainer" + i;
        divContentHolder.appendChild(divDirectionsContainer);

        divDirectionsContainer.className = "divContentStyle";
        divDirectionsContainer.style.display = "none";

        var divDirectionsContent = dojo.create("div");
        divDirectionsContent.id = "divDirectionsContent" + i;
        divDirectionsContainer.appendChild(divDirectionsContent);

        var br = dojo.create("br");
        divContent.appendChild(br);
    }
    FixBottomPanelWidth();
}

//Position bottom Pods

function ShowServicePods(_this, share) {
    map.infoWindow.hide();
    selectedGraphic = null;
    var key;
    var position;
    if (share) {
        key = _this.split("$", 1)[0];
    } else {
        key = _this.getAttribute("serviceLinkId");
    }
	displayedLayer = key;
    if (dojo.byId('div' + key).style.display == "block") {
        var hiddenContests = 0;
        for (var index in services) {
            if (index == key)
                break;
            if (dojo.byId('div' + index).style.display == "none") {
                hiddenContests++;
            }
        }
        if (share) {
            position = Number(window.location.toString().split("$pos=")[1]) - hiddenContests;
        } else {
            position = Number(_this.getAttribute("position")) - hiddenContests;
        }
        Slide(((position * (infoBoxWidth + 5)) + (position * 4.1)));
    }
    ShowServiceLayer(index);
}

//Create polygon service information

function CreateServicePolygonInfo(service, feature, key) {
	if (document.getElementById("divCarouselDataContent")) {
		document.getElementById("divCarouselDataContent").style.display = "block";
	}
    RemoveChildren(dojo.byId("divContent" + key));
    var tableInfo = dojo.create("table");
    tableInfo.id = "tableInfo" + key;
    if (!isMobileDevice) {
        tableInfo.style.marginLeft = "10px";
    } else {
        tableInfo.style.paddingLeft = "8px";
    }
    var tableInfoBody = dojo.create("tbody");
    tableInfo.appendChild(tableInfoBody);
	
	//Content
    for (var i = 0; i < service.FieldNames.length; i++) {
		if (feature.attributes[service.FieldNames[i].FieldName] === null || feature.attributes[service.FieldNames[i].FieldName] == showNullValueAs) {continue;} //Do not write entry if no data
		
        var tr = dojo.create("tr");
        tableInfoBody.appendChild(tr);
		if (service.FieldNames[i].ServiceAvailability) {
			//Extract the domain
			var fieldMatch = service.FieldNames[i].ServiceAvailability.ScheduleTypeFieldName;
			var domainArray = [];
			dojo.forEach(feature._graphicsLayer.fields,function(item,i) {
				if (item.name == fieldMatch) {
					if (item.domain.codedValues) {
						domainArray = item.domain.codedValues;
					}
				}
			});
			
			//Frequency
			var tdFreq = dojo.create("td");
			tdFreq.innerHTML = "";
			if (service.FieldNames[i].ServiceAvailability.ScheduleTypeDisplayText) {
				tdFreq.innerHTML += service.FieldNames[i].ServiceAvailability.ScheduleTypeDisplayText + " ";
			}
			var freqValue = feature.attributes[service.FieldNames[i].ServiceAvailability.ScheduleTypeFieldName];
			dojo.forEach(domainArray,function(itemD,iD) {
				if (itemD.code && itemD.code == freqValue) {freqValue = itemD.name;}
			});
			tdFreq.innerHTML += freqValue;
			tdFreq.innerHTML += schedulePatternDescriptor(feature.attributes[service.FieldNames[i].ServiceAvailability.ScheduleFieldName],feature.attributes[service.FieldNames[i].ServiceAvailability.ScheduleTypeFieldName]);
			tr.appendChild(tdFreq);
			
			//Determine next X pickups
			var tr = dojo.create("tr");
			tableInfoBody.appendChild(tr);
			var tdSched = dojo.create('td');
			tr.appendChild(tdSched);
			
			if (service.FieldNames[i].ServiceAvailability.ScheduleDisplayText) {
				tdSched.innerHTML += service.FieldNames[i].ServiceAvailability.ScheduleDisplayText + " ";
			}
			var fullSched = null;
			fullSched = parseScheduleDates(feature.attributes[service.FieldNames[i].ServiceAvailability.ScheduleFieldName],feature.attributes[service.FieldNames[i].ServiceAvailability.ScheduleTypeFieldName],new Date().getFullYear());
			var currDay = new Date();
			currDay.setHours(0,0,0,0);
			fullSched = dojo.filter(fullSched,function(item) {
				return item >= currDay;
			});
			var quantity = service.FieldNames[i].ServiceAvailability.Quantity;
			if (fullSched.length > quantity) {
			fullSched = fullSched.slice(0,quantity);
			}
			else if (fullSched.length < quantity) {
				var nextYear = dojo.date.add(new Date(),"year",1);
				var fullSched2 = parseScheduleDates(feature.attributes[service.FieldNames[i].ServiceAvailability.ScheduleFieldName],feature.attributes[service.FieldNames[i].ServiceAvailability.ScheduleTypeFieldName],nextYear.getFullYear());
				fullSched = fullSched.concat(fullSched2.slice(0,quantity - fullSched.length));
			}
			//Adjust schedule according to holidays
			var fName = feature.attributes[service.FieldNames[i].ServiceAvailability.HolidayFieldName];
			if (fName != "" && fName != null) {
				var queryTask = new esri.tasks.QueryTask(holidayTable.ServiceUrl);
				var query = new esri.tasks.Query();
				query.outFields = [holidayTable.DateFieldName,feature.attributes[service.FieldNames[i].ServiceAvailability.HolidayFieldName]];
				query.where = "1 = 1";
				queryTask.execute(query,
					function(results) {
						var holidayArray = [];
						dojo.forEach(results.features,function(item,i) {
							var retDate = new Date(item.attributes[holidayTable.DateFieldName]);
							retDate = dojo.date.add(retDate,"minute",retDate.getTimezoneOffset()); //Returned date is UTC but JS assumes local ∴ adjust to match users local time (also accounts for Daylight Savings)
							holidayArray.push([item.attributes[fName],retDate]);
						});
						fullSched = modForHolidays(fullSched, holidayArray);
						var schedList = "<ul style='margin:0px;'>";
						dojo.forEach(fullSched, function(item, i) {
							schedList += "<li>" + dojo.date.locale.format(item,{selector:"date",datePattern:dateFormat,locale:dateLocale}) + "</li>";
						});
						schedList += "</li>";
						if (fullSched.length > 0) {
							tdSched.innerHTML += schedList;
						}
						else {
							tdSched.innerHTML = "";
						}
					},
					function (err) {
						console.error(err);
					}
				);
			}
			else {
				var schedList = "<ul style='margin:0px;'>";
				dojo.forEach(fullSched, function(item, i) {
					schedList += "<li>" + dojo.date.locale.format(item,{selector:"date",datePattern:dateFormat,locale:dateLocale}) + "</li>";
				});
				schedList += "</li>";
				if (fullSched.length > 0) {
					tdSched.innerHTML += schedList;
				}
				else {
					tdSched.innerHTML = "";
				}
			}
		}
		else if (service.FieldNames[i].Links) {
			var tdLink = dojo.create("td");
			tr.appendChild(tdLink);
			var tableLink = dojo.create("table");
			tableLink.cellSpacing = "0";
			tableLink.cellPadding = "0";
			tdLink.appendChild(tableLink);
			var tbodyLink = dojo.create("tbody");
			tableLink.appendChild(tbodyLink);
			var trLink = dojo.create("tr");
			tbodyLink.appendChild(trLink);
			for (var m = 0; m < service.FieldNames[i].Links.length; m++) {
				if (feature.attributes[service.FieldNames[i].Links[m].FieldName] == null || feature.attributes[service.FieldNames[i].Links[m].FieldName] == showNullValueAs) {continue;} //Do no write empty link
				// Insert separator from previous cell at end of current row
				if(m > 0) {
					var span = trLink.insertCell(-1);
					if (isMobileDevice) {
						span.style.borderLeft = "1px solid white";
					}
					else {
						span.style.borderLeft = "1px solid dimgray";
					}
					span.style.paddingRight = "5px";
				}

				// Create cell for link
				var tdHref = trLink.insertCell(-1);
				tdHref.style.paddingRight = "5px";
				if (service.FieldNames[i].Links[m].type == "tag") {
					var innerSpan = document.createElement("span");
					if (service.FieldNames[i].Links[m].DisplayText) {
						innerSpan.innerHTML = service.FieldNames[i].Links[m].DisplayText + " " + feature.attributes[service.FieldNames[i].Links[m].FieldName];
					}
					else {
						innerSpan.innerHTML = feature.attributes[service.FieldNames[i].Links[m].FieldName];
					}
					tdHref.appendChild(innerSpan);
				}
				else {
					var aLink = document.createElement("a");
					aLink.className = "focusHighlight";
					aLink.target = "_blank";
					if (service.FieldNames[i].Links[m].type == "web") {
						aLink.href = feature.attributes[service.FieldNames[i].Links[m].FieldName];
					}
					else if (service.FieldNames[i].Links[m].type == "mail") {
						aLink.href = "mailto:" + feature.attributes[service.FieldNames[i].Links[m].FieldName];
					}
					aLink.innerHTML = service.FieldNames[i].Links[m].DisplayText;
					tdHref.appendChild(aLink);
				}
			}
		}
		else {
			tdData = dojo.create("td");
			tdData.align = "left";
			tr.appendChild(tdData);

			var tdContent = "";
			if (service.FieldNames[i].DisplayText) {
				tdContent += service.FieldNames[i].DisplayText + " ";
			}
			if (service.FieldNames[i].BreakOn && feature.attributes[service.FieldNames[i].FieldName].indexOf(service.FieldNames[i].BreakOn) >= 0) {
				var regex = new RegExp(service.FieldNames[i].BreakOn,'g');
				var text = feature.attributes[service.FieldNames[i].FieldName];
				tdContent += "<ul style='margin:0px;'><li>" + text.replace(regex,"</li><li>") + "</li></ul>";
			}
			else {
				tdContent += feature.attributes[service.FieldNames[i].FieldName]
			}
			tdData.innerHTML = tdContent;
		}
    }
    dojo.byId("divContent" + key).appendChild(tableInfo);

}

//Create point service information

function CreateServicePointInfo(service, feature, key, distance, featureGeometry) {
	if (document.getElementById("divCarouselDataContent")) {
		document.getElementById("divCarouselDataContent").style.display = "block";
	}
    if (!isMobileDevice) {
        dojo.byId("divDirectionsContainer" + key).style.display = "none";
    }
    var tableInfo = dojo.create("table");
    tableInfo.id = "tableInfo" + key;
    if (!isMobileDevice) {
        tableInfo.style.marginLeft = "10px";
    } else {
        tableInfo.style.paddingLeft = "8px";
    }
    tableInfo.style.width = "93%";
    tableInfo.cellSpacing = "0";
    tableInfo.cellPadding = "0";
	tableInfo.className = "tableInfoItem";

    tableInfo.setAttribute('x', featureGeometry.x);
    tableInfo.setAttribute('y', featureGeometry.y);
    tableInfo.setAttribute('layer', key);
    if (!isMobileDevice) {
        if (!isTablet) {
            tableInfo.onmouseover = function (evt) {
                if (map.getLayer(this.getAttribute('layer')).visible) {
                    GlowRipple(this, rendererColor);
                }
            };
            tableInfo.onmouseout = function (evt) {
                HideRipple();
            };
        }
    }
    var tableInfoBody = dojo.create("tbody");
    tableInfo.appendChild(tableInfoBody);
    var tr = dojo.create("tr");
    tableInfoBody.appendChild(tr);
    var td = dojo.create("td");
    td.style.paddingTop = "5px";
	td.style.paddingBottom = "5px";
    tr.appendChild(td);
    var tableData = dojo.create("table");
    td.appendChild(tableData);
    var tableDataBody = dojo.create("tbody");
    tableData.appendChild(tableDataBody);
	
	//Content
    for (var i = 0; i < service.FieldNames.length; i++) {
		if (feature[service.FieldNames[i].FieldName] === null || feature[service.FieldNames[i].FieldName] == showNullValueAs) {continue;} //Do not write entry if no data
		var trData = dojo.create("tr");
        tableDataBody.appendChild(trData);
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
				if (feature[service.FieldNames[i].Links[m].FieldName] == null || feature[service.FieldNames[i].Links[m].FieldName] == showNullValueAs) {continue;} //Do no write empty link
				// Insert separator from previous cell at end of current row
				if(m > 0) {
					var span = trLink.insertCell(-1);
					if (isMobileDevice) {
						span.style.borderLeft = "1px solid white";
					}
					else {
						span.style.borderLeft = "1px solid dimgray";
					}
					span.style.paddingRight = "5px";
				}

				// Create cell for link
				var tdHref = trLink.insertCell(-1);
				tdHref.style.paddingRight = "5px";
				if (service.FieldNames[i].Links[m].type == "tag") {
					var innerSpan = document.createElement("span");
					if (service.FieldNames[i].Links[m].DisplayText) {
						innerSpan.innerHTML = service.FieldNames[i].Links[m].DisplayText + " " + feature[service.FieldNames[i].Links[m].FieldName];
					}
					else {
						innerSpan.innerHTML = feature[service.FieldNames[i].Links[m].FieldName];
					}
					tdHref.appendChild(innerSpan);
				}
				else {
					var aLink = document.createElement("a");
					aLink.className = "focusHighlight";
					aLink.target = "_blank";
					if (service.FieldNames[i].Links[m].type == "web") {
						aLink.href = feature[service.FieldNames[i].Links[m].FieldName];
					}
					else if (service.FieldNames[i].Links[m].type == "mail") {
						aLink.href = "mailto:" + feature[service.FieldNames[i].Links[m].FieldName];
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
			if (service.FieldNames[i].BreakOn && feature[service.FieldNames[i].FieldName].indexOf(service.FieldNames[i].BreakOn) >= 0) {
				var regex = new RegExp(service.FieldNames[i].BreakOn,'g');
				var text = feature[service.FieldNames[i].FieldName];
				tdContent += "<ul><li>" + text.replace(regex,"</li><li>") + "</li></ul>";
			}
			else {
				tdContent += feature[service.FieldNames[i].FieldName]
			}
			if (i == 0) {
				tdContent = "<h3>" + tdContent + " (" + FormatDistance(distance, unitConfig.DirectionsLengthLabel) + ")</h3>";
				if (!isMobileDevice) {
					tdData.setAttribute("onclick","goToFeature(" + String(featureGeometry.x) + "," + String(featureGeometry.y) + ",'" + key + "');");
					tdData.setAttribute("onkeyup","if (event.keyCode == dojo.keys.ENTER || event.keyCode == dojo.keys.SPACE) {goToFeature(" + String(featureGeometry.x) + "," + String(featureGeometry.y) + ",'" + key + "');}");
					tdData.style.cursor = "pointer";
				}
				tdData.setAttribute("tabindex","0");
				tdData.className = "focusHighlight";
				tdData.setAttribute("role","button");
			}
			tdData.innerHTML = tdContent;
		}
    }
    var tdImage = dojo.create("td");
    tdImage.style.textAlign = "right";
	tdImage.style.verticalAlign = "top";
	tdImage.style.paddingTop = "5px";
    tr.appendChild(tdImage);
    var image = dojo.create("img");

    if (!isMobileDevice) {
        if (searchforDirections) {
            var divImage = dojo.create("div", {
                "style": "display:block"
            });
        } else {
            var divImage = dojo.create("div", {
                "style": "display:none"
            });
        }
        tdImage.appendChild(divImage);
        if (isTablet) {
            divImage.onclick = function (evt) {
                HideRipple();
            };
        }
        divImage.appendChild(image);
        image.src = "images/imgDirectionsDark.png";
        image.className = "imgCarouselHeader";
		image.setAttribute("role","button"); //CanAccess
		image.setAttribute("tabindex","0"); //CanAccess

        dojo.addClass(dojo.byId("divContent" + key), "fadeIn");
        dojo.addClass(dojo.byId("divDirectionsContainer" + key), "fadeIn");
        dojo.replaceClass(dojo.byId("divContent" + key), "fadeIn", "fadeOut");
        dojo.replaceClass(dojo.byId("divDirectionsContainer" + key), "fadeIn", "fadeOut");
    } else {
        var divImage = dojo.create("div");
        divImage.className = "mblListItemIcon";
        tdImage.appendChild(divImage);
        divImage.appendChild(image);
        image.src = "images/imgDirectionsLight.png";
    }

    image.id = 'imgDirections' + i + "$" + key;
    image.title = intl.directionsTooltip;
    image.alt = intl.directionsTooltip;
    image.pointer = "cursor";
    image.style.cursor = "pointer";
    image.setAttribute('x', featureGeometry.x);
    image.setAttribute('y', featureGeometry.y);
    image.setAttribute('routeObjectId', feature[map.getLayer(key).objectIdField]);
    image.setAttribute('featureName', feature[service.FieldNames[0].FieldName]);
    image.onclick = function (evt) {
        ShowRouteServices(key, this, feature, featureGeometry, service, false);
    };
	image.onkeyup = function (evt) { //CanAccess
		if (!evt) {evt = event;}//ie7&8 compatibility
		var kc = evt.keyCode;
		if (kc == dojo.keys.ENTER || kc == dojo.keys.SPACE) {
			ShowRouteServices(key, this, feature, featureGeometry, service, false);
		}
	};
    dojo.byId("divContent" + key).appendChild(tableInfo);
    if (!isMobileDevice) {
        dojo.byId("divContent" + key).style.display = "block";
    }
}

//Show route on PC browser

function ShowRouteServices(key, _this, feature, featureGeometry, service, share) {
    if (!isMobileDevice) {
        ShowProgressIndicator();
        map.infoWindow.hide();
        selectedGraphic = null;
        hidePreviousDirections(key);
    }
    ShowServiceLayer(key);
    routeLayer = _this.id.split("$", 2)[1];
    if (share) {
        routeLayer = key;
        var featurePoint = new esri.geometry.Point(Number(featureGeometry.x), Number(featureGeometry.y), map.spatialReference);
    } else {
        var featurePoint = new esri.geometry.Point(Number(_this.getAttribute('x')), Number(_this.getAttribute('y')), map.spatialReference);
        routeID = _this.getAttribute('routeObjectId');
    }
    if (isMobileDevice) {
        dojo.byId("divContent" + key).style.display = "none";
    } else {
        fadeOut(dojo.byId("divContent" + key));
        fadeIn(dojo.byId("divDirectionsContainer" + key));
        setTimeout(function () {
            dojo.byId("divContent" + key).style.display = "none";
            dojo.byId("divDirectionsContainer" + key).style.display = "block";
        }, 500);
    }
    DisplayDirections(this);
    if (!isMobileDevice) {
        if (feature[service.FieldNames[0].FieldName]) {
            dojo.byId("tdDirectionsListName" + key).innerHTML = intl.directionsTo + ' ' + feature[service.FieldNames[0].FieldName];
        } else {
            if (_this.getAttribute('featureName')) {
                dojo.byId("tdDirectionsListName" + key).innerHTML = intl.directionsTo + ' ' + _this.getAttribute('featureName');
            } else {
                dojo.byId("tdDirectionsListName" + key).innerHTML = intl.directionsTo + ' ' + showNullValueAs;
            }
        }
        ConfigureRoute(mapPoint, featurePoint);
    } else {
		dojo.byId("pointMenuList").style.display = "none";
        dojo.byId("tblToggleHeader" + key).style.display = "none";
        dojo.byId("divRepresentativeScrollContent" + key).style.display = "none";
        dojo.byId("getDirection").style.display = "none";
        ShowMblRouteService(key, featurePoint, feature[service.FieldNames[0].FieldName]);
    }
}

//Show route on mobile browser

function ShowMblRouteService(key, featurePoint, destName) {
    dojo.destroy("divRepresentativeDataPointDetails" + key);
    dojo.destroy(dojo.byId("divRepresentativeDataPointContainer" + key));
    ConfigureRoute(mapPoint, featurePoint, key, destName);
    dojo.byId("divListContainer").style.display = "none";
    dojo.byId('divMobileContainerView').style.display = "none";
    dojo.replaceClass("divMobileContainerView", "opacityShowAnimation", "opacityHideAnimation");
    dojo.replaceClass("divMobileContainerDetails", "hideContainer", "showContainer");

}

//Hide the directions container

function hidePreviousDirections(key) {
    for (var index in services) {
        if (index != key) {
            if (dojo.byId("divDirectionsContainer" + index).style.display == "block") {
                fadeOut(dojo.byId("divDirectionsContainer" + index));
                dojo.byId("divDirectionsContainer" + index).style.display = "none";
                fadeIn(dojo.byId("divContent" + index));
                dojo.byId("divContent" + index).style.display = "block";
            }
        }
    }
}

function fadeIn(container) {
    dojo.replaceClass(container, "fadeIn", "fadeOut");
}

function fadeOut(container) {
    dojo.replaceClass(container, "fadeOut", "fadeIn");
}

//Display map layers

function ShowServiceLayer(layer) {
    if (!layer) {
        return;
    }
    HideServiceLayers();
    dojo.byId("imgShare").setAttribute("selectedPod", layer);
    map.infoWindow.hide();
    if (map.getLayer(layer).geometryType != "esriGeometryPoint") {
        if (map.getLayer(layer).getSelectedFeatures().length > 0) {
            if (shareFlag) {

                map.setExtent(startExtent);
            } else {
                map.setExtent(GetExtentFromPolygon(map.getLayer(layer).getSelectedFeatures()[0].geometry.getExtent().expand(2)));
            }
            map.getLayer(layer).show();
            if (isMobileDevice) {
                var center = map.getLayer(layer).graphics[0].geometry.getExtent().getCenter();
                selectedGraphic = center;
                DisplayMblInfo(selectedGraphic, layer);
                map.centerAt(selectedGraphic);
            }
        }
    } else {
        map.getLayer(layer).show();
    }
}

//Hide map layers

function HideServiceLayers() {
    dojo.byId("imgShare").setAttribute("selectedPod", null);
    map.graphics.clear();
    map.getLayer(routeLayerId).hide();
    if (!shareFlag) {
        routeID = null;
        featureID = null;
    }
    for (var index in services) {
        if (map.getLayer(index)) {
            map.getLayer(index).hide();
        }
    }
}

//Get extent of polygon

function GetExtentFromPolygon(extent) {
    var width = extent.getWidth();
    var height = extent.getHeight();
    var xmin = extent.xmin;
    var ymin = extent.ymin - ((2 * height) / 12);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//Show ripple on mouse over in desktop and tablet browser

function GlowRipple(control, rippleColor) {
    HideRipple();
    var glowPoint = new esri.geometry.Point(Number(control.getAttribute('x')), Number(control.getAttribute('y')), map.spatialReference);
    var layer = map.getLayer(highlightPollLayerId);
    var i = rippleSize;
    var flag = true;
    var intervalID = setInterval(function () {
        layer.clear();
        if (i == rippleSize) {
            flag = false;
        } else if (i == (rippleSize - 4)) {
            flag = true;
        }
        var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, (i - 1) * 2,
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
        new dojo.Color(rippleColor), 6),
        new dojo.Color([0, 0, 0, 0]));

        var graphic = new esri.Graphic(glowPoint, symbol, null, null);
        var features = [];
        features.push(graphic);
        var featureSet = new esri.tasks.FeatureSet();
        featureSet.features = features;
        layer.add(featureSet.features[0]);
        if (flag) i++;
        else i--;
    }, 100);
    intervalIDs[intervalIDs.length] = intervalID;
}

function HideRipple() {
    ClearAllIntervals();
    map.getLayer(highlightPollLayerId).clear();
}

function ClearAllIntervals() {
    for (var i = 0; i < intervalIDs.length; i++) {
        clearTimeout(intervalIDs[i]);
        delete intervalIDs[i];
    }
    intervalIDs.length = 0;
}

//Displays directions to go to the target location

function DisplayDirections(evt) {
    map.getLayer(routeLayerId).clear();
    var key = evt.routeLayer;
    if (!dojo.byId('tblDirectionsList' + key)) {
        if (isMobileDevice) {
            var divDataContainer = dojo.create('div');
            divDataContainer.id = "divDataDirectionsContainer" + key;
            divDataContainer.style.marginTop = "10px";
            dojo.byId("divRepresentativeScrollContent" + key).appendChild(divDataContainer);
        }
        if (!isMobileDevice) {
            var divImage = dojo.create('div');
            divImage.className = "divImageBack";
            divImage.id = 'divDirectionsBack' + key;
            dojo.byId("divDirectionsContainer" + key).appendChild(divImage);

            var imgBack = dojo.create('img');
            divImage.appendChild(imgBack);

            imgBack.id = 'imgDirectionsList' + key;
            imgBack.src = 'images/back.png';
            imgBack.className = "imgCarouselHeader";
            imgBack.style.cursor = 'pointer';
            imgBack.title = intl.directionsBack;
            imgBack.alt = intl.directionsBack;
            imgBack.onclick = function (evt) {
                fadeOut(dojo.byId("divDirectionsContainer" + key));
                fadeIn(dojo.byId("divContent" + key));
                setTimeout(function () {
                    dojo.byId("divDirectionsContainer" + key).style.display = "none";
                    dojo.byId("divContent" + key).style.display = "block";
                }, 500);
            };
			//CanAccess
			imgBack.setAttribute("tabindex","0");
            imgBack.onkeyup = function (evt) {
				if (!evt) {evt = event;}//ie7&8 compatibility
				if (evt.keyCode == dojo.keys.ENTER || evt.keyCode == dojo.keys.SPACE) {
					fadeOut(dojo.byId("divDirectionsContainer" + key));
					fadeIn(dojo.byId("divContent" + key));
					setTimeout(function () {
						dojo.byId("divDirectionsContainer" + key).style.display = "none";
						dojo.byId("divContent" + key).style.display = "block";
					}, 500);
				}
            };
        }
        var divContainer = dojo.create('div');
        divContainer.id = "divDataDirectionsContent" + key;
        divContainer.style.marginTop = "10px";
        if (!isMobileDevice) {
            dojo.byId("divDirectionsContainer" + key).appendChild(divContainer);
        } else {
            divDataContainer.appendChild(divContainer);
            dojo.byId("divDataDirectionsContainer" + key).style.display = 'none';
            divContainer.style.bottom = "2px";
        }

        var directionsListName = dojo.create('table');
        directionsListName.style.width = "87%";
        if (!isMobileDevice) {
            directionsListName.style.marginLeft = "10px";
            directionsListName.cellPadding = "0";
            directionsListName.cellSpacing = "0";
        }
        divContainer.appendChild(directionsListName);

        var tbodyDirectionsListName = dojo.create('tbody');
        directionsListName.appendChild(tbodyDirectionsListName);

        var trDirectionsListName = dojo.create('tr');
        tbodyDirectionsListName.appendChild(trDirectionsListName);

        var tdDirectionsList = dojo.create('td');
        tdDirectionsList.id = 'tdDirectionsListName' + key;
        tdDirectionsList.style.verticalAlign = "top";
        trDirectionsListName.appendChild(tdDirectionsList);

        var directionsList = dojo.create('table');
        directionsList.id = 'tblDirectionsList' + key;

        if (!isMobileDevice) {
            directionsList.style.marginLeft = '10px';
            directionsList.style.width = "95%";
            directionsList.style.borderBottom = "dimgray 1px dashed";
        } else {
            directionsList.style.paddingLeft = '10px';
            directionsList.style.width = "97%";
            directionsList.style.borderBottom = "solid white 1px";
        }
        directionsList.cellSpacing = 0;
        directionsList.cellPadding = 0;
        divContainer.appendChild(directionsList);

        var tbodyDirectionsList = dojo.create('tbody');
        directionsList.appendChild(tbodyDirectionsList);

        var trDirectionsList = dojo.create('tr');
        tbodyDirectionsList.appendChild(trDirectionsList);
        if (isMobileDevice) {
            trDirectionsList.style.paddingLeft = '10px';
        }

        var trDirectionsTime = dojo.create('tr');
        tbodyDirectionsList.appendChild(trDirectionsTime);

        var tdDirectionsDirections = dojo.create('td');
        tdDirectionsDirections.id = 'tdDirectionsListDirections' + key;
        trDirectionsTime.appendChild(tdDirectionsDirections);

        var tdDirectionsTime = dojo.create('td');
        tdDirectionsTime.id = 'tdDirectionsListTime' + key;
        trDirectionsTime.appendChild(tdDirectionsTime);
    } else {
        if (!isMobileDevice) {
            dojo.byId("divDirectionsContainer" + key).style.display = 'block';
        } else {
            dojo.byId("divDataDirectionsContainer" + key).style.display = "block";
            dojo.byId("divRepresentativeScrollContent" + key).style.display = "block";
        }
    }

    if (!dojo.byId("divRouteListContainer" + key)) {
        var divRouteListContainer = dojo.create('div');
        divRouteListContainer.id = "divRouteListContainer" + key;

        if (!isMobileDevice) {
            divRouteListContainer.style.marginTop = '2px';
            divRouteListContainer.style.position = "relative";
            dojo.byId("divDirectionsContainer" + key).appendChild(divRouteListContainer);
            dojo.byId("divDirectionsContainer" + key).appendChild(divRouteListContainer);
        } else {
            divRouteListContainer.className = "divRepresentativeDataContainer";
            divDataContainer.appendChild(divRouteListContainer);
        }

        var divRouteListContent = dojo.create('div');
        divRouteListContent.id = 'divRouteListContent' + key;
        divRouteListContent.className = 'focusHighlightInset';
		divRouteListContent.style.overflow = "auto";
        if (!isMobileDevice) {
            divRouteListContent.style.width = "400px";
            divRouteListContent.style.position = "absolute";
            divRouteListContent.style.marginLeft = "10px";
            if (isTablet) {
                divRouteListContent.style.height = "80px";
            } else {
                divRouteListContent.style.height = "125px";
            }
        } else {
            divRouteListContent.className = "divRepresentativeDirectionScrollContent";
        }
        divRouteListContainer.appendChild(divRouteListContent);
    } else {
        dojo.byId("divRouteListContainer" + key).style.display = 'block';
    }
    map.getLayer(routeLayerId).show();
}

//Open website on click of URL link

function OpenWebSite(webURL) {
    var url = (webURL === null) ? "" : webURL;
    if (url !== "") {
        if (url.indexOf('http://') == -1) {
            url = "http://" + url;
        }
        window.open(url);
    }
}

//Open email application

function OpenServiceMail(email) {
    (email === null) ? "" : window.location = "mailto:" + email;
}

//Query point and polygon services

function QueryService(mapPoint) {
    counter = 0;
    for (var i in services) {
        if (!services[i].distance) {
            counter++;
            QueryRecords(i, services[i], mapPoint);
        } else {
            counter++;
            BufferRadius(mapPoint, i, services[i]);
        }
    }
}

//Query polygon services

function QueryRecords(key, service, mapPoint) {
    var queryTask = new esri.tasks.QueryTask(service.ServiceUrl);
    var query = new esri.tasks.Query();
    query.geometry = mapPoint;
    query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_WITHIN;
    query.outFields = ["*"];
    query.returnGeometry = true;
    map.getLayer(key).selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function (features) {
        map.getLayer(key).hide();
        counter--;
        if (features.length > 0) {
            if (!isMobileDevice) {
                dojo.byId('td' + key).style.display = "";
            }
            dojo.byId('div' + key).style.display = "block";
            if (isMobileDevice) {
                dojo.byId("li_" + key).style.display = "block";
            }
            CreateServicePolygonInfo(service, features[0], key);
        } else {
            if (!isMobileDevice) {
                dojo.byId('td' + key).style.display = "none";
            }
            dojo.byId('div' + key).style.display = "none";
            if (isMobileDevice) {
                dojo.byId("li_" + key).style.display = "none";
            }
        }
        if (counter === 0) {
            ValidateResults(mapPoint);
            ShareServices();
        }
    });
}

//Query Point services

function BufferRadius(mapPoint, index, serviceInfo) {
    RemoveChildren(dojo.byId("divContent" + index));
    var params = new esri.tasks.BufferParameters();
    params.geometries = [mapPoint];
    params.distances = [serviceInfo.distance];
    params.unit = esri.tasks.GeometryService.UNIT_STATUTE_MILE;
    params.bufferSpatialReference = map.spatialReference;
    params.outSpatialReference = map.spatialReference;
    geometryService.buffer(params, function (geometry) {
        var query = new esri.tasks.Query();
        query.geometry = geometry[0];
        query.where = "1=1";
        query.outFields = ["*"];
        query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_CONTAINS;
        query.returnGeometry = true;
        map.getLayer(index).selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function (featureset) {
            counter--;
            map.getLayer(index).hide();
            var featureSet = [];
            for (var i = 0; i < featureset.length; i++) {
                for (var j in featureset[i].attributes) {
                    if (!featureset[i].attributes[j]) {
                        featureset[i].attributes[j] = showNullValueAs;
                    }
                }
                var directions = [];
                if (mapPoint) {
                    var dist = GetDistance(mapPoint, featureset[i].geometry);
                    var distanceMiles = dojo.number.format(dist);
                }
                featureSet.push({
                    name: serviceInfo.Name,
                    attributes: featureset[i].attributes,
                    geometry: featureset[i].geometry,
                    distance: distanceMiles
                });
            }

            featureSet.sort(function (a, b) {
                return a.distance - b.distance;
            });

            if (featureSet.length > 0) {
                for (var i = 0; i < featureSet.length; i++) {
                    dojo.byId('div' + index).style.display = "block";
                    if (isMobileDevice) {
                        dojo.byId("li_" + index).style.display = "block";
                    }
                    CreateServicePointInfo(serviceInfo, featureSet[i].attributes, index, featureSet[i].distance, featureSet[i].geometry);
                }
            } else {
                if (serviceInfo.ShowBeyondBuffer) {
                    var query = new esri.tasks.Query();
                    query.where = "1=1";
                    query.outFields = ["*"];
                    query.returnGeometry = true;
                    map.getLayer(index).selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function (feature) {
                        var Feature = [];
                        for (var i = 0; i < feature.length; i++) {
							if (i > 5) {
								break;
							}
                            for (var j in feature[i].attributes) {
                                if (!feature[i].attributes[j]) {
                                    feature[i].attributes[j] = showNullValueAs;
                                }
                            }
                            if (mapPoint) {
                                var dist = GetDistance(mapPoint, feature[i].geometry);
                                var distanceMiles = dojo.number.format(dist);
                            }
                            Feature.push({
                                name: serviceInfo.Name,
                                attributes: feature[i].attributes,
                                geometry: feature[i].geometry,
                                distance: distanceMiles
                            });
                        }
                        Feature.sort(function (a, b) {
                            return a.distance - b.distance;
                        });
                        for (var i = 0; i < Feature.length; i++) {
                            dojo.byId('div' + index).style.display = "block";
                            if (isMobileDevice) {
                                dojo.byId("li_" + index).style.display = "block";
                            }
                            CreateServicePointInfo(serviceInfo, Feature[i].attributes, index, Feature[i].distance, Feature[i].geometry);
                        }
                    });
                } else {
                    dojo.byId('div' + index).style.display = "none"
                    if (isMobileDevice) {
                        dojo.byId("li_" + index).style.display = "none";
                    }
                }
            }
            if (counter === 0) {
                ValidateResults(mapPoint);
                ShareServices();
            }
			query.geometry
        });
    });
}

//Validate availability of services in the user selected area

function ValidateResults(mapPoint) {
    HideServiceLayers();
    HideProgressIndicator();
    var layerCount = 0;
    var hiddenCount = 0;
    for (var index in services) {
        layerCount++;
        if (dojo.byId('div' + index).style.display == "none") {
            hiddenCount++;
        }
    }
    if (layerCount == hiddenCount) {
        if (!isMobileDevice) {
            WipeOutResults();
        }
        alert(messages.getElementsByTagName("servicesNotAvailable")[0].childNodes[0].nodeValue);
        return;
    }
    if (!isMobileDevice) {
        WipeInResults(true);
    } else {
        selectedGraphic = mapPoint;
        map.infoWindow.resize(225, 60);
        map.setExtent(GetBrowserMapExtent(selectedGraphic));
        selectedMapPoint = mapPoint;
        var screenPoint = map.toScreen(selectedMapPoint);
        screenPoint.y = map.height - screenPoint.y;
        map.infoWindow.show(screenPoint);
        if (isMobileDevice) {
            map.infoWindow.setTitle(intl.address);
            dojo.connect(map.infoWindow.imgDetailsInstance(), "onclick", function () {
                if (isMobileDevice) {
                    map.infoWindow.hide();
                    selectedMapPoint = null;
                    dojo.byId('divListContainer').style.display = "block";
                    dojo.byId('menuList').style.display = "none";
                    dojo.byId('divMobileContainerView').style.display = "block";
                    SetContentHeight("divDataListContent", 60);
                    dojo.replaceClass("divMobileContainerView", "opacityShowAnimation", "opacityHideAnimation");
                    dojo.replaceClass("divMobileContainerDetails", "showContainer", "hideContainer");
                }
                dojo.byId('divInfoContent').style.display = "block";
            });
        }
    }
}

//Handle sharing functionality

function ShareServices() {
    var extent = GetQuerystring('extent');
    if (shareFlag) {
        if (window.location.toString().split("$point=").length > 1) {
            if (window.location.toString().split("$point=")[1].split("$selectedPod=").length >= 1) {
                if (window.location.toString().split("$point=")[1].split("$selectedPod=")[1]) {
                    var url = esri.urlToObject(window.location.toString());
                    if (isMobileDevice) {
                        routeID = url.query.extent.split("$point=")[1].split("$routeID=")[1];
                        if (routeID) {
                            routeID = url.query.extent.split("$point=")[1].split("$routeID=")[1];
                            ExecuteRouteQueryTask();
                        } else {
                            ShowServiceLayer(window.location.toString().split("$point=")[1].split("$selectedPod=")[1]);
                        }
                    } else {
                        ShowServicePods(window.location.toString().split("$point=")[1].split("$selectedPod=")[1].split("$pos=")[0], true);
                        featureID = url.query.extent.split("$point=")[1].split("$featureID=")[1];
                        routeID = url.query.extent.split("$point=")[1].split("$routeID=")[1];
                        if (featureID && !routeID) {
                            featureID = url.query.extent.split("$point=")[1].split("$pos=")[0].split("$featureID=")[1];
                            ExecuteQueryTask();
                        }
                        if (routeID && !featureID) {
                            routeID = true;
                            routeID = url.query.extent.split("$point=")[1].split("$routeID=")[1].split("$pos=")[0];
                            ExecuteRouteQueryTask();
                        }
                        if (featureID && routeID) {
                            featureID = url.query.extent.split("$point=")[1].split("$pos=")[0].split("$featureID=")[1].split("$routeID=")[0];
                            routeID = url.query.extent.split("$point=")[1].split("$routeID=")[1].split("$pos=")[0];
                            ExecuteRouteFeatureQueryTask();
                        }
                    }
                }
            }
        }
    }
    if (!routeID) {

        shareFlag = false;
    }
}

//Display mobile info callout

function DisplayMblInfo(mapPoint, layer, targetName) {
    var key = layer;
    map.infoWindow.resize(225, 60);
    if (map.getLayer(layer).geometryType == "esriGeometryPoint") {
        targetName = dojo.string.substitute(targetName).trimString(14);
        map.infoWindow.setTitle(targetName);
        map.infoWindow.setContent(intl.directionsTooltip);
    } else {
        map.infoWindow.setTitle(layer);
        map.infoWindow.setContent("");
    }
    setTimeout(function () {
        selectedMapPoint = mapPoint;
        var screenPoint = map.toScreen(selectedMapPoint);
        screenPoint.y = map.height - screenPoint.y;
        map.infoWindow.show(screenPoint);
        if (isMobileDevice) {
            if (map.getLayer(layer).geometryType != "esriGeometryPoint") {
                dojo.connect(map.infoWindow.imgDetailsInstance(), "onclick", function () {
                    if (isMobileDevice) {
                        map.infoWindow.hide();
                        dojo.byId('divMobileContainerView').style.display = "block";
                        dojo.replaceClass("divMobileContainerView", "opacityShowAnimation", "opacityHideAnimation");
                        dojo.replaceClass("divMobileContainerDetails", "showContainer", "hideContainer");
                        dojo.byId('divListContainer').style.display = "none";
                        dojo.byId("divRepresentativeDataContainer").style.display = "block";
                        dojo.byId("tblToggleHeader" + key).style.display = "block";
                        dojo.byId("divRepresentativeScrollContainer" + key).style.display = "block";
                        dojo.byId("divRepresentativeScrollContent" + key).style.display = "block";

                        SetContentHeight("divContent" + key, 80);
                        SetContentHeight("divRepresentativeScrollContent" + key, 80);
						
						dojo.byId("divRepresentativeScrollContainer" + key).style.overflow = "auto";
						console.warn("Untested scrolling container");
						
                        dojo.byId('menuList').style.display = "block";
                    }
                });
            } else {
                dojo.connect(map.infoWindow.imgDetailsInstance(), "onclick", function () {
                    map.infoWindow.hide();
                    dojo.byId("tdListHeader").innerHTML = targetName;
                    dojo.byId("divListContainer").style.display = "none";
                    dojo.byId('divMobileContainerView').style.display = "block";
                    dojo.replaceClass("divMobileContainerView", "opacityShowAnimation", "opacityHideAnimation");
                    dojo.replaceClass("divMobileContainerDetails", "showContainer", "hideContainer");
                    dojo.byId("divDataDirectionsContainer" + key).style.display = "block";
                    dojo.byId("divRepresentativeScrollContent" + key).style.display = "block";
                    dojo.byId("divRepresentativeDataContainer").style.display = "block";
                    dojo.byId("tblToggleHeader" + key).style.display = "block";
                    dojo.byId("divRepresentativeScrollContainer" + key).style.display = "block";
                    dojo.byId('getDirection').style.display = "none";
                    dojo.byId('goBack').style.display = "none";
                    dojo.byId('pointMenuList').style.display = "none";
                    SetContentHeight("divRouteListContent" + key, 150);

                    dojo.connect(dojo.byId("pointMenuList"), "onclick", function () {
                        dojo.byId("divDataDirectionsContainer" + key).style.display = "none";
                        dojo.byId("divRepresentativeScrollContent" + key).style.display = "none";
                        dojo.byId("tdListHeader").innerHTML = infoContent;
                        dojo.byId("divContent" + key).style.display = "block";
                        dojo.byId("divRepresentativeScrollContent" + key).style.display = "block";
                        dojo.byId("tblToggleHeader" + key).style.display = "block";
                        dojo.byId("pointMenuList").style.display = "none";
                        dojo.byId('menuList').style.display = "block";
                        SetContentHeight("divContent" + key, 80);
                        SetContentHeight("divRepresentativeScrollContent" + key, 80);
                    });
                });
            }
        }
    }, 500);
}

//Create list of services available for mobile

function CreateListLayOut() {
    if (isMobileDevice) { //If mobile device, list items are created
        var listServiceTypesContainer = dijit.byId("listContainer");
        for (var i in services) {
            var li = dojo.create("LI");
            listServiceTypesContainer.containerNode.appendChild(li);
            var itemWidget = new dojox.mobile.ListItem({
                label: services[i].Name.trimString(20),
                id: "li_" + i,
                icon: "images/arrow.png"
            }, li);
            itemWidget.startup();
            itemWidget.domNode.setAttribute("key", i);
            MblDataDisplay(i);
            dojo.connect(itemWidget.domNode, "onclick", function (e) {
                key = this.getAttribute("key");
                dojo.byId('divListContainer').style.display = "none";
                dojo.byId("divRepresentativeDataContainer").style.display = "block";
                dojo.byId("tblToggleHeader" + key).style.display = "block";
                dojo.byId("divRepresentativeScrollContainer" + key).style.display = "block";
                dojo.byId("divRepresentativeScrollContent" + key).style.display = "block";
                SetContentHeight("divContent" + key, 80);
                SetContentHeight("divRepresentativeScrollContent" + key, 80);
                dojo.byId("menuList").style.display = "block";
                selectedFieldName = key;
            });
            dojo.connect(dojo.byId("menuList"), "onclick", function (e) {
                for (var i in services) {
                    ToggleHeaderIcons(i);
                }
            });
            if (listServiceTypesContainer.redrawBorders) {
                listServiceTypesContainer.redrawBorders();
            }
        }
    }
}

//Clear the layers and the data when ever the user click on close icon in the mobile header

function HideMainContainer() {
    map.infoWindow.hide();
    mapPoint = null;
    selectedGraphic = null;
    HideServiceLayers();
    RemoveChildren(dojo.byId('divRepresentativeDataContainer'));
    dojo.byId('goBack').style.display = "none";
    dojo.byId('getDirection').style.display = "none";
    dojo.byId('pointMenuList').style.display = "none";
    dojo.byId('divMobileContainerView').style.display = "none";
    dojo.replaceClass("divMobileContainerView", "opacityShowAnimation", "opacityHideAnimation");
    dojo.replaceClass("divMobileContainerDetails", "hideContainer", "showContainer");
    dojo.byId('divListContainer').style.display = "block";
    dojo.byId("divRepresentativeDataContainer").style.display = "none";
}

//Create Dom elements and store data in the containers

function MblDataDisplay(key) {
    if (key) {
        var divDataHeader = dojo.byId("divRepresentativeDataContainer");
        var tblToggle = dojo.create("table");
        tblToggle.id = "tblToggleHeader" + key;
        tblToggle.style.paddingLeft = "12px";
        tblToggle.cellSpacing = 0;
        tblToggle.cellPadding = 0;
        divDataHeader.appendChild(tblToggle);

        var tbodyToggle = dojo.create("tbody");
        tblToggle.appendChild(tbodyToggle);

        var trToggle = dojo.create("tr");
        trToggle.className = "trToggleHeader";
        tbodyToggle.appendChild(trToggle);

        var tdToggle = dojo.create("td");
        trToggle.appendChild(tdToggle);
        tdToggle.innerHTML = (services[key].Name).bold();

        var divRepresentativeScrollContainer = dojo.create("div");
        divRepresentativeScrollContainer.id = "divRepresentativeScrollContainer" + key;
        divRepresentativeScrollContainer.className = "divRepresentativeDataContainer";
        divRepresentativeScrollContainer.style.bottom = "0px";
        divDataHeader.appendChild(divRepresentativeScrollContainer);

        var divRepresentativeScrollContent = dojo.create("div");
        divRepresentativeScrollContent.id = "divRepresentativeScrollContent" + key;
		if (isMobileDevice) {
			divRepresentativeScrollContent.style.overflow = "hidden";
		}
        divRepresentativeScrollContent.className = "divRepresentativeScrollContent";
        divRepresentativeScrollContent.style.bottom = "0px";
        divRepresentativeScrollContainer.appendChild(divRepresentativeScrollContent);

        var tblDataContainer = dojo.create("table");
        tblDataContainer.style.textAlign = "left";
        tblDataContainer.style.width = "100%";

        var trDataContainer = dojo.create("tr");
        tblDataContainer.appendChild(trDataContainer);

        var tdDataContainer = dojo.create("td");
        trDataContainer.appendChild(tdDataContainer);
        divRepresentativeScrollContent.appendChild(tblDataContainer);
        tdDataContainer.appendChild(dojo.byId("divContent" + key));

        dojo.byId("divRepresentativeScrollContainer" + key).style.display = "none";
        dojo.byId("divRepresentativeScrollContent" + key).style.display = "none";
        dojo.byId("tblToggleHeader" + key).style.display = "none";
    }
}

//Toggle the header icons in mobile

function ToggleHeaderIcons(key) {
    dojo.byId("divRepresentativeDataContainer").style.display = "none";
    dojo.byId("tblToggleHeader" + key).style.display = "none";
    dojo.byId("divRepresentativeScrollContainer" + key).style.display = "none";
    dojo.byId("divRepresentativeScrollContent" + key).style.display = "none";
    dojo.byId("menuList").style.display = "none";
    dojo.byId('divListContainer').style.display = "block";
    SetContentHeight("divDataListContent", 60);
}

//Get the extent based on the map point

function GetBrowserMapExtent(mapPoint) {
    var width = map.extent.getWidth();
    var height = map.extent.getHeight();
    var xmin = mapPoint.x - (width / 2);
    var ymin = mapPoint.y - (height / 4);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//Get the extent based on the map point for mobile

function GetMobileMapExtent(mapPoint) {
    var width = map.extent.getWidth();
    var height = map.extent.getHeight();
    var xmin = mapPoint.x - (width / 2);
    var ymin = mapPoint.y - (height / 2);
    var xmax = xmin + width;
    var ymax = ymin + height;
    return new esri.geometry.Extent(xmin, ymin, xmax, ymax, map.spatialReference);
}

//Calculate distance between two mapPoints

function GetDistance(startPoint, endPoint) {
    var sPoint = esri.geometry.webMercatorToGeographic(startPoint);
    var ePoint = esri.geometry.webMercatorToGeographic(endPoint);
    var lon1 = sPoint.x;
    var lat1 = sPoint.y;
    var lon2 = ePoint.x;
    var lat2 = ePoint.y;
    var theta = lon1 - lon2;
    var dist = Math.sin(Deg2Rad(lat1)) * Math.sin(Deg2Rad(lat2)) + Math.cos(Deg2Rad(lat1)) * Math.cos(Deg2Rad(lat2)) * Math.cos(Deg2Rad(theta));
    dist = Math.acos(dist);
    dist = Rad2Deg(dist);
    dist = dist * 60 * 1.1515;
	if (unitConfig.DirectionsLengthUnit == "KM") {
		dist = dist * 1.60934;
	}
	return dist;
    //return (dist * 10) / 10;
}

//Convert degrees to radians

function Deg2Rad(deg) {
    return (deg * Math.PI) / 180.0;
}

//Convert radians to degrees

function Rad2Deg(rad) {
    return (rad / Math.PI) * 180.0;
}

//Get width of a control when text and font size are specified
String.prototype.getWidth = function (fontSize) {
    var test = dojo.create("span");
    document.body.appendChild(test);
    test.style.visibility = "hidden";

    test.style.fontSize = fontSize + "px";

    test.innerHTML = this;
    var w = test.offsetWidth;
    document.body.removeChild(test);
    return w;
};

//Slide the carousel pods to the right

function SlideRight() {
    var difference = dojo.byId("divCarouselDataContainer").offsetWidth - dojo.byId("divCarouselDataContent").offsetWidth;
    if (newLeft > difference) {
        dojo.byId('divLeftArrow').style.display = "block";
        dojo.byId('divLeftArrow').style.cursor = "pointer";
        newLeft = newLeft - (infoBoxWidth + 9);
        dojo.byId("divCarouselDataContent").style.left = newLeft + "px";
        dojo.addClass("divCarouselDataContent", "slidePanel");
        ResetSlideControls();
    }
}

//Slide the carousel pods to the left

function SlideLeft() {
    if (newLeft < 0) {
        if (newLeft > -(infoBoxWidth + 9)) {
            newLeft = 0;
        } else {
            newLeft = newLeft + (infoBoxWidth + 9);
        }
        if (newLeft >= -10) {
            newLeft = 0;
        }
        dojo.byId("divCarouselDataContent").style.left = (newLeft) + "px";
        dojo.addClass("divCarouselDataContent", "slidePanel");
        ResetSlideControls();
    }
}

//Slide to the selected info box in the bottom panel

function Slide(position) {
    newLeft = -(position);
    if (position < 10) {
        newLeft = 0;
    }
    if (position > infoBoxWidth) {
        dojo.byId('divLeftArrow').style.display = "block";
        dojo.byId('divLeftArrow').style.cursor = "pointer";
    }
    dojo.byId("divCarouselDataContent").style.left = -(position) + "px";
    dojo.addClass("divCarouselDataContent", "slidePanel");
    ResetSlideControls();
}

//reset the slide controls

function ResetSlideControls() {
	dojo.byId("divCarouselDataContent").style.display = "block";
    if (newLeft > dojo.byId("divCarouselDataContainer").offsetWidth - dojo.byId("divCarouselDataContent").offsetWidth) {
        dojo.byId('divRightArrow').style.display = "block";
        dojo.byId('divRightArrow').style.cursor = "pointer";
    } else {
        dojo.byId('divRightArrow').style.display = "none";
        dojo.byId('divRightArrow').style.cursor = "default";
    }
    if (newLeft == 0) {
        dojo.byId('divLeftArrow').style.display = "none";
        dojo.byId('divLeftArrow').style.cursor = "default";
    } else {
        dojo.byId('divLeftArrow').style.display = "block";
        dojo.byId('divLeftArrow').style.cursor = "pointer";
    }
}