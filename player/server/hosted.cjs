


// readme :: info : back-end - this file runs server-side
// ----------------------------------------------------------------------------------------------------------------------------
    "use strict";
// ----------------------------------------------------------------------------------------------------------------------------





// import :: tools
// ----------------------------------------------------------------------------------------------------------------------------
    require( "../global/shared.cjs" );
    const { app, BrowserWindow, ipcMain } = require( "electron" );

    Modify( globalThis ).define
    ({
        Player: app,
        Worker: ipcMain,
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: initClient : called by event from `main.js` as `app.whenReady()` -or `app.on("ready")` ... creates BrowserWindow
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( Player ).define
    ({
        initClient ()
        {
            let devTools = (process.env.NODE_ENV+"").toLowerCase().startsWith("dev");
            let remember = Config( "*" );
            let winScope = remember.ornate.windowSizing;

            let settings = // object
            {
                title: "nexus-media",
                backgroundColor: "#000000",
                autoHideMenuBar: true,

                webPreferences:
                {
                    devTools,
                    nodeIntegration: true,
                    contextIsolation: false,
                },
            };

            if ( winScope !== "maximized" )
            {
                winScope = winScope.split("x");
                winScope = { width: (winScope[0]*1), height: (winScope[1]*1), center: true };
                Object.assign( settings, winScope );
            };

            globalThis.Client = new BrowserWindow( settings );
            Client.loadURL( "file://" + Path.join(__dirname,"../client/window.htm") );

            if ( winScope === "maximized" )
            { Client.maximize() };

            if ( devTools )
            { Client.webContents.openDevTools() };
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------





// define :: initServer : listen on PORT
// ----------------------------------------------------------------------------------------------------------------------------
    Modify( Player ).define
    ({
        initServer ()
        {
            return {then ( accept )
            {
                accept();
            }};
        }
    });
// ----------------------------------------------------------------------------------------------------------------------------
