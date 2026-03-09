export interface AdditionalOptions {
    id: number,
    label: string;
    name: string;
    value: boolean
}

export const DEPENDENT_ITEMS: AdditionalOptions[] = [{
    id: 1,
    label: "Also publish or republish all items that link to items you are publishing",
    name: "publish",
    value: true
}, {
    id: 2,
    label: "Do not publish or republish any items that link to items you are publishing",
    name: "doNotPublish",
    value: false
}]

export const ITEMS_IN_PROGRESS: AdditionalOptions[] = [{
    id: 1,
    label: "Only publish the checked-in versions of items",
    name: "publishCheckin",
    value: true
}, {
    id: 2,
    label: "Publish the checked-out or in-workflow versions of items if available",
    name: "publishCheckedout",
    value: false
}]

export const PUBLISHING_PRIORITY: AdditionalOptions[] = [{
    id: 1,
    label: "Apply publish priority set on target type",
    name: "publishPriority",
    value: true
}, {
    id: 2,
    label: "Override publish priority",
    name: "overridePriority",
    value: false
}]