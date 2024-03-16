import { Button } from "@mui/material";
import React from "react";


interface EntryPointProps {
  loadSampleData: (roomId: string) => void;
  connectExistingInstance: (roomId: string) => void;
}


const EntryPoint: React.FC<EntryPointProps> = ({ loadSampleData, connectExistingInstance }) => {

  const roomId = "testroom";

  return (
    <>
      <p>Click the button to begin!</p>
      <p>This should be changed later to be an upload button for logs or room connection info to join an existing room.</p>
      <Button
        onClick={() => loadSampleData(roomId)}
      >
        Load Demo Log
      </Button>
      <Button
        onClick={() => connectExistingInstance(roomId)}
      >
        Load from firebase
      </Button>
    </>
  );
};

export default EntryPoint;