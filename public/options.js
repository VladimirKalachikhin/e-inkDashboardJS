
const checkDataFreshness = true;
// типы данных, которые, собственно, будем показывать 
const displayData = {  	// 
	'track' : {'variants' : [['track',dashboardHeadingTXT],['magtrack',dashboardMagHeadingTXT]], 	// курс или магнитный курс
		'precision' : 0,	// точность показываемой цифры, символов после запятой
		'multiplicator' : 1, 	// на что нужно умножить значение для показа
		'fresh': 5000		// время свежести, миллисек.
	},
	'speed' : {'variants' : [['speed',dashboardSpeedTXT+', '+dashboardSpeedMesTXT]],	// скорость
		'precision' : 1,
		'multiplicator' : 60*60/1000,
		'fresh': 3000
	},
	'depth' : {'variants' : [['depth',dashboardDepthTXT+', '+dashboardDepthMesTXT]], 	// глубина
		'precision' : 1,
		'multiplicator' : 1,
		'fresh': 2000
	}
};
const signalKsubscribe = {
	"context": "vessels.self",
	"subscribe": [
		{
			"path": "navigation.courseOverGroundTrue",
			"format": "delta",
			"policy": "instant",
			"minPeriod": 0
		},
		{
			"path": "navigation.speedOverGround",
			"format": "delta",
			"policy": "instant",
			"minPeriod": 0
		},
		{
			"path": "environment.depth.belowSurface",
			"format": "delta",
			"policy": "instant",
			"minPeriod": 0
		},
		{
			"path": "navigation.courseOverGroundMagnetic",
			"format": "delta",
			"policy": "instant",
			"minPeriod": 0
		},
		{
			"path": "navigation.magneticDeviation",
			"format": "delta",
			"policy": "instant",
			"minPeriod": 0
		},
	]
};
