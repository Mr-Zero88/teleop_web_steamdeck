import { useState } from 'react'
import Markdown from 'react-markdown'
import './App.css'
import setup from '.'
import type TurtleBot from './turtleBot';

function App() {
  let defaultURL = `ws://${location.hostname}:9090`;
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.has('ws')) {
    defaultURL = `ws://${urlParams.get('ws')}`;
  }
  const [url, setUrl] = useState(defaultURL);
  const [connected, setConnected] = useState(false);
  const [battery, setBattery] = useState(0);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      {connected ? (
        <>
          <span>Connected to {url}</span>
          <br />
          <span>Battery: {battery}%</span>
        </>
      ) : (
        <>
          <input value={url} onChange={(event) => setUrl(event.target.value)}/>
          <button onClick={async () => {
            let error = await setup(url).catch((e: Error) => e);
            if(error instanceof Error)
              return setError(formatError(error));
            else
              setError(null);
            setConnected(true);

            let turtleBot: TurtleBot = error;
            turtleBot.batteryState.subscribe((state) => {
              setBattery(Math.round(state.percentage));
            });
          }}>Connect</button>
          {error ? (
            <>
              <br />
              <div style={{textAlign: 'left'}}>
                <Markdown>{error}</Markdown>
              </div>
            </>
          ) : (<></>)}
        </>
      )}
      <div id="map"></div>
    </>
  )
}

export default App


function formatError(error: Error) {
  let result = "";
  console.log(error.name)
  if(error.stack) {
    result += `${error.stack}`;
  } else {
    result += `${error.name}: ${error.message}`;
  }
  result = result.replaceAll('\n', '\n+ ');
  if(error.cause && error.cause instanceof Error) {
    result += `\n  Caused by ${formatError(error.cause).split('\n').join('\n  ')}`;
  }
  return result;
}