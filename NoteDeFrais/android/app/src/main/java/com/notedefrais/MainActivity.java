package com.notedefrais;

import android.app.Activity;
import android.content.Intent;
import com.facebook.react.ReactActivity;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.keychain.KeychainPackage;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "NoteDeFrais";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        // Cause trouble on android
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

}
