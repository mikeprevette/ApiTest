// This is total shit JS, please no judgy. 

/* ####################################----PLAYPLEX----#################################### */
var xrsBool = false;
var playplexStyle = false;
var isPromoError = false;
var isImgError = false;
var hasAllShows = false;
var firstRun = true;
var imageParams = '&width=450&quality=0.2';
var xrs = '?xrs=vdapi_00_ba851eb8cd0e90efb7d099a8628e05a8';
var apiVersion = '1.7'; //Default  - Overridden by apps.json
var appVersion = '4.1'; //Default  - Overridden by apps.json
var liveRootURL = 'http://api.playplex.viacom.com/feeds/networkapp/intl';
var stagingRootURL = 'http://testing.api.playplex.viacom.vmn.io/feeds/networkapp/intl';
var activeSeries, brand, platform, region, stage, isisURL, params;
var cardLinks = [];
var card = Object.create(null);


function makeTheScreen() {
	$.getJSON("apps.json", function(appsList) {
			$.each(appsList.apps, function(z, apps) {
				$('#selector')
         .append($("<option></option>")
                    .attr("value", apps.app.brand +','+ apps.app.platform +','+ apps.app.country +','+ apps.app.stage + ',' + apps.app.arcSpace + ',' + apps.app.apiVersion + ',' + apps.app.appVersion)
                    .text(apps.app.name)); 	
			}
			)}
	);
// 	$('<div />', {
// 								'id': 'stage',
// 								'class': 'downloadButton',
// 								'text': 'Live',
// 								'onclick': 'stage="staging";buildPlayPlex();'
// 							}).appendTo('#top');
	
	if (firstRun === true) {
		alert("Hello! This is an unsupported tool, and will likely break often. \n\n Things to note: \n -- no loading spinners (be patient) \n -- no pagination (25item max)\n -- error if you change brands while its still loading");
		stringToParams ("mtv,ios,gb,live,mtv-intl-uk-authoring,1.7,4.1");
	}
}

function stringToParams (buildString){
	console.log(buildString);
	var splits = buildString.split(',');
	brand = splits[0];
	console.log(brand);
	//addURLParam("brand", brand);
	platform = splits[1];
	console.log(platform);
	//addURLParam("platform", platform);
	region = splits[2];
	console.log(region);
	//addURLParam("region", region);
	stage = splits[3];
	console.log(stage);
	
	isisURL = 'http://isis.mtvnservices.com/Isis.html#module=content&site='+ splits[4] +'&id=';
	console.log(splits[4]);
	
	apiVersion = splits[5];
	console.log(apiVersion);
	//addURLParam("stage", stage);
	appVersion = splits[6];
	console.log(appVersion);
	buildPlayPlex(brand,stage,platform,region,apiVersion,appVersion);
}

//####################################----Build The Series Modules----####################################

function buildPlayPlex(brand,stage,platform,region,apiVersion,appVersion) {
// 	functionIsRunning = true;
// 	$('.overlay').show();
	// 	$.ajaxSetup({ cache: false });
	// Poll the home screen, and get it's modules
	firstRun=false;
	nuclear();
	console.log(stage);
	mainPath = '/main/' + apiVersion + '/';
	seriesClipsPath = '/series/clips/' + apiVersion + '/';
	seriesItemsPath = '/series/items/' + apiVersion + '/';
	params = '?key=networkapp1.0&brand=' + brand + '&platform=' + platform + '&region=' + region + '&version=' + appVersion;

	
	if (stage == 'staging') {
		apiUrl = stagingRootURL + mainPath + params;
		seriesItemsURL = stagingRootURL + seriesItemsPath;
		seriesClipsURL = stagingRootURL + seriesClipsPath;
	} else { 
		apiUrl = liveRootURL + mainPath + params;
		seriesItemsURL = liveRootURL + seriesItemsPath;
		seriesClipsURL = liveRootURL + seriesClipsPath;
	}
	console.log(apiUrl);
	
	$.getJSON(apiUrl, function(playplexMain) {
		$.each(playplexMain.data.appConfiguration.screens, function(z, screens) {
			if (screens.screen.name == "home" || screens.screen.name == "allShows" || screens.screen.name == "browse") {
				toLoad = screens.screen.url;
				screenName = screens.screen.name;
				screenID = screens.screen.id;
				getScreen(toLoad, screenName, screenID, z);
				console.log(screens.screen.name + ' ' + toLoad);
			}
		});
	});
}
						
