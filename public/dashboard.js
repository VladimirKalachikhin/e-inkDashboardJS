// Функции
/*
display()
chkAlarms()
menuOnSubmit()
menuOpen()
openSetKeysWin()
showDirectionMark()

keySu(event)
setKeys(event)
saveKeys()

symbolSized(symbol)

getCookie(name)
setCookie(name,data)

saveMode()
restoreMode()

depthAlarm()
maxSpeedAlarm()
minSpeedAlarm()
toHeadingAlarm()
*/
function display(){
// собственно рисует картинку
// Что будем рисовать
//console.log('DISPLAY',mode.mode);
let enough = false, type, parm, variant, variantType, symbol='', nextsymbol='', header = '';
const parms = Object.keys(displayData);
const cnt = parms.length;
prevMode = null;
let cycle = null;
for(let i=0;i<cnt;i++){ 	// 
	type = parms[i];	// что показывать
	parm = displayData[type];	// как показывать
	//console.log('Начало цикла type=',type,"parm=",parm,'mode.mode=',mode.mode);
	if(!mode.mode) mode.mode = type; 	// что-то не так с типом, сделаем текущий тип указанным. mode.mode -- это то, что сейчас показывается на главном экране
	if(enough) {
		variant = 0;
		if(type == 'track' && mode.magnetic) variant = 1;
		variantType = parm['variants'][variant][0];
		//console.log('Next type=',type,'variantType =',variantType,'tpv[variantType]=',tpv[variantType]);
		if(tpv[variantType] == undefined) { 	// но значения следующего типа нет в полученных данных.
			if(i == cnt-1) i = -1; 	// цикл по кругу
			continue;
		}
		if(cycle == variantType){ 	// прокрутили до ранее выбранного типа, но нечего показывать
			nextsymbol = '';
			break;
		}
		nextsymbol = parm['variants'][variant][1]+":&nbsp; "+Math.round(tpv[variantType].value*parm['multiplicator']*(10**parm['precision']))/(10**parm['precision']);
		nextMode = type;
		//console.log('symbol =',symbol,'nextsymbol=',nextsymbol,'nextMode=',nextMode,'parm=',parm);
		break;
	}
	if(type != mode.mode) {  	//console.log(' это не указанный тип'); // 	текущее что показывать не то, что показывается на главном экране
		prevMode = type;	// запомним это как предыдущее что показывать, для управления клавишами
		continue;
	}
	// этот тип тот же, что и на экране, его надо показать
	variant = 0;
	if(type == 'track' && mode.magnetic) variant = 1;
	variantType = parm['variants'][variant][0];
	//console.log('Main variantType =',variantType,'tpv[variantType]:',tpv[variantType],'cycle=',cycle);
	if(tpv[variantType] == undefined) { 	// но значения такого типа нет в полученных данных.
		mode.mode = null; 	// обозначим, что следующий тип должен стать указанным, т.е., если того, что было на главном экране уже нет, будем показывать следующее
		if(cycle == variantType){ 	// прокрутили все типы, но нечего показывать
			symbol = 'No data';	
			break;
		}
		if(!cycle) cycle = variantType;	// запомним этот тип того, что нужно показывать для проверки зацикливания, если ничего не осталось показывать
		if(i == cnt-1) i = -1; 	// цикл по кругу
		continue;
	}
	header = parm['variants'][variant][1];
	symbol = Math.round(tpv[variantType].value*parm['multiplicator']*(10**parm['precision']))/(10**parm['precision']);
	enough = true;	// в принципе, хватит, но нам нужен следующий тип для надписи на клавише
	cycle = variantType;	// сдедующий тип будем искать по кругу до выбранного
	if(i == cnt-1) i = -1; 	// цикл по кругу
	//console.log('Cycle type=',type,'variantType',variantType,'prevMode=',prevMode,"mode.mode=",mode.mode,'nextMode=',nextMode,'i=',i,'cnt=',cnt,'tpv[variantType].value',tpv[variantType].value);
}
if(!prevMode){
	prevMode = parms[cnt-1];
}
//console.log('Exit cycle type=',type,'prevMode=',prevMode,"mode.mode=",mode.mode,'nextMode=',nextMode,'symbol=',symbol);

const rumbNames = ['&nbsp;&nbsp;&nbsp;N&nbsp;&nbsp;&nbsp;','NNE','&nbsp;NE&nbsp;','ENE','&nbsp;&nbsp;E&nbsp;&nbsp;','ESE','&nbsp;SE&nbsp;','SSE','&nbsp;&nbsp;&nbsp;S&nbsp;&nbsp;&nbsp;','SSW','&nbsp;SW&nbsp;','WSW','&nbsp;&nbsp;W&nbsp;&nbsp;','WNW','&nbsp;NW&nbsp;','NNW'];
let currRumb = ['   ','   ','    ','   ','   ','   ','    ','   ','   ','   ','    ','   ','   ','   ','    ','   '];
let rumbNum;
if(mode.magnetic && tpv['magtrack']) rumbNum = Math.round(tpv['magtrack'].value/22.5);
else if(tpv['track']) rumbNum = Math.round(tpv['track'].value/22.5);
else rumbNum = null;
if(rumbNum==16) rumbNum = 0;
//console.log("rumbNum=",rumbNum);
currRumb[rumbNum] = rumbNames[rumbNum];

let percent=null;
if(mode.toHeadingAlarm) {
	// Метка текущего направления 	theHeading уже есть
	if((theHeading>315)&&(theHeading<=360)){
		percent = 100 - (theHeading - 315)*100/90;
		currTrackMark.innerHTML = `<img src='img/markCurrN.png' style='display:block;position:fixed;top:0;right:${percent}%;' class='vert'>`;
	} 
	else if((theHeading>=0)&&(theHeading<45)){
		percent = (theHeading+45)*100/90;
		currTrackMark.innerHTML = `<img src='img/markCurrN.png' style='display: block;position: fixed;top:0;left:${percent}%;' class='vert'>`;
	}
	else if(theHeading == 45){
		currTrackMark.innerHTML = `<img src='img/markCurrSE.png' style='display: block;position: fixed;top:0;right:0;' class='vert'>`;
	}
	else if((theHeading > 45) && (theHeading < 135)){
		percent = 100 - (theHeading-45)*100/90;
		currTrackMark.innerHTML = `<img src='img/markCurrE.png' style='display: block;position: fixed;right:0;bottom:${percent}%;' class='hor'>`;
	}
	else if(theHeading == 135){
		currTrackMark.innerHTML = `<img src='img/markCurrNE.png' style='display: block;position: fixed;bottom:0;right:0;' class='vert'>`;
	}
	else if((theHeading>135)&&(theHeading<225)){
		percent = 100 - (theHeading-135)*100/90;
		currTrackMark.innerHTML = `<img src='img/markCurrN.png' style='display: block;position: fixed;bottom:0;left:${percent}%;' class='vert'>`;
	}
	else if(theHeading==225){
		currTrackMark.innerHTML = `<img src='img/markCurrNE.png' style='display: block;position: fixed;bottom:0;left:0;' class='vert'>`;
	}
	else if((theHeading>225)&&(theHeading<315)){
		percent = 100 - (theHeading-225)*100/90;
		currTrackMark.innerHTML = `<img src='img/markCurrE.png' style='display:block;position:fixed;left:0;top:${percent}%;' class='hor'>`;
	}
	else if(theHeading==315){
		currTrackMark.innerHTML = `<img src='img/markCurrNE.png' style='display: block;position: absolute;top:0;left:0;' class='vert'>`;
	}
	document.body.append(currTrackMark);
}
else {
	currTrackMark.innerHTML='';
}

// DISPLAY:
symbol = symbolSized(symbol);	// собственно, цифра
symbolSpan.innerHTML = symbol;
headerSpan.innerHTML = header;	// подпись сверху
nextsymbolSpan.innerHTML = nextsymbol;	// подпись на клавише
// подпись на левой кнопке
// Проблемы: onClick не всегда срабатывает, если кликать на картинку в кнопке (не успевает всплывать?); результат нажатия появится только со следующим событием, если ничего не происходит -- кнопка нажимается, но последствий не видно
if(tpv['magvar']) {	
	magneticTurnButtonSpan.innerHTML = `
		<div  class='small_symbol' style='position:absolute;text-align:center;'>${dashboardMagVarTXT}</div>
		<span style='font-size:75%;'>${Math.round(tpv['magvar'])}</span> `;	
}
else magneticTurnButtonSpan.innerHTML = "<img src='img/compass.png' alt='magnetic course'>";

//console.log("tpv['magtrack']",tpv['magtrack'],magneticTurnButton);
if(tpv['magtrack']) {
	magneticTurnButton.disabled = false;
}
else {
	magneticTurnButton.disabled = true;
}

if(mode.magnetic){
	if(mode.toHeadingAlarm){
		if(mode.toHeadingMagnetic) dashboardHeadingTXTspan.innerText = dashboardMagHeadingTXT;
		else  dashboardHeadingTXTspan.innerText = dashboardHeadingTXT;
	}
	else dashboardHeadingTXTspan.innerText = dashboardMagHeadingTXT;

	magneticTurnButtonSpan.style.opacity = 1;
}
else {
	if(mode.toHeadingAlarm){
		if(mode.toHeadingMagnetic) dashboardHeadingTXTspan.innerText = dashboardMagHeadingTXT;
		else  dashboardHeadingTXTspan.innerText = dashboardHeadingTXT;
	}
	else dashboardHeadingTXTspan.innerText = dashboardHeadingTXT;
	
	magneticTurnButtonSpan.style.opacity = 0.5;
}
// румб по краю
let cells = borderSigns.querySelectorAll('td > span');
cells[0].innerHTML = currRumb[14];
cells[1].innerHTML = currRumb[15];
cells[2].innerHTML = currRumb[0];
cells[3].innerHTML = currRumb[2];
cells[4].innerHTML = currRumb[1];
cells[5].innerHTML = currRumb[13];
cells[6].innerHTML = currRumb[3];
cells[7].innerHTML = currRumb[12];
cells[8].innerHTML = currRumb[4];
cells[9].innerHTML = currRumb[11];
cells[10].innerHTML = currRumb[5];
cells[11].innerHTML = currRumb[10];
cells[12].innerHTML = currRumb[9];
cells[13].innerHTML = currRumb[8];
cells[14].innerHTML = currRumb[7];
cells[15].innerHTML = currRumb[6];

} // end function display

