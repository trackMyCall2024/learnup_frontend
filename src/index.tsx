import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./setup/reportWebVitals";
import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";

import AppRoutes from "./setup/routes";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssVarsProvider as JoyCssVarsProvider, extendTheme } from "@mui/joy/styles";
import { themeJoy } from "./theme/themeJoy";
import { themeMui } from "./theme/themeMaterial";
import { Provider } from "react-redux";
import { store } from "./store/configReducer";
import { Auth0Provider } from "@auth0/auth0-react";
import AppRouter from "./AppRouter";

const materialTheme = materialExtendTheme(themeMui);
const joyTheme = extendTheme(themeJoy);

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);

root.render(
    <React.StrictMode>
        {/* <Auth0Provider
            domain={'dev-gied5dxzv0v4e4pa.us.auth0.com'}
            clientId={'djaxQ10FCMs03JQeqxqMsDG04iquX54k'}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: "http://localhost:3000",
                scope: "openid profile email offline_access",
            }}
            cacheLocation={"localstorage"}
            useRefreshTokens={true}
        > */}
            <Provider store={store}>
                <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
                    <JoyCssVarsProvider theme={joyTheme}>
                        <QueryClientProvider client={queryClient}>
                            <AppRouter/>
                        </QueryClientProvider>
                    </JoyCssVarsProvider>
                </MaterialCssVarsProvider>            
            </Provider>
        {/* </Auth0Provider> */}
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
