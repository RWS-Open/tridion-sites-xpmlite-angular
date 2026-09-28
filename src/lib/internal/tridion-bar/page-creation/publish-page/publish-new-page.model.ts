export interface publishResult{
    "$type": string,
    "PublishTransactionIds": string[]
}

export interface PublishingStatus{
    State:string;
    Message:string;
    IsCompleted:boolean
}