function chkAlarms(){
// Оповещения в порядке возрастания опасности, реально сработает последнее
let alarmJS;
alarm = false;	// на каждое событие отключаем сигнализацию, а что-нибудь из нижележащего её включит
if(mode.minSpeedAlarm && (tpv['speed'].value != (null || undefined))) {
	if(tpv['speed'].value*60*60/1000 <= mode.minSpeedValue) {
		mode.mode = 'speed';
		header = dashboardMinSpeedAlarmTXT;
		alarmJS = 'minSpeedAlarm();';
		alarm = true;
	}
}
if(mode.maxSpeedAlarm && (tpv['speed'].value != (null || undefined))) {
	if(tpv['speed'].value*60*60/1000 >= mode.maxSpeedValue) {
		mode.mode = 'speed';
		header = dashboardMaxSpeedAlarmTXT;
		alarmJS = 'maxSpeedAlarm();';
		alarm = true;
	}
}
theHeading=null;
if(mode.toHeadingAlarm) {
	if(mode.toHeadingMagnetic && tpv.magtrack) theHeading = tpv.magtrack.value;
	else if(tpv.track) theHeading = tpv.track.value; 	// тревога прозвучит, даже если был указан магнитный курс, но его нет
	else theHeading = null;
	const minHeading = mode.toHeadingValue - mode.toHeadingPrecision;
	if(minHeading<0) minHeading = minHeading+360;
	const maxHeading = mode.toHeadingValue + mode.toHeadingPrecision;
	if(maxHeading>=360) maxHeading = maxHeading-360;
	//console.log('alarm=',alarm,'theHeading=',theHeading,'minHeading=',minHeading,'maxHeading=',maxHeading)
	if((theHeading < minHeading) || (theHeading > maxHeading)) {
		mode.mode = 'track';
		header = dashboardToHeadingAlarmTXT;
		alarmJS = 'toHeadingAlarm();';
		alarm = true;
	}
}
if(mode.depthAlarm && (tpv['depth'].value != (null || undefined))) {
	if(tpv['depth'].value <= mode.minDepthValue) {
		mode.mode = 'depth';
		header = dashboardDepthAlarmTXT;
		alarmJS = 'depthAlarm();';
		alarm = true;
	}
}
if(alarm){
	if(nowFsound !== alarmJS) {
		//console.log(nowFsound,alarmJS)
		clearInterval(alarmInterval); 	// нужен звук другой, остановим старый
		alarmInterval = eval(alarmJS); 	// звук
		nowFsound = alarmJS;
	}
	dashboard.classList.add('wb','alarm'); 	// цвет
}
else {
	if(alarmInterval) { 	// звук звучит
		clearInterval(alarmInterval);
	}
	dashboard.classList.remove('wb','alarm');
	alarmInterval = null;
	nowFsound = '';
}
} // end function chkAlarms

