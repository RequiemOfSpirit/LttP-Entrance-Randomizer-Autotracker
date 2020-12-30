import { AppErrorType } from "./types/errors.types";

export const AppErrorTypePriorities: Record<AppErrorType, number> = {
  [AppErrorType.ENTRANCE_LOCATION_NOT_FOUND]: 1,
  [AppErrorType.INVALID_ENTRANCE_LINK]: 1,
  [AppErrorType.INVALID_SCREEN_INDEX]: 0
};
