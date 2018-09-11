// This is total shit JS, please no judgy. 

/* ####################################----PLAYPLEX----#################################### */
const imageParams = '&height=640&quality=0.7';
const neutronRootURL = 'http://neutron-api.viacom.tech-q.mtvi.com/feeds/networkapp/intl';
const corsProxy = 'https://cors-anywhere.herokuapp.com/';
// const corsProxy = 'https://crossorigin.me/';
const mtvGbDeeplinkRoot = 'mtvplayuk://';


var isPromoError = false;
var isImgError = false;
var firstRun = true;
var activeSeries, brand, platform, region, stage, isisURL, params, appVersion, apiVersion;
var page = 0;
var cardLinks = [];
var card = Object.create(null);


//####################################----on load parse the apps.json file and prefil the form----####################################


function makeTheScreen(mode) {
  console.log("makeTheScreen");
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
          .attr("value", apps.app.brand + ',' + apps.app.platform + ',' + apps.app.country + ',' + apps.app.stage + ',' + apps.app.arcSpace + ',' + apps.app.apiVersion + ',' + apps.app.appVersion)
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
    stringToParams(getParameterByName("brand") + "," + getParameterByName("platform") + "," + getParameterByName("region") + "," + getParameterByName("stage") + "," + getParameterByName("arcSpace") + "," + getParameterByName("apiVersion") + "," + getParameterByName("appVersion"));
    //buildPlayPlex();
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

  console.log(splits[4]);
  arcSpace = splits[4];

  apiVersion = splits[5];
  console.log(apiVersion);

  appVersion = splits[6];
  console.log(appVersion);

  putCustomValues();
  buildPlayPlex();
}

//####################################----Header Utility----####################################

function setHeader(xhr) {
  xhr.setRequestHeader('x-requested-with', 'mpTestApp');
}

//####################################----Build The Screens----####################################

function buildPlayPlex() {
  console.log("buildPlayPlex");
  $('#loadingOverlay').show();
  firstRun = false;
  nuclear();

  getCustomParamValues();


  isisURL = 'http://isis.mtvnservices.com/Isis.html#module=content&site=' + arcSpace + '&id=';

  mainPath = '/main/' + apiVersion + '/';
  params = '?brand=' + brand + '&platform=' + platform + '&region=' + region;

  if (stage == 'neutron') {
    apiUrl = neutronRootURL + mainPath + params;
  } else {
    apiUrl = neutronRootURL + mainPath + params;
  }
  console.log(apiUrl);

  //console.log(brand,region,platform,stage);

  $.ajax({
    url: corsProxy + apiUrl,
    type: 'GET',
    dataType: 'json',
    success: function(playplexMain) {
      $.each(playplexMain.data.appConfiguration.screens, function(z, screens) {
        if (screens.screen.name == "adult") {
          toLoad = screens.screen.url;
          screenName = screens.screen.name;
          screenID = screens.screen.id;
          getScreen(toLoad, screenName, screenID, z);
          console.log(screens.screen.name + ' ' + toLoad);
        }
      });
    },
    error: function() {
      console.log("something went wrong with the http request");
    },
    beforeSend: setHeader
  });
  putCustomValues();
}

//####################################----Build The Screens & Modules----####################################

