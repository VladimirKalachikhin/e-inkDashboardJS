module.exports = function (app) {
/**/

var plugin = {};
var versionTXT = '';

plugin.id = 'e-inkDashboardJS';
plugin.name = 'e-inkDashboardjs';
plugin.description = 'Dashboard for powerful JavaScript-enabled e-ink devices with some Signal K instruments';

plugin.schema = {
	'title': 'e-inkDashboardJS',
	'type': 'object',
	'properties': {
		'trackProp':{
			'title': '',
			'description': 'Reload Dashboard after changing all of this.',
			'type': 'object',
			'properties': {
				'feature':{
					'type': 'string',
					'title': 'Will be displayed as Course:',
					'enum': [
						'Course over ground (COG)',
						'Heading true (HT)',
						'Heading magnetic (HM)',
						'Heading compass (HC)',
					],
					'default': 'Course over ground (COG)'
				},
				'maxRefreshInterval': {
					'type': 'number',
					'title': 'The maximum frequency of Course refresh, sec',
					'description': `Set this as quickly as your e-ink device may. If 0 -- 
					the data will be displayed as fast as they are received. If your device swamping this data flow -- 
					set this parameter to 0.5, 1 or 2 sec. Getting data seldom can be dangerous!
					`,
					'default': 0
				},
			},
		},
		'speedProp':{
			'title': '',
			'type': 'object',
			'properties': {
				'feature':{
					'type': 'string',
					'title': 'Will be displayed as Speed:',
					'enum': [
						'Speed ower ground (SOG)',
						'Speed through water (STW)',
					],
					'default': 'Speed ower ground (SOG)'
				},
				'maxRefreshInterval': {
					'type': 'number',
					'title': 'The maximum frequency of Speed refresh, sec',
					'description': `Set this as quickly as your e-ink device may. If 0 -- 
					the data will be displayed as fast as they are received. If your device swamping this data flow -- 
					set this parameter to 0.5, 1 or 2 sec. Getting data seldom can be dangerous!
					`,
					'default': 0
				},
			},
		},
		'depthProp':{
			'title': '',
			'type': 'object',
			'properties': {
				'feature':{
					'type': 'string',
					'title': 'Will be displayed as Depth:',
					'enum': [
						'Depth below surface (DBS)',
						'Depth below keel (DBK)',
						'Depth below transducer (DBT)',
					],
					'default': 'Depth below surface (DBS)'
				},
				'maxRefreshInterval': {
					'type': 'number',
					'title': 'The maximum frequency of Depth refresh, sec',
					'description': `Set this as quickly as your e-ink device may. If 0 -- 
					the data will be displayed as fast as they are received. If your device swamping this data flow -- 
					set this parameter to 0.5, 1 or 2 sec. Getting data seldom can be dangerous!
					`,
					'default': 0
				},
			},
		},
		'checkDataFreshness':{
			'type': 'boolean',
			'title': 'Checking the freshness of data',
			'description': `Does not display out-of-date data. If all devices on your network have the same time 
			(with differents less than 1 sec.) -- check this and you can be sure that you see actual data.
			`,
			'default': true
		},
		'updNotifications':{
			'type': 'boolean',
			'title': 'Update SignalK notifications',
			'description': `Updating the SignalK notification system value zones and raising alarms. Note that
			each instance of the dashboard has its own alarms, but SignalK alert is one for all.
			`,
			'default': true
		},
	}
};

var unsubscribes = []; 	// массив функций с традиционным именем, в котором функции, которые надо выполнить при остановке плагина

plugin.start = function (options, restartPlugin) {
const fs = require("fs");

//app.debug('options:',options);
if(options.trackProp.feature.includes('COG')) options.trackProp.feature = 'navigation.courseOverGroundTrue';
else if(options.trackProp.feature.includes('HT')) options.trackProp.feature = 'navigation.headingTrue';
else if(options.trackProp.feature.includes('HM')) options.trackProp.feature = 'navigation.headingMagnetic';
else if(options.trackProp.feature.includes('HC')) options.trackProp.feature = 'navigation.headingCompass';

if(options.speedProp.feature.includes('SOG')) options.speedProp.feature = 'navigation.speedOverGround';
else if(options.speedProp.feature.includes('STW')) options.speedProp.feature = 'navigation.speedThroughWater';

if(options.depthProp.feature.includes('DBS')) options.depthProp.feature = 'environment.depth.belowSurface';
else if(options.depthProp.feature.includes('DBK')) options.depthProp.feature = 'environment.depth.belowKeel';
else if(options.depthProp.feature.includes('DBT')) options.depthProp.feature = 'environment.depth.belowTransducer';

const optionsjs = `
const checkDataFreshness = ${options.checkDataFreshness};
var updNotifications = ${options.updNotifications};
// типы данных, которые, собственно, будем показывать 
const displayData = {  	// 
	'track' : {'variants' : [['track',dashboardHeadingTXT],['magtrack',dashboardMagHeadingTXT]], 	// курс или магнитный курс
		'precision' : 0,	// точность показываемой цифры, символов после запятой
		'multiplicator' : 1, 	// на что нужно умножить значение для показа
		'fresh': ${(5+options.trackProp.maxRefreshInterval) * 1000},		// время свежести, миллисек.
		'path': '${options.trackProp.feature}'
	},
	'speed' : {'variants' : [['speed',dashboardSpeedTXT+', '+dashboardSpeedMesTXT]],	// скорость
		'precision' : 1,
		'multiplicator' : 60*60/1000,
		'fresh': ${(3+options.speedProp.maxRefreshInterval) * 1000},
		'path': '${options.speedProp.feature}'
	},
	'depth' : {'variants' : [['depth',dashboardDepthTXT+', '+dashboardDepthMesTXT]], 	// глубина
		'precision' : 1,
		'multiplicator' : 1,
		'fresh': ${(2+options.depthProp.maxRefreshInterval) * 1000},
		'path': '${options.depthProp.feature}'
	}
};
const signalKsubscribe = {
	"context": "vessels.self",
	"subscribe": [
		{
			"path": "${options.trackProp.feature}",
			"format": "delta",
			"policy": "instant",
			"minPeriod": ${options.trackProp.maxRefreshInterval * 1000}
		},
		{
			"path": "${options.speedProp.feature}",
			"format": "delta",
			"policy": "instant",
			"minPeriod": ${options.speedProp.maxRefreshInterval * 1000}
		},
		{
			"path": "${options.depthProp.feature}",
			"format": "delta",
			"policy": "instant",
			"minPeriod": ${options.depthProp.maxRefreshInterval * 1000}
		},
		{
			"path": "navigation.courseOverGroundMagnetic",
			"format": "delta",
			"policy": "instant",
			"minPeriod": ${options.trackProp.maxRefreshInterval * 1000}
		},
		{
			"path": "navigation.magneticDeviation",
			"format": "delta",
			"policy": "instant",
			"minPeriod": ${options.trackProp.maxRefreshInterval * 1000}
		},
		{
			"path": "notifications.mob",
			"format": "delta",
			"policy": "instant",
			"minPeriod": 0
		}
	]
};
`;
fs.writeFileSync(__dirname+'/public/options.js',optionsjs);

}; // end function plugin.start

plugin.stop = function () {
// Here we put logic we need when the plugin stops
	app.debug('Plugin stopped');
	unsubscribes.forEach(f => f());
	unsubscribes = [];
}; // end function plugin.stop

return plugin;
}; //end module.exports

