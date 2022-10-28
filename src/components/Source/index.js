import React,{useEffect, useState} from 'react';
import { gapi } from 'gapi-script';
import ListDocuments from '../ListDocuments/ListDocuments';
import { useCookies } from 'react-cookie';
import GooglePhotoIcon from '../../assets/images/Group 308.png'


const CLIENT_ID = process.env.REACT_APP_GOOGLE_PHOTOS_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_PHOTOS_API_KEY

const DISCOVERY_DOCS = 'https://photoslibrary.googleapis.com/$discovery/rest?version=v1'

const SCOPES = 'https://www.googleapis.com/auth/photoslibrary.readonly'

const Source = () => {

  const [cookies, setCookie, removeCookie] = useCookies();
  const [signedInUser, setSignedInUser] = useState();
  const [gInstance, setGInstance] = useState();
  const [ token, setToken ] = useState({}); 
      /**
       *  Sign in the user upon button click.
       */
      const handleAuthClick = (event) => {
        gapi.auth2.getAuthInstance().signIn();
      };
    
      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
    
      useEffect(() => {
        if (!gInstance && cookies.gUser) {
          handleClientLoad();
        }
      }, [signedInUser, gInstance]);
    
    
    
      const updateSigninStatus = (isSignedIn) => {
        if (isSignedIn || cookies.user) {
          // Set the signed in user
          if (cookies.user) {
            setSignedInUser(cookies.user);
          } else {
            setToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse());
            setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
            document.cookie = `gUser=${JSON.stringify(gapi.auth2.getAuthInstance().currentUser.le.wt)}`;
          }
        } else {
          // prompt user to sign in
          handleAuthClick();
        }
      };
    
      /**
       *  Sign out the user upon button click.
       */
      const handleSignOutClick = (event) => {
        removeCookie('gUser');
        setSignedInUser();
        gapi.auth2.getAuthInstance().signOut();
      };
    
      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      const initClient = () => {
        gapi.client
          .init({
            clientId: CLIENT_ID,
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOCS],
            scope: SCOPES,
            access_type: 'offline',
          })
          .then(
            function () {
              // Listen for sign-in state changes.
              gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    
              // Handle the initial sign-in state.
              updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
              setGInstance(gapi.client);
            },
            function (error) {}
          );
      };
    
      const handleClientLoad = () => {
        gapi.load('client:auth2', initClient);
      };

  return (
    <div>
    {signedInUser || cookies.gUser ? (
        <ListDocuments
          token={token}
          onSignOut={handleSignOutClick}
          gapiClient={gInstance}
        />
      ) : (
        <div>
            <div className="source-container" style={{ paddingTop: '35%' }}>
            <div className="content-container">
                <span className="content, get-started" style={{ color: "#404040", fontSize: '18px'}}>Get started by connecting your account</span>
              </div>
              <div className="icon-container" style={{ paddingTop: '40px', marginRight: '20px' }}>
              <div className="icon icon-success">
                  <img height="100px" width="100.72px" src={GooglePhotoIcon} />
              </div>
              </div>
              <div className={"content-container"} style={{ paddingTop: '50px' }} onClick={() => handleClientLoad()} >
                <button className={'connect-button'}>Connect</button>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default Source