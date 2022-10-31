import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import PlayIcon from '../../assets/images/Vector.png';

function VideoComponent({ id, element, itemOnClick }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [time, setTime] = useState('');
  const [ playing, setPlaying] = useState(false);
  const [ ended, setEnded ] = useState(false);
  const handlePlaying = () => {
    setPlaying(true);
  }
  useEffect(() => {
    const padTo2Digits = (num) => {
      return num.toString().padStart(2, '0');
    };

    const convertMsToHM = (milliseconds) => {
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);

      seconds = seconds % 60;
      // 👇️ if seconds are greater than 30, round minutes up (optional)
      minutes = seconds >= 30 ? minutes + 1 : minutes;

      minutes = minutes % 60;

      hours = hours % 24;

      if (hours > 0) {
        return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
      }
      return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    };

    if (!videoUrl) {
      const video_id = element.id;
      const video_url = `${element.baseUrl}=dv`
      const converted_time = convertMsToHM(element.mediaMetadata.width);

      setVideoUrl(video_url);
      setTime(converted_time);
    }
  }, [element]);

  useEffect(() => {
    if(ended) {
      setEnded(false);  
      setPlaying(false);
    }
  },[ended])
  
  return (
    <div className="item" id={id} >
      <div 
       className="abc"  
       style={{
        width:'47%', 
        height:'33%',  
        position: 'absolute',
        minHeight: '150px',
        maxHeight: '150px',
        background:'transparent',
        zIndex: 88,
      }} 
      onClick={(e) => {itemOnClick(element)}}/>
      <ReactPlayer
        style={{position:'obsolute'}}
        url={videoUrl}
        width="100%"
        height="98%"
        playing = {playing}
        onEnded={() => setEnded(true)}
        playIcon={
          <button
            style={{
              borderRadius: '50%',
              display: 'inline-flex',
              zIndex: 2,
              margin: '125px 96px 5px 5px',
              width: '20px',
              height: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              marginRight: 'auto',
              marginLeft: '5px',
              marginBottom: '5px',
              border: 'none',
              textAlign: 'end',
            }}
            onClick={handlePlaying}
          >
            <img
              src={PlayIcon}
              alt="close"
              width="12"
              style={{ marginTop: '3px', float: 'left', marginRight: '-5px', maxWidth: '100%', maxHeight: '148px', cursor: 'pointer' }}
            />           
          </button>
        }
        light={`${element.baseUrl}=d`}
      />
    </div>
  );
}

export default VideoComponent;