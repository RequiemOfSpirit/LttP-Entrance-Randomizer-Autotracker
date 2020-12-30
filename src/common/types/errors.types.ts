export enum AppErrorType {
  ENTRANCE_LOCATION_NOT_FOUND = "EntranceLocationNotFoundError",  // Thrown by `getEntranceLocation` in `LocationTracker`
  INVALID_SCREEN_INDEX = "InvalidScreenIndexError",  // Thrown by `getEntranceLocation` in `LocationTracker`

  INVALID_ENTRANCE_LINK = "InvalidEntranceLinkError"  // Thrown by `doesEntranceLinkExist` in `redux/selectors`
}

export interface CustomAppError extends Error {
  name: AppErrorType,
  priority: number
}
