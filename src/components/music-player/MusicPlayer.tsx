"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import ReactHowler from "react-howler";

import { IconButton, Collapse } from "@mui/material";

import {
  CaretDoubleUp,
  Playlist,
  Person,
  Play,
  Pause,
  VinylRecord,
  SpeakerSlash,
  SpeakerSimpleHigh,
  SkipForward,
  SkipBack,
} from "@phosphor-icons/react";

import Equalizer from "@/components/equalizer/Equalizer";

interface Track {
  title: string;
  url: string;
  artist: string;
}
interface MusicPlayerProps {
  tracks: Track[];
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks }) => {
  const [playing, setPlaying] = useState<boolean>(false);
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
    if (window.innerWidth >= 768) {
      setVisible(true);
    }
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.set(containerRef.current, { opacity: 0 });

    tl.current = gsap.timeline().to(containerRef.current, {
      delay: 0.05,
      duration: 0.25,
      opacity: 1,
      ease: "linear",
    });

    recordTl.current = gsap.timeline({ repeat: -1 }).to("#now-playing", {
      duration: 1.8,
      rotation: 360,
      ease: "linear",
    });

    gsap.set("#playlist", { opacity: 0 });

    playlistTl.current = gsap.timeline({}).to("#playlist", {
      opacity: 1,
      duration: 0.2,
      delay: 0.05,
      ease: "linear",
    });
  }, []);

  const togglePlayer = () => {
    playlistVisible ? setPlaylistVisible(false) : setVisible(!visible);
  };

  const togglePlaylist = () => {
    setPlaylistVisible(!playlistVisible);
  };

  const handlePlayPauseRounded = () => {
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
      className={`fixed bottom-0 left-0 right-0 z-[150] flex h-auto w-full flex-col opacity-0 md:w-fit ${pathName === "/dashboard" ? "hidden" : ""}`}
    >
      <div
        id="player-container"
        className="flex flex-col rounded-t-md border border-customGold bg-customNavy md:mb-6 md:ml-6 md:mr-0 md:rounded-lg"
      >
        <Collapse in={playlistVisible} id="playlist" className="z-10 opacity-0">
          <div className="block" id="playlist-border">
            {tracks.map((track, index) => (
              <div
                id="playlist-border"
                key={index}
                className="flex h-full flex-row border-b border-customGold p-1"
              >
                <div
                  className={`flex w-auto flex-1 flex-col px-1 font-bigola transition-colors ${index === currentTrackIndex ? "text-customGold" : "text-customCream"} `}
                  id="playlist-item"
                >
                  <div
                    className="flex flex-row items-center"
                    id="player-toggle"
                  >
                    <Person
                      size={22}
                      weight="duotone"
                      className="pr-2 drop-shadow-text"
                    />
                    <p
                      className="text-base drop-shadow-text"
                      id="player-toggle"
                    >
                      {track.artist}
                    </p>
                  </div>
                  <div className="flex flex-row" id="player-toggle">
                    <VinylRecord
                      size={22}
                      weight="duotone"
                      className="pr-2 drop-shadow-text"
                    />
                    <p className="text-base drop-shadow-text">{track.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {index == currentTrackIndex ? (
                    <Equalizer playing={playing} />
                  ) : (
                    <IconButton className="md:hover:text-custom m-0 flex p-1 text-customCream drop-shadow-text transition-colors hover:text-customGold">
                      <Play
                        weight="duotone"
                        id="player-toggle"
                        onClick={() => handleTrackChange(index)}
                      />
                    </IconButton>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Collapse>
        <Collapse in={visible} className="hidden p-0 md:block">
          <div
            className="relative border-b border-customGold p-2"
            id="playlist-border"
          >
            <div className="absolute left-[119px] top-[48.85%] z-[4] h-[3px] w-[3px] rounded-full bg-black"></div>
            <img
              id="now-playing"
              className="absolute left-[105px] top-[41.5%] z-[3] w-[30px]"
              src="./images/small-logo.png"
            ></img>
            <img
              className="drop-shadow-record md:w-[185px]"
              src="./images/player.svg"
            ></img>
          </div>
        </Collapse>
        <div className="flex justify-between px-1 py-2 md:py-1">
          <IconButton
            className="hidden p-1 text-customCream drop-shadow-text transition-colors md:block md:hover:text-customGold"
            onClick={togglePlayer}
          >
            <CaretDoubleUp
              weight="duotone"
              id="player-toggle"
              className={` ${visible ? "rotate-180 transform" : ""}`}
            />
          </IconButton>
          <IconButton className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold">
            {mute ? (
              <SpeakerSimpleHigh
                weight="duotone"
                id="player-toggle"
                onClick={handleMute}
              />
            ) : (
              <SpeakerSlash
                weight="duotone"
                id="player-toggle"
                onClick={handleMute}
              />
            )}
          </IconButton>
          <IconButton
            onClick={handlePreviousTrack}
            className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold"
          >
            <SkipBack id="player-toggle" weight="duotone" />
          </IconButton>

          <IconButton
            onClick={handlePlayPauseRounded}
            className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold"
          >
            {playing ? (
              <Pause id="player-toggle" weight="duotone" />
            ) : (
              <Play id="player-toggle" weight="duotone" />
            )}
          </IconButton>
          <IconButton
            onClick={handleNextTrack}
            className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold"
          >
            <SkipForward id="player-toggle" weight="duotone" />
          </IconButton>
          <IconButton
            onClick={togglePlaylist}
            className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold"
          >
            <Playlist id="player-toggle" weight="duotone" />
          </IconButton>
        </div>
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
