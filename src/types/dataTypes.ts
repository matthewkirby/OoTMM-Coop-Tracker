import { Database } from "firebase/database";

export interface SettingsFormat {
  [settingName: string]: string;
}

export interface CheckFormat {
  name: string;
  checkId: number;
  numChecks: number;
  rewards: string[];
}

export interface RegionFormat {
  game: "oot" | "mm";
  nChecks: number;
  checks: CheckFormat[];
}

export interface LocationsFormat {
  [region: string]: RegionFormat;
}

export interface TrackerSetupData {
  settings: SettingsFormat;
  locations: LocationsFormat;
}

export interface TrackerState {
  [checkId: number]: boolean;
}

export type TrackerStateSetterType = React.Dispatch<React.SetStateAction<TrackerState>>;

export interface FirebaseInfo {
  connected: boolean;
  uid: undefined | string;
  authAttempted: boolean;
  rootRefString: undefined | string;
  db: Database;
}

export interface AllTheTrackerSetters {
  setTrackerLayout: React.Dispatch<React.SetStateAction<LocationsFormat>>;
  setTrackerSettings: React.Dispatch<React.SetStateAction<SettingsFormat>>;
  setTrackerState: TrackerStateSetterType;
}