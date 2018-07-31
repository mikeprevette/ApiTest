// This is total shit JS, please no judgy. 

/* ####################################----PLAYPLEX----#################################### */
const imageParams = '&width=450&quality=0.7';
const liveRootURL = 'http://api.playplex.viacom.com/feeds/networkapp/intl';
const testingRootURL = 'http://testing.api.playplex.viacom.vmn.io/feeds/networkapp/intl';
const hotfixRootURL = 'http://hotfix.api.playplex.viacom.vmn.io/feeds/networkapp/intl';
const devRootURL = 'http://dev.api.playplex.viacom.vmn.io/feeds/networkapp/intl';
var firstRun = true;
var activeSeries, brand, platform, region, stage, appVersion, apiVersion, termsOfServiceUrl, legalUpdatesOverviewUrl, arbitrationUrl, copyrightComplianceUrl, closedCaptioningUrl, adChoicesUrl, tvRatingsUrl;  



// Take input brand / region
// ask app api for the required doc urls
// generate a tab for each
// process line breaks / sanitize / convert links?
// Accept a bala notifier flag

//####################################----on load parse the apps.json file and prefil the form----####################################


function makeTheScreen(mode) {
	console.log("makeTheScreen");
	if (firstRun === true && mode == "Live") {
   console.log("Live Mode");
	} else {
		console.log("Dev Mode");
    alert("Dev mode");
	}

	urlString = window.location.href;
	console.log(urlString);
	
	//awefull logic to check to see if a querry param is already added, if there is a ? then it assumas all are there. BAD
	if (urlString.indexOf('?') !== -1) {
		brand = getParameterByName("brand");
    platform = "ios";
    region = getParameterByName("region");
    stage = "live";
    appVersion = "4.5";
    apiVersion = "1.9";
//     stage = getParameterByName("stage");
//     appVersion = getParameterByName("apiVersion");
//     apiVersion = getParameterByName("appVersion");
    console.log(brand+", "+platform+", "+region+", "+stage+", "+appVersion+", "+apiVersion);
	//buildPlayPlex();
    getDocs();
	} 
}

function getDocs(){
  firstRun = false;
  mainPath = '/main/' + apiVersion + '/';
  params = '?key=networkapp1.0&brand=' + brand + '&platform=' + platform + '&region=' + region + '&version=' + appVersion;
  if (stage == 'testing') {
    apiUrl = testingRootURL + mainPath + params;
  } else if (stage == 'hotfix') {
    apiUrl = hotfixRootURL + mainPath + params;
  } else if (stage == 'dev') {
    apiUrl = devRootURL + mainPath + params;
  } else { // LIVEEEEEEEE
    apiUrl = liveRootURL + mainPath + params;
  }
  
  $.getJSON(apiUrl, function(mainConfig) {
    termsOfServiceUrl = mainConfig.data.appConfiguration.termsOfServiceUrl;
      console.log(termsOfServiceUrl);
      if (termsOfServiceUrl != null || termsOfServiceUrl !== "") {
        grabLegalDoc(termsOfServiceUrl);
      }
      privacyPolicyUrl = mainConfig.data.appConfiguration.privacyPolicyUrl;
      console.log(privacyPolicyUrl);
      if (privacyPolicyUrl != null || privacyPolicyUrl !== "") {
        grabLegalDoc(privacyPolicyUrl);
      }
      legalUpdatesOverviewUrl = mainConfig.data.appConfiguration.privacyPolicyChangesUrl;
      console.log(legalUpdatesOverviewUrl);
      if (legalUpdatesOverviewUrl != null || legalUpdatesOverviewUrl !== "") {
        grabLegalDoc(legalUpdatesOverviewUrl);
      }
    arbitrationUrl = mainConfig.data.appConfiguration.privacyPolicyFaqsUrl;
      console.log(arbitrationUrl);
          if (arbitrationUrl != null || arbitrationUrl !== "") {
        grabLegalDoc(arbitrationUrl);
      }
    copyrightComplianceUrl = mainConfig.data.appConfiguration.copyrightNoticeUrl;
      console.log(copyrightComplianceUrl);
          if (copyrightComplianceUrl != null || copyrightComplianceUrl !== "") {
            grabLegalDoc(copyrightComplianceUrl);
          }
    closedCaptioningUrl = mainConfig.data.appConfiguration.closedCaptionSupportUrl;
      console.log(closedCaptioningUrl);
          if (closedCaptioningUrl != null || closedCaptioningUrl !== "") {
        grabLegalDoc(closedCaptioningUrl);
      }
    adChoicesUrl = mainConfig.data.appConfiguration.adChoicesDisclosureUrl;
      console.log(adChoicesUrl);
          if ( adChoicesUrl != null ||  adChoicesUrl !== "") {
        grabLegalDoc(adChoicesUrl);
      }
    //tvRatingsUrl = mainConfig.data.appConfiguration.tvRatingsUrl;
      //console.log(tvRatingsUrl);   
  })
 
}

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("legalContent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
            
function grabLegalDoc(URL) {
  $.getJSON(URL, function(legalItem) {
    var legalDocTitle = legalItem.data.title;
    var legalDoc = legalItem.data.text;
    var legalDocClean = legalDoc.replace(/{brandName}/g, brand);
    $('<div />', {
      'id': legalDocTitle,
      'class': 'legalContent',
      'text': legalDocClean
    }).appendTo('#containers');
    $('<button />', {
      'id': legalDocTitle + "Tab",
      'class': 'tablinks',
      'text': legalDocTitle,
      'onClick': "openTab(event, '" + legalDocTitle + "')"
    }).appendTo('#tabbar');
  })
}


function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}