function menuOnSubmit(){
// main menu submit
mode.depthAlarm = depthAlarmSet.checked;
mode.minDepthValue = minDepthValue.value == ""?null:parseFloat(minDepthValue.value);
if(mode.minDepthValue===null) mode.depthAlarm = false;

mode.minSpeedAlarm = minSpeedAlarmSet.checked;
mode.minSpeedValue = minSpeedValue.value == ""?null:parseFloat(minSpeedValue.value);
if(mode.minSpeedValue===null) mode.minSpeedAlarm = false;

mode.maxSpeedAlarm = maxSpeedAlarmSet.checked;
mode.maxSpeedValue = maxSpeedValue.value == ""?null:parseFloat(maxSpeedValue.value);
if(mode.maxSpeedValue===null) mode.maxSpeedAlarm = false;

mode.toHeadingAlarm = toHeadingAlarmSet.checked;
mode.toHeadingValue = toHeadingValue.value == (null || undefined)?toHeadingValue.value:parseFloat(toHeadingValue.value);
for(let radio of document.getElementById("toHeadingPrecision").querySelectorAll("input")){	// здесь просто toHeadingPrecision почему-то уже nodeList, поэтому getElementById. Где засада?
	if(radio.checked) {
		mode.toHeadingPrecision = parseInt(radio.value);
		break;
	}
}
mode.toHeadingMagnetic = mode.magnetic;
if(mode.toHeadingValue===null) mode.toHeadingAlarm = false;
//console.log("mode on submit:",mode);
saveMode();
mainMenuWin.style.display = "none";

if(mode.toHeadingAlarm) {
	showDirectionMark();	// Метка указанного направления
}
else {
	currDirectMark.innerHTML='';
}
display();	
} // end function menuOnSubmit