//####################################----Build The Series Modules----####################################
function getScreen(screenURL,screenName,screenID,screenIndex) {
		$.getJSON(screenURL, function(playplexHome) {
			$.each(playplexHome.data.screen.modules, function(z, modules) {
				target = modules.module.dataSource;
				if (modules.module.hasOwnProperty('parameters')) {
					if (modules.module.parameters.hasOwnProperty('aspectRatio')) {
												aspectRatio = modules.module.parameters.aspectRatio;
												console.log(aspectRatio);
							} else {
											aspectRatio = "1:1"; 
								console.log(aspectRatio);
							}
					} else {
									aspectRatio = "1:1";
						console.log(aspectRatio);
				} 
				//build the container Header
				containerId = uuidMaker(modules.module.id) + '_s' + screenIndex + 'm' + z;
				
				$('<div />', {
					'id': 'moduleHeader_' + containerId,
					'class': 'containerHeader',
				}).appendTo('#containers');
				//build the container
				$('<div />', {
					'id': 'module_' + containerId,
					'class': 'container',
				}).appendTo('#containers');

				//add Text to the container Header
				$('<span />', {
					'id': 'containerHeaderText_' + containerId,
					'class': 'containerHeaderText',
					'text': 'Screen: '+ screenName + ' | Promo: ' + modules.module.title
				}).appendTo('#moduleHeader_' + containerId);
				
				//add a Link to the container Header
				$('<span />', {
					'id': 'containerApiButton_' + containerId,
					'class': 'containerApiButton',
					'text': 'PromoList API Output',
					'onclick': 'window.open("'+ target +'");'
				}).appendTo('#moduleHeader_' + containerId);
				if (apiVersion == "1.9") {
				getModule19(target,screenID,containerId,z,aspectRatio);
				} else {
				getModule(target,screenID,containerId,z,aspectRatio);
				}
			})
	})
};



