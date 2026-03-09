export interface PublishOption {
    id: number;
    name: string;
    value: boolean;
    label: string;
}

export const PUBLISH_CONFIG: PublishOption[] = [{
    id: 1,
    name: "republish",
    value: false,
    label: "Republish previously published content only"
},
{
    id: 2,
    name: "publish",
    value: true,
    label: "Publish both new content and previously published content"
}];

export const DEPLOYMENT_CONFIG: PublishOption[] = [{
    id: 1,
    name: "deployImmediately",
    value: true,
    label: "Deploy immediately after publishing"

}, {
    id: 2,
    name: "scheduleDeployment",
    value: false,
    label: "Schedule deployment"
}]