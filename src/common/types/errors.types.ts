export enum AppErrorType {
  ENTRANCE_LOCATION_NOT_FOUND = "EntranceLocationNotFoundError",
  INVALID_SCREEN_INDEX = "InvalidScreenIndexError",
  INVALID_ENTRANCE_LINK = "InvalidEntranceLinkError"
}

export interface CustomError extends Error {
  name: AppErrorType,
  priority: number
}