//####################################----Build The Series Modules----####################################
function getModule(moduleURL,screenID,containerId,z,aspectRatio) {
						$.getJSON(moduleURL, function(playplexData) {
										$.each(playplexData.data.items, function(i, cardVal) {
											
											//build the card
											// Check subType:"empty"
											card[cardVal.id];
											card[cardVal.id] = cardVal;
											type = playplexData.data.alias;
											propertyMgid = cardVal.id;
											propertyID = uuidMaker(cardVal.id);
											seriesTitle = cardVal.title.replace(/ /g,"_");
											propertyCardID = uuidMaker(screenID) + '_' + propertyID + '_' + z + i;
											
											//Check to see if the promo is valid
											if (cardVal.subType === "empty" || cardVal.subType === "noUrl") {
												imgUrl = "./img/error.jpg";
												isPromoError = true;
											} else {
												isPromoError = false;
												if (cardVal.hasOwnProperty("images") && cardVal.images.length > 0) {
													for (let c = 0, l = cardVal.images.length; c < l; c++) {
														if (cardVal.images[c].aspectRatio === aspectRatio) {
															imgUrl = cardVal.images[c].url + imageParams;
															cardAspectRatio = aspectRatio.replace(':', 'x');
															isImgError = "false";
															break;
														} else {
															imgUrl = "./img/error.jpg";
															isImgError = "true";
														}
													}
												} else {
													imgUrl = "./img/error.jpg";
													isImgError = "true";
												}
											}
											
											if (type == 'featured_list' || 'shows_list') {

												$('<div />', {
													'id': propertyCardID,
													'class': 'showCard_' + cardAspectRatio,
													'style': 'background-image: url(' + imgUrl +')'
												}).appendTo('#module_' + containerId);
												
												$('<div />', {
													'id': 'errorbox'+ '_' + z + i,
											    'class': 'errorbox'
												}).appendTo('#' + propertyCardID);
												
												if (isPromoError === "true") {
													$('<p />', {
													'class': 'error',
													'text': "Broken Promo ERROR - Likely expired series, in an active promo"
												}).appendTo('#errorbox'+ '_' + z + i);
												}
												if (isImgError === "true") {
													$('<p />', {
													'class': 'error',
													'text': "Broken IMAGE ERROR - Likely no aspectRatio on configObj Art, images not published, or bad image DP"
												}).appendTo('#errorbox'+ '_' + z + i);
												}
													
												
												//build the meta
												$('<div />', {
													'id': 'showCardMeta_' + propertyCardID,
													'class': 'showCardMeta'
												}).appendTo('#' + propertyCardID);
												//build the meta objects
												$('<p />', {
													'id': 'showCardHeader_' + propertyCardID,
													'class': 'showCardHeader',
													'text': cardVal.title
												}).appendTo('#showCardMeta_' + propertyCardID);
												
													$('<p />', {
													'id': 'showCardJsonButton_' + propertyCardID,
													'class': 'showCardJsonButton',
													'text': 'API OUTPUT',
													'onclick': 'showOverlayJson("'+ propertyMgid + '");'
												}).appendTo('#showCardMeta_' + propertyCardID);
												
												$('<p />', {
													'id': 'showCardLink_' + z + i,
													'text': 'ARC Id ' + propertyID,
													'class': 'showCardLink',
													'onclick': 'window.open("' + isisURL + propertyID + '");'
												}).appendTo('#showCardMeta_' + propertyCardID);
												
												//build the Buttons

												if (cardVal.hasPromos == true || cardVal.hasSubItems == true) {
													$('<div />', {
														'id': 'showCardButtonBar_' + propertyCardID,
														'class': 'showCardButtons',
													}).appendTo('#' + propertyCardID);
													
													//console.log(apiVerison);
// 													if (apiVerson == '1.9') {
// 														fullMgid = cardVal.id;
// 													} else { fullMgid = cardval.mgid;}

													// 												if has clips add button, if has episodes add button
													if (cardVal.hasPromos == true) {
														$('<p />', {
															'id': 'showCardButtons_' + z + i,
															'class': 'showCardButton',
															'text': 'Extras',
															'onclick': 'loadContent("' + propertyMgid + '","clip","'+ seriesTitle +'");'
														}).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
													}
													if (cardVal.hasSubItems == true) {
														$('<p />', {
															'id': 'showCardButtons_' + z + i,
															'class': 'showCardButton',
															'text': 'Full Episodes',
															'onclick': 'loadContent("' + propertyMgid + '","episode","'+ seriesTitle +'");'
														}).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
													}
												} else if (isPromoError === false) {
													$('<p />', {
													'class': 'contentError',
													'text': "Broken Series - No Content"
												}).appendTo('#' + propertyCardID);
												}
											}
										});
									});
	}

