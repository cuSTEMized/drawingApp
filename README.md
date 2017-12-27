# Step-by-step tutorial for converting a website into an app

(Instructions for Mac to make an Android app)

Step 1. Install Cordova, Android Studio, and gradel
```
npm install -g cordova
brew install gradle
```

Step 2. Create Cordova project
```
cordova create CuSTEMized_Coloring_App com.custemized.CuSTEMized_Coloring_App CuSTEMized_Coloring_App
```

Step 3. Add Android as a platform
```
cd CuSTEMized_Coloring_App
cordova platforms add android
```

Step 4. Move your web files to the `www/` folder, create icon and splash screen 
Icon and splash screen necessary for kids apps in Google Play to meet parental guidelines

- Splash screen: https://github.com/AlexDisler/cordova-splash
- Icon: https://github.com/AlexDisler/cordova-icon


Step 5. Build and test your app for Android

This step requires Android Studio and gradel as well as for all the latest Android SDK build tools and packages to be installed through Android Studio with all licenses accepted. 
```
cordova build android
cordova emulate android
```

Step 6. Create release

Build the release.
```
cordova build android --release
```

To release an app, you will need to manually sign it. First, generate a key:
```
keytool -genkey -v -keystore key-name.keystore -alias alias-name -keyalg RSA -keysize 2048 -validity 10000
```

The resulting release `android-release-unsigned.apk` will be unsigned.

To sign the release, use `jarsigner` along with the key you just generated:
```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore key-name.keystore android-release-unsigned.apk alias-name
```

You will also want to zipalign your app before uploading onto Google Play:
```
zipalign -v 4 android-release-unsigned.apk CuSTEMized_Coloring_App_v1.apk 
```

Step 7. Commit to Github

Do not need to commit all files. Run:
```
cordova platform save
cordova plugin save
```
Now you can ignore the platform and plugin folders in your commit for example.

After fetching repo on another machine you just run following command to generate and fetch plugins and platforms automatically
```
cordova prepare
```
