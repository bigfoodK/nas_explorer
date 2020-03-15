import React from 'react';

export interface PluginInfo {
    name: string;
    author: string;
    version: number[];
    description: string;
}

export default abstract class PluginBase {
    public abstract readonly info: PluginInfo;

    public abstract IconComponent: typeof React.Component | React.FC;

    public abstract MainComponent: typeof React.Component | React.FC;
}