//####################################----Load Content----####################################

						function loadContent(seriesMgid, contentType, seriesTitle) {
							functionIsRunning = true;
							window.scrollTo(0, 0);
							if (document.getElementById('container_Content') !== null) {
								cleanHouse(container_Content);
							} else {
								$('<div />', {
									'id': 'container_Content',
									'class': 'container',
								}).prependTo('#containers');
							}
							$('<div />', {
								'id': 'contentContainerHeader',
								'class': 'containerHeader',
								'text': contentType
							}).appendTo('#container_Content');
													
							$('<div />', {
								'id': 'CSV',
								'class': 'downloadButton',
								'text': 'DOWNLOAD CONTENT CSV',
								'onclick': 'downloadCSV({ filename: "' + seriesTitle + '_data.csv" });'
							}).appendTo('#buttons');	
							
							episodeLink = seriesItemsURL + seriesMgid + params;
							clipLink = seriesClipsURL + seriesMgid + params;
							
							if (contentType == "episode") {
									targetLink = episodeLink;
									$('<div />', {
									'id': 'episodeAPI',
									'class': 'downloadButton',
									'text': 'OPEN EPISODE API',
									'onclick': 'window.open("'+ episodeLink +'");'
								}).appendTo('#buttons');	
							} else if (contentType == "clip") {
									targetLink = clipLink;
									$('<div />', {
									'id': 'clipAPI',
									'class': 'downloadButton',
									'text': 'OPEN CLIP API',
									'onclick': 'window.open("'+ clipLink +'");'
							}).appendTo('#buttons');	
							}
							//activeSeries = seriesMgid;
							//build the container

							$('.overlay').show();
							$.getJSON(targetLink, function(playplexContent) {
								$.each(playplexContent.data.items, function(i, contentCardVal) {
									tve = "false";
									z = "content";
									imgUrl = "";
									aspectError = "false";
									title = '"' + contentCardVal.title + '"';
									//title = title.replace(",", "%2C");
									
									//title = JSON.stringify(String(contentCardVal.title));
									//console.log(cardVal.distPolicy);
									if (contentCardVal.authRequired === true) {
										tve = "true";
									}


									//Since this is only for Content, Lets assume we're always 16:9
									aspectRatio = "16:9";
									//Set the imag URL based on the aspecRatio
									for (let v = 0, l = contentCardVal.images.length; v < l; v++) {
										if (contentCardVal.images[v].aspectRatio === aspectRatio) {
												imgUrl = contentCardVal.images[v].url + imageParams;
												aspectError = "false";
												console.log("Good Image");
												break;
										} else {
											imgUrl = contentCardVal.images[0].url + imageParams;
											aspectError = "true";
										}
									}
									//console.log(contentCardVal.images[0])

									// 					link = contentCardVal.id; // grabs the ID field
									// 					link = link.substr(link.length - 36); // takes the UUID off the MGID
									// 					link = deeplinkBase.concat(deeplinkPath,link); // ads the Deeplink app root to path + uuid
									link = uuidMaker(contentCardVal.id);
									/* console.log(cardVal.title); */

									//Make a CSV index
									cardLinks.push({title:title, uuid:link});
									
									
									
									$('<div />', {
										'id': i + z,
										'class': 'contentCard',
										'style': 'background-image: url(' + imgUrl + ')'
									}).appendTo('#container_Content');
									$('<div />', {
										'id': 'contentErrorbox'+ '_' + i + z,
										'class': 'errorbox'
									}).appendTo('#' + i + z);

									// put the lock on the card	
									if (tve === "true") {
										$('<div />', {
											'id': 'lock_' + i + z,
											'class': 'lock',
										}).appendTo('#' + i + z);
									}
									if (aspectError === "true") {
										$('<p />', {
											'class': 'error',
											'text': "IMG Error - No 16:9 aspectRatio match, using fallback"
										}).appendTo('#contentErrorbox' + '_' + i + z);
									}

									//build the meta
									$('<div />', {
										'id': 'CardMeta_' + i + z,
										'class': 'CardMeta'
									}).appendTo('#' + i + z);

									//build the meta objects

									$('<p />', {
										'id': 'CardSubHeader_' + i + z,
										'class': 'CardSubHeader',
										'text': contentCardVal.subTitle
									}).appendTo('#CardMeta_' + i + z);

									$('<p />', {
										'id': 'CardHeader_' + i + z,
										'class': 'CardHeader',
										'text': contentCardVal.title
									}).appendTo('#CardMeta_' + i + z);

									$('<p />', {
										'id': 'CardHeaderLink_' + i + z,
										'class': 'CardHeaderLink',
										'text': 'ARC ID: ' + link,
										'onclick': 'window.open("' + isisURL+link + '");'
									}).appendTo('#CardMeta_' + i + z);

								});
							});
						}

