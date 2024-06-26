[Русское описание](https://github.com/VladimirKalachikhin/e-inkDashboardJS/blob/master/README.ru-RU.md)  
# e-ink Dashboard for SignalK [![License: CC BY-NC-SA 4.0](screenshots/Cc-by-nc-sa_icon.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en)

## v. 0.1
The e-inkDashboardJS displaying in real time some instruments, attached to Signal K, on modern and powerful e-ink readers.  
Only modern browser needed.

## Features

* velocity
* depth
* true or magnetic course
* alarms

## Compatibility
Linux. Signal K.

## Usage
Unlike [e-inkdashboard](https://www.npmjs.com/package/e-inkdashboard), e-inkdashboardjs allows displaying data at the same speed as they come from sensors. However, the data may be displayed with a lower frequency if the device does not allow it.  
The screen image optimized to different screen resolutions and should look good from little to big screens.  
The presence of the touch screen is assumed, and mode is switched by a tap to the next data type button on the screen.   You can use two or more devices to display different info.  
For some devices with hardware keys you may set up some hardware keys to switch mode, magnetic or true course and opening alarm menu. Use <img src="public/img/settings.png" alt="Settings button" width="24px"> button on bottom of alarm menu to set up it. Default keys is:

* ArrowDown for next mode
* ArrowUp for previous mode
* AltRight for alarm menu
* KeyM for magnetic course switch
 
Access to the e-inkDashboard by address:   

`http://YourSignalKhost:YourSignalKport/e-inkdashboardjs/`  

 The e-inkDashboard allows you to set a visual and sound signal for dangerous events, such as shallow or speed.
Set up your browser to allow sound signal.  
The signal settings are local for every showing device, and it is triggered only if the device work. Be careful!

## Install&configure:
Install plugin from Signal K Appstore as **e-inkdashboardjs**.  
Restart Signal K,  
Use Server -> Plugin Config menu to start plugin and configure update frequency and type of data displayed.  
Set update frequency to comfort rate for your device. Note that too slow update is dangerous of not noticing a rapidly changing parameter such as depth.  
Press Submit to save changes.

## SignalK alarms
Since the SignalK does not any alarm handling, e-inkDashboard has its own. But the e-inkDashboardJS sets the SugnalK's alarm states for velocity, depth and course and raises the SugnalK's alarms notifications.  
Besides that the e-inkDashboardJS take MOB notification from SignalK. If it has spatial info ([GaladrielMap SignalK edition](https://github.com/VladimirKalachikhin/GaladrielMapSK) send it) - then displays direction to MOB.

## Thanks

* [Typicons by Stephen Hutchings](https://icon-icons.com/pack/Typicons/1144) for icons.

## Support

[Discussions](https://github.com/VladimirKalachikhin/Galadriel-map/discussions)

The forum will be more lively if you make a donation at [ЮMoney](https://sobe.ru/na/galadrielmap)

[Paid personal consulting](https://kwork.ru/it-support/20093939/galadrielmap-installation-configuration-and-usage-consulting)  