function getScreen(screenURL, screenName, screenID, screenIndex) {
  console.log("getScreen");

  $.ajax({
    url: corsProxy + screenURL,
    type: 'GET',
    dataType: 'json',
    success: function(playplexHome) {
      $.each(playplexHome.data.screen.modules, function(z, modules) {
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
        }
          else if (cellSize == "M") {
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
          'text': 'Screen: ' + screenName + ' | Promo: ' + modules.module.title
        }).appendTo('#moduleHeader_' + containerId);

        //add a Link to the container Header
        $('<span />', {
          'id': 'containerApiButton_' + containerId,
          'class': 'button',
          'text': 'PromoList API Output',
          'onclick': 'window.open("' + target + '");'
        }).appendTo('#moduleHeader_' + containerId);
        if (apiVersion == "1.9") {
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
  console.log("getModule19 - USING 1.9 LOGIC")
  var screenUUID = uuidMaker(screenID);

  $.ajax({
    url: corsProxy + moduleURL,
    type: 'GET',
    dataType: 'json',
    success: function(playplexData) {
      $.each(playplexData.data.items, function(i, cardVal) {
        isImgError = false;
        isPromoError = false;
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
        propertyType = cardVal.entityType;
        seriesTitle = cardVal.title.replace(/ /g, "_");
        propertyCardID = screenUUID + '_' + propertyID + '_' + z + i;

        //Check to see if the promo is valid
        if (propertyType === "empty" || propertyType === "noUrl" || propertyType === "promo") {
          imgUrl = "./img/error.jpg";
          isPromoError = true;
          console.log("its an promo error" + propertyID);
        } else {
          let deeplink = makeDeeplink(propertyMgid);
          isPromoError = false;
          if (cardVal.hasOwnProperty("images") && cardVal.images.length > 0) {
            for (let c = 0, l = cardVal.images.length; c < l; c++) {
              if (cardVal.images[c].aspectRatio === aspectRatio) {
                imgUrl = cardVal.images[c].url + imageParams;
                isImgError = false;
                break;
              } else {
                imgUrl = "./img/error.jpg";
                isImgError = true;
                console.log("its an IMG Aspect error " + propertyID);
              }
            }
          } else {
            imgUrl = "./img/error.jpg";
            isImgError = true;
            console.log("its an IMG Array error " + propertyID);
          }
        }
        // MAKE ALL THE CARDS IN HTML
        $('<div />', {
          'id': propertyCardID,
          'class': 'showCard_' + cellSize,
          'style': 'background-image: url(' + imgUrl + ')'
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
            'text': "Broken IMAGE ERROR - Likely no aspectRatio or incorrect aspect Ratio, images not published, or bad image DP"
          }).appendTo('#errorbox' + '_' + propertyCardID);
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
          'class': 'button',
          'text': 'API OUTPUT',
          'onclick': 'showOverlayJson("' + propertyMgid + '");'
        }).appendTo('#showCardMeta_' + propertyCardID);

        $('<p />', {
          'id': 'showCardLink_' + z + i,
          'text': 'ARC',
          'class': 'button',
          'onclick': 'window.open("' + isisURL + propertyID + '");'
        }).appendTo('#showCardMeta_' + propertyCardID);

        $('<p />', {
          'id': 'showCardDeeplink_' + z + i,
          'text': 'Deeplink ',
          'class': 'button',
          'onclick': 'window.open("' + deeplink + '");'
        }).appendTo('#showCardMeta_' + propertyCardID);

        //build the Buttons

        if (cardVal.hasOwnProperty("links")) {
          //console.log(Object.keys(cardVal.links));
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
        } else {
          linksError = true;
          console.log("its an series Links error " + propertyID);
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
        } else if (isPromoError === false || linksError === true) {
          console.log("its an Series error " + propertyID);
          $('<p />', {
            'class': 'contentError',
            'text': "Broken Series - No Content"
          }).appendTo('#' + propertyCardID);
        }
      });
      if (playplexData.metadata.pagination.next != null) { // checks for a next page then re-triggers itself.
        moduleURL = playplexData.metadata.pagination.next;
        getModule19(moduleURL, screenID, containerId, z, aspectRatio); //run it all over again
      }
    },
    error: function() {
      console.log("something went wrong with the http request");
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

function loadContentLink(contentLink, contentType, seriesTitle) {
  console.log("loadContentLink");
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

  $('<span />', {
    'id': 'numberOfItems',
  }).appendTo('#contentContainerHeader');

  $('<div />', {
    'id': 'contentContainerItems',
    'class': 'container'
  }).appendTo('#container_Content');

  $('<div />', {
    'id': 'CSV',
    'class': 'button',
    'text': 'DOWNLOAD CONTENT CSV',
    'onclick': 'downloadCSV({ filename: "' + seriesTitle + '_data.csv" });'
  }).appendTo('#contentContainerHeader');


  $('<div />', {
    'id': 'episodeAPI',
    'class': 'button',
    'text': 'OPEN API',
    'onclick': 'window.open("' + contentLink + '");'
  }).appendTo('#contentContainerHeader');

  //activeSeries = seriesMgid;
  //build the container
  fillContentModule19(contentLink);
}

//####################################----Fill the Content Module with items (1.9 api)----####################################

function fillContentModule19(contentLink) {
  $('#loadingOverlay').show();
  console.log("fillContentModule19");
  $.getJSON(contentLink, function(playplexContent) {
    $('#numberOfItems').text(" | total items: " + playplexContent.metadata.pagination.totalItems);
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
      if (tve === "true") {
        $('<div />', {
          'id': 'lock_' + link,
          'class': 'lock',
        }).appendTo('#' + link);
      }
      if (aspectError === "true") {
        $('<p />', {
          'class': 'error',
          'text': "IMG Error - No 16:9 aspectRatio match, using fallback"
        }).appendTo('#contentErrorbox' + '_' + link);
      }
      if (imgError === "true") {
        $('<p />', {
          'class': 'error',
          'text': "IMG Error -Empty or missing images"
        }).appendTo('#contentErrorbox' + '_' + link);
      }

      //build the meta
      $('<div />', {
        'id': 'CardMeta_' + link,
        'class': 'CardMeta'
      }).appendTo('#' + link);

      //build the meta objects


      $('<p />', {
        'id': 'CardSubHeader_' + link,
        'class': 'CardSubHeader',
        'text': contentCardVal.subTitle
      }).appendTo('#CardMeta_' + link);

      $('<p />', {
        'id': 'CardHeader_' + link,
        'class': 'CardHeader',
        'text': contentCardVal.title
      }).appendTo('#CardMeta_' + link);

      $('<div />', {
        'id': 'showCardJsonButton_' + propertyCardID,
        'class': 'button',
        'text': 'API OUTPUT',
        'onclick': 'showOverlayJson("' + contentCardVal.mgid + '");'
      }).appendTo('#' + link);

      $('<div />', {
        'id': 'contentCardHeaderLink_' + link,
        'text': 'ARC',
        'class': 'button',
        'onclick': 'window.open("' + isisURL + link + '");'
      }).appendTo('#' + link);

      $('<div />', {
        'id': 'contentCardDeeplink_' + link,
        'text': 'Deeplink ',
        'class': 'button',
        'onclick': 'window.open("' + deeplink + '");'
      }).appendTo('#' + link);



    });

    if (playplexContent.metadata.pagination.next != null) { // checks for a next page then re-triggers itself.
      contentLink = playplexContent.metadata.pagination.next;
      page = playplexContent.metadata.pagination.page;
      console.log("Page:" + page);
      fillContentModule19(contentLink); //run it all over again
    }
  });
  $('#loadingOverlay').hide();
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

//####################################----Toggle JSON Overlays----####################################

function showOverlayJson(mgid) {
  console.log("showOverlayJson");
  var body = document.body;
  body.classList.toggle('noscroll');
  $(overlay).toggle();
  txtObject = JSON.stringify(card[mgid], null, 4);
  txtObject = txtObject.replace(/&reg/g, "&amp;reg");
  document.getElementById('cardJson').innerHTML = txtObject;
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
  addURLParam("brand", brand);
  region = $('#countries').val();
  addURLParam("region", region);
  platform = $('#platforms').val();
  addURLParam("platform", platform);
  stage = $('#stages').val();
  addURLParam("stage", stage);
  appVersion = $('#appVersions').val();
  addURLParam("appVersion", appVersion);
  apiVersion = $('#apiVersions').val();
  addURLParam("apiVersion", apiVersion);
  $('#quickSelector').val('---');
  buildPlayPlex();
}

//####################################----put custom selectors / params ----####################################

function putCustomValues() {
  // set the custom params by their new values.
  addURLParam("brand", brand);
  addURLParam("platform", platform);
  addURLParam("region", region);
  addURLParam("stage", stage);
  addURLParam("arcSpace", arcSpace);
  addURLParam("apiVersion", apiVersion);
  addURLParam("appVersion", appVersion);
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
  // 	appVersion = getParameterByName("appVersion");
}

//####################################----Offest the Top header----####################################

function adjustContainers() {
  var offset = $("#top").height();
  $('#containers').css('margin-top', offset);
}

//####################################----Make a deeplink----####################################

function makeDeeplink(propertyMgid) {
  //console.log("makeDeeplink");
  var path

  if (propertyMgid.indexOf("episode") !== -1) {
    path = 'episode/';
  } else if (propertyMgid.indexOf("series") !== -1) {
    path = 'series/';
  } else if (propertyMgid.indexOf("event") !== -1) {
    path = 'event/';
  } else if (propertyMgid.indexOf("playlist") !== -1) {
    path = 'playlist/';
  } else if (propertyMgid.indexOf("video") !== -1) {
    path = 'video/';
  }

  var propertyID = uuidMaker(propertyMgid);
  if (brand == "mtvplay") {
    deeplink = mtvGbDeeplinkRoot + path + propertyID;
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