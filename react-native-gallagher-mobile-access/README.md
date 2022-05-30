# react-native-gallagher-mobile-access

React Native bindings for the Gallagher Mobile Connect SDK

### <span style='color:red'>Important</span>
These react bindings are provided without warranty or guarantee. They were created as an open source effort to help other developers get started with the SDK more quickly. 

<p style='font-weight: bold'>
Gallagher are not React-Native experts, which means the following:
</p>

1. There is no official support for this package. If you find bugs or things that don't work correctly, please file a Github Issue against the project outlining the problem, then ideally you might also submit a pull request to resolve it.

2. Should you encounter encounter problems compiling or running the react-native integration (such as with Xcode, CocoaPods, yarn, npm, or other tooling), Gallagher will almost certainly **not** be able to help you.

3. The quality of the code in the example application is not of production quality. It does not follow React-Native best practices, style, idioms, or possess any other such qualities.  
You should not use it as a reference for UI structure, program design, or for anything other than a learning vehicle.

4. If you are an experienced React Native developer, and have suggestions about how it would be better to re-structure the sample code and/or the bindings library, *please* file a Github issue/pull request to help improve this. It will be appreciated.

## Getting Started

First, make sure you can build and compile the example app.  
This will make sure your dev system is set up correctly.
### Installation
In your package.json file you can now add the react-native-gallagher-mobile-access as a npm package to install in three ways:
* Using the repo from github:
```json
  "dependencies": {
    "react-native-gallagher-mobile-access": "https://gitpkg.now.sh/GallagherSecurity/mobileconnectsdk-react-native-bindings/react-native-gallagher-mobile-access?main",
  ...
```
* Pulling and/or copying the Gallagher repo and providing the path to the `react-native-gallagher-mobile-access` folder (remember file paths in your package.json are relative, you will need to adjust the file path accordingly to your folder structures, you also need to update the native_lib_path in the [Podspec file][react-native-gallagher-mobile-access.podspec] to match where the sdk is located)
```json
  "dependencies": {
    "react-native-gallagher-mobile-access": "file:../../git/react-native-gallagher-mobile-access/react-native-gallagher-mobile-access",
  ...
```
* yarn or npm
```sh
yarn add 'https://gitpkg.now.sh/GallagherSecurity/mobileconnectsdk-react-native-bindings/react-native-gallagher-mobile-access?main'
npm install 'https://gitpkg.now.sh/GallagherSecurity/mobileconnectsdk-react-native-bindings/react-native-gallagher-mobile-access?main'
```

Run `yarn` or `npm install` in your root folder of your project to install the `react-native-gallagher-mobile-access` into your `node_modules`
```sh
yarn
```

### Android Setup (Example App)
*Prerequisite: Android Library*
1. Unzip the library that you obtained from Gallagher. It should have a folder structure as follows:
```
com/gallagher/security/gallaghermobileaccess/*
```
2. Move the files that were unzipped in the previous step into a folder in the root of your project as follows:
##### *Please note that is necessary for react-native autolinking to take place since the bindings will be installed into your node_modules and needs to know where to find the library files*
```
example/gallagher/sdk/android
```

3. The folder structure should now be as follows:
```
example/gallagher/sdk/android/com/gallagher/security/gallaghermobileaccess/*
```

### iOS Setup (Example app)
*Prerequisite: iOS Static Library*

1. Unzip the static library that you obtained from Gallagher. It should have a folder structure as follows:
```
GallagherMobileAccess.swiftmodule/
        *.swiftmodule, swiftinterface, etc
iphoneos/
        libGallagherMobileAccess.a
iphonesimulator/
        libGallagherMobileAccess.a
```
2. Move the files that was unzipped in the previous step into a folder within the example app as follows:
##### *Please note that is necessary for the react-native autolinking to take place since the bindings will be installed into your node_modules and needs to know where to find the static library files*
```
example/gallagher/sdk/ios
```

3. The folder structure should now be as follows:

```
example/gallagher/sdk/ios/
    GallagherMobileAccess.swiftmodule/*.swiftmodule, swiftinterface, etc
    iphoneos/libGallagherMobileAccess.a
    iphonesimulator/libGallagherMobileAccess.a
```

4. Install CocoaPods if you don't already have it, then run pod install.

```
cd example/ios
pod install
cd ../.. # ready for npx react-native run-ios
```

## Building and running the example app
*Prerequisite: If running in iPhone, iOS setup for the example app*
*Prerequisite: If running on Android, Android setup for the example app*
```sh
cd example
yarn
# ✨  Done in 8.23s.
```

Once you have used yarn to get everything configured, launch react native as follows:

1. In one terminal window, launch `npx react-native start`.  
You should see the Metro bundler splash screen appear. Leave it running and open a second terminal tab/window

