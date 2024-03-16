import { createContext, useEffect, useState } from 'react';
import './App.css';
import { parseSpoiler } from './scripts/parseSpoiler';
import EntryPoint from './components/EntryPoint';
import { SettingsFormat, LocationsFormat, TrackerState, AllTheTrackerSetters } from './types/dataTypes';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Tracker from './components/Tracker';
import { initFirebase } from './scripts/firebase';

const darkTheme = createTheme({
  palette: { mode: "dark" }
});

export const TrackerStateContext = createContext<TrackerState>({});

function App() {
  // States to manage the structure of the tracker (these are unlikely to change)
  const [trackerLoaded, setTrackerLoaded] = useState<boolean>(false);
  const [trackerLayout, setTrackerLayout] = useState<LocationsFormat>({});
  const [trackerSettings, setTrackerSettings] = useState<SettingsFormat>({});

  // Firebase related states
  const [firebaseRoomId, setFirebaseRoomId] = useState<string>("");
  const [isOriginatingUser, setIsOriginatingUser] = useState<boolean>(false);

  // States that are a bit more dynamic
  const [trackerState, setTrackerState] = useState<TrackerState>({});


  // Firebase stuff
  useEffect(() => {
    if (trackerLoaded) {
      const allTheTrackerSetters: AllTheTrackerSetters = { setTrackerLayout, setTrackerSettings, setTrackerState };
      initFirebase(firebaseRoomId, isOriginatingUser, allTheTrackerSetters, trackerLayout, trackerSettings);
      }
  }, [trackerLoaded]);


  const loadSampleData = (roomId: string) => {
    parseSpoiler("")
      .then(initialState => {
        setTrackerLayout(initialState?.locations ?? {});
        setTrackerSettings(initialState?.settings ?? {});
        setFirebaseRoomId(roomId);
        setIsOriginatingUser(true);
        setTrackerLoaded(true);
      })
  };

  const connectExistingInstance = (roomId: string) => {
    setFirebaseRoomId(roomId);
    setTrackerLoaded(true);
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {!trackerLoaded ? (
        <EntryPoint
          loadSampleData={loadSampleData}
          connectExistingInstance={connectExistingInstance}
        />
      ) : (
        <TrackerStateContext.Provider value={trackerState}>
          <Tracker
            trackerLayout={trackerLayout ?? {}}
            settingsState={trackerSettings ?? {}}
          />
        </TrackerStateContext.Provider>
      )}
    </ThemeProvider>
  )
}

export default App
