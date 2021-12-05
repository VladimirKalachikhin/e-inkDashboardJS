if(navigator.language.includes('ru')){
//if(false){
	var dashboardHeadingTXT = 'Истинный курс'; 	//  хотя это "путевой угол", "путь"
	var dashboardMagHeadingTXT = 'Магнитный курс';
	var dashboardMagVarTXT = 'Склонение';
	var dashboardSpeedTXT = 'Скорость';
	var dashboardMinSpeedAlarmTXT = 'Скорость меньше допустимой';
	var dashboardMaxSpeedAlarmTXT = 'Скорость больше допустимой';
	var dashboardSpeedMesTXT = 'км/ч';
	var dashboardDepthTXT = 'Глубина';
	var dashboardDepthAlarmTXT = 'Слишком мелко';
	var dashboardDepthMesTXT = 'м';
	var dashboardGNSSoldTXT = 'Данные от приборов устарели';
	var dashboardDepthMenuTXT = 'Опасная глубина';
	var dashboardMinSpeedMenuTXT = 'Минимальная скорость';
	var dashboardMaxSpeedMenuTXT = 'Максимальная скорость';
	var dashboardToHeadingAlarmTXT = 'Отклонение от курса';
	var dashboardKeysMenuTXT = 'Используйте клавиши для смены режимов';
	var dashboardKeySetupTXT = 'Укажите назначение и нажмите клавишу для:';
	var dashboardKeyNextTXT = 'Следующий режим';
	var dashboardKeyPrevTXT = 'Предыдущий режим';
	var dashboardKeyMenuTXT = 'Меню оповещений';
	var dashboardKeyMagneticTXT = 'Магнитный курс';
}
else {
	var dashboardHeadingTXT = 'Course';
	var dashboardMagHeadingTXT = 'Magnetic course';
	var dashboardMagVarTXT = 'Magnetic variation';
	var dashboardSpeedTXT = 'Speed';
	var dashboardMinSpeedAlarmTXT = 'Speed too high';
	var dashboardMaxSpeedAlarmTXT = 'Speed too low';
	var dashboardSpeedMesTXT = 'km/h';
	var dashboardDepthTXT = 'Depth';
	var dashboardDepthAlarmTXT = 'Too shallow';
	var dashboardDepthMesTXT = 'm';
	var dashboardGNSSoldTXT = 'Instrument data old';
	var dashboardDepthMenuTXT = 'Shallow';
	var dashboardMinSpeedMenuTXT = 'Min speed';
	var dashboardMaxSpeedMenuTXT = 'Max speed';
	var dashboardToHeadingAlarmTXT = 'The course is bad';
	var dashboardKeysMenuTXT = 'Use keys to switch the screen mode';
	var dashboardKeySetupTXT = 'Select purpose and press key for:';
	var dashboardKeyNextTXT = 'Next mode';
	var dashboardKeyPrevTXT = 'Previous mode';
	var dashboardKeyMenuTXT = 'Alarm menu';
	var dashboardKeyMagneticTXT = 'Magnetic course';
}

function internationalisation(){
dashboardDepthMenuTXTspan.innerText = `${dashboardDepthMenuTXT}, ${dashboardDepthMesTXT}`;
dashboardMinSpeedMenuTXTspan.innerText = `${dashboardMinSpeedMenuTXT}, ${dashboardSpeedMesTXT}`;
dashboardMaxSpeedMenuTXTspan.innerText = `${dashboardMaxSpeedMenuTXT}, ${dashboardSpeedMesTXT}`;
dashboardKeySetupTXTspan.innerText = `${dashboardKeySetupTXT}`;
dashboardKeyNextTXTspan.innerText = `${dashboardKeyNextTXT}`;
dashboardKeyPrevTXTspan.innerText = `${dashboardKeyPrevTXT}`;
dashboardKeyMenuTXTspan.innerText = `${dashboardKeyMenuTXT}`;
dashboardKeyMagneticTXTspan.innerText = `${dashboardKeyMagneticTXT}`;
dashboardKeysMenuTXTspan.innerText = `${dashboardKeysMenuTXT}`;

}


