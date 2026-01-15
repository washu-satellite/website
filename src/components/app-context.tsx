import { MessageEnvelopeSchema } from '@/gen/messages/transport/v1/transport_pb';
import { bStore } from '@/hooks/useAppStore';
import { authClient } from '@/lib/auth-client';
import { useAuthenticatedUser } from '@/lib/auth/client';
import { cn } from '@/lib/utils';
import { fromBinary } from '@bufbuild/protobuf';
import { Centrifuge, Subscription } from 'centrifuge/build/protobuf';
import { Geist, Geist_Mono } from 'next/font/google';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react';

interface AppContextState {
}

export interface AppContextProps {
}

const DefaultAppContext: AppContextProps = {
}

const AppContext = React.createContext<AppContextProps>(DefaultAppContext);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const AppContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
    const _client = bStore.use.client();

    const _theme = bStore.use.theme();

    const _setClient = bStore.use.setClient();
    const _subscribe = bStore.use.subscribe();
    
    const _addMessage = bStore.use.addMessage();

    const userData = useAuthenticatedUser();

    // establish user information, connect to the Centrifuge server, generate handlers
    const init = async () => {
        

        // const r = await fetch("/api/get-token");
        // if (!r.ok) { console.error("Failed to retrieve JWT for socket"); return; }

        // const { token } = await r.json();

        // console.log(`Got the token: ${token}`);

        // const c = new Centrifuge(`ws://localhost:8000/connection/websocket?format=protobuf`, {
        //     token: token
        // });

        // c.on('connected', ctx => {
        //     console.log("Connected to server");
        // });

        // c.on('message', ctx => {
        //     console.log("Got a message");

        //     const d = new Uint8Array(ctx.data);
        //     const envelope = fromBinary(MessageEnvelopeSchema, d);

        //     console.log(`Got envelope with src: ${envelope.senderId} and dest: ${envelope.destId}`);

        //     // note: always use bStore.getState() in handlers
        //     const channels = bStore.getState().openChannels;

        //     // // TODO: add channels to bStore
        //     // if (!channels.includes("telemetry"))
        //     //     return;

        //     _addMessage(envelope);
        // });

        // const sub = c.newSubscription("telemetry");
        // sub.on('publication', ctx => {
        //     // console.log("Got a publication!");

        //     const d = new Uint8Array(ctx.data);
        //     const envelope = fromBinary(MessageEnvelopeSchema, d);

        //     _addMessage(envelope);
        // });
        // sub.subscribe();
        // _subscribe("telemetry", sub);

        // c.connect();
        
        // _setClient(c);
        // return c;
    }

    // app initialization
    useEffect(() => {
        // if the user's session has not been established,
        // delay connecting to the Centrifuge server and populating user information
        if (!userData) {
            return;
        }

        init();
    }, [userData]);

    return (
        <AppContext.Provider
            value={{
                ...DefaultAppContext
            }}
        >
            <body
                className={cn(
                    `${geistSans.variable} ${geistMono.variable} antialiased`,
                    {
                        "dark": _theme === 'dark'
                    }
                )}
            >
                {props.children}
            </body>
        </AppContext.Provider>
    );
}

export default AppContext;

export { AppContextProvider };