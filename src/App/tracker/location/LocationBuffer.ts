import { Location } from "../../../common/locations";
import { LocationLink } from "../../../common/types/locations.types";

/**
 * Buffer class to temporarily hold historical location data.
 * This class only holds the 4 latest locations it receives. It also provides
 *  a method to give a structured location link with backups out of those 4 locations
 */
export class LocationBuffer {
  private static MAX_LENGTH = 4;

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

  /**
   * Returns the main location link being tracked (locations 2 and 3)
   */
  getLocationLink(): LocationLink {
    let source: Location;
    let destination: Location;

    try {
      source = this.getMainSource();
      destination = this.getMainDestination();
    } catch (error) {
      throw new Error("Not enough locations to create main LocationLink");
    }

    return { source, destination };
  }

  /**
   * Returns the backup locations stored (locations 1 and 4)
   */
  getBackupLocations(): LocationLink {
    let source: Location;
    let destination: Location;

    try {
      source = this.getBackupSource();
      destination = this.getBackupDestination();
    } catch (error) {
      throw new Error("Backup locations not available");
    }

    return { source, destination };
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
      throw new Error("Location not found");
    }

    return location;
  }
}