//####################################----Build The Series Modules 19----####################################
function getModule19(moduleURL,screenID,containerId,z,aspectRatio) {
						console.log("USING 1.9 LOGIC")
						$.getJSON(moduleURL, function(playplexData) {
										$.each(playplexData.data.items, function(i, cardVal) {
											isImgError = false;
											card[cardVal.mgid];
											card[cardVal.mgid] = cardVal;
											propertyMgid = cardVal.mgid;
											propertyID = cardVal.id;
											propertyType = cardVal.entityType;
											seriesTitle = cardVal.title.replace(/ /g,"_");
											propertyCardID = uuidMaker(screenID) + '_' + propertyID + '_' + z + i;
											
											//Check to see if the promo is valid
											if (propertyType === "empty" || propertyType === "noUrl") {
												imgUrl = "./img/error.jpg";
												isPromoError = true;
											} else {
												isPromoError = false;
												if (cardVal.hasOwnProperty("images") && cardVal.images.length > 0) {
													for (let c = 0, l = cardVal.images.length; c < l; c++) {
														if (cardVal.images[c].aspectRatio === aspectRatio) {
															imgUrl = cardVal.images[c].url + imageParams;
															cardAspectRatio = aspectRatio.replace(':', 'x');
															isImgError = false;
															break;
														} else {
															imgUrl = "./img/error.jpg";
															isImgError = true;
														}
													}
												} else {
													imgUrl = "./img/error.jpg";
													isImgError = true;
												}
											}
// MAKE ALL THE CARDS IN HTML
												$('<div />', {
													'id': propertyCardID,
													'class': 'showCard_' + cardAspectRatio,
													'style': 'background-image: url(' + imgUrl +')'
												}).appendTo('#module_' + containerId);
												
												$('<div />', {
													'id': 'errorbox'+ '_' + z + i,
											    'class': 'errorbox'
												}).appendTo('#' + propertyCardID);
												
												if (isPromoError === true) {
													$('<p />', {
													'class': 'error',
													'text': "Broken Promo ERROR - Likely expired series, in an active promo"
												}).appendTo('#errorbox'+ '_' + z + i);
												}
												if (isImgError === true) {
													$('<p />', {
													'class': 'error',
													'text': "Broken IMAGE ERROR - Likely no aspectRatio on configObj Art, images not published, or bad image DP"
												}).appendTo('#errorbox'+ '_' + z + i);
												}
												
												
												//build the meta
												$('<div />', {
													'id': 'showCardMeta_' + propertyCardID,
													'class': 'showCardMeta'
												}).appendTo('#' + propertyCardID);
												//build the meta objects
												$('<p />', {
													'id': 'showCardHeader_' + propertyCardID,
													'class': 'showCardHeader',
													'text': cardVal.title
												}).appendTo('#showCardMeta_' + propertyCardID);
												
													$('<p />', {
													'id': 'showCardJsonButton_' + propertyCardID,
													'class': 'showCardJsonButton',
													'text': 'API OUTPUT',
													'onclick': 'showOverlayJson("'+ propertyMgid + '");'
												}).appendTo('#showCardMeta_' + propertyCardID);
												
												$('<p />', {
													'id': 'showCardLink_' + z + i,
													'text': 'ARC Id ' + propertyID,
													'class': 'showCardLink',
													'onclick': 'window.open("' + isisURL + propertyID + '");'
												}).appendTo('#showCardMeta_' + propertyCardID);
												
												//build the Buttons
											
											if (cardVal.hasOwnProperty("links")) {
												//console.log(Object.keys(cardVal.links));
												if (cardVal.links.hasOwnProperty("episode")) {
													//console.log(cardVal.links.episode);
													episodeLink = cardVal.links.episode;
													hasEpisodes = true;
												} else {hasEpisodes = false;}
												if (cardVal.links.hasOwnProperty("video")) {
													//console.log(cardVal.links.video);
													videoLink = cardVal.links.video;
													hasVideos = true;
												} else {hasVideos = false}
												if (cardVal.links.hasOwnProperty("playlist")) {
													//console.log(cardVal.links.playlist);
													playlistLink = cardVal.links.playlist;
													hasPlaylists = true;
												} else {hasPlaylists = false}
											}


												if (hasEpisodes === true || hasVideos === true || hasPlaylists === true) {
													$('<div />', {
														'id': 'showCardButtonBar_' + propertyCardID,
														'class': 'showCardButtons',
													}).appendTo('#' + propertyCardID);

													//console.log(apiVerison);
													// 													if (apiVerson == '1.9') {
													// 														fullMgid = cardVal.id;
													// 													} else { fullMgid = cardval.mgid;}

													// 												if has clips add button, if has episodes add button
													if (hasVideos === true) {
														$('<p />', {
															'id': 'showCardButtons_Video' + z + i,
															'class': 'showCardButton',
															'text': 'Extras',
															'onclick': 'loadContentLink("' + videoLink + '","clip","' + seriesTitle + '");'
														}).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
													}
													if (hasEpisodes === true) {
														$('<p />', {
															'id': 'showCardButtons_Episode' + z + i,
															'class': 'showCardButton',
															'text': 'Full Episodes',
															'onclick': 'loadContentLink("' + episodeLink + '","episode","' + seriesTitle + '");'
														}).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
													}
													if (hasPlaylists === true) {
														$('<p />', {
															'id': 'showCardButtons_Playlist' + z + i,
															'class': 'showCardButton',
															'text': 'Playlists',
															'onclick': 'loadContentLink("' + playlistLink + '","playlists","' + seriesTitle + '");'
														}).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
													}
												} else if (isPromoError === false) {
													$('<p />', {
														'class': 'contentError',
														'text': "Broken Series - No Content"
													}).appendTo('#' + propertyCardID);
												}
				}
			);
		});
	}

