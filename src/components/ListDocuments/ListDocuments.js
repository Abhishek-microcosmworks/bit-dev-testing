import React, { useEffect , useState} from 'react'
import GooglePhoto from '../../assets/images/googlephotos.com svg.png';
import LinkBreak from '../../assets/images/LinkBreak.png'
import spinner  from '../../assets/images/spinner.gif'
import { subscribeToTimer, sendForm } from './api'
import useScrollPosition from '@react-hook/window-scroll';
import VideoComponent from './VideoComponent';

const ListDocuments = ({token, onSignOut, gapiClient }) => {
    
   const [doc, setDocuments] = useState([]);
   const [loading, setLoading] = useState(false)
   const [isLoading, setIsLoading] = useState(false);
   const [images, setImages] = useState([])
   const [selectedId, setSelectId] = useState('');
   const [url, setUrl] = useState('');
   const [mimeType, setMimeType] = useState('');
   const [name, setName] = useState('');
   const [progress, setProgress] = useState(0);
   const [progressState, setProgressState] = useState('Importing');
   const [searchText, setSearchText] = useState('')
   const [nxtPgToken, setNxtPgToken] = useState();

   let sId = '';

   //fetching images 
    const fetchImages = async() => {
      setIsLoading(true)
      const images = await gapiClient.photoslibrary.mediaItems.list({
        pageSize: 10
      })
      renderImages(images.result.mediaItems)
      setNxtPgToken(images.result.nextPageToken)
      setIsLoading(false)
    }

    useEffect(() => {
     fetchImages()
   },[gapiClient])

   //Setting the images and video data in doc
   const renderImages = (images) => {
    if(images === undefined){
      return
    }
    const docs = []
    for(let index = 0; index < images.length; index++){
      const element = images[index]
      if (element.mimeType.includes('video/')) {
        docs.push(<VideoComponent key={element.id} className="item" id={element.id} itemOnClick={itemOnClick} element={element} />);
        continue;
      }
      docs.push(
        <div
         className='item'
         key={element.id}
         id={element.id}
         onClick={(e) => itemOnClick(element)}
        >
        <img src={element.baseUrl} alt={''} style={{ maxWidth: '100%', maxHeight: '148px', margin: 'auto'}} />
        </div>
      )
    }
    const updated_doc = [...doc, ...docs];
    setDocuments(updated_doc)
   }

   useEffect(() => {
    renderImages()
   }, [images])

   const itemOnClick = (element) => {
    const id = element.id;
    const urlD = element.baseUrl;
    const defaultContainer = document.querySelectorAll('.item');
    defaultContainer.forEach((ele) => {
      ele.style = 'border:none;';
    });
    if(sId !== id) {
      document.getElementById(id).style.border = '2px solid #168CFF';
      sId = id;
      setSelectId(id);
      setUrl(urlD);
      setMimeType(element.mimeType);
      setName(element.filename);
    } else {
      setSelectId('');
      setUrl('');
      setMimeType('');
      setName('');
    }
  };

  const handleAdd = async () => {
    const api = 'http://localhost:3001/photos'
  
    setLoading(true);
    const payload = {
      token: token,
      mime_type: mimeType,
      file_id: selectedId,
      url: url
    };
    sendForm(payload)
    subscribeToTimer('download-google-photos-progress', (err, progress_state, progress) => {
      console.log(progress)
      setProgress(progress);
      setProgressState(progress_state);
    });
    subscribeToTimer('download-google-photos-final', (err, final_data, data) => {
      const returnJson = {
        action : 'create',
        type: final_data.type,
        file: final_data.final_data,
        fileSize: final_data.fileSize,
        mp4 : final_data.final_data
      }
    console.log(returnJson)
    if (window.vlogr) {
      window.vlogr.addData(1, JSON.stringify(returnJson));
    }
    if (window.webkit) {
      window.webkit.messageHandlers.addData.postMessage(returnJson);
    }

    if (window.top) {
      window.top.postMessage(returnJson, '*');
    }
    setSelectId('');
    setUrl('');
    setMimeType('');
    setLoading(false);
    setProgress(0)
  })
  };

  const handleChange = (e) => {
    e.preventDefault();
    search(e.target.value);
  };

  const search = (value) => {
    setDocuments([]);
    setNxtPgToken('');
    setSearchText(value);
  };

  const scroll = useScrollPosition();

  const searchedData = async() => {
    if(searchText === ''){
      await fetchImages()
    }
      const searced = await gapiClient.photoslibrary.mediaItems.search({
        pageSize: 10,
        filters: {
          contentFilter: {
            includedContentCategories: [
             searchText
            ]
          },
          includeArchivedMedia: true
        }
      })
      renderImages(searced.result.mediaItems)
      setNxtPgToken(searced.result.nextPageToken)
  }

  useEffect(() => {
    searchedData()
  },[searchText])
  
  const loadMorePages = async(nxtPgToken) => {
    setIsLoading(true)
    const morePages = await gapiClient.photoslibrary.mediaItems.list({
            pageToken: nxtPgToken,
            pageSize: 10
    })
       renderImages(morePages.result.mediaItems)
       setNxtPgToken(morePages.result.nextPageToken)
       setIsLoading(false)
  }

//Loading more data on next page
  useEffect(() => {
    var totalPageHeight = document.body.scrollHeight;
    var scrollPoint = window.scrollY + window.innerHeight;
    let percentage = (scrollPoint / totalPageHeight) * 100;
    
    if (percentage >= 99.5 && nxtPgToken) {
      setIsLoading(true)
      setTimeout(() => {
        loadMorePages(nxtPgToken)
      }, 1000);
    }
  }, [scroll]);
 
  return (
    <div style={{ textAlign: '-webkit-center' }}>
      {loading? (
        <div>
         <div className={'top-fixed'}>    
          <div className={'logo-loading'}>
            <div style={{ float: 'right', marginRight: '10px'}}>
              <img src={GooglePhoto} height={'25px'} />
            </div>
          </div>
          </div>
          <div>
          {/* progress bar div and css  */}
          <div 
            style={{
             width: "100%",
             height: 'auto',
             marginTop: '50%',
             zIndex: 102,
             textAlign: 'center',
             marginLeft: '0px' 
            }}>
            <div>
              <p className='App-intro process-header' style={{fontColor:'#404040', fontWeight:500, fontSize: '20px'}}>{progressState}</p>
              <p className='warning' style={{fontSize:'13px'}}> Don't turn off the app or device.</p>
              <progress id="file" className="progress_bar" value={progress} max="100"> </progress> 
              <div className="w3-center w3-text-white text-color" style={{ marginTop: '20px', color:'#128CFE', fontSize:'12px' }}>{progress}%</div>
              <div>{progress != 100 ?(<button className="cancel-button" type="reset" onClick={() => {}}>Cancel</button>):(<button className="cancel-button" type="reset" onClick={() => {}}>Cancel</button>)}</div>
              </div> 
          </div>
          </div>
        </div>
      ) : (
        <div>
        <div className={'top-fixed'}>
          <div className={'logo'}>
            <div style={{ float: 'right'}}>
              <img src={GooglePhoto} height={'25px'} />
            </div>
          </div>
          <div className={'disconnect'}>
            <a style={{color: '#404040' }} type="primary" onClick={onSignOut}>
            <img src={LinkBreak} alt='' height={'13px'} style={{ marginRight: "2px" }}/>
              Disconnect
            </a>
          </div>
          <div className="search" style={{ display: 'none' }}>
            <input
            style={{ display: 'none' }}
              className="search-input"
              type="text"
              value={searchText}
              onChange={(e) => {
                handleChange(e);
              }}
            ></input>
          </div>
          </div>
          <div 
            style={{ 
              maxWidth: '425px', 
              display: 'flex', 
              flexFlow: 'row wrap', 
              paddingBottom: '250px', 
              marginTop: '80px',
              }}>
          {doc}
          </div>
          <div style={{ display: isLoading === true ? 'block' : 'none' , marginBottom: '250px'}}>
            <img src={spinner} height="30px" alt='loading....' />
          </div>
          <div className={'footer'} style={{ display: selectedId ? 'block' : 'none', zIndex: 999}} >
            <button
            style={{ marginRight: '20px' }}
              className={'connect-button'}
              onClick={() => {
                handleAdd();
              }}
            >
              Add
            </button>
          </div>
          </div>  
      )} 
    </div>
    
  )}

export default ListDocuments