function menuOpen(){
// main menu open
if(mainMenuWin.style.display=="inherit"){
	mainMenuWin.style.display="none";
} 
else {
	//console.log("mode on open menu:",mode);
	if(mode.depthAlarm) depthAlarmSet.checked = true;
	if(mode.minDepthValue != (undefined || null)) minDepthValue.value = mode.minDepthValue;

	if(mode.minSpeedAlarm) minSpeedAlarmSet.checked = true;
	if(mode.minSpeedValue != (undefined || null)) minSpeedValue.value = mode.minSpeedValue;

	if(mode.maxSpeedAlarm) maxSpeedAlarmSet.checked = true;
	if(mode.maxSpeedValue != (undefined || null)) maxSpeedValue.value = mode.maxSpeedValue;

	if(mode.toHeadingAlarm) {
		toHeadingAlarmSet.checked = true;
		toHeadingValue.value = mode.toHeadingValue.toString(10);
	}
	else {
		if(mode.magnetic){
			if(tpv.magtrack == undefined) toHeadingValue.value = '';
			else if(tpv.magtrack.value===null) toHeadingValue.value = '';
			else toHeadingValue.value = Math.round(tpv.magtrack.value).toString(10);
		}
		else{
			if(tpv.track == undefined) toHeadingValue.value = '';
			else if(tpv.track.value===null) toHeadingValue.value = '';
			else toHeadingValue.value = Math.round(tpv.track.value).toString(10);
		}
	}
	//console.log("mode.toHeadingAlarm=",mode.toHeadingAlarm,"mode.toHeadingValue=",mode.toHeadingValue,mode);
	if(mode.toHeadingPrecision) {
		for(let radio of toHeadingPrecision.querySelectorAll("input")){
			if(radio.value == mode.toHeadingPrecision){
				radio.checked = true;
				break;
			}
		}
	}
	else toHeadingPrecision.querySelectorAll("input")[0].checked = true;
	
	mainMenuWin.style.display="inherit";
};
} // end function menuOpen

