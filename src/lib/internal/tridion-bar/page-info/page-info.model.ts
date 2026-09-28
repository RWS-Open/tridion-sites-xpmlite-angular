export interface ItemResponse {
  Id: string;
  Title?: string;
  [key: string]: unknown;
}

export interface CheckInPayload {
  RemovePermanentLock?: boolean;
}
