import { Location, LocationLinkWithBackups, LocationWithBackup } from "../../../common/locations";

/**
 * Buffer class to temporarily hold historical location data.
 * This class only holds the 4 latest locations it receives. It also provides
 *  a method to give a structured location link with backups out of those 4 locations
 */
export class LocationBuffer {
  static MAX_LENGTH = 4;

  private locationHistory: Array<Location> = [];

  add(location: Location): void {
    this.locationHistory.push(location);

    if (this.locationHistory.length > LocationBuffer.MAX_LENGTH) {
      this.locationHistory.shift();
    }
  }

  clear(): void {
    this.locationHistory.splice(0, this.locationHistory.length);
  }

  toLocationLinkWithBackups(): LocationLinkWithBackups {
    let sourceLocation: LocationWithBackup;
    let destinationLocation: LocationWithBackup;

    try {
      sourceLocation = {
        main: this.getMainSource(),
        backup: this.getBackupSource()
      };
      destinationLocation = {
        main: this.getMainDestination(),
        backup: this.getBackupDestination()
      };
    } catch (error) {
      const errorMessage = "Not enough locations to create LocationLink with backups";
      throw new Error(errorMessage);
    }

    return {
      previous: sourceLocation,
      next: destinationLocation
    };
  }

  private getBackupSource(): Location {
    return this.get(0);
  }

  private getMainSource(): Location {
    return this.get(1);
  }

  private getMainDestination(): Location {
    return this.get(2);
  }

  private getBackupDestination(): Location {
    return this.get(3);
  }

  private get(index: number): Location {
    let location: Location = this.locationHistory[index];

    if (location === undefined) {
      const errorMessage = "Location not found";
      throw new Error(errorMessage);
    }

    return location;
  }
}
