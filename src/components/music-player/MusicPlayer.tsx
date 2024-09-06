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
      className="fixed bottom-0 left-0 right-0 z-[2] flex h-auto w-full flex-col opacity-0 md:w-auto"
    >
      {/* Playlist Popup */}
      <Collapse in={playlistVisible} className="z-10 w-full md:w-fit">
        <div className="mb-3 flex flex-col rounded-lg border-2 backdrop-blur-md">
          {tracks.map((track, index) => (
            <div
              key={index}
              className={`flex h-full flex-row p-1 ${
                index !== tracks.length - 1 ? "border-b-2" : ""
              }`}
            >
              <div
                className={`flex w-auto flex-1 flex-col px-1 font-bigola ${
                  index === currentTrackIndex
                    ? "text-customCream"
                    : "text-customWhite"
                } drop-shadow-text`}
              >
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
                    <GraphicEq className="text-customCream drop-shadow-text" />
                  ) : (
                    <PlayArrow
                      className="text-customWhite drop-shadow-text"
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
        <div className="relative left-6 hidden md:block">
          <img
            id="now-playing"
            className="absolute left-[105px] top-[40.75%] z-[3] w-[32px]"
            src="./images/small-logo.png"
          ></img>
          <img
            className="drop-shadow-record md:w-[200px]"
            src="./images/player.svg"
          ></img>
        </div>
      </Collapse>

      <div className="flex justify-between pb-6 pl-6 md:mt-3 md:justify-start">
        <IconButton className="px-1 py-0 text-customWhite drop-shadow-text">
          {mute ? (
            <VolumeOff onClick={handleMute} />
          ) : (
            <VolumeUp onClick={handleMute} />
          )}
        </IconButton>
        <IconButton
          onClick={handlePreviousTrack}
          className="px-1 py-0 text-customWhite drop-shadow-text"
        >
          <SkipPrevious />
        </IconButton>

        <IconButton
          onClick={handlePlayPause}
          className="px-1 py-0 text-customWhite drop-shadow-text"
        >
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton
          onClick={handleNextTrack}
          className="px-1 py-0 text-customWhite drop-shadow-text"
        >
          <SkipNext />
        </IconButton>
        <IconButton
          onClick={togglePlaylist}
          className="px-1 py-0 text-customWhite drop-shadow-text"
        >
          <LibraryMusic />
        </IconButton>
        <IconButton
          className="hidden px-1 py-0 md:block"
          onClick={togglePlayer}
        >
          {visible ? (
            <KeyboardArrowDown className="text-customWhite drop-shadow-text" />
          ) : (
            <KeyboardArrowUpTwoTone className="text-customWhite drop-shadow-text" />
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
