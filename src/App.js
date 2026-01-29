import React, { useContext, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "src/router";
import AuthContext from "src/context/Auth";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { ThemeProvider } from "@material-ui/core";
import { createTheme } from "./theme";
import { Toaster } from "react-hot-toast";
import { Buffer } from "buffer";
import { THEME } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
function App() {
  const theme = createTheme();

  global.Buffer = Buffer;

  return (
    <div className="App">  <TonConnectUIProvider
      manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
      walletsListConfiguration={{
        includeWallets: [
          {
            appName: "tonwallet",
            name: "TON Wallet",
            imageUrl: "https://wallet.ton.org/assets/ui/qr-logo.png",
            aboutUrl:
              "https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd",
            universalLink: "https://wallet.ton.org/ton-connect",
            jsBridgeKey: "tonwallet",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            platforms: ["chrome", "android"],
          },
          {
            appName: "tonflow",
            name: "TONFLOW",
            imageUrl: "https://tonflow.app/assets/images/tonflow_ico_256.png",
            aboutUrl: "https://tonflow.app",
            universalLink: "https://tonflow.app/ton-connect",
            deepLink: "tonflow-tc://",
            bridgeUrl: "https://bridge.tonapi.io/bridge",
            jsBridgeKey: "tonflow",
            platforms: ["windows", "linux", "macos", "chrome"],
          },
        ],
      }}
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/DemoDappWithTonConnectBot/demo",
      }}
    >
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Toaster position="top-right" reverseOrder={true} />
          <AuthContext>
            <RouterProvider router={router} />
          </AuthContext>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
      </TonConnectUIProvider>



    </div>
  );
}

export default App;