//####################################----Load Content Links----####################################

						function loadContentLink(contentLink, contentType, seriesTitle) {
							window.scrollTo(0, 0);
							if (document.getElementById('container_Content') !== null) {
								cleanHouse(container_Content);
							} else {
								$('<div />', {
									'id': 'container_Content',
									'class': 'container',
								}).prependTo('#containers');
							}
							$('<div />', {
								'id': 'contentContainerHeader',
								'class': 'containerHeader',
								'text': contentType
							}).appendTo('#container_Content');
													
							$('<div />', {
								'id': 'CSV',
								'class': 'downloadButton',
								'text': 'DOWNLOAD CONTENT CSV',
								'onclick': 'downloadCSV({ filename: "' + seriesTitle + '_data.csv" });'
							}).appendTo('#buttons');	
							
							
							$('<div />', {
									'id': 'episodeAPI',
									'class': 'downloadButton',
									'text': 'OPEN API',
									'onclick': 'window.open("'+ contentLink +'");'
								}).appendTo('#buttons');	

							//activeSeries = seriesMgid;
							//build the container

							$('.overlay').show();
							$.getJSON(contentLink, function(playplexContent) {
								$.each(playplexContent.data.items, function(i, contentCardVal) {
									card[contentCardVal.mgid];
									card[contentCardVal.mgid] = contentCardVal;
									z = "content";
									imgUrl = "";
									tve = "false";
									aspectError = "false";
									imgError = "false";
									title = '"' + contentCardVal.title + '"';
									txtObject = JSON.stringify(contentCardVal, null, 4);
									//title = title.replace(",", "%2C");
									
									//title = JSON.stringify(String(contentCardVal.title));
									//console.log(cardVal.distPolicy);
									if (contentCardVal.authRequired === true) {
										tve = "true";
									}


									//Since this is only for Content, Lets assume we're always 16:9
									aspectRatio = "16:9";
									//Set the imag URL based on the aspecRatio
									
									if (contentCardVal.hasOwnProperty("images") && contentCardVal.images.length > 0) {
										for (let v = 0, l = contentCardVal.images.length; v < l; v++) {
											if (contentCardVal.images[v].aspectRatio === aspectRatio) {
												imgUrl = contentCardVal.images[v].url + imageParams;
												aspectError = "false";
												imgError = "false";
												console.log("Good Image");
												break;
											} else {
												imgUrl = contentCardVal.images[0].url + imageParams;
												aspectError = "true";
												imgError = "false";
											}
										}
									} else {
										imgUrl = "./img/error.jpg";
										aspectError = "false";
										imgError = "true";
									}

									//console.log(contentCardVal.images[0])

									// 					link = contentCardVal.id; // grabs the ID field
									// 					link = link.substr(link.length - 36); // takes the UUID off the MGID
									// 					link = deeplinkBase.concat(deeplinkPath,link); // ads the Deeplink app root to path + uuid
									link = uuidMaker(contentCardVal.id);
									/* console.log(cardVal.title); */

									//Make a CSV index
									cardLinks.push({title:title, uuid:link});
									
									
									
									$('<div />', {
										'id': i + z,
										'class': 'contentCard',
										'style': 'background-image: url(' + imgUrl + ')'
									}).appendTo('#container_Content');
									
									
									$('<p />', {
													'id': 'showCardJsonButton_' + propertyCardID,
													'class': 'showCardJsonButton',
													'text': 'API OUTPUT',
													'onclick': 'showOverlayJson("'+ contentCardVal.mgid + '");'
												}).appendTo('#' + i + z);

									$('<div />', {
										'id': 'contentErrorbox_' + i + z,
										'class': 'errorbox'
									}).appendTo('#' + i + z);

									// put the lock on the card	
									if (tve === "true") {
										$('<div />', {
											'id': 'lock_' + i + z,
											'class': 'lock',
										}).appendTo('#' + i + z);
									}
									if (aspectError === "true") {
										$('<p />', {
											'class': 'error',
											'text': "IMG Error - No 16:9 aspectRatio match, using fallback"
										}).appendTo('#contentErrorbox' + '_' + i + z);
									}
									if (imgError === "true") {
										$('<p />', {
											'class': 'error',
											'text': "IMG Error -Empty or missing images"
										}).appendTo('#contentErrorbox' + '_' + i + z);
									}

									//build the meta
									$('<div />', {
										'id': 'CardMeta_' + i + z,
										'class': 'CardMeta'
									}).appendTo('#' + i + z);

									//build the meta objects

									$('<p />', {
										'id': 'CardSubHeader_' + i + z,
										'class': 'CardSubHeader',
										'text': contentCardVal.subTitle
									}).appendTo('#CardMeta_' + i + z);

									$('<p />', {
										'id': 'CardHeader_' + i + z,
										'class': 'CardHeader',
										'text': contentCardVal.title
									}).appendTo('#CardMeta_' + i + z);

									$('<p />', {
										'id': 'CardHeaderLink_' + i + z,
										'class': 'CardHeaderLink',
										'text': 'ARC ID: ' + link,
										'onclick': 'window.open("' + isisURL+link + '");'
									}).appendTo('#CardMeta_' + i + z);

								});
							});
							$('.overlay').hide();
							functionIsRunning = false;
						}
