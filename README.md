# Where did I put it?

Tired of looking for you phone in silent mode in your appartement? Looking for an actual, physical button to find it?

Seek no more!

### Software setup

#### Requirements
* NodeJS
* Chrome or Chromium browser installed

#### Installation

* Install Google Find My Phone Android app on your device
* Clone this repository
* Run `npm ci`
* Run `npm run build`
* Copy `config.sample.yml` to `config.local.yml`:
```yml
browser:
  kind: chromium
  executablePath: /usr/bin/chromimum-browser
  headless: true
logger:
  kind: console
devices:
  - kind: android
    email: my-email1@gmail.com
    password: my-password1
    shortcut: "1"
  - kind: android
    email: my-email2@gmail.com
    password: my-password2
    shortcut: "2"
```

##### Interactive mode

Interactive mode requires the program to be focused.

* Run `CONFIG_FILE=config.local.yml npm start`
* To find you device, press the key you used as a shortcut


##### Inline mode (non-interfactive)

Inline mode runs once and then closes. This is most useful paired with custom global shortcuts.

* Run `CONFIG_FILE=config.local.yml npm start -- --inline SHORTCUT` where `SHORTCUT` is the shortcut defined in your config file, e.g. `CONFIG_FILE=config.local.yml npm start -- --inline 2`

### Raspberry Pi setup

The point of this is to have a physical emergency button to find your phone, even when you're not close to your computed.
The recommended setup is to install and run it on a headless Raspberry Pi.

* Get a Raspberry Pi capable of running NodeJS
* Get a physical button, the cheapest and simplest option is to get a 10$ USB Num Keypad.
* Install the software as above

#### Interactive mode

For interactive mode, make sure the program is focused, as NodeJS is not capable of handling global keypress shortcuts easily. Press the shortcut button defined above and *voilà*!


#### Global shortcut

If you don't want to have the terminal focused (e.g you're using other windowed programs), you may want to configure a global shortcut to launch the program in inline mode (see above).
