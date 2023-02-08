import { MutableRefObject, useEffect, useRef } from "react";
import { TextStyle, ViewStyle } from "react-native";

import { Style } from "@mendix/pluggable-widgets-tools";

//import { HelloWorld } from "./components/HelloWorld";
import { EZWebsocketNativeProps } from "../typings/EZWebsocketNativeProps";

declare global {
    var mx: any;
}

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

export function EZWebsocketNative({
    objectId,
    websocketIdentifier,
    actionConfig,
    timeoutAction,
    navigateAction,
    onCloseMicroflowParameterValue
}: EZWebsocketNativeProps<CustomStyle>) {
    // Persist connection throughout render cycles
    const connection: MutableRefObject<WebSocket | null> = useRef(null);

    useEffect(() => {
        // Check if there is no open connection already
        connection.current === null &&
            // Make sure all values are initiated
            objectId.status === "available" &&
            websocketIdentifier.status === "available" &&
            startConnection();
    }, [objectId, websocketIdentifier]);

    useEffect(() => {
        return () => {
            // Close connection on unmount
            connection.current?.close();
        };
    }, []);

    const startConnection = () => {
        // Open websocket connection
        // The replace action makes sure that applications without ssl connect to ws:// and with ssl connect to wss://
        let ws = new WebSocket(global.mx.remoteUrl.replace(/http/, "ws") + websocketIdentifier.value);
        ws.onopen = _event => {
            // Send objectId, csrftoken and onCloseMicroflowParamterValue to wsserver on opening of connection
            // to connect the current session to the object
            const parameters = {
                objectId: objectId.value,
                csrfToken: global.mx.session.sessionData.csrftoken,
                onCloseMicroflowParameterValue: onCloseMicroflowParameterValue?.value
            };
            ws.send(JSON.stringify(parameters));
        };

        ws.onmessage = event => {
            // Find the action to execute for the received triggerstring
            let config = actionConfig.find(config => {
                return config.trigger === event.data;
            });
            if (!config) {
                console.log("Action " + event.data + " not implemented");
                return;
            }
            console.debug("Execute action: " + event.data);
            config.action && config.action.canExecute
                ? config.action.execute()
                : console.error("Action " + event.data + " could not be executed");
        };

        ws.onclose = event => {
            console.debug(event);
            // Timeout event
            event.code === 1001 && timeoutAction && timeoutAction.canExecute && timeoutAction.execute();
            // Navigate away/close page/unrender event
            event.code === 1005 && navigateAction && navigateAction.canExecute && navigateAction.execute();
        };

        // Store connection inside ref so we can keep track through rendercycles
        connection.current = ws;
    };
    return null;
}