//####################################----Make a UUID----####################################

						function uuidMaker(mgid) {
							UUID = mgid.substr(mgid.length - 36); // takes the UUID off the MGID
							return (UUID);
}

//####################################----Make a Deeplink----####################################


						function deeplinkBuilder(mgid, parentMgid) {
							UUID = uuidMaker(mgid); // takes the UUID off the MGID
							if (mgid.indexOf("mtvplay") !== -1) {
								deeplinkBase = "mtvnetworkapp://";
							} else if (mgid.indexOf("comedycentralplay") !== -1) {
								deeplinkBase = "ccnetworkapp://";
							} else if (mgid.indexOf("vh1play") !== -1) {
								deeplinkBase = "vh1networkapp://";
							} else deeplinkBase = "fail://";
							//build series deeplinks
							if (mgid.indexOf("episode") !== -1) {
								deeplinkUSPath = "episode/";
								if (playplexStyle === false) {
									deeplink = deeplinkBase.concat(deeplinkUSPath, UUID); // ads the Deeplink app root to path + uuid
								} else {
									deeplink = deeplinkBase.concat('series/', parentMgid, '/', deeplinkUSPath, mgid); // ads the Deeplink app root to path + uuid
								}
							} else if (mgid.indexOf("series") !== -1) {
								deeplinkUSPath = "series/";
								if (playplexStyle === false) {
									deeplink = deeplinkBase.concat(deeplinkUSPath, UUID); // ads the Deeplink app root to path + uuid
								} else {
									deeplink = deeplinkBase.concat(deeplinkUSPath, mgid); // ads the Deeplink app root to path + uuid
								}
							}


							if (xrsBool !== false) {
								deeplink = deeplink.concat(xrs);
							}

							return (deeplink);
						};