2. In a second terminal window, launch `npx react-native run-ios`.  
This will launch the iPhone simulator, and then begin the Xcode build/compile process. The first time you run this, it will likely take several minutes, then you should see the example app launch in the simulator.  
**Unfortunately**, The Mobile Connect SDK will fail to register credentials on some mac computers. It uses the Apple Secure Enclave to store private key material, which many Intel macs do not have. We advise you therefore, to run and debug on a physical phone.

3. Connect a physical device, then Open Xcode (tested with Xcode 12.5), and open `example/ios/GallagherMobileAccessExample.xcworkspace`.  
Select the "GallagherMobileAccessExample" target, select the physical phone as the target device, and build/run.  
You will need to change the Apple development Team ID to your own, rather than Gallagher's.

If everything goes according to plan, you will see the example app launch on your phone.

You should then follow the [Developer Guide][ios-dev-guide] for the native SDK, translating method calls into JavaScript as appropriate. Look at the typescript bindings in `react-native-gallagher-mobile-access/index.d.ts` for the translated method call names and signatures.

*Note: the ios developer guide mentions linking libraries, and the RxSwift dependency. You do not need to do any of this for the React Native integration, as it is managed by CocoaPods*

**Troubleshooting the example app:**

iOS: If you run npx react-native run-ios and the simulator appears but just sits with a message saying "Loading from Metro..." check AppDelegate.m in the example source code.  
There is a function `sourceURLForBridge` that has some code to override the host address for finding the react native dev server. Check that it's commented out, or if you have multiple NIC's, you may need to uncomment it and put the correct IP address in.

----

## iOS Setup: Integrating the bindings into your own app
*Prerequisite: Static Library*

1. Unzip the static library that you obtained from Gallagher. It should have a folder structure as follows:
```
GallagherMobileAccess.swiftmodule/
        *.swiftmodule, swiftinterface, etc
iphoneos/
        libGallagherMobileAccess.a
iphonesimulator/
        libGallagherMobileAccess.a
```
2. Move the files that was unzipped in the previous step into a folder in the root of your project as follows:
##### *Please note that is necessary for the react-native autolinking to take place since the bindings will be installed into your node_modules and needs to know where to find the static library files*
```
AppRootFolder/gallagher/sdk/ios
```

3. The folder structure should now be as follows:

```
AppRootFolder/gallagher/sdk/ios/
    GallagherMobileAccess.swiftmodule/*.swiftmodule, swiftinterface, etc
    iphoneos/libGallagherMobileAccess.a
    iphonesimulator/libGallagherMobileAccess.a
```

4. You will need to update your `info.plist` with the following:
```xml
  <key>NSLocationAlwaysUsageDescription</key>
  <string>Your location is needed to detect readers using Bluetooth®. GPS is not used and your location is never shared.</string>
  <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
  <string>Your location is needed to detect readers using Bluetooth®. GPS is not used and your location is never shared.</string>
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>Your location is needed to detect readers using Bluetooth®. GPS is not used and your location is never shared.</string>
  <key>NSBluetoothAlwaysUsageDescription</key>
  <string>Your Bluetooth® is needed to detect readers using Bluetooth®</string>
  <key>UIBackgroundModes</key>
  <array>
      <string>bluetooth-central</string>
  </array>
```
5. Run `pod install` in your ios folder within your react native project to link the native dependencies
```sh
cd ios/
```
6. Now you should be able to use the `GallagherMobileAccess` within your application as below:
```js
import GallagherMobileAccess from 'react-native-gallagher-mobile-access';

GallagherMobileAccess.configure(null, null, null);
```

## Android Setup: Integrating the bindings into your own app
*Prerequisite: Static Library*
1. Unzip the static library that you obtained from Gallagher. It should have a folder structure as follows:
```
com/gallagher/security/gallaghermobileaccess/*
```
2. Move the files that was unzipped in the previous step into a folder in the root of your project as follows:
##### *Please note that is necessary for the react-native autolinking to take place since the bindings will be installed into your node_modules and needs to know where to find the static library files*
```
AppRootFolder/gallagher/sdk/android
```

3. The folder structure should now be as follows:
```
AppRootFolder/gallagher/sdk/android/com/gallagher/security/gallaghermobileaccess/*
```

4. Add the following permissions as needed to `AndroidManifest.xml` file that should be located in `android/app/src/main/AndroidManifest.xml`
```xml
...
<uses-permission android:name="android.permission.INTERNET" />
<!-- Add from here -->
<!-- Bluetooth LE -->
<uses-feature android:name="android.hardware.bluetooth_le" android:required="true" />
<!-- Required for Android 6.0 and later when using Bluetooth LE -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<!-- Required for Android 10 and later when using Bluetooth LE -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<!-- Required for Android 10 and later when using Bluetooth LE while the app is not on-screen -->
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<!-- NFC -->
<uses-permission android:name="android.permission.NFC" />
<!-- Unlock notification wakes the screen -->
<uses-permission android:name="android.permission.WAKE_LOCK" />
<!-- permission to run as a foreground service to enable BLE scanning https://developer.android.com/about/versions/pie/android-9.0-changes-28 -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<!-- Request legacy Bluetooth permissions on older devices. -->
<uses-permission android:name="android.permission.BLUETOOTH"
                  android:maxSdkVersion="30" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"
                  android:maxSdkVersion="30" />
<!-- Needed only if your app looks for Bluetooth devices.
      You must add an attribute to this permission, or declare the
      ACCESS_FINE_LOCATION permission, depending on the results when you
      check location usage in your app. -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<!-- Needed only if your app makes the device discoverable to Bluetooth
      devices. -->
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
<!-- Needed only if your app communicates with already-paired Bluetooth
      devices. -->
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<!-- Add till here -->
...
```

