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
		$.each(appsList.apps, function(z, apps) {
			var combi = combinations(apps.app.brand, apps.app.country, apps.app.platform, apps.app.stage, apps.app.appVersion, apps.app.apiVersion);
			for (let c of combi ) {
				//console.log(combi.done);
				mainPath = '/main/' + c[5] + '/';
				params = '?key=networkapp1.0&brand=' + c[0] + '&platform=' + c[2] + '&region=' + c[1] + '&version=' + c[4];
				if (c[3] == 'testing') {
					apiUrl = testingRootURL + mainPath + params;
				} else if (c[3] == 'hotfix') {
					apiUrl = hotfixRootURL + mainPath + params;
				} else if (c[3] == 'dev') {
					apiUrl = devRootURL + mainPath + params;
				} else { // LIVE
					apiUrl = liveRootURL + mainPath + params;
				}
				appMeta = {brand: c[0], country: c[1], platform: c[2], stage: c[3], appVersion: c[4], apiVersion: c[5], apiUrl: apiUrl};
				appInstances.push(appMeta); // dump the data into an array
			}
		})
	})
	console.log(appInstances);
//   test();
}

function test() {
	for (var i = 0; i < appInstances.length; i++) {
		console.log(appInstances[i].brand);
		console.log("hi");
	}
}
