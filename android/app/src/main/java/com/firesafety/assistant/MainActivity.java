package com.firesafety.assistant;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onBackPressed() {
        getBridge().getWebView().evaluateJavascript(
            "(function(){" +
              "if(typeof window._appHandleBack==='function'){" +
                "window._appHandleBack();" +
              "}else{" +
                "window.history.back();" +
              "}" +
            "})();",
            null
        );
    }
}
