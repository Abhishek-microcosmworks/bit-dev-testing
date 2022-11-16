import React,{useEffect, useState, useRef} from 'react';
import { gapi } from 'gapi-script';
import ListDocuments from '../ListDocuments/ListDocuments';
import { useCookies } from 'react-cookie';
import GooglePhotoIcon from '../../assets/images/Group 308.png'
import axios from 'axios';


const CLIENT_ID = process.env.REACT_APP_GOOGLE_PHOTOS_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_PHOTOS_API_KEY

const DISCOVERY_DOCS = 'https://photoslibrary.googleapis.com/$discovery/rest?version=v1'

const SCOPES = 'https://www.googleapis.com/auth/photoslibrary.readonly'

const Source = () => {

  const [cookies, setCookie, removeCookie] = useCookies();
  const [signedInUser, setSignedInUser] = useState();
  const [gInstance, setGInstance] = useState();
  const [ token, setToken ] = useState({});
  const [requestUrl, setRequestUrl] = useState('')
  const googleClient = useRef()

   /*
    Loading the script and setting the authentication code from window.location.href 
 */
    useEffect( () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script)
  
      script.onload = function () {
      /*global google*/
       googleClient.current =  google?.accounts.oauth2.initCodeClient({
         client_id: CLIENT_ID,
         scope: `https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile ${SCOPES} openid`,
         ux_mode: "redirect",
         redirect_uri: 'https://photosplugin.netlify.app',
         access_type:'offline',
         include_granted_scopes: true
        })
       setRequestUrl(window.location.href)
      }
    }, [])

    /*
      Sending the request code to the backend.
     */
    useEffect(() => {
      async function getRequest(){
        if(requestUrl === ''){
          return
        }
        try {
          const res = await axios.post("https://googledrivebk.plugin.vlogr.com/auth-code", {
          
            requestedUrl: requestUrl,
            redirectUrl: 'https://gdplugin.netlify.app'
        
        })
        const backendResponse = res.data
        if(backendResponse === ''){
          return
        }
        setCookie('gUser',JSON.stringify(backendResponse))
        setToken(backendResponse)
        } catch (error) {
          console.log(error)
        } 
      }
      getRequest()
    },[requestUrl])

    function getGoogleOauth(){
      const client = googleClient.current;
      client.requestCode();
    }

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
        if (cookies.gUser) {
          handleClientLoad();
        }
      }, [signedInUser, cookies]);
    
      const updateSigninStatus = (isSignedIn) => {
        if (isSignedIn || cookies) {
          // Set the signed in user
          if (cookies) {
            setSignedInUser(cookies);
          } else {
            //setToken(gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse());
            setSignedInUser(gapi.auth2.getAuthInstance().currentUser.le.wt);
            document.cookie = `gUser=${cookies}`;
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
       const initClient = async() => { 
        gapi.client.init({
           apiKey: API_KEY,
           clientId: CLIENT_ID,
           discoveryDocs: [DISCOVERY_DOCS],
           scope: SCOPES,
           access: 'offline',
         }).then(function () {
           // Listen for sign-in state changes.
           gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
           gapi.client.setToken({access_token: token.access_token })
   
           // Handle the initial sign-in state.
           updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
           setGInstance(gapi.client);
         })   
     }
    
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
              <div className="icon-container" style={{ paddingTop: '40px'}}>
              <div className="icon icon-success">
                  <img height="100px" width="100.72px" src={GooglePhotoIcon} />
              </div>
              </div>
              <div className={"content-container"} style={{ paddingTop: '50px' }} onClick={() => getGoogleOauth()} >
                <button className={'connect-button'}>Connect</button>
              </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default Source