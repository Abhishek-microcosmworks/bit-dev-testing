import './App.css';
import axios from 'axios';
import { Source } from '@vlogrinc/vlogr.components-lib';
import GooglePhotoIcon from './assets/images/Group 308.png';
import LinkBreak from './assets/images/LinkBreak.png';
import spinner  from './assets/images/spinner.gif';
import PlayIcon from './assets/images/Vector.png';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_PHOTOS_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_PHOTOS_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_GOOGLE_PHOTOS_REDIRECT_URI;

function App() {
  return (
    <div className="App">
      <Source
        clientId={CLIENT_ID} 
        apiKey={API_KEY} 
        redirectUri={REDIRECT_URI}
        googlePhotoIcon={GooglePhotoIcon}
        linkBreak={LinkBreak}
        spinner={spinner}
        playIcon={PlayIcon}
        axios={axios}
      />
    </div>
  );
}

export default App;