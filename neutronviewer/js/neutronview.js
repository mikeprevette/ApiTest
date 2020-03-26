// This is total shit JS, please no judgy. 

/* ####################################----PLAYPLEX----#################################### */
const imageParams = '&height=640';
const neutronSRootURL = 'http://staging-neutron-api.viacom.tech/feeds/networkapp/intl';
const neutronQARootURL = 'http://qa-neutron-api.viacom.tech/feeds/networkapp/intl';
const neutronLiveRootURL = 'http://neutron-api.viacom.tech/feeds/networkapp/intl';
const corsProxy = 'https://viamprevette.herokuapp.com/';
const mtvPlusDeeplinkRoot = 'mtvplayuk://';
const betPlusDeeplinkRoot = 'betplus://';
const paramountPlusDeeplinkRoot = 'paramountplus://';
const nogginPlusIntlDeeplinkRoot = 'nogginplusintl://';
const mtvintlDeeplinkRoot = 'mtvplay://';
const mtvusDeeplinkRoot = 'mtvnetworkapp://';
const cctntlDeeplinkRoot = 'ccplay://';
const deepLinkXrs = 'mikesTestSite';
var firstRun = true;
var brand, platform, region, stage, isisURL, params, appVersion, apiVersion, appRating, apiUrl;
var cardLinks = [];
var appsInstances = [];
var countryObject = [];
var card = Object.create(null);
var playPlexMainConfig = Object.create(null);


// function createAppOptions(apps,z) {
// 			var combi = combinations(apps.app.platform, apps.app.country, apps.app.stage);
// 			for (let c of combi ) {
// 				console.log(combi.done);
// //         console.log(c);
//         $('#quickSelector')
//         .append($("<option></option>")
//           .attr("value", apps.app.brand + ',' + c[0] + ',' + c[1] + ',' + c[2] + ',' + apps.app.arcSpace + ',' + apps.app.apiVersion + ',' + apps.app.appVersion + ',' + apps.app.appRating)
//           .text(apps.app.name + " | " + c[0] + "-" + c[1] + "-" + c[2]));
// 			}
// }

function setHeaderForm(app) {
  
  // Countries 
  app.country.sort(function(a, b) {
    var textA = a.countryCode.toUpperCase();
    var textB = b.countryCode.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });
  $('#countrySelector').empty();
  $.each(app.country, function(z, countries) {
    //console.log(countries.countryCode);
    countryObject.push(countries);
    $('#countrySelector')
      .append($("<option></option>")
        .attr("value", z)
        .text(countries.countryCode));
  })
  
  // Platforms
  $('#platformSelector').empty();
  $.each(app.platform, function(z, platforms) {
    $('#platformSelector')
      .append($("<option></option>")
        .attr("value", platforms)
        .text(platforms));
  })
  
  // Stages
  $('#stageSelector').empty();
  $.each(app.stage, function(z, stages) {
    $('#stageSelector')
      .append($("<option></option>")
        .attr("value", stages)
        .text(stages));
  })
}

function appSelector(appsIndex) {
  let app = appsInstances[appsIndex];
  
  // clear them first
  $('#countrySelector').empty();
  $('#platformSelector').empty();
  $('#stageSelector').empty();
  
  // 
  if (app.platform.length > 1) {
    $(multiPlatformSelector).show();
  } else {
    $(multiPlatformSelector).hide();
  }
  if (app.country.length > 1) {
    $(multiCountrySelector).show();
  } else {
    $(multiCountrySelector).hide();
  }
  if (app.stage.length > 1) {
    $(multiStageSelector).show();
  } else {
    $(multiStageSelector).hide();
  }
  // update the forms

  setHeaderForm(app);
  // make it so
  stringToParams(app.brand + ',' + app.platform[0] + ',' + app.country[0].countryCode + ',' + app.stage[0] + ',' + app.country[0].arcSpace + ',' + app.apiVersion + ',' + app.appVersion + ',' + app.country[0].appRating)
}


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
      console.log("Making the QuickSelect list");
      appsInstances.push(apps.app);
      //console.log(apps.app);
      $('#quickSelector')
        .append($("<option></option>")
          .attr("value", z)
          .text(apps.app.name));
    })
    buildAdvancedmenu(appsList);
  });

  var urlString = window.location.href;
  console.log(urlString);

  //awefull logic to check to see if a querry param is already added, if there is a ? then it assumas all are there. BAD
  if (urlString.indexOf('?') !== -1) {
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
  console.log('Brand: ' + brand);

  platform = splits[1];
  console.log('Platform: ' + platform);

  region = splits[2];
  console.log('Region: ' + region);

  stage = splits[3];
  console.log('Stage: ' + stage);

  arcSpace = splits[4];
  console.log('ArcSpace: ' + arcSpace);

  apiVersion = splits[5];
  console.log('API Version: ' + apiVersion);

  appVersion = splits[6];
  console.log('App Version: ' + appVersion);
  
  appRating = splits[7];
  console.log("app Rating is" + appRating);

  updateUrlParams();
  getPlayPlexConfig();
}

//####################################----Header Utility----####################################

function setHeader(xhr) {
  xhr.setRequestHeader('x-requested-with', 'mpTestApp');
}

//####################################----Get the Main Config----####################################

function getPlayPlexConfig() {
  console.log("getPlayPlexConfig");
  $('#welcome').hide();
  $('#loadingOverlay').show();
  firstRun = false;
  getCustomParamValues();
  isisURL = 'http://isis.mtvnservices.com/Isis.html#module=content&site=' + arcSpace + '&id=';
  var mainPath = '/main/' + apiVersion + '/';
  var params = '?brand=' + brand + '&platform=' + platform + '&region=' + region;

  if (stage == 'qa' || stage == "neutron-qa") {
    apiUrl = neutronQARootURL + mainPath + params;
  } else if (stage == 's' || stage == "staging") {
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
         nuclear();
         if (screens.screen.name == "adult" || screens.screen.name == "home" || screens.screen.name == "pav" || screens.screen.name == "ebook" ) { //REWORK THIS TO USE ENABLED BRANDS || screens.screen.name == "offline"
            var toLoad = screens.screen.url;
            var screenID = screens.screen.id;
            getScreen(toLoad, screenID, z);
            console.log(screens.screen.name + ' ' + toLoad);
          }
        })
}

//####################################----Take action on the brandScreenSelector----####################################

function brandScreenSelectorFunction(brandScreenValue) {
  console.log("brandScreenSelector: " + brandScreenValue);
  var splitValue = brandScreenValue.split(',');
  var brandScreenType = splitValue[0];
  var brandScreenName = splitValue[1];
  $.each(playPlexMainConfig.data.appConfiguration.screens, function(z, screens) {
    if (screens.screen.type == brandScreenType) {
        var toLoad = screens.screen.url + "&selectedBrand=" + brandScreenName;
        var screenID = screens.screen.id;
        nuclear();
        getScreen(toLoad, screenID, z);
        }
  });
}



//####################################----Build The Screens & Modules----####################################

