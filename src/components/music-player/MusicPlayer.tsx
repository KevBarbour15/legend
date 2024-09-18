"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import gsap from "gsap";

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const recordTl = useRef<gsap.core.Timeline | null>(null);
  const recordPlayerTl = useRef<gsap.core.Timeline | null>(null);
  const playlistTl = useRef<gsap.core.Timeline | null>(null);
  const pathName = usePathname();

  useEffect(() => {
    if (window.innerWidth >= 768 && pathName !== "/dashboard") {
      setVisible(true);
    }
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set(containerRef.current, { y: 200, opacity: 0 });

    tl.current = gsap.timeline().to(containerRef.current, {
      delay: 0.15,
      duration: 0.5,
      y: 0,
      opacity: 1,
      ease: "sine.inOut",
    });

    recordTl.current = gsap.timeline({ repeat: -1 }).to("#now-playing", {
      duration: 1.8,
      rotation: 360,
      ease: "linear",
    });

    gsap.set("#player", { opacity: 0 });
    gsap.set("#playlist", { opacity: 0 });

    recordPlayerTl.current = gsap.timeline({}).to("#player", {
      opacity: 1,
      duration: 0.2,
      delay: 0.15,
      ease: "power4.in",
    });

    playlistTl.current = gsap.timeline({}).to("#playlist", {
      opacity: 1,
      duration: 0.2,
      delay: 0.15,
      ease: "power4.in",
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
    if (playing) {
      recordTl.current?.play();
    } else {
      recordTl.current?.pause();
    }

    if (visible) {
      recordPlayerTl.current?.play();
    } else {
      recordPlayerTl.current?.reverse();
    }

    if (playlistVisible) {
      playlistTl.current?.play();
    } else {
      playlistTl.current?.reverse();
    }
  }, [playing, visible, playlistVisible]);

  return (
    <div
      ref={containerRef}
      id="player-container"
      className="fixed bottom-0 left-0 right-0 z-[150] flex h-auto w-full flex-col opacity-0 md:w-fit"
    >
      {/* Playlist Popup */}
      <Collapse
        in={playlistVisible}
        id="playlist"
        className="z-10 w-full opacity-0 md:mx-0 md:ml-6 md:w-fit"
      >
        <div
          className="block rounded-sm border border-customNavy bg-gradient-to-tr from-customCream to-customWhite drop-shadow-record md:mb-3"
          id="playlist-border"
        >
          {tracks.map((track, index) => (
            <div
              id="playlist-border"
              key={index}
              className={`flex h-full flex-row p-1 ${
                index !== tracks.length - 1 ? "border-b border-customNavy" : ""
              }`}
            >
              <div
                className="flex w-auto flex-1 flex-col px-1 font-hypatia text-customNavy"
                id="playlist-item"
              >
                <div className="flex flex-row">
                  <Person className="pr-2" />
                  <p className="text-xl">{track.artist}</p>
                </div>
                <div className="flex flex-row">
                  <Audiotrack className="pr-2" />
                  <p className="text-xl">{track.title}</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <IconButton className="m-0 flex">
                  {index == currentTrackIndex ? (
                    <GraphicEq className="text-customNavy" id="playlist-item" />
                  ) : (
                    <PlayArrow
                      className="text-customNavy"
                      onClick={() => handleTrackChange(index)}
                      id="playlist-item"
                    />
                  )}
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </Collapse>
      {/* Player Popup */}
      <Collapse in={visible} id="player" className="opacity-0">
        <div className="relative left-6 hidden md:block">
          <img
            id="now-playing"
            className="absolute left-[105px] top-[40.75%] z-[3] w-[32px]"
            src="./images/small-logo.png"
          ></img>
          <img className="md:w-[200px]" src="./images/player.svg"></img>
        </div>
      </Collapse>

      <div className="flex justify-between bg-opacity-50 p-3 backdrop-blur-md md:mt-3 md:justify-start md:bg-opacity-0 md:pb-6 md:pl-6 md:pr-0 md:pt-0 md:backdrop-blur-none">
        <IconButton className="player-button px-1 py-0 text-customCream transition-all">
          {mute ? (
            <VolumeOff onClick={handleMute} />
          ) : (
            <VolumeUp onClick={handleMute} />
          )}
        </IconButton>
        <IconButton
          onClick={handlePreviousTrack}
          className="player-button transition-d px-1 py-0 text-customCream"
        >
          <SkipPrevious />
        </IconButton>

        <IconButton
          onClick={handlePlayPause}
          className="player-button px-1 py-0 text-customCream transition-all"
        >
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton
          onClick={handleNextTrack}
          className="player-button px-1 py-0 text-customCream transition-all"
        >
          <SkipNext />
        </IconButton>
        <IconButton
          onClick={togglePlaylist}
          className="player-button px-1 py-0 text-customCream transition-all"
        >
          <LibraryMusic />
        </IconButton>
        <IconButton
          className="player-button hidden px-1 py-0 text-customCream transition-all md:block"
          onClick={togglePlayer}
        >
          {visible ? <KeyboardArrowDown /> : <KeyboardArrowUpTwoTone />}
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