//####################################----Handle a Series deeplink----####################################

						function seriesTapHandlerDeeplink(loadMgid) {
							if (confirm("Hit OK to deeplink into series, or hit CANCEL to load it's episodes \n") === true) {
								window.open(deeplinkBuilder(loadMgid, loadMgid));
							} else {
								loadContent(loadMgid);
							}
						};

//####################################----Clean Content----####################################


						function cleanHouse(div) {
							if (div != null) {
								while (div.hasChildNodes()) {
									div.removeChild(div.lastChild);
								}
								$( "#buttons" ).empty();
								cardLinks = [];
							}
						}

//####################################----Clean Content----####################################

						function nuclear() {
								$("#containers").empty();
								$( "#buttons" ).empty();
								cardLinks = [];
							}

//####################################----Toggle JSON Overlays----####################################

function showOverlayJson(mgid) {
	
	var body = document.body;
	body.classList.toggle('noscroll');
	$(overlay).toggle();
	txtObject = JSON.stringify(card[mgid], null, 4);
	document.getElementById('cardJson').innerHTML = txtObject;
	}



//####################################----URL Param----####################################

function addURLParam(paramName,paramValue) {
// 		var url=window.location.href,
// 				separator = (url.indexOf("?")===-1)?"?":"&",
// 				newParam=separator + paramName + '=' + paramValue;
// 				newUrl=url.replace(newParam,"");
// 				newUrl+=newParam;
// 				window.location.href =newUrl;

    var loc = location.href;
    if (loc.indexOf("?") === -1) {
      loc += "?";
			loc = loc + paramName + '=' + paramValue;
			window.history.pushState( {} , '', loc );
		} else {
			 if (string.indexOf(paramName) !== -1){
					 existingParams = loc.split('?');
				 
				 if (existingParams.indexOf('&') !== -1) {
						paramToUpdate = existingParams[1].split('&');
				 } else {
					 	paramToUpdate = existingParams[0];
				 }
				 
				 $.each(paramToUpdate, function(i, param) {
					 if (param.indexOf(paramName) !== -1) {
							 
						}
				 })
			 }
		}
	//if (indexOf(paramName))
	

    loc = loc + paramName + '=' + paramValue;
		window.history.pushState( {} , '', loc );
	}
//####################################----CSV----####################################

function convertArrayOfObjectsToCSV(args) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

function downloadCSV(args) {  
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: cardLinks
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }



