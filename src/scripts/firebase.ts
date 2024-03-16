// Import the functions you need from the SDKs you need
import { getAuth, signInAnonymously, onAuthStateChanged  } from "firebase/auth";
import { getDatabase, ref, set, onValue, remove, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { AllTheTrackerSetters, FirebaseInfo, LocationsFormat, SettingsFormat, TrackerState, TrackerStateSetterType } from "../types/dataTypes";


// Connect to the firebase app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId
};
const firebaseApp = initializeApp(firebaseConfig);


// Database meta info
const firebaseInfo: FirebaseInfo = {
  connected: false,
  uid: undefined,
  authAttempted: false,
  rootRefString: undefined,
  db: getDatabase(firebaseApp)
};

let baseRefStrings: {[key:string]:string} = {
  settings: "/settings",
  layout: "/layout",
  tracking: "/tracking"
};


// Log the user in anonymously and set up the tracker instance
export const initFirebase = (
  roomid: string,
  isOriginatingUser: boolean,
  allTheTrackerSetters: AllTheTrackerSetters,
  trackerLayout: LocationsFormat,
  trackerSettings: SettingsFormat
) => {
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Connected to firebase")
      firebaseInfo.uid = user.uid;
      firebaseInfo.db = getDatabase();
      firebaseInfo.rootRefString = `games/${roomid}`;
      baseRefStrings = Object.fromEntries(
        Object.entries(baseRefStrings).map(([key, value]) => [key, `${firebaseInfo.rootRefString}${value}`])
      );
      firebaseInfo.connected = true;

      initRemoteTracking(allTheTrackerSetters.setTrackerState);
      if (isOriginatingUser) {
        initRemoteTrackerInstance(trackerLayout as LocationsFormat, trackerSettings as SettingsFormat);
      } else {
        loadTrackerInstance(allTheTrackerSetters);
      }
    } else {
      console.log("Auth state not logged in");
      if(firebaseInfo.authAttempted) return;
      firebaseInfo.authAttempted = true;
      signInAnonymously(auth).catch(function(error) {
          console.log(error);
      });
    }
  });
};


// Set up event tracking
export const initRemoteTracking = (setTrackerState: TrackerStateSetterType) => {
  if (!firebaseInfo.connected) return
  const trackingRef = ref(firebaseInfo.db, baseRefStrings.tracking);
  onValue(trackingRef, (data) => {
    setTrackerState(data.val() ?? {});
  });
};


export const initRemoteTrackerInstance = (trackerLayout: LocationsFormat, trackerSettings: SettingsFormat) => {
  const roomRef = ref(firebaseInfo.db, firebaseInfo.rootRefString);
  set(roomRef, {
    layout: trackerLayout,
    settings: trackerSettings,
    tracking: {}
  });
}


export const loadTrackerInstance = (allTheTrackerSetters: AllTheTrackerSetters) => {
  const layoutRef = ref(firebaseInfo.db, baseRefStrings.layout);
  get(layoutRef).then((snapshot): void => {
    if (snapshot.exists()) allTheTrackerSetters.setTrackerLayout(snapshot.val());
  });
  const settingsRef = ref(firebaseInfo.db, baseRefStrings.settings);
  get(settingsRef).then((snapshot):void => {
    if (snapshot.exists()) allTheTrackerSetters.setTrackerSettings(snapshot.val());
  });
};


// Functions to make individual updates to the tracker state
export const firebaseSetValue = (
  locationId: number,
  newLocationStatus: boolean,
  trackerState: TrackerState
) => {
  const locationRef = ref(firebaseInfo.db, `${baseRefStrings.tracking}/${locationId}`);
  if (locationId in trackerState)
    remove(locationRef);
  else
    set(locationRef, newLocationStatus);
};