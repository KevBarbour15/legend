"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import { MusicPlayerProps } from "@/data/music-player";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import ReactHowler from "react-howler";

import { IconButton, Collapse } from "@mui/material";

import {
  CaretUp,
  VinylRecord,
  Play,
  Pause,
  SpeakerSlash,
  SpeakerSimpleHigh,
  SkipForward,
  SkipBack,
} from "@phosphor-icons/react";

import Equalizer from "@/components/equalizer/Equalizer";

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
      duration: 0.35,
      delay: 0.05,
      ease: "sine.inOut",
    });

    recordPlayerTl.current = gsap.timeline({}).to("#record-player", {
      opacity: 1,
      duration: 0.35,
      delay: 0.05,
      ease: "sine.inOut",
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
      className={`fixed bottom-0 left-0 right-0 z-[150] flex flex-col-reverse opacity-0 md:flex-row ${pathName === "/dashboard" ? "hidden" : ""}`}
    >
      <div
        id="player-container"
        className="fixed bottom-0 left-0 right-0 mx-3 mb-3 flex flex-col drop-shadow-record md:mb-6 md:ml-6 md:mr-0 md:w-fit md:flex-row"
      >
        <div className="w-full md:w-fit md:rounded-sm md:bg-customGold md:bg-opacity-65 md:p-1">
          <Collapse
            in={visible}
            id="record-player"
            className="hidden rounded-t-sm bg-customNavy opacity-0 md:block"
          >
            <div
              className="relative rounded-t-sm"
              style={{
                backgroundImage: "url('/images/oak.jpg')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            >
              <div className="rounded-sm bg-customNavy bg-opacity-10 p-2">
                <img
                  id="now-playing"
                  className="absolute left-[100.5px] top-[38.25%] z-[3] w-[38px]"
                  src="./images/monogram-record.png"
                ></img>
                <img
                  className="drop-shadow-record md:w-[185px]"
                  src="./images/player.svg"
                ></img>
              </div>
            </div>
          </Collapse>
          <div
            style={{
              backgroundImage: "url('/images/metal.jpg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
            className={`z-[11] rounded-sm ${visible ? "md:rounded-b-sm md:rounded-t-none" : ""}`}
          >
            <div
              className={`flex justify-between rounded-sm bg-customNavy bg-opacity-50 px-1 py-2 md:bg-opacity-65 md:py-1 ${visible ? "md:rounded-b-sm md:rounded-t-none" : ""}`}
            >
              <IconButton
                className="hidden p-1 text-customCream drop-shadow-text transition-colors md:block md:hover:text-customGold"
                onClick={togglePlayer}
              >
                <CaretUp
                  weight="duotone"
                  id="player-toggle"
                  className={` ${visible ? "rotate-180 transform" : ""}`}
                />
              </IconButton>
              <IconButton className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold">
                {mute ? (
                  <SpeakerSlash
                    weight="fill"
                    id="player-toggle"
                    onClick={handleMute}
                  />
                ) : (
                  <SpeakerSimpleHigh
                    weight="fill"
                    id="player-toggle"
                    onClick={handleMute}
                  />
                )}
              </IconButton>
              <IconButton
                onClick={handlePreviousTrack}
                className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold"
              >
                <SkipBack id="player-toggle" weight="fill" />
              </IconButton>

              <IconButton
                onClick={handlePlayPauseRounded}
                className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold"
              >
                {playing ? <Pause weight="fill" /> : <Play weight="fill" />}
              </IconButton>
              <IconButton
                onClick={handleNextTrack}
                className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold"
              >
                <SkipForward weight="fill" />
              </IconButton>
              <IconButton
                onClick={togglePlaylist}
                className="p-1 text-customCream drop-shadow-text transition-colors md:hover:text-customGold"
              >
                <VinylRecord weight="duotone" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <div
        id="playlist"
        className="z-10 mb-[70px] rounded-sm px-3 md:fixed md:bottom-0 md:left-[255px] md:mb-0 md:px-0 md:pb-6"
      >
        <Collapse in={playlistVisible}>
          <div
            className="aspect-square w-full rounded-sm drop-shadow-record md:h-[425px] md:w-auto"
            style={{
              backgroundImage: "url('/images/album-art.jpg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="h-full rounded-sm bg-black bg-opacity-45">
              <img
                className="h-16 p-3 drop-shadow-text md:h-20"
                src="./images/small-logo.png"
              ></img>
              <div className="h-fit">
                {tracks.map((track, index) => (
                  <div key={index} className="flex h-full flex-row p-1 md:px-3">
                    <div className="mr-3 flex flex-col justify-between px-1 font-bigola text-customCream drop-shadow-text md:px-0">
                      <p className="text-xl leading-none md:text-2xl">
                        {index + 1}.
                      </p>
                      <p className="text-base md:text-xl">by</p>
                    </div>
                    <div className="flex w-full flex-col justify-between px-1 font-bigola text-customCream drop-shadow-text md:px-0">
                      <div className="text-xl leading-none md:text-2xl">
                        <p>{track.title}</p>
                      </div>
                      <div className="text-base md:text-xl">
                        <p>{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      {index == currentTrackIndex ? (
                        <Equalizer playing={playing} />
                      ) : (
                        <IconButton className="m-0 flex p-1 text-customCream drop-shadow-text md:px-0 md:hover:text-customGold">
                          <Play
                            weight="fill"
                            onClick={() => handleTrackChange(index)}
                          />
                        </IconButton>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Collapse>
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
