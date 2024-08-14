"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import ReactHowler from "react-howler";
import { IconButton, Collapse } from "@mui/material";
import {
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  KeyboardArrowDown,
  KeyboardArrowUpTwoTone,
  LibraryMusic,
  VolumeOff,
  VolumeUp,
  Audiotrack,
  Person,
  GraphicEq,
} from "@mui/icons-material";

gsap.registerPlugin(Draggable);

interface Track {
  title: string;
  url: string;
  artist: string;
}
interface MusicPlayerProps {
  tracks: Track[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks }) => {
  const [playing, setPlaying] = useState<boolean>(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [mute, setMute] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [playlistVisible, setPlaylistVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const recordTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set(containerRef.current, { y: 100, opacity: 0 });
    tl.current = gsap.timeline().to(containerRef.current, {
      delay: 0.35,
      duration: 0.5,
      y: 0,
      opacity: 100,
    });

    recordTl.current = gsap.timeline({ repeat: -1 }).to("#now-playing", {
      duration: 1.8,
      rotation: 360,
      ease: "linear",
    });
  }, []);

  const togglePlayer = () => {
    playlistVisible ? setPlaylistVisible(false) : setVisible(!visible);
  };

  const togglePlaylist = () => {
    setPlaylistVisible(!playlistVisible);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleMute = () => {
    setMute(!mute);
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

  useEffect(() => {
    if (window.innerWidth >= 768) {
      // make player visible on desktop
      setVisible(true);
    }

    if (playing) {
      recordTl.current?.play();
    } else {
      recordTl.current?.pause();
    }
  }, [playing]);

  return (
    <div
      ref={containerRef}
      id="player-container"
      className="fixed bottom-0 z-[2] flex h-auto w-screen flex-col border-2 border-customGold bg-customWhite opacity-0 shadow-top shadow-black md:w-350px"
    >
      {/* Playlist Popup */}
      <Collapse in={playlistVisible}>
        <div className="flex flex-col">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="flex h-full flex-row border-b-2 border-customGold bg-customWhite p-1"
            >
              <div className="flex w-auto flex-1 flex-col px-1 font-bigola text-customNavy drop-shadow-text">
                <div className="flex flex-row">
                  <Person className="pr-2" />
                  <h1 className="text-xl">{track.artist}</h1>
                </div>
                <div className="flex flex-row">
                  <Audiotrack className="pr-2" />
                  <h1 className="text-xl">{track.title}</h1>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <IconButton className="m-0 flex">
                  {index == currentTrackIndex ? (
                    <GraphicEq className="text-customNavy drop-shadow-text" />
                  ) : (
                    <PlayArrow
                      className="text-customGold drop-shadow-text"
                      onClick={() => handleTrackChange(index)}
                    />
                  )}
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </Collapse>

      {/* Player Popup */}
      <Collapse in={visible}>
        <div className="relative flex flex-row p-2">
          <IconButton
            onClick={togglePlaylist}
            className="absolute right-1 top-1 z-10 text-customNavy drop-shadow-text"
          >
            <LibraryMusic />
          </IconButton>
          <div className="relative flex h-20 w-20 rounded-xl">
            <img
              id="now-playing"
              className="drop-shadow-record"
              src="./images/monogram.png"
            ></img>
          </div>
          <div className="flex flex-col justify-center px-2 font-bigola text-customNavy">
            <div className="flex flex-row">
              <Person className="pr-2 text-customNavy drop-shadow-text" />
              <h1 className="text-xl drop-shadow-text">
                {tracks[currentTrackIndex].artist}
              </h1>
            </div>
            <div className="flex flex-row">
              <Audiotrack className="pr-2 text-customNavy drop-shadow-text" />
              <h1 className="text-xl drop-shadow-text">
                {tracks[currentTrackIndex].title}
              </h1>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 mx-auto w-4/5 border-b-2"></div>
        </div>
      </Collapse>

      <div className="flex items-center justify-center p-1">
        <IconButton className="absolute bottom-1 left-1 text-customNavy drop-shadow-text">
          {mute ? (
            <VolumeOff onClick={handleMute} />
          ) : (
            <VolumeUp onClick={handleMute} />
          )}
        </IconButton>
        <IconButton onClick={handlePreviousTrack} className="text-customNavy">
          <SkipPrevious className="drop-shadow-text" />
        </IconButton>

        <IconButton
          onClick={handlePlayPause}
          className="text-customNavy drop-shadow-text"
        >
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton
          onClick={handleNextTrack}
          className="text-customNavy drop-shadow-text"
        >
          <SkipNext />
        </IconButton>
        <IconButton
          className="absolute bottom-1 right-1"
          onClick={togglePlayer}
        >
          {visible ? (
            <KeyboardArrowDown className="p-0 text-customNavy drop-shadow-text" />
          ) : (
            <KeyboardArrowUpTwoTone className="p-0 text-customNavy drop-shadow-text" />
          )}
        </IconButton>
      </div>
      <ReactHowler
        src={tracks[currentTrackIndex].url}
        playing={playing}
        mute={mute}
        volume={1.0}
        loop={true}
      />
    </div>
  );
};

export default MusicPlayer;
