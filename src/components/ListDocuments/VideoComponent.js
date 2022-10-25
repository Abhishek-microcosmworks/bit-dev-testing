import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import PlayIcon from '../../assets/images/playicon.png';

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
      const video_url = `${element.productUrl}`;
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
      <div className="abc"  style={{width:'47%', height:'23%',  position: 'absolute' ,  background:'transparent'}} onClick={(e) => {itemOnClick(element)}}/>

      <ReactPlayer
        style={{position:'obsolute'}}
        url={videoUrl}
        width="100%"
        height="100%"
        playing = {playing}
        onEnded={() => setEnded(true)}
        playIcon={
          <button
            style={{
              borderRadius: '10px',
              display: 'inline-flex',
              zIndex: 99,
              marginTop: '90%',
              width: '70px',
              height: '20px',
              backgroundColor: 'transparent',
              marginRight: 'auto',
              marginLeft: '5px',
              marginBottom: '5px',
              border: '3px solid #fff',
              zIndex:101
            }}

            onClick={handlePlaying}
          >
            <img
              src={PlayIcon}
              alt="close"
              width="16"
              style={{ marginTop: '-1px', float: 'left', marginLeft: '-5px' }}
            />
            <span className="span-img">{time}</span>
          </button>
        }
        light={element.baseUrl}
      />
    </div>
  );
}

export default VideoComponent;