5. Add the following features to `AndroidManifest.xml` file that should be located in `android/app/src/main/AndroidManifest.xml`
```xml
...
<activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
<!-- Add from here -->
<service
    android:name="com.gallagher.security.mobileaccess.BleBackgroundService"
    android:exported="false"
    android:stopWithTask="false" />

<service
    android:name="com.gallagher.security.mobileaccess.NfcBackgroundService"
    android:enabled="true"
    android:exported="true"
    android:permission="android.permission.BIND_NFC_SERVICE">
    <intent-filter>
        <action android:name="android.nfc.cardemulation.action.HOST_APDU_SERVICE" />
    </intent-filter>
    <meta-data
        android:name="android.nfc.cardemulation.host_apdu_service"
        android:resource="@xml/ggl_apdu_service" />
</service>
<!-- Add till here -->
...
```

6. Add the following to `build.gradle` located under `/android/build.gradle`
```gradle
maven {
    // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
    url("$rootDir/../node_modules/react-native/android")
}
// Add this below React native maven
maven {
    // Location of the closed-source Gallagher SDK
    url("$rootDir/../gallagher/sdk/android")
}
```
7. Now you should be able to use the `GallagherMobileAccess` within your application as below:
```js
import GallagherMobileAccess from 'react-native-gallagher-mobile-access';

GallagherMobileAccess.configure(null, null, null);
```

## Usage

**NOTE:** You are required to ask permission from the user in order to access NFC, Bluetooth and Location. Please ensure you request the correct permissions from the user using your react-native library of choice.

In your `App` file, before your exported `App()` function, you will need to import and configure the SDK. After which point you can enable BLE scanning and Automatic Access requests. 

Look at `App.tsx` in the example project for more information.

```ts
import GallagherMobileAccess from "react-native-gallagher-mobile-access";

// ...

GallagherMobileAccess.configure(null, null, null);

function App() {
  useEffect(async () => {
    GallagherMobileAccess.setScanning(true);
    GallagherMobileAccess.setAutomaticAccessEnabled(true);

    const states = await GallagherMobileAccess.getStates();
    console.log("sdk states:" + JSON.stringify(states));
  }, []);
};
```

You will then need to register a credential, using the `registerCredential` method.

**NOTE:** The React Native SDK bindings diverge here from the native Swift/Java bindings.

In the native Swift/Java SDK, you call `registerCredential` and supply two callbacks, which may get called in sequence. The native SDK does this:

1. `onAuthenticationTypeSelectionRequested` callback - Optionally called if the SDK wants you to prompt the user to choose between PIN or Fingerprint as a second factor authentication method.
2. `onRegistrationCompleted` callback - called after registration completes, to inform you of success, or an error

This two-callback paradigm does not map well to JavaScript, which prefers to use promises and async/await, and in particular, React Native's bridging mechanism, which wants to have functions that return either a single promise, or invoke a single callback.

As such, the registration flow has been rewritten into a two-step method:

1. You call `registerCredential`, which returns a `Promise` that you can `await`
3. If the credential does not require a second factor, the reigstration should succeed, and the promise will resolve with a JS object with `{ "completed": true, "credential": { ...} }`
3. Alternatively, if the SDK wants you to ask the user to choose a second factor authentication method, it will resolve the promise with a JS object with `{ "completed": false, "continuationPoint": "<opaque string>"}`.  
At this point, you should display your user interface and ask the user to select a method.  
When they do, you must then call `registerCredentialContinue`, supplying the continuation point, and the result. This returns a second `Promise` which will then resolve with `{ "completed": true, "credential": { ...} }`

```ts
try {
    const url = "<invitation url from the Command Centre REST api>";
    const response = await GallagherMobileAccess.registerCredential(url);
    if(!response.completed && "continuationPoint" in response) {
        const authenticationType = await PromptUserToSelectMethod(); // your UI code goes here.
        
        await GallagherMobileAccess.registerCredentialContinue(response.continuationPoint, true, authenticationType);
    }
    // registered successfully
} catch (error) {
    // failed
}
```

[ios-dev-guide]: https://gallaghersecurity.github.io/mobileconnectsdk-docs/docs/ios/sdk-docs/developer-guide.html
[podspec-file]: react-native-gallagher-mobile-access.podspec