function openSetKeysWin() {
/**/
//console.log(controlKeys);
if(setKeysWin.style.display == 'none'){
	window.removeEventListener("keydown", keySu, true);  
	if(controlKeys.upKey) {
		if(controlKeys.upKey.length) {
			upKeyField.value = controlKeys.upKey[0];
			upKeyFieldDisplay.innerHTML = controlKeys.upKey[0]?controlKeys.upKey[0]:'some key';
		}
		else {
			upKeyField.value = null;
			upKeyFieldDisplay.innerHTML = '';
		}
	}
	if(controlKeys.downKey){
		if(controlKeys.downKey.length) {
			downKeyField.value = controlKeys.downKey[0];
			downKeyFieldDisplay.innerHTML = controlKeys.downKey[0]?controlKeys.downKey[0]:'some key';
		}
		else {
			downKeyField.value = null;
			downKeyFieldDisplay.innerHTML = '';
		}
	}
	if(controlKeys.menuKey){
		if(controlKeys.menuKey.length) {
			menuKeyField.value = controlKeys.menuKey[0];
			menuKeyFieldDisplay.innerHTML = controlKeys.menuKey[0]?controlKeys.menuKey[0]:'some key';
		}
		else {
			menuKeyField.value = null;
			menuKeyFieldDisplay.innerHTML = '';
		}
	}
	if(controlKeys.magneticKey){
		if(controlKeys.magneticKey.length) {
			magneticKeyField.value = controlKeys.magneticKey[0];
			magneticKeyFieldDisplay.innerHTML = controlKeys.magneticKey[0]?controlKeys.magneticKey[0]:'some key';
		}
		else {
			magneticKeyField.value = null;
			magneticKeyFieldDisplay.innerHTML = '';
		}
	}
	window.addEventListener("keydown", setKeys, true);  // В читалке Sony можно назначить listener только на window 
	setKeysWin.style.display = 'initial';
}
else {
	setKeysWin.style.display = 'none';
	window.addEventListener("keydown", keySu, true);  
}
} // end function openSetKeysWin()

