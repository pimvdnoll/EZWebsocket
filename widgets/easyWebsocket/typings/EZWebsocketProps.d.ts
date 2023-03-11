/**
 * This file was generated from EZWebsocket.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export interface ActionConfigType {
    trigger: string;
    action?: ActionValue;
}

export interface ActionConfigPreviewType {
    trigger: string;
    action: {} | null;
}

export interface EZWebsocketContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    websocketIdentifier: DynamicValue<string>;
    objectId: DynamicValue<string>;
    actionConfig: ActionConfigType[];
    messageAttribute?: EditableValue<string>;
    timeoutAction?: ActionValue;
    navigateAction?: ActionValue;
    onCloseMicroflowParameterValue?: DynamicValue<string>;
}

export interface EZWebsocketPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    websocketIdentifier: string;
    objectId: string;
    actionConfig: ActionConfigPreviewType[];
    messageAttribute: string;
    timeoutAction: {} | null;
    navigateAction: {} | null;
    onCloseMicroflowParameterValue: string;
}
