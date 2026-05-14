# Add project-specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified in
# /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt

-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# react-native-vector-icons
-keep class com.oblador.vectoricons.** { *; }

# Google Sign-In
-keep class com.google.android.gms.auth.** { *; }
-keep class com.google.android.gms.common.api.** { *; }
