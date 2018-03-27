// This is total shit JS, please no judgy. 

/* ####################################----SETUP----#################################### */

const liveRootURL = 'http://api.playplex.viacom.com/feeds/networkapp/intl';
const testingRootURL = 'http://testing.api.playplex.viacom.vmn.io/feeds/networkapp/intl';
const hotfixRootURL = 'http://hotfix.api.playplex.viacom.vmn.io/feeds/networkapp/intl';
const devRootURL = 'http://dev.api.playplex.viacom.vmn.io/feeds/networkapp/intl';


var firstRun = true;
var brand, platform, region, stage, isisURL, params, appVersion, apiVersion;
var page = 0;
var appInstances = [];


//####################################----pattern of the options----####################################


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


//####################################----on load parse the apps.json file and prefil the form----####################################


function letsDoThis(mode) {

	if (mode == "live") {
		appsJsonFile = "paramapps.json";
	} else {
		console.log("Dev Mode");
		appsJsonFile = "paramapps.json";
	}



	$.getJSON(appsJsonFile, function(appsList) {
		var i = 0;
		$.each(appsList.apps, function(z, apps) {
			$('<div />', {
				'id': apps.app.brand + '_chart',
				'class': 'chart',
				'text': apps.app.brand
		}).appendTo('#containers');
			$('<div />', {
					'id': apps.app.brand + '_header',
					'class': 'line'
				}).appendTo('#' + apps.app.brand +'_chart');
			
			var combi = combinations(apps.app.brand, apps.app.platform, apps.app.stage, apps.app.country, apps.app.appVersion, apps.app.apiVersion);
			for (let c of combi ) {
				//console.log(combi.done);
				mainPath = '/main/' + c[5] + '/';
				params = '?key=networkapp1.0&brand=' + c[0] + '&platform=' + c[1] + '&region=' + c[3] + '&version=' + c[4];
				if (c[2] == 'testing') {
					apiUrl = testingRootURL + mainPath + params;
				} else if (c[2] == 'hotfix') {
					apiUrl = hotfixRootURL + mainPath + params;
				} else if (c[2] == 'dev') {
					apiUrl = devRootURL + mainPath + params;
				} else { // LIVE
					apiUrl = liveRootURL + mainPath + params;
				}
				appMeta = {brand: c[0], country: c[3], platform: c[1], stage: c[2], appVersion: c[4], apiVersion: c[5], apiUrl: apiUrl};
				appInstances.push(appMeta); // dump the data into an array
				drawBrandCountry(i, appMeta); // render this brand
				i++;
				drawAppMeta(apps.app.brand, apiUrl);
			}
		})
	})
}

function drawAppMeta(brand, apiUrl) {
				$.getJSON(apiUrl, function(apiEndpoint) {
						$.each(apiEndpoint.data.appConfiguration, function(key, item) {
							$('<div />', {
								'id' : brand + key, 
								'class': 'line'
							}).appendTo('#' + brand + '_chart');
							$('<div />', {
								'class': 'lineItem',
								'text': item
							}).appendTo('#' + brand + key);
						})
			})
}


function drawBrand(i, appMeta) {
					$('<div />', {
					'id': appMeta.brand + '_' + i,
					'class': 'line'
				}).appendTo('#' + appMeta.brand +'_chart');
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.brand
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.country //country
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.platform //country
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.stage //country
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.appVersion //country
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.apiVersion //country
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.apiUrl
				}).appendTo('#' + appMeta.brand + '_' + i);
}

function drawBrandCountry(i, appMeta) {
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.country + ' ' + appMeta.platform + ' ' + appMeta.stage // Header
				}).appendTo('#' + appMeta.brand + '_header');
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.platform //platform
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.stage //stage
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.appVersion //version
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.apiVersion //apiVersion
				}).appendTo('#' + appMeta.brand + '_' + i);
				$('<div />', {
					'class': 'lineItem',
					'text': appMeta.apiUrl
				}).appendTo('#' + appMeta.brand + '_' + i);
}
