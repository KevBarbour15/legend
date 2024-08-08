"use client";
import { useState, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import ReactHowler from "react-howler";
import { IconButton, Collapse, Box, Icon } from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  KeyboardArrowDown,
  KeyboardArrowUpTwoTone,
  QueueMusic,
} from "@mui/icons-material";

gsap.registerPlugin(Draggable);

interface Track {
  title: string;
  url: string;
  artist: string;
  albumArt: string;
  album: string;
}
interface MusicPlayerProps {
  tracks: Track[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks }) => {
  const [playing, setPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [playlistVisible, setPlaylistVisible] = useState(false);

  useGSAP(() => {
    /*
    Draggable.create("#player-container", {
      type: "x,y",
      inertia: true,
      onClick: function () {
        console.log("clicked");
      },
      onDragEnd: function () {
        console.log("drag ended");
      },
    });
    */
  });

  const togglePlayer = () => {
    playlistVisible ? setPlaylistVisible(false) : setVisible(!visible);
  };

  const togglePlaylist = () => {
    if (!visible) {
      setVisible(true);
    }
    setPlaylistVisible(!playlistVisible);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handlePreviousTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      currentTrackIndex === 0 ? tracks.length - 1 : prevIndex - 1,
    );
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      currentTrackIndex === tracks.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleTrackChange = (index: number) => {
    setCurrentTrackIndex(index);
    setPlaying(true);
  };

  return (
    <div
      id="player-container"
      className="fixed bottom-0 flex h-auto w-screen flex-col border-2 border-customGold bg-customWhite shadow-xl shadow-black md:w-350px"
    >
      <Collapse in={playlistVisible}>
        <div className="flex flex-col">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="flex h-full flex-row border-b-2 border-customGold bg-customWhite p-1"
            >
              <div className="flex h-20 w-20 rounded-xl">
                <img
                  className="rounded-xl object-cover"
                  src={track.albumArt}
                ></img>
              </div>
              <div className="flex w-auto flex-1 flex-col px-1 font-hypatia text-customNavy">
                <h1 className="text-xl">{track.artist}</h1>
                <h1 className="text-xl">{track.title}</h1>
                <h1 className="text-xl">{track.album}</h1>
              </div>
              <div className="flex h-full items-center justify-center">
                <IconButton onClick={() => handleTrackChange(index)}>
                  <PlayArrow className="text-customNavy" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </Collapse>

      <Collapse in={visible}>
        <div className="relative flex flex-row px-1 pt-1">
          <div className="flex h-20 w-20 rounded-xl">
            <img
              className="rounded-xl object-cover"
              src={tracks[currentTrackIndex].albumArt}
            ></img>
          </div>
          <div className="flex flex-col justify-end px-2 font-hypatia text-customNavy">
            <h1 className="text-xl">{tracks[currentTrackIndex].artist}</h1>
            <h1 className="text-xl">{tracks[currentTrackIndex].title}</h1>
            <h1 className="text-xl">{tracks[currentTrackIndex].album}</h1>
          </div>
        </div>
      </Collapse>

      <div className="flex items-center justify-center p-1">
        <IconButton
          onClick={togglePlaylist}
          className="absolute bottom-1 left-1 text-customNavy"
        >
          <QueueMusic />
        </IconButton>
        <IconButton onClick={handlePreviousTrack} className="text-customNavy">
          <SkipPrevious />
        </IconButton>
        <IconButton onClick={handlePlayPause} className="text-customNavy">
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton onClick={handleNextTrack} className="text-customNavy">
          <SkipNext />
        </IconButton>
        <IconButton
          className="absolute bottom-1 right-1"
          onClick={togglePlayer}
        >
          {visible ? (
            <KeyboardArrowDown className="p-0 text-customNavy" />
          ) : (
            <KeyboardArrowUpTwoTone className="p-0 text-customNavy" />
          )}
        </IconButton>
      </div>
      <ReactHowler
        src={tracks[currentTrackIndex].url}
        playing={playing}
        volume={1.0}
      />
    </div>
  );
};

export default MusicPlayer;
