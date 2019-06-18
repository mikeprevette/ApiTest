// This is total shit JS, please no judgy. 

/* ####################################----PLAYPLEX----#################################### */
const imageParams = '&height=640';
const neutronSRootURL = 'http://neutron-api.viacom.tech-s.mtvi.com/feeds/networkapp/intl';
const neutronQARootURL = 'http://qa-neutron-api.viacom.tech/feeds/networkapp/intl';
const neutronLiveRootURL = 'http://neutron-api.viacom.tech/feeds/networkapp/intl';
//const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const corsProxy = 'https://viamprevette.herokuapp.com/';
const mtvPlusDeeplinkRoot = 'mtvplayuk://';
const betPlusDeeplinkRoot = 'betplus://';
const paramountPlusDeeplinkRoot = 'paramountplus://';

var isPromoError = false;
var isImgError = false;
var firstRun = true;
var activeSeries, brand, platform, region, stage, isisURL, params, appVersion, apiVersion, appRating;
var page = 0;
var cardLinks = [];
var card = Object.create(null);
var playPlexMainConfig = Object.create(null);

//####################################----on load parse the apps.json file and prefil the form----####################################


function makeTheScreen(mode) {
  console.log("makeTheScreen");
  $('#welcome').show();
  // 	$("#containers").load(function() {
  //      $('#loadingOverlay').hide();
  // 	});
  if (firstRun === true && mode == "live") {
    //alert("Hello! This is an unsupported tool, and will likely break often. \n\n Things to note: \n -- error if you change brands while its still loading");
    appsJsonFile = "apps.json";
  } else {
    console.log("Dev Mode");
    appsJsonFile = "dev_apps.json";
  }

  $.getJSON(appsJsonFile, function(appsList) {
    //console.log(appsList.apps);
    //console.log(appsList.apps[0].app.name);
    appsList.apps.sort(function(a, b) {
      var textA = a.app.name.toUpperCase();
      var textB = b.app.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    $.each(appsList.apps, function(z, apps) {
      $('#quickSelector')
        .append($("<option></option>")
          .attr("value", apps.app.brand + ',' + apps.app.platform + ',' + apps.app.country + ',' + apps.app.stage + ',' + apps.app.arcSpace + ',' + apps.app.apiVersion + ',' + apps.app.appVersion + ',' + apps.app.appRating)
          .text(apps.app.name));
    })
    $.each(appsList.brands.sort(), function(z, brands) {
      $('#brands')
        .append($("<option></option>")
          .attr("value", brands)
          .text(brands.toUpperCase()));
    })
    $.each(appsList.countries.sort(), function(z, countries) {
      $('#countries')
        .append($("<option></option>")
          .attr("value", countries)
          .text(countries.toUpperCase()));
    })
    $.each(appsList.platforms, function(z, platforms) {
      $('#platforms')
        .append($("<option></option>")
          .attr("value", platforms)
          .text(platforms));
    })
    $.each(appsList.stages, function(z, stages) {
      $('#stages')
        .append($("<option></option>")
          .attr("value", stages)
          .text(stages));
    })
    $.each(appsList.appVersions, function(z, appVersions) {
      $('#appVersions')
        .append($("<option></option>")
          .attr("value", appVersions)
          .text(appVersions));
    })
    $.each(appsList.apiVersions, function(z, apiVersions) {
      $('#apiVersions')
        .append($("<option></option>")
          .attr("value", apiVersions)
          .text(apiVersions));
    })
  });

  urlString = window.location.href;
  console.log(urlString);

  //awefull logic to check to see if a querry param is already added, if there is a ? then it assumas all are there. BAD
  if (urlString.indexOf('?') !== -1) {
    $('#welcome').hide();
    stringToParams(getParameterByName("brand") + "," + getParameterByName("platform") + "," + getParameterByName("region") + "," + getParameterByName("stage") + "," + getParameterByName("arcSpace") + "," + getParameterByName("apiVersion") + "," + getParameterByName("appVersion") + "," + getParameterByName("appRating"));
    //getPlayPlexConfig();
  } else {
    $('#loadingOverlay').hide();
    //stringToParams("cc,ios,gb,live,comedy-intl-uk-authoring,1.7,4.2");
  }
}

//####################################----Turn the form input into params for the main function----####################################

function stringToParams(buildString) {
  console.log("stringToParams");
  //$('#loadingOverlay').show();
  console.log(buildString);
  var splits = buildString.split(',');

  brand = splits[0];
  console.log(brand);

  platform = splits[1];
  console.log(platform);

  region = splits[2];
  console.log(region);

  stage = splits[3];
  console.log(stage);

  arcSpace = splits[4];
  console.log(arcSpace);

  apiVersion = splits[5];
  console.log(apiVersion);

  appVersion = splits[6];
  console.log(appVersion);
  
  appRating = splits[7];
  console.log("app Rating is" + appRating);

  updateUrlParams();
  updateFormValues();
  getPlayPlexConfig();
}

//####################################----Header Utility----####################################

function setHeader(xhr) {
  xhr.setRequestHeader('x-requested-with', 'mpTestApp');
}

//####################################----Get the Main Config----####################################

function getPlayPlexConfig() {
  console.log("getPlayPlexConfig");
  $('#loadingOverlay').show();
  firstRun = false;
  getCustomParamValues();
  isisURL = 'http://isis.mtvnservices.com/Isis.html#module=content&site=' + arcSpace + '&id=';
  mainPath = '/main/' + apiVersion + '/';
  params = '?brand=' + brand + '&platform=' + platform + '&region=' + region;

  if (stage == 'qa' || stage == "neutron-qa") {
    apiUrl = neutronQARootURL + mainPath + params;
  } else if (stage == 's' || stage == "neutron-s") {
        apiUrl = neutronSRootURL + mainPath + params;
  } else { 
    apiUrl = neutronLiveRootURL + mainPath + params;
  }
  console.log(apiUrl);

  //console.log(brand,region,platform,stage);

  $.ajax({
    url: corsProxy + apiUrl,
    type: 'GET',
    dataType: 'json',
    success: function(playplexMain) {
      // get enabled brands
      playPlexMainConfig = playplexMain;
      loadPlayPlexConfig();
    },
    error: function() {
      console.log("something went wrong with the http request");
    },
    beforeSend: setHeader
  });
  updateUrlParams();
  updateFormValues();
}


//####################################----Load the config----####################################


function loadPlayPlexConfig(){
      $('#mainApiButton').show();
      $('#brandScreenSelector').empty();
  // if enabled brands is longer than 1
      if (playPlexMainConfig.data.appConfiguration.enabledBrands.length > 1) {
          $('#multiBrandSelector').show();
        } else {
          $('#multiBrandSelector').hide();
      }
      $.each(playPlexMainConfig.data.appConfiguration.enabledBrands, function(z, enabledBrand) { 
        console.log('found a brand named - ' + enabledBrand.brandName + ' whose type is ' + enabledBrand.brandType);
        $('#brandScreenSelector')
          .append($("<option></option>")
            .attr("value", enabledBrand.brandType + "," + enabledBrand.brandName)
            .text(enabledBrand.brandName));
        });
        $.each(playPlexMainConfig.data.appConfiguration.screens, function(z, screens) { 
         if (screens.screen.name == "adult" || screens.screen.name == "home") { //REWORK THIS TO USE ENABLED BRANDS
            toLoad = screens.screen.url;
            screenName = screens.screen.name;
            screenID = screens.screen.id;
            getScreen(toLoad, screenName, screenID, z);
            console.log(screens.screen.name + ' ' + toLoad);
          }
        })
}

//####################################----Take action on the brandScreemSelector----####################################

function brandScreenSelectorFunction(brandScreenValue) {
  console.log("brandScreenSelector: " + brandScreenValue);
  splitValue = brandScreenValue.split(',');
  brandScreenType = splitValue[0];
  brandScreenName = splitValue[1];
  $.each(playPlexMainConfig.data.appConfiguration.screens, function(z, screens) {
    if (screens.screen.type == brandScreenType) {
        toLoad = screens.screen.url + "&selectedBrand=" + brandScreenName;
        screenName = screens.screen.name;
        screenID = screens.screen.id;
        getScreen(toLoad, screenName, screenID, z);
        }
  });
}



//####################################----Build The Screens & Modules----####################################

function getScreen(screenURL, screenName, screenID, screenIndex) {
  console.log("getScreen");
  console.log(screenURL);
  nuclear();
  $.ajax({
    url: corsProxy + screenURL,
    type: 'GET',
    dataType: 'json',
    success: function(playplexHome) {
      $.each(playplexHome.data.screen.modules, function(z, modules) {
        if (modules.module.templateType == 'pp_continueWatchingCarousel'){
          return;
        }
        target = modules.module.dataSource;
        if (modules.module.hasOwnProperty('parameters')) {
          if (modules.module.parameters.hasOwnProperty('cellSize')) {
            cellSize = modules.module.parameters.cellSize;
            console.log(cellSize);
          }
        }
        if (cellSize == "L") {
          aspectRatio = "16:9";
          console.log(cellSize);
          console.log(aspectRatio);
        } else if (cellSize == "M") {
          aspectRatio = "2:3";
          console.log(cellSize);
          console.log(aspectRatio);
        } else if (cellSize == "S") {
          aspectRatio = "16:9";
          console.log(cellSize);
          console.log(aspectRatio);
        } else {
          aspectRatio = "16:9";
          cellSize = "S";
          console.log(cellSize);
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
          'html': '<span title="API">'+ modules.module.title + '</span>',
          'onclick': 'window.open("' + target + '");'
        }).appendTo('#moduleHeader_' + containerId);

        if (apiVersion != undefined ) {
          getModule19(target, screenID, containerId, z, aspectRatio, cellSize);
        }
      })
    },
    error: function() {
      console.log("something went wrong with the http request");
    },
    beforeSend: setHeader
  });
}


//####################################----Build The Modules (1.9 api)----####################################
function getModule19(moduleURL, screenID, containerId, z, aspectRatio, cellSize) {
  //console.log("getModule19 - USING 1.9 LOGIC")
  var screenUUID = uuidMaker(screenID);
  $.ajax({
    url: corsProxy + moduleURL,
    type: 'GET',
    dataType: 'json',
    success: function(playplexData) {
      if (playplexData.data.items.length == 0) {
        $('<div />', {
          'class': 'moduleError',
          'text': 'Empty Zone'
        }).appendTo('#module_' + containerId);
      } else {
        $.each(playplexData.data.items, function(i, cardVal) {
          isImgError = false;
          imgUrl = "./img/error.jpg";
          isPromoError = false;
          hasSeasons = false;
          hasEpisodes = false;
          hasVideos = false;
          hasPlaylists = false;
          hasMovie = false;
          hasShortform = false;
          hasLongform = false;
          linksError = false;
          card[cardVal.mgid];
          card[cardVal.mgid] = cardVal;
          propertyMgid = cardVal.mgid;
          propertyID = cardVal.id;
          entityType = cardVal.entityType;
          seriesTitle = cardVal.title.replace(/ /g, "_");
          propertyCardID = screenUUID + '_' + propertyID + '_' + z + i;

          //Check to see if the promo is valid
          if (entityType === "empty" || entityType === "noUrl" || entityType === "promo" || entityType === "editorial") {
            imgUrl = "./img/error.jpg";
            isPromoError = true;
            console.log("its an promo error" + propertyID);
          } else {
            let deeplink = makeDeeplink(propertyMgid);
            //           console.log("deeplink is" + deeplink);
            isPromoError = false;
            if (cardVal.hasOwnProperty("images") && cardVal.images.length > 0) {
              for (let c = 0, l = cardVal.images.length; c < l; c++) {
                if (cardVal.images[c].aspectRatio === aspectRatio) {
                  imgUrl = cardVal.images[c].url + imageParams;
                  isImgError = false;
                  break;
                } else {
                  isImgError = true;
                }
              }
            } else {
              imgUrl = "./img/error.jpg";
              isImgError = true;
              console.log("its an IMG Array error " + propertyID);
            }
          }
          // MAKE ALL THE BASE CARDS IN HTML
          $('<div />', {
            'id': propertyCardID,
            'class': 'showCard_' + cellSize,
            'style': 'background-image: url(' + imgUrl + ')',
            'html' : '<img src="./img/gradient.png" width=100% height=100%>'
          }).appendTo('#module_' + containerId);
         

          $('<div />', {
            'id': 'errorbox' + '_' + propertyCardID,
            'class': 'errorbox'
          }).appendTo('#' + propertyCardID);

          if (isPromoError === true) {
            $('<p />', {
              'class': 'error',
              'text': "Broken Promo ERROR - Likely expired series, in an active promo"
            }).appendTo('#errorbox' + '_' + propertyCardID);
          }
          if (isImgError === true) {
            $('<p />', {
              'id': 'imgError' + containerId,
              'class': 'error',
              'text': "IMAGE ERROR - Check for expected " + aspectRatio + " aspectRatio, image publishing, or image DP"
            }).appendTo('#errorbox' + '_' + propertyCardID);
          }
          //build the meta
          $('<div />', {
            'id': 'showCardControls_' + propertyCardID,
            'class': 'showCardControls'
          }).appendTo('#' + propertyCardID);
          //build the meta objects

          $('<p />', {
            'id': 'showCardJsonButton_' + propertyCardID,
            'class': 'button',
            'text': 'API',
            'onclick': 'showOverlayJson("' + propertyMgid + '");'
          }).appendTo('#showCardControls_' + propertyCardID);

          $('<p />', {
            'id': 'showCardLink_' + z + i,
            'text': 'ARC',
            'class': 'button',
            'onclick': 'window.open("' + isisURL + propertyID + '");'
          }).appendTo('#showCardControls_' + propertyCardID);

          $('<p />', {
            'id': 'showCardDeeplink_' + z + i,
            'text': 'Deeplink ',
            'class': 'button',
            'onclick': 'window.open("' + deeplink + '");'
          }).appendTo('#showCardControls_' + propertyCardID);
          
          $('<div />', {
            'id': 'showCardMeta_' + propertyCardID,
            'class': 'showCardMeta'
          }).appendTo('#' + propertyCardID);
          
          if (cardVal.hasOwnProperty("brandImageUrl")) {
            $('<div />', {
              'id': 'showCardBrandLogo_' + propertyCardID,
              'class': 'brandLogo',
              'style': 'background-image: url(' + cardVal.brandImageUrl + ')'
            }).appendTo('#showCardMeta_' + propertyCardID);
          }
// ----------------------------------  Check for a Rating -----------------------------------
//         if (apiVersion == "2.1") {
          if (cardVal.hasOwnProperty("contentRating") && cardVal.contentRating != null && cardVal.contentRating.ratings != null) {
              //console.log('defined rating' + appRating);
//               appRating.concat("Standard:Rating",appRating);
              for (let c = 0, l = cardVal.contentRating.ratings.length; c < l; c++) {
                if (cardVal.contentRating.ratings[c].contentType.indexOf(appRating) !== -1) {
                  //console.log('found rating ' + cardVal.contentRating.ratings[c].contentType);
                  if (cardVal.contentRating.ratings[c].images.length > 0) {
                    $('<div />', {
                      'id': 'showCardRating_' + propertyCardID,
                      'class': 'rating',
                      'style': 'background-image: url(' + cardVal.contentRating.ratings[c].images[0].url + ')'
                    }).appendTo('#showCardControls_' + propertyCardID);
                    break;
                 } else {
                      $('<div />', {
                      'id': 'showCardRating_' + propertyCardID,
                      'class': 'rating',
                      'style': 'margin-left:0.5em;',
                      'text': cardVal.contentRating.ratings[c].typeName
                    }).appendTo('#showCardControls_' + propertyCardID);
                   break;
                 }
                } else {
                  // Fail at finding an Matched rating
                  console.log('No Matching rating');
                }
              }
            } else {
            // Fail finding Ratings
             console.log('No ratings on the item');
            }
//         }

          //Content Type Specific Logic
          if (entityType === "episode" || entityType === "video") {
              hasEpisodes = false;
              hasVideos = false;
              linksError = false;
              promoError = false;
              playable = true;
              seasonLink = "";
            
            // Playable ITEM Title
           if (cardVal.hasOwnProperty("parentEntity")) {
              $('<span />', {
                'id': 'showCardMetaParent_' + propertyCardID,
                'class': 'showCardMetaParent',
                'html': cardVal.parentEntity.title + '<br/>'
              }).appendTo('#showCardMeta_' + propertyCardID);
            }


            if (cardVal.hasOwnProperty("seasonNumber")) {
              $('<span />', {
                'id': 'showCardMetaTitle_' + propertyCardID,
                'class': 'showCardMetaTitle',
                'text': 'Season ' + cardVal.seasonNumber.toString()
              }).appendTo('#showCardMeta_' + propertyCardID);
            } else {
              $('<span />', {
                'id': 'showCardMetaTitle_' + propertyCardID,
                'class': 'showCardMetaTitle',
                'text': 'NO SEASON# ',
                'style': 'color:red'
              }).appendTo('#showCardMeta_' + propertyCardID);
            }

            if (cardVal.hasOwnProperty("episodeAiringOrder")) {
              $('<span />', {
                'id': 'showCardMetaMetaTitle_' + propertyCardID,
                'class': 'showCardMetaTitle',
                'html': ', Ep ' + cardVal.episodeAiringOrder.toString() + '<br/>'
              }).appendTo('#showCardMeta_' + propertyCardID);
            } else {
              $('<span />', {
                'id': 'showCardMetaTitle_' + propertyCardID,
                'class': 'showCardMetaTitle',
                'html': ' NO EP#<br/>',
                'style': 'color:red'
              }).appendTo('#showCardMeta_' + propertyCardID);
            }
          $('<p />', {
              'class': 'contentError',
              'text': "Playable Item"
            }).appendTo('#' + propertyCardID);
            
          } else if ((entityType === "series" || entityType === "event" || entityType === "movie" || entityType === "editorial") && cardVal.hasOwnProperty("links")) {
            playable = false;
            // Series Title
            $('<span />', {
              'id': 'showCardMeta_' + propertyCardID,
              'class': 'showCardMetaTitle',
              'text': cardVal.title
            }).appendTo('#showCardMeta_' + propertyCardID);

            //console.log("I'm checking links");
            if (cardVal.links.hasOwnProperty("episode")) {
              //console.log(cardVal.links.episode);
              episodeLink = cardVal.links.episode;
              hasEpisodes = true;
            } else {
              hasEpisodes = false;
            }
            if (cardVal.links.hasOwnProperty("video")) {
              //console.log(cardVal.links.video);
              videoLink = cardVal.links.video;
              hasVideos = true;
            } else {
              hasVideos = false;
            }
            if (cardVal.links.hasOwnProperty("playlist")) {
              //console.log(cardVal.links.playlist);
              playlistLink = cardVal.links.playlist;
              hasPlaylists = true;
            } else {
              hasPlaylists = false;
            }
            if (cardVal.links.hasOwnProperty("movie")) {
              // 					console.log(cardVal.links.movie);
              movieLink = cardVal.links.movie;
              hasMovie = true;
            } else {
              hasMovie = false;
            }
            if (cardVal.links.hasOwnProperty("shortForm")) {
              // 					console.log(cardVal.links.movie);
              shortFormLink = cardVal.links.shortForm;
              hasShortform = true;
            } else {
              hasShortform = false;
            }
            if (cardVal.links.hasOwnProperty("longForm")) {
              // 					console.log(cardVal.links.movie);
              LongFormLink = cardVal.links.longForm;
              hasLongform = true;
            } else {
              hasLongform = false;
            }
            if (cardVal.links.hasOwnProperty("season")) {
              // 					console.log(cardVal.links.movie);
              seasonLink = cardVal.links.season;
              hasSeasons = true;
            } else {
              hasSeasons = false;
              seasonLink = "";
            }
          } else {
            linksError = true;
            console.log("its an Links error " + propertyID);
          }

          if (hasEpisodes === true || hasVideos === true || hasPlaylists === true || hasMovie === true || hasShortform === true || hasLongform === true) {
            $('<div />', {
              'id': 'showCardButtonBar_' + propertyCardID,
              'class': 'showCardButtons',
            }).appendTo('#' + propertyCardID);

            if (hasVideos === true) {
              $('<p />', {
                'id': 'showCardButtons_Video' + z + i,
                'class': 'showCardButton',
                'text': 'Videos',
                'onclick': 'loadContentLink("' + videoLink + '","video","' + seriesTitle + '","' + seasonLink + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasEpisodes === true) {
              $('<p />', {
                'id': 'showCardButtons_Episode' + z + i,
                'class': 'showCardButton',
                'text': 'Episodes',
                'onclick': 'loadContentLink("' + episodeLink + '","episode","' + seriesTitle + '","' + seasonLink + '");'
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
            if (hasMovie === true) {
              $('<p />', {
                'id': 'showCardButtons_Movie' + z + i,
                'class': 'showCardButton',
                'text': 'Movie',
                'onclick': 'loadContentLink("' + movieLink + '","movie","' + seriesTitle + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasShortform === true) {
              $('<p />', {
                'id': 'showCardButtons_ShortForm' + z + i,
                'class': 'showCardButton',
                'text': 'ShortForm',
                'onclick': 'loadContentLink("' + shortFormLink + '","shortForm","' + seriesTitle + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasLongform === true) {
              $('<p />', {
                'id': 'showCardButtons_ShortForm' + z + i,
                'class': 'showCardButton',
                'text': 'LongForm',
                'onclick': 'loadContentLink("' + LongFormLink + '","longForm","' + seriesTitle + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
          } else if (playable !== true){
            console.log("its an Links error " + propertyID);
            $('<p />', {
              'class': 'contentError',
              'text': "Broken - No Content",
              'style': "color:red"
            }).appendTo('#' + propertyCardID);
          }
        });
        if (playplexData.metadata.pagination.next != null) { // checks for a next page then re-triggers itself.
          moduleURL = playplexData.metadata.pagination.next;
          getModule19(moduleURL, screenID, containerId, z, aspectRatio, cellSize); //run it all over again
        }
      }
    },
    error: function() {
      console.log("something went wrong with the http request");
      var toRemoveHeader = 'moduleHeader_' + containerId;
      var toRemoveModule = 'module_' + containerId;
      removeElement(toRemoveHeader);
      removeElement(toRemoveModule);
    },
    beforeSend: setHeader
  });
  $('#loadingOverlay').hide();
  //   if (div != null) {
  //     while (div.hasChildNodes()) {
  //       div.removeChild(div.lastChild);
  //     }
}

//####################################----Load Content Links (1.9 api)----####################################

function loadContentLink(contentLink, contentType, seriesTitle, seasonLink) {
  console.log("loadContentLink");
  window.scrollTo(0, 0);
  if (document.getElementById('container_Content') !== null) {
    cleanHouse(container_Content);
  } else {
    $('<div />', {
      'id': 'container_Content',
      'class': 'container'
    }).prependTo('#containers');
  }

  $('<div />', {
    'id': 'contentContainerHeader',
    'class': 'containerHeader'
  }).appendTo('#container_Content');
  
    $('<span />', {
    'id': 'contentClose',
    'text': 'X',
    'onclick': '$("#container_Content").remove();'
  }).appendTo('#contentContainerHeader');
  
  $('<span />', {
    'id': 'contentContainerHeaderItems',
    'class':'containerHeaderText',
  }).appendTo('#contentContainerHeader');
  
  $('<span />', {
    'id': 'contentContainerHeaderTitle',
    'class':'containerHeaderText',
    'text': ' ' + contentType +'s'
  }).appendTo('#contentContainerHeader');

  if (seasonLink !== undefined) {
    //console.log(seasonLink);
    // Add season UI
    $('<form />', {
      'id': 'seasonForm',
      'class': 'TBD',
      'text': 'Seasons:',
      'html': '<select id="seasonsSelector" onChange="cleanHouse(contentContainerItems);fillContentModule19(this.value);"></select>'
    }).appendTo('#contentContainerHeader');
    // ajax the list of seasons
    // inject seasons to UI
    getSeasons(seasonLink, contentType, contentLink);
  }

  $('<div />', {
    'id': 'contentContainerItems',
    'class': 'container'
  }).appendTo('#container_Content');
  

  $('<div />', {
    'id': 'CSV',
    'class': 'button',
    'text': 'CSV',
    'onclick': 'downloadCSV({ filename: "' + seriesTitle + '_data.csv" });'
  }).appendTo('#contentContainerHeader');

  $('<div />', {
    'id': 'episodeAPI',
    'class': 'button',
    'text': 'API',
    'onclick': 'window.open("' + contentLink + '");'
  }).appendTo('#contentContainerHeader');

  //activeSeries = seriesMgid;
  //build the container
  fillContentModule19(contentLink);
}

//####################################----Get seasons)----####################################

function getSeasons(seasonLink, contentType, contentLink) {
  console.log("Getting Seasons");
  seasonLink = corsProxy + seasonLink;
  $.getJSON(seasonLink, function(seasons) {
    $('#seasonsSelector')
      .append($("<option></option>")
        .attr("value", contentLink)
        .text("ALL"));
    $.each(seasons.data.items, function(i, seasonVal) {
      //console.log ("SEASON " + i);
      if (contentType == "episode") {
        targetLink = seasonVal.links.episode;
      } else if (contentType == "video") {
        targetLink = seasonVal.links.video;
      }
      $('#seasonsSelector')
        .append($("<option></option>")
          .attr("value", targetLink)
          .text(seasonVal.subTitle));
    });
    if (seasons.metadata.pagination.next != null) { // checks for a next page then re-triggers itself.
      seasonLink = seasons.metadata.pagination.next;
      page = seasons.metadata.pagination.page;
      console.log("Page:" + page);
      getSeasons(seasonLink); //run it all over again
    }
  });
}

//####################################----Fill the Content Module with items (1.9 api)----####################################


function fillContentModule19(contentLink) {
    $('<div />', {
    'id': 'contentLoadingCard',
    'class': 'loadingCard',
    'style':'display:none;',
    'html': '<span>loading</span><br/><div class="loader"></div>'
  }).appendTo('#contentContainerItems');
  $(contentLoadingCard).show();
  console.log("fillContentModule19");
  contentLink =  corsProxy + contentLink;
  $.getJSON(contentLink, function(playplexContent) {
    $('#contentContainerHeaderItems').text(' ' + playplexContent.metadata.pagination.totalItems);
    //console.log("total items: " + playplexContent.metadata.pagination.totalItems);
    $.each(playplexContent.data.items, function(i, contentCardVal) {
      card[contentCardVal.mgid];
      card[contentCardVal.mgid] = contentCardVal;
      imgUrl = "";
      tve = "false";
      aspectError = "false";
      imgError = "false";
      title = '"' + contentCardVal.title + '"';
      let deeplink = makeDeeplink(contentCardVal.mgid);
      txtObject = JSON.stringify(contentCardVal, null, 4);
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
            //console.log("Good Image");
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

      link = uuidMaker(contentCardVal.id);

      //Make a CSV index

      if (aspectError == "true") {
        aspectErrorMessage = "Aspect Ratio Error";
      } else {
        aspectErrorMessage = "";
      }
      if (imgError == "true") {
        imgErrorMessage = "Image Error";
      } else {
        imgErrorMessage = "";
      }

      cardLinks.push({
        title: title,
        uuid: link,
        aspectError: aspectErrorMessage,
        imageError: imgErrorMessage
      });
      
      $('<div />', {
        'id': link,
        'class': 'contentCard',
        'style': 'background-image: url(' + imgUrl + ')'
      }).appendTo('#contentContainerItems');

      $('<div />', {
        'id': 'contentErrorbox_' + link,
        'class': 'errorbox'
      }).appendTo('#' + link);

      // put the lock on the card	
      if (aspectError === "true") {
        $('<p />', {
          'class': 'error',
          'text': "IMAGE ERROR - No " + aspectRatio + " image, using fallback"
        }).appendTo('#contentErrorbox' + '_' + link);
      }
      if (imgError === "true") {
        $('<p />', {
          'class': 'error',
          'text': "IMAGE ERROR - Missing images"
        }).appendTo('#contentErrorbox' + '_' + link);
      }

      //build the meta
      $('<div />', {
        'id': 'CardMeta_' + link,
        'class': 'CardMeta'
      }).appendTo('#' + link);

      //build the meta objects

      $('<span />', {
        'id': 'contentCardTitle_' + link,
        'class': 'contentCardTitle',
        'html': contentCardVal.title + '<br/>'
      }).appendTo('#CardMeta_' + link);
      
      if (contentCardVal.hasOwnProperty("seasonNumber")){
      $('<span />', {
        'id': 'CardSubHeader_' + link,
        'class': 'CardSubHeader',
        'html': 'Season ' + contentCardVal.seasonNumber + ','
      }).appendTo('#CardMeta_' + link);
    } else {
      $('<span />', {
        'id': 'CardSubHeader_' + link,
        'class': 'CardSubHeader',
        'html': 'Season undefined, ',
        'style': 'color:red;'
      }).appendTo('#CardMeta_' + link);
    }
      
    if (contentCardVal.hasOwnProperty("episodeAiringOrder")){
      $('<span />', {
        'id': 'CardSubHeader_' + link,
        'class': 'CardSubHeader',
        'html': ' Ep ' + contentCardVal.episodeAiringOrder + '<br/>'
      }).appendTo('#CardMeta_' + link);
    } else {
      $('<span />', {
        'id': 'CardSubHeader_' + link,
        'class': 'CardSubHeader',
        'html': ' Ep undefined <br/>',
        'style': 'color:red;'
      }).appendTo('#CardMeta_' + link);
    }

    $('<span />', {
        'id': 'CardDescription_' + link,
        'class': 'CardDescription',
        'text': contentCardVal.description
      }).appendTo('#CardMeta_' + link);
      
      

      //build the meta
      $('<div />', {
        'id': 'contentCardControls_' + link,
        'class': 'showCardControls'
      }).appendTo('#' + link);
      
      //build the meta objects
      $('<div />', {
        'id': 'showCardJsonButton_' + link,
        'class': 'button',
        'text': 'API',
        'onclick': 'showOverlayJson("' + contentCardVal.mgid + '");'
      }).appendTo('#contentCardControls_' + link);

      $('<div />', {
        'id': 'contentCardHeaderLink_' + link,
        'text': 'ARC',
        'class': 'button',
        'onclick': 'window.open("' + isisURL + link + '");'
      }).appendTo('#contentCardControls_' + link);

      $('<div />', {
        'id': 'contentCardDeeplink_' + link,
        'text': 'Deeplink ',
        'class': 'button',
        'onclick': 'window.open("' + deeplink + '");'
      }).appendTo('#contentCardControls_' + link);
      
      
      if (contentCardVal.hasOwnProperty("contentRating") && contentCardVal.contentRating != null && contentCardVal.contentRating.ratings != null ) {
              //console.log('defined rating' + appRating);
//               appRating.concat("Standard:Rating",appRating);
              for (let c = 0, l = contentCardVal.contentRating.ratings.length; c < l; c++) {
                if (contentCardVal.contentRating.ratings[c].contentType.indexOf(appRating) !== -1) {
                  //console.log('found rating ' + cardVal.contentRating.ratings[c].contentType);
                  if (contentCardVal.contentRating.ratings[c].images.length > 0) {
                    $('<div />', {
                      'id': 'contentCardRating_' + link,
                      'class': 'rating',
                      'style': 'background-image: url(' + contentCardVal.contentRating.ratings[c].images[0].url + ')'
                    }).appendTo('#contentCardControls_' + link);
                    break;
                 } else {
                      $('<div />', {
                      'id': 'contentCardRating_' + link,
                      'class': 'rating',
                      'style': 'margin-left:0.5em;',
                      'text': contentCardVal.contentRating.ratings[c].typeName
                    }).appendTo('#contentCardControls_' + link);
                   break;
                 }
                } else {
                  // Fail at finding an Matched rating
                  console.log('No Matching rating');
                }
              }
            } else {
            // Fail finding Ratings
             console.log('No ratings on the item');
      }
     if (tve === "true") {
        $('<div />', {
          'id': 'lock_' + link,
          'class': 'lock',
        }).appendTo('#contentCardControls_' + link);
      }

    });

    if (playplexContent.metadata.pagination.next != null) { // checks for a next page then re-triggers itself.
      contentLink = playplexContent.metadata.pagination.next;
      page = playplexContent.metadata.pagination.page;
      console.log("Page:" + page);
      fillContentModule19(contentLink); //run it all over again
    }
    $(contentLoadingCard).hide();
  });
}

//####################################----Make a UUID----####################################

function uuidMaker(mgid) {
  //console.log("uuidMaker " + mgid);
  UUID = mgid.substr(mgid.length - 36); // takes the UUID off the MGID
  return (UUID);
}


//####################################----Clean Content----####################################

function cleanHouse(div) {
  console.log("cleanHouse");
  if (div != null) {
    while (div.hasChildNodes()) {
      div.removeChild(div.lastChild);
    }
    cardLinks = [];
  }
}

//####################################----Clean Screen----####################################

function nuclear() {
  console.log("Nuclear");
  $("#containers").empty();
  cardLinks = [];
}

//####################################----Remove an ID----####################################

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

//####################################----Toggle JSON Overlays----####################################

function showOverlayJson(mgid) {
  console.log("showOverlayJson");
  var body = document.body;
  body.classList.toggle('noscroll');
  $(overlay).toggle();
  txtObject = JSON.stringify(card[mgid], null, 4);
  txtObject = txtObject.replace(/&reg/g, "&"+"reg");
  var newStr = txtObject.replace(/(<a href=")?((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)))(">(.*)<\/a>)?/gi, function () {
    return '<a href="'+ arguments[2] + '" target="_blank">' + (arguments[7] || arguments[2]) + '</a>'
});
  document.getElementById('cardJson').innerHTML = newStr;
  // 	console.log(txtObject);
  body.classList.toggle('noscroll');
}


//####################################----Open the API----####################################

function openMainApi() {
  console.log("openMainApi");
  window.open(apiUrl);
}

//####################################----Get custom targets set custom params----####################################

function customTarget() {
  brand = $('#brands').val();
  addURLParam('brand', brand);
  region = $('#countries').val();
  addURLParam('region', region);
  platform = $('#platforms').val();
  addURLParam('platform', platform);
  stage = $('#stages').val();
  addURLParam('stage', stage);
  appVersion = $('#appVersions').val();
  addURLParam('appVersion', appVersion);
  apiVersion = $('#apiVersions').val();
  addURLParam('apiVersion', apiVersion);
  $('#quickSelector').val('---');
  getPlayPlexConfig();
}

//####################################----put custom selectors / params ----####################################

function updateUrlParams() {
  // set the custom params by their new values.
  addURLParam("brand", brand);
  addURLParam("platform", platform);
  addURLParam("region", region);
  addURLParam("stage", stage);
  addURLParam("arcSpace", arcSpace);
  addURLParam("apiVersion", apiVersion);
  addURLParam("appVersion", appVersion);
  addURLParam("appRating", appRating);
}

//####################################----update advanced form----####################################

function updateFormValues() {
  document.getElementById('brands').value = brand;
  document.getElementById('countries').value = region;
  document.getElementById('stages').value = stage;
  document.getElementById('platforms').value = platform;
  document.getElementById('appVersions').value = appVersion;
  document.getElementById('apiVersions').value = apiVersion;
}

//####################################----update custom selectors----####################################

function getCustomParamValues() {
  brand = getParameterByName("brand");
  region = getParameterByName("region");
  stage = getParameterByName("stage");
  platform = getParameterByName("platform");
  arcSpace = getParameterByName("arcSpace");
  apiVersion = getParameterByName("apiVersion");
  appRating = getParameterByName("appRating");
  // 	appVersion = getParameterByName("appVersion");
}


//####################################----Make a deeplink----####################################

function makeDeeplink(propertyMgid) {
  //console.log("makeDeeplink");
  var path
// breaking these out incase we need to handle special cases in the future.
  if (propertyMgid.indexOf("episode") !== -1) {
    path = 'content/';
  } else if (propertyMgid.indexOf("series") !== -1) {
    path = 'content/';
  } else if (propertyMgid.indexOf("event") !== -1) {
    path = 'content/';
  } else if (propertyMgid.indexOf("playlist") !== -1) {
    path = 'content/';
  } else if (propertyMgid.indexOf("video") !== -1) {
    path = 'content/';
  } else if (propertyMgid.indexOf("movie") !== -1) {
    path = 'content/';
  } else if (propertyMgid.indexOf("live") !== -1) {
    path = 'content/';
  } else if (propertyMgid.indexOf("editorial") !== -1) {
    path = 'content/';
  }

//   var propertyID = uuidMaker(propertyMgid);
  if (brand == "mtvplus") {
    deeplink = mtvPlusDeeplinkRoot + path + propertyMgid;
  } else if (brand == "paramountplus"){
    deeplink = paramountPlusDeeplinkRoot + path + propertyMgid;
  } else if (brand == "betplus") {
    deeplink = betPlusDeeplinkRoot + path + propertyMgid;       
  } else {
    deeplink = "NULL";
  }
  return deeplink;
}


//####################################----GET URL Param----####################################

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//####################################---- PUT URL Param----####################################
function addURLParam(sVariable, sNewValue) {
  var aURLParams = [];
  var aParts;
  var aParams = (window.location.search).substring(1, (window.location.search).length).split('&');

  for (var i = 0; i < aParams.length; i++) {
    aParts = aParams[i].split('=');
    aURLParams[aParts[0]] = aParts[1];
  }

  if (aURLParams[sVariable] != sNewValue) {
    if (sNewValue.toUpperCase() == "ALL")
      aURLParams[sVariable] = null;
    else
      aURLParams[sVariable] = sNewValue;

    var sNewURL = window.location.origin + window.location.pathname;
    var bFirst = true;

    for (var sKey in aURLParams) {
      if (aURLParams[sKey]) {
        if (bFirst) {
          sNewURL += "?" + sKey + "=" + aURLParams[sKey];
          bFirst = false;
        } else
          sNewURL += "&" + sKey + "=" + aURLParams[sKey];
      }
    }

    //return sNewURL;
    window.history.pushState({}, '', sNewURL);
  }
}

//this will reload the page, it's likely better to store this until finished

// function addURLParam(paramName, paramValue) {
// console.log("addURLParam");
// 	var loc = location.href;
// 	if (loc.indexOf("?") === -1) {
// 		loc += "?";
// 		loc = loc + paramName + '=' + paramValue;
// 		window.history.pushState({}, '', loc);
// 	} else {
// 		if (string.indexOf(paramName) !== -1) {
// 			existingParams = loc.split('?');

// 			if (existingParams.indexOf('&') !== -1) {
// 				paramToUpdate = existingParams[1].split('&');
// 			} else {
// 				paramToUpdate = existingParams[0];
// 			}

// 			$.each(paramToUpdate, function(i, param) {
// 				if (param.indexOf(paramName) !== -1) {

// 				}
// 			})
// 		}
// 	}

// 	loc = loc + paramName + '=' + paramValue;
// 	window.history.pushState({}, '', loc);
// }

//####################################----CSV----####################################

function convertArrayOfObjectsToCSV(args) {
  console.log("CSV");
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
  console.log("downloadCSV");
  var data, filename, link;
  var csv = convertArrayOfObjectsToCSV({
    data: cardLinks
  });
  if (csv == null) return;

  filename = args.filename || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    data = encodeURI(csv);
  }

  link = document.createElement('a');
  link.type = "text/csv";
  link.rel = "noopener noreferrer";
  link.href = "data:application/octet-stream," + data;
  link.download = filename;
  link.target = "_blank";
  link.click();
}