function showDirectionMark(){
if((mode.toHeadingValue>315)&&(mode.toHeadingValue<360)){
	percent = 100 - (mode.toHeadingValue - 315)*100/90;
	currDirectMark.innerHTML = `<img src="img/markNNW.png" style="display:block;position:fixed;top:0;right:${percent}%;" class="markVert">`;
} 
else if(mode.toHeadingValue == 0){
	currDirectMark.innerHTML = `<img src="img/markN.png" style="display:block;position:fixed;top:0;left:49.5%;" class="markVert">`;
}
else if((mode.toHeadingValue>0)&&(mode.toHeadingValue<45)){
	percent = (mode.toHeadingValue+45)*100/90;
	currDirectMark.innerHTML = `<img src="img/markNNE.png" style="display: block;position: fixed;top:0;left:${percent}%;" class="markVert">`;
}
else if(mode.toHeadingValue == 45){
	currDirectMark.innerHTML = `<img src="img/markNE.png" style="display: block;position: fixed;top:0;right:0;" class="markVert">`;
}
else if((mode.toHeadingValue > 45) && (mode.toHeadingValue < 90)){
	percent = 100 - (mode.toHeadingValue-45)*100/90;
	currDirectMark.innerHTML = `<img src="img/markENE.png" style="display: block;position: fixed;right:0;bottom:${percent}%;" class="markHor">`;
}
else if(mode.toHeadingValue == 90){
	currDirectMark.innerHTML = `<img src="img/markE.png" style="display: block;position: fixed;right:0;top:49%;" class="markHor">`;
}
else if((mode.toHeadingValue > 90) && (mode.toHeadingValue < 135)){
	percent = (mode.toHeadingValue-45)*100/90;
	currDirectMark.innerHTML = `<img src="img/markESE.png" style="display: block;position: fixed;right:0;top:${percent}%;" class="markHor">`;
}
else if(mode.toHeadingValue == 135){
	currDirectMark.innerHTML = `<img src="img/markSE.png" style="display: block;position: fixed;bottom:0;right:0;" class="markHor">`;
}
else if((mode.toHeadingValue>135)&&(mode.toHeadingValue<180)){
	percent = 100 - (mode.toHeadingValue-135)*100/90;
	currDirectMark.innerHTML = `<img src="img/markSSE.png" style="display: block;position: fixed;bottom:0;left:${percent}%;" class="markVert">`;
}
else if(mode.toHeadingValue == 180){
	currDirectMark.innerHTML = `<img src="img/markS.png" style="display: block;position: fixed;bottom:0;left:49.5%;" class="markVert">`;
}
else if((mode.toHeadingValue>180)&&(mode.toHeadingValue<225)){
	percent = (mode.toHeadingValue-135)*100/90;
	currDirectMark.innerHTML = `<img src="img/markSSW.png" style="display: block;position: fixed;bottom:0;right:${percent}%;" class="markVert">`;
}
else if(mode.toHeadingValue==225){
	currDirectMark.innerHTML = `<img src="img/markSW.png" style="display: block;position: fixed;bottom:0;left:0;" class="markHor">`;
}
else if((mode.toHeadingValue>225)&&(mode.toHeadingValue<270)){
	percent = 100 - (mode.toHeadingValue-225)*100/90;
	currDirectMark.innerHTML = `<img src="img/markWSW.png" style="display:block;position:fixed;left:0;top:${percent}%;" class="markHor">`;
}
else if(mode.toHeadingValue == 270){
	currDirectMark.innerHTML = `<img src="img/markW.png" style="display: block;position: fixed;left:0;top:49%;" class="markHor">`;
}
else if((mode.toHeadingValue>270)&&(mode.toHeadingValue<315)){
	percent = (mode.toHeadingValue-225)*100/90;
	currDirectMark.innerHTML = `<img src="img/markWNW.png" style="display:block;position:fixed;left:0;bottom:${percent}%;" class="markHor">`;
}
else if(mode.toHeadingValue==315){
	currDirectMark.innerHTML = `<img src="img/markNW.png" style="display: block;position: absolute;top:0;left:0;" class="markHor">`;
}
} // end function showDirectionMark

function keySu(event) {
if (event.defaultPrevented) {
	return; // Should do nothing if the default action has been cancelled
}

var handled = false;
if (event.code !== undefined) {
	if(controlKeys.upKey.indexOf(event.code) != -1) handled = 'up';
	else if(controlKeys.downKey.indexOf(event.code) != -1) handled = 'down';
	else if(controlKeys.menuKey.indexOf(event.code) != -1) handled = 'menu';
	else if(controlKeys.magneticKey.indexOf(event.code) != -1) handled = 'magnetic';
}
else if (event.keyCode !== undefined) { // Handle the event with KeyboardEvent.keyCode and set handled true.
	if(controlKeys.upKey.indexOf(event.keyCode) != -1) handled = 'up';
	else if(controlKeys.downKey.indexOf(event.keyCode) != -1) handled = 'down';
	else if(controlKeys.menuKey.indexOf(event.keyCode) != -1) handled = 'menu';
	else if(controlKeys.magneticKey.indexOf(event.keyCode) != -1) handled = 'magnetic';
}
else if (event.location != 0) { // 
	if(controlKeys.upKey.indexOf(event.location) != -1) handled = 'up';
	else if(controlKeys.downKey.indexOf(event.location) != -1) handled = 'down';
	else if(controlKeys.menuKey.indexOf(event.location) != -1) handled = 'menu';
	else if(controlKeys.magneticKey.indexOf(event.location) != -1) handled = 'magnetic';
}

if (handled) {
	event.preventDefault(); // Suppress "double action" if event handled
	switch(handled){
	case 'down':
		//alert(handled);
		mode.mode=nextMode;
		display();
		saveMode();
		break;
	case 'up':
		//alert(handled);
		//console.log('Up key down','prevMode=',prevMode,"mode.mode=",mode.mode,'nextMode=',nextMode);
		mode.mode=prevMode;
		display();
		saveMode();
		break;
	case 'menu':
		//alert(handled);
		menuOpen();
		break;
	case 'magnetic':
		//alert(handled);
		mode.magnetic=!mode.magnetic;
		display();
		saveMode();
		break;
	}
}
} // end function keySu

