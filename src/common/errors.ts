import { AppErrorType, CustomError } from "./types/errors.types";

class CustomAppError implements CustomError {
  name: AppErrorType;
  priority: number;
  message: string;

  constructor(name: AppErrorType, priority: number, errorMessage: string) {
    this.name = name;
    this.priority = priority;
    this.message = errorMessage;
  }
}

// Thrown by `getLocationsOnScreen` in `common/mapData`
export class InvalidScreenIndexError extends CustomAppError {
  static NAME: AppErrorType = AppErrorType.INVALID_SCREEN_INDEX;
  static PRIORITY: number = 0;

  constructor(errorMessage: string) {
    super(
      InvalidScreenIndexError.NAME,
      InvalidScreenIndexError.PRIORITY,
      errorMessage
    );
  }
}

// Thrown by `getEntranceLocation` in `LocationTracker`
export class EntranceLocationNotFoundError extends CustomAppError {
  static NAME: AppErrorType = AppErrorType.ENTRANCE_LOCATION_NOT_FOUND;
  static PRIORITY: number = 1;

  constructor(errorMessage: string) {
    super(
      EntranceLocationNotFoundError.NAME,
      EntranceLocationNotFoundError.PRIORITY,
      errorMessage
    );
  }
}

// Thrown by `doesEntranceLinkExist` in `redux/selectors`
export class InvalidEntranceLinkError extends CustomAppError {
  static NAME: AppErrorType = AppErrorType.INVALID_ENTRANCE_LINK;
  static PRIORITY: number = 1;

  constructor(errorMessage: string) {
    super(
      InvalidEntranceLinkError.NAME,
      InvalidEntranceLinkError.PRIORITY,
      errorMessage
    );
  }
}