function getScreen(screenURL, screenID, screenIndex) {
  console.log("getting the main screen");
  console.log(screenURL);
  var cellSize, aspectRatio;
  $.ajax({
    url: corsProxy + screenURL,
    type: 'GET',
    dataType: 'json',
    success: function(playplexHome) {
      // ----- --  Check for Kids nav
//    console.log(playplexHome);
      if (playplexHome.data.screen.hasOwnProperty("navigation") && playplexHome.data.screen.navigation.dataSource != null) {
        console.log("IM A KIDS APP");
        var target = playplexHome.data.screen.navigation.dataSource;
        var containerId = "navigation";
        // add a kids module here
        cellSize = "nogginNavSquare";
        aspectRatio = "1:1";
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
          'html': '<span title="API">Navigation</span>',
          'onclick': 'window.open("' + target + '");'
        }).appendTo('#moduleHeader_' + containerId);
        
        getModule19(target, screenID, containerId, 0, aspectRatio, cellSize);
      }
      
     // ----- --  Do normal carosels

      $.each(playplexHome.data.screen.modules, function(z, modules) {
        if (modules.module.templateType == 'pp_continueWatchingCarousel' || modules.module.templateType == 'crossPlatformContinueWatching'){
          return;
        }
        var target = modules.module.dataSource;
        if (modules.module.hasOwnProperty('parameters')) {
          if (modules.module.parameters.hasOwnProperty('cellSize')) {
            cellSize = modules.module.parameters.cellSize;
            //console.log(cellSize);
          } else if(modules.module.parameters.hasOwnProperty('aspectRatio')) {
            cellSize = "M";
          } else {
          cellSize = "nogginContentSquare";
          } 
        }
               
        if (cellSize == "L") {
          aspectRatio = "16:9";
        } else if (cellSize == "M") {
          aspectRatio = "2:3";
        } else if (cellSize == "S") {
          aspectRatio = "16:9";
        } else if (cellSize == "nogginContentSquare") {
          aspectRatio = "1:1";
        } else {
          aspectRatio = "16:9";
          cellSize = "S";
        }
        
        //console.log(cellSize);
        //console.log(aspectRatio);
        
        
        //build the container Header
        var containerId = uuidMaker(modules.module.id) + '_s' + screenIndex + 'm' + z;

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
        if (modules.module.title != "") {
          containerHeaderText = modules.module.title;
        } else if (modules.module.layout.name != "") {
          containerHeaderText = playplexHome.data.screen.title + " | " + modules.module.layout.name;
        } else {
          containerHeaderText = playplexHome.data.screen.title;
        }
        
        $('<span />', {
          'id': 'containerHeaderText_' + containerId,
          'class': 'containerHeaderText',
          'html': '<span title="API">'+ containerHeaderText + '</span>',
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
  var isPromoError = false;
  var itemsLoaded = 0;
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
          itemsLoaded++;
          if (cardVal.entityType == "animationbutton" ) {
            return;
//             cardVal.mgid == z + i;
//             cardVal.id == "null" + z + i;
          }
          card[cardVal.mgid];
          card[cardVal.mgid] = cardVal;
          var isImgError = "";
          var imgUrl = "./img/error.jpg";
          var isPromoError = false;
          var hasSeasons = false;
          var hasEpisodes = false;
          var hasVideos = false;
          var hasPlaylists = false;
          var hasMixedContent = false;
          var hasMovie = false;
          var hasShortform = false;
          var hasLongform = false;
          var hasSimilarContent = false;
          var linksError = false;
          var promoError = false;
          var playable = true;
          var seasonLink = "";
          var deeplink;
          var episodeLink;
          var shortFormLink;
          var LongFormLink;
          var mixedContentLink;
          var videoLink;
          var movieLink;
          var playlistLink;
          var similarContentLink;
          var entityType = cardVal.entityType;
          var seriesTitle = cardVal.title.replace(/ /g, "_");
          var propertyCardID = screenUUID + '_' + cardVal.id + '_' + z + i;

          //Check to see if the promo is valid
          if (entityType === "empty" || entityType === "noUrl" || entityType === "promo" || entityType === "animationbutton") {
            imgUrl = "./img/error.jpg";
            isPromoError = true;
            console.log("its an promo error" + cardVal.mgid);
          } else {
            deeplink = makeDeeplink(cardVal.mgid);
            //           console.log("deeplink is" + deeplink);
            isPromoError = false;
            // look for a noggin Nav card image
            if (cardVal.hasOwnProperty("images") && cardVal.images.length > 0) {
              if (cellSize === "nogginNavSquare") {
                for (let c = 0, l = cardVal.images.length; c < l; c++) {
                  if (cardVal.images[c].imageUsageType === "nav-button") {
                    imgUrl = cardVal.images[c].url + imageParams;
                    isImgError = "";
                    break;
                  }
               }
              } else {
              // Look for a correct image size for a standard card
              for (let c = 0, l = cardVal.images.length; c < l; c++) {
                if (cardVal.images[c].aspectRatio === aspectRatio) {
                  imgUrl = cardVal.images[c].url + imageParams;
                  isImgError = "";
                  break;
                } else {
                  isImgError = "Wrong Aspect ratio.";
                  console.log("Wrong Aspect ratio images: " + cardVal.mgid);
                }
              }
             }
            } else {
              imgUrl = "./img/error.jpg";
              isImgError = "No images.";
              console.log("Missing images: " + cardVal.mgid);
            }
          }
          // MAKE ALL THE BASE CARDS IN HTML
          $('<div />', {
            'id': propertyCardID,
            'class': 'showCard_' + cellSize,
            'style': 'background-image: url(' + imgUrl + ')',
            'html' : '<img src="./img/gradient.png" width=100% height=100% class="gradient">'
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
          if (isImgError !== "") {
            $('<p />', {
              'id': 'imgError' + containerId,
              'class': 'error',
              'html': "IMAGE ERROR - <u>" + isImgError + "</u><br/> Check for expected " + aspectRatio + " aspectRatio, image publishing, or image DP"
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
            'onclick': 'showOverlayJson("' + cardVal.mgid + '");'
          }).appendTo('#showCardControls_' + propertyCardID);

          $('<p />', {
            'id': 'showCardLink_' + z + i,
            'text': 'ARC',
            'class': 'button',
            'onclick': 'window.open("' + isisURL + cardVal.id + '");'
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
              console.log('defined rating' + appRating);
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
             //console.log('No ratings on the item');
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

          if (cardVal.entityType === "episode") {
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
                'html': ', NO EP#<br/>',
                'style': 'color:red'
              }).appendTo('#showCardMeta_' + propertyCardID);
            }
          } else {
              $('<span />', {
                'id': 'showCardMetaTitle_' + propertyCardID,
                'class': 'showCardMetaTitle',
                'text': cardVal.title
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
              shortFormLink = cardVal.links.shortForm;
              hasShortform = true;
            } else {
              hasShortform = false;
            }
            if (cardVal.links.hasOwnProperty("longForm")) {
              LongFormLink = cardVal.links.longForm;
              hasLongform = true;
            } else {
              hasLongform = false;
            }      
            // Similar Content
            if (cardVal.links.hasOwnProperty("similarContent")) {
//                 var proxiedSimilarLink = corsProxy + cardVal.links.similarContent;
//                 $.getJSON(proxiedSimilarLink, function(similar) {
//                    if (similar.metadata.pagination.totalItems >= 1) {
//                        similarContentLink = cardVal.links.similarContent;
//                        hasSimilarContent = true;
//                    }
//                 })
              similarContentLink = cardVal.links.similarContent;
              hasSimilarContent = true;
            } else {
              hasSimilarContent = false;
            }
            
            if (cardVal.links.hasOwnProperty("collection")) {
              mixedContentLink = cardVal.links.collection;
              hasMixedContent = true;
            } else {
              hasMixedContent = false;
            }
            if (cardVal.links.hasOwnProperty("season")) {
              seasonLink = cardVal.links.season;
              hasSeasons = true;
            } else {
              hasSeasons = false;
              seasonLink = "";
            }
          } else if (entityType === "game" || entityType === "videogame") {
            $('<p />', {
              'class': 'contentError',
              'text': "Game"
            }).appendTo('#' + propertyCardID);
         } else if (entityType === "ebook"){
            $('<p />', {
              'class': 'contentError',
              'text': "Ebook"
            }).appendTo('#' + propertyCardID);       
         } else {
            linksError = true;
            //console.log("its an Links error " + propertyCardID);
             $('<p />', {
              'class': 'contentError',
              'text': "Link Or Type Error",
              'style': "color:red"
            }).appendTo('#' + propertyCardID);
          }

          if (hasEpisodes === true || hasVideos === true || hasPlaylists === true || hasMovie === true || hasShortform === true || hasLongform === true || hasMixedContent === true || hasSimilarContent === true) {
            $('<div />', {
              'id': 'showCardButtonBar_' + propertyCardID,
              'class': 'showCardButtons',
            }).appendTo('#' + propertyCardID);

            if (hasVideos === true) {
              $('<div />', {
                'id': 'showCardButtons_Video' + z + i,
                'class': 'showCardButton',
                'text': 'Videos',
                'onclick': 'loadContentLink("' + videoLink + '","videos","' + seriesTitle + '","' + seasonLink + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasEpisodes === true) {
              $('<div />', {
                'id': 'showCardButtons_Episode' + z + i,
                'class': 'showCardButton',
                'text': 'Episodes',
                'onclick': 'loadContentLink("' + episodeLink + '","episodes","' + seriesTitle + '","' + seasonLink + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasPlaylists === true) {
              $('<div />', {
                'id': 'showCardButtons_Playlist' + z + i,
                'class': 'showCardButton',
                'text': 'Playlists',
                'onclick': 'loadContentLink("' + playlistLink + '","playlists","' + seriesTitle + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasMovie === true) {
              $('<div />', {
                'id': 'showCardButtons_Movie' + z + i,
                'class': 'showCardButton',
                'text': 'Movie',
                'onclick': 'loadContentLink("' + movieLink + '","movies","' + seriesTitle + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasShortform === true) {
              $('<div />', {
                'id': 'showCardButtons_ShortForm' + z + i,
                'class': 'showCardButton',
                'text': 'ShortForm',
                'onclick': 'loadContentLink("' + shortFormLink + '","shortForm","' + seriesTitle + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasLongform === true) {
              $('<div />', {
                'id': 'showCardButtons_ShortForm' + z + i,
                'class': 'showCardButton',
                'text': 'LongForm',
                'onclick': 'loadContentLink("' + LongFormLink + '","longForm","' + seriesTitle + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasMixedContent === true) {
              $('<div />', {
                'id': 'showCardButtons_ShortForm' + z + i,
                'class': 'showCardButton',
                'text': 'Mixed Collection',
                'onclick': 'loadContentLink("' + mixedContentLink + '","Mixed Items","' + seriesTitle + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
            if (hasSimilarContent === true) {
              $('<div />', {
                'id': 'showCardButtons_Similar' + z + i,
                'class': 'showCardButton',
                'text': 'Related',
                'onclick': 'loadContentLink("' + similarContentLink + '","Related","' + seriesTitle + '");'
              }).appendTo('#' + 'showCardButtonBar_' + propertyCardID);
            }
          } else if (playable !== true){
            //console.log("its an Links error " + propertyCardID);
            $('<p />', {
              'class': 'contentError',
              'html': "<u>No Content</u>",
              'style': "color:red"
            }).appendTo('#' + propertyCardID);
          }
        });
        if (playplexData.metadata.pagination.next != null && itemsLoaded < 150) { // checks for a next page then re-triggers itself.
          moduleURL = playplexData.metadata.pagination.next;
          getModule19(moduleURL, screenID, containerId, z, aspectRatio, cellSize); //run it all over again
        } else if (itemsLoaded >= 150) {
          $('<div />', {
            'id': 'endCard',
            'class': 'showCard_' + cellSize,
            'html' : '<img src="./img/gradient.png" width=100% height=100% class="gradient">'
          }).appendTo('#module_' + containerId);
          $('<div />', {
            'id': 'errorbox_endCard',
            'class': 'errorbox'
          }).appendTo('#endCard');
          $('<p />', {
              'class': 'error',
              'text': "150 items exceeded"
            }).appendTo('errorbox_endCard');
           $.end();
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
    'text': ' ' + contentType
  }).appendTo('#contentContainerHeader');

  if (seasonLink !== undefined) {
    //console.log(seasonLink);
    // Add season UI
    $('<form />', {
      'id': 'seasonForm',
      'class': 'TBD',
      'html': 'Seasons: <select id="seasonsSelector" onChange="cleanHouse(contentContainerItems);fillContentModule(this.value);"><option value="' + contentLink + '">All</option></select>'
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

  //build the container
  fillContentModule(contentLink);
}

//####################################----Get seasons)----####################################

function getSeasons(seasonLink, contentType, contentLink) {
  console.log("Getting Seasons");
  var targetLink;
  seasonLink = corsProxy + seasonLink;
  $.getJSON(seasonLink, function(seasons) {
    $.each(seasons.data.items, function(i, seasonVal) {
      //console.log ("SEASON " + i);
      if (!$.isEmptyObject(seasonVal.links)) {
        if (contentType == "episode") {
          targetLink = seasonVal.links.episode;
        } else if (contentType == "video") {
          targetLink = seasonVal.links.video;
        }
        $('#seasonsSelector')
          .append($("<option></option>")
            .attr("value", targetLink)
            .text(seasonVal.subTitle));
      } else {
        console.log('Suspected empty season: ' + seasonVal.subTitle + ' ' + seasonVal.id );
      }
    });

    if (seasons.metadata.pagination.next != null) { // checks for a next page then re-triggers itself.
      seasonLink = seasons.metadata.pagination.next;
      var page = seasons.metadata.pagination.page;
      console.log("Page:" + page);
      getSeasons(seasonLink); //run it all over again
    }
  });
}

//####################################----Fill the Content Module with items (1.9 api)----####################################


function fillContentModule(contentLink) {
    $('<div />', {
    'id': 'contentLoadingCard',
    'class': 'loadingCard',
    'style':'display:none;',
    'html': '<span>loading</span><br/><div class="loader"></div>'
  }).appendTo('#contentContainerItems');
  $(contentLoadingCard).show();
  $("#episodeAPI").attr('onclick','window.open("' + contentLink + '");');
  console.log("fillContentModule");
  contentLink =  corsProxy + contentLink;

  
  $.getJSON(contentLink, function(playplexContent) {
    $('#contentContainerHeaderItems').text(' ' + playplexContent.metadata.pagination.totalItems);
    //console.log("total items: " + playplexContent.metadata.pagination.totalItems);
    $.each(playplexContent.data.items, function(i, contentCardVal) {
      card[contentCardVal.mgid];
      card[contentCardVal.mgid] = contentCardVal;
      var link = uuidMaker(contentCardVal.id);
      var aspectRatio;
      var imgUrl = "";
      var tve = "false";
      var imgError = "";
      var title = '"' + contentCardVal.title + '"';
      let deeplink = makeDeeplink(contentCardVal.mgid);
      var txtObject = JSON.stringify(contentCardVal, null, 4);
      if (contentCardVal.authRequired === true) {
        tve = "true";
      }

      if (contentCardVal.entityType === "series" || contentCardVal.entityType === "movie") {
        aspectRatio = "2:3";
      } else {
      //Since this is only for Content, Lets assume we're always 16:9
        aspectRatio = "16:9";
      }
      //Set the imag URL based on the aspecRatio

      if (contentCardVal.hasOwnProperty("images") && contentCardVal.images.length > 0) {
        for (let v = 0, l = contentCardVal.images.length; v < l; v++) {
          if (contentCardVal.images[v].aspectRatio === aspectRatio) {
            imgUrl = contentCardVal.images[v].url + imageParams;
            imgError = "";
            //console.log("Good Image");
            break;
          } else {
            imgUrl = contentCardVal.images[0].url + imageParams;
            imgError = "Wrong Aspect ratio.";
            console.log("Wrong Aspect ratio images on: " + link)

          }
        }
      } else {
        imgUrl = "./img/error.jpg";
        imgError = "No Images.";
        console.log("Missing Images on: " + link)
      }


      //Make a CSV index



      cardLinks.push({
        title: title,
        type: contentCardVal.entityType,
        season: contentCardVal.seasonNumber,
        epAirOrder: contentCardVal.episodeAiringOrder,
        uuid: link,
        imageError: imgError
      });
      
      // Pick which content card to use
      if (aspectRatio === "2:3") {
      $('<div />', {
        'id': link,
        'class': 'contentCard2x3',
        'style': 'background-image: url(' + imgUrl + ')'
      }).appendTo('#contentContainerItems');
      } else {
        $('<div />', {
        'id': link,
        'class': 'contentCard16x9',
        'style': 'background-image: url(' + imgUrl + ')'
      }).appendTo('#contentContainerItems');
      }

      $('<div />', {
        'id': 'contentErrorbox_' + link,
        'class': 'errorbox'
      }).appendTo('#' + link);

      if (imgError !== "") {
        $('<p />', {
          'class': 'error',
          'html': "IMAGE ERROR - <u>" + imgError + "</u>"
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
      
      if (contentCardVal.entityType === "episode" || contentCardVal.entityType == "video") {
        if (contentCardVal.hasOwnProperty("seasonNumber")) {
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

        if (contentCardVal.hasOwnProperty("episodeAiringOrder")) {
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
      }

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
                  //console.log('No Matching rating');
                }
              }
            } else {
            // Fail finding Ratings
             //console.log('No ratings on the item');
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
      var page = playplexContent.metadata.pagination.page;
      console.log("Page:" + page);
      fillContentModule(contentLink); //run it all over again
    }
    $(contentLoadingCard).hide();
  });
}

//####################################----Make a UUID----####################################

function uuidMaker(mgid) {
  //console.log("uuidMaker " + mgid);
  var UUID = mgid.substr(mgid.length - 36); // takes the UUID off the MGID
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
  console.log("Clearing Screen");
  $("#containers").empty();
  cardLinks = [];
  card = [];
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
  var txtObject = JSON.stringify(card[mgid], null, 4);
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





//####################################----Get custom Screen----####################################

function customScreen(toLoad) {
        nuclear();
        screenID = "custom";
        z = 1;
        getScreen(toLoad, screenID, z);
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
  document.getElementById('countrySelector').value = countryObject.findIndex(c >= c.countryCode === region);
  document.getElementById('stageSelector').value = stage;
  document.getElementById('platformSelector').value = platform;
}

//####################################----Build the Advance menu----####################################


function  buildAdvancedmenu(appsList) {
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
          .text(countries));
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


//####################################----Take action on the countrySelector----####################################

function countrySelectorFunction(countryValue) {
  region = countryObject[countryValue].countryCode;
  arcSpace = countryObject[countryValue].arcSpace;
  appRating = countryObject[countryValue].appRating;
  addURLParam('region', region);
  addURLParam('arcSpace', arcSpace);
  addURLParam('appRating', appRating);
  getPlayPlexConfig();
}

//####################################----Take action on the platformSelector----####################################

function platformSelectorFunction(platformValue) {
  console.log("platformValueSelector: " + platformValue);
  platform = platformValue;
  addURLParam('platform', platform);
  getPlayPlexConfig();
}

//####################################----Take action on the stageSelector----####################################

function stageSelectorFunction(stageValue) {
  console.log("stageValueSelector: " + stageValue);
  stage = stageValue;
  addURLParam('stage', stage);
  getPlayPlexConfig();
}


//####################################----Make a deeplink----####################################

function makeDeeplink(mgid) {
  //console.log("makeDeeplink");
  var path;
  var deeplink;
// breaking these out incase we need to handle special cases in the future.
  if (mgid.indexOf("episode") !== -1) {
    path = 'content/';
  } else if (mgid.indexOf("series") !== -1) {
    path = 'content/';
  } else if (mgid.indexOf("event") !== -1) {
    path = 'content/';
  } else if (mgid.indexOf("playlist") !== -1) {
    path = 'content/';
  } else if (mgid.indexOf("video") !== -1) {
    path = 'content/';
  } else if (mgid.indexOf("movie") !== -1) {
    path = 'content/';
  } else if (mgid.indexOf("live") !== -1) {
    path = 'content/';
  } else if (mgid.indexOf("editorial") !== -1) {
    path = 'content/';
  }
  
  var postString = path + mgid + "?xrs=" + deepLinkXrs; 

  if (brand == "mtvplus") {
    deeplink = mtvPlusDeeplinkRoot + postString;
  } else if (brand == "paramountplus"){
    deeplink = paramountPlusDeeplinkRoot + postString;
  } else if (brand == "betplus") {
    deeplink = betPlusDeeplinkRoot + postString;       
  } else if (brand == "noggin" && region != 'US') {
    deeplink = nogginPlusIntlDeeplinkRoot + postString;
  } else if (brand == 'mtv' && region !='US') {
    deeplink = mtvintlDeeplinkRoot + postString;
  } else if (brand == 'mtv' && region =='US') {
    deeplink = mtvusDeeplinkRoot + postString;
  } else if (brand == 'cc' && region != 'US'){
    deeplink = cctntlDeeplinkRoot + postString;
  } else {
    deeplink = "DEEPLINK FOR THIS APP NOT AVAILABLE IN THE TOOL YET";
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

//####################################----Make all App combinations----####################################


// get the list of all the possible params X
// build each url save it to an object
// request each config and add its param to the objects properties
// render a matrix of the params

// Generate all combinations of array elements:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function%2A
// https://stackoverflow.com/questions/4331092/finding-all-combinations-of-javascript-array-values
			function* combinations(head, ...tail) {
				let remainder = tail.length ? combinations(...tail) : [
					[]
				];
				for (let r of remainder)
					for (let h of head) yield [h, ...r];
			}