function setKeys(event) {
/*  */
//console.log(event);
if(event.code == 'Tab' || event.code == 'Esc' || event.code == 'Home') return;
//alert(event.code+','+event.keyCode+','+event.key+','+event.charCode+','+event.location)
event.preventDefault();
//alert(event.code+','+event.keyCode+','+event.key+','+event.charCode+','+event.location);
var keyCode;
if(event.code) keyCode = event.code;
else keyCode = 'some key';
//alert(typeof event.target.id);
if(event.target.id == 'upKeyField') {
	keyCodes['upKey'] = [event.code,event.keyCode,event.key,event.charCode,event.location]
	upKeyFieldDisplay.innerHTML = keyCode;
}
else if(event.target.id == 'downKeyField') {
	keyCodes['downKey'] = [event.code,event.keyCode,event.key,event.charCode,event.location]
	downKeyFieldDisplay.innerHTML = keyCode;
}
else if(event.target.id == 'menuKeyField') {
	keyCodes['menuKey'] = [event.code,event.keyCode,event.key,event.charCode,event.location]
	menuKeyFieldDisplay.innerHTML = keyCode;
}
else if(event.target.id == 'magneticKeyField') {
	keyCodes['magneticKey'] = [event.code,event.keyCode,event.key,event.charCode,event.location]
	magneticKeyFieldDisplay.innerHTML = keyCode;
}
else if(event.target.id == '') {
	keyCodes['downKey'] = [event.code,event.keyCode,event.key,event.charCode,event.location]
	downKeyFieldDisplay.innerHTML = keyCode;
}
//console.log('keyCodes',keyCodes);
} // end function setKeys()

function saveKeys(){
for(var type in keyCodes){
	controlKeys[type] = keyCodes[type];
}
//console.log(controlKeys);
keyCodes = JSON.stringify(controlKeys);
var date = new Date(new Date().getTime()+1000*60*60*24*365).toGMTString();
//alert(keyCodes);
document.cookie = 'GaladrielMapDashboardControlKeys='+keyCodes+'; expires='+date+';';
setKeysWin.style.display = 'none';
} // end function saveKeys

function symbolSized(symbol){
let fontZ = Math.floor(symbol.length/3); 	// считая, что штатный размер шрифта позволяет разместить 4 символа на экране
if(fontZ>1) {
	fontZ = Math.round((1/fontZ)*100);
	symbol = "<span style='font-size:"+fontZ+"%;'>"+symbol+"</span>";
}
return symbol;
} // end function symbolSized

function getCookie(name) {
// возвращает cookie с именем name, если есть, если нет, то null
name=name.trim();
var matches = document.cookie.match(new RegExp(
	"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	)
);
//console.log('matches',matches);
return matches ? JSON.parse(decodeURIComponent(matches[1])) : null;
} // end function getCookie

function setCookie(name,data){
const dateCookie = new Date(new Date().getTime()+1000*60*60*24*365).toGMTString();
document.cookie = name+'='+JSON.stringify(data)+'; expires='+dateCookie+';';
} // end function setCookie

function saveMode(){
setCookie('e-inkDashboardJSmode',mode);
shadowmode = null;
} // end function saveMode

function restoreMode(){
const shadowmodeStr = JSON.stringify(shadowmode);
let modeStr = JSON.stringify(mode);
// в этом мудацком языке нельзя сравнивать разные объекты
if(shadowmodeStr == modeStr) shadowmode = null;
else mode = JSON.parse(shadowmodeStr);	// реальная копия, потому что в этом мудацком языке имя переменной -- отдельная сущность, но явной операции разименования нет.
} // end function restoreMode



var snd = new Audio("img/beep-02.wav");
//console.log(snd);
function depthAlarm() { 	// 
	return setInterval(function(){snd.play();},200)
}
function maxSpeedAlarm() {
	return setInterval(function(){snd.play();},1000)
}
function minSpeedAlarm() {
	return setInterval(function(){snd.play();},1500)
}
function toHeadingAlarm() {
	return setInterval(function(){snd.play();},500)
}


