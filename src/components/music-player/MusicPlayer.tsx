"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import Image from "next/image";
import { MusicPlayerProps } from "@/data/music-player";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import ReactHowler from "react-howler";

import { IconButton, Collapse } from "@mui/material";

import {
  VinylRecord,
  Play,
  Pause,
  SpeakerSlash,
  SpeakerSimpleHigh,
  SkipForward,
  SkipBack,
  X,
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
  const armTl = useRef<gsap.core.Timeline | null>(null);
  const pathName = usePathname();

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setVisible(true);
    }
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    tl.current = gsap.timeline().to(containerRef.current, {
      duration: 0.15,
      opacity: 1,
      ease: "sine.inOut",
    });

    armTl.current = gsap.timeline().to("#arm", {
      duration: 0.5,
      ease: "sine.inOut",
      rotation: 30,
      transformOrigin: "top center",
      x: 12,
    });

    recordTl.current = gsap.timeline().to("#now-playing", {
      duration: 1.8,
      rotation: 360,
      ease: "linear",
      repeat: -1,
    });

    gsap.set("#playlist", { opacity: 0 });

    playlistTl.current = gsap.timeline({}).to("#playlist", {
      opacity: 1,
      duration: 0.15,
      delay: 0.05,
      ease: "sine.inOut",
    });

    recordPlayerTl.current = gsap.timeline({}).to("#record-player", {
      opacity: 1,
      duration: 0.15,
      delay: 0.05,
      ease: "sine.inOut",
    });
  }, []);

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
  };

  useGSAP(() => {
    if (visible && playing) {
      recordTl.current?.play();
      armTl.current?.play();
    } else {
      recordTl.current?.pause();
      armTl.current?.reverse();
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
        className="fixed bottom-0 left-0 right-0 mx-3 mb-3 flex flex-col md:mb-6 md:ml-6 md:mr-0 md:w-fit md:flex-row"
      >
        <div className="w-full md:w-fit">
          <Collapse
            in={visible}
            id="record-player"
            className="mb-2 hidden opacity-0 md:block"
          >
            <div className="relative h-auto w-full">
              <Image
                id="now-playing"
                height={128}
                width={128}
                style={{
                  height: "151px",
                  width: "151px",
                }}
                className="absolute left-[4px] top-[1.05px] z-[3] drop-shadow-record"
                src="/images/record.png"
                alt="Record"
                priority={true}
                loading="eager"
              />
              <Image
                id="arm"
                height={128}
                width={128}
                style={{
                  height: "90%",
                  width: "auto",
                }}
                src="/images/arm.png"
                alt="Record"
                className="absolute right-[17px] top-[10.5px] z-[3] h-[98.5%] drop-shadow-recordPlayer"
              />
              <Image
                height={128}
                width={128}
                style={{
                  height: "auto",
                  width: "100%",
                }}
                className="rounded-sm drop-shadow-recordPlayer"
                src="/images/record-player.jpg"
                alt="Record"
                priority={true}
              />
            </div>
          </Collapse>
          <div className="z-[11] flex justify-between rounded-sm bg-black bg-[radial-gradient(at_25%_2%,#707070_0px,transparent_50%),radial-gradient(at_20%_47%,#333333_0px,transparent_50%)] px-1 py-2 drop-shadow-recordPlayer md:gap-2 md:py-1">
            <IconButton className="p-1 text-customSilver drop-shadow-text transition-all md:hover:text-customGold">
              {mute ? (
                <SpeakerSlash weight="thin" onClick={handleMute} />
              ) : (
                <SpeakerSimpleHigh weight="thin" onClick={handleMute} />
              )}
            </IconButton>
            <IconButton
              onClick={handlePreviousTrack}
              className="p-1 text-customSilver drop-shadow-text transition-all md:hover:text-customGold"
            >
              <SkipBack weight="thin" />
            </IconButton>

            <IconButton
              onClick={handlePlayPauseRounded}
              className="p-1 text-customSilver drop-shadow-text transition-all md:hover:text-customGold"
            >
              {playing ? <Pause weight="thin" /> : <Play weight="thin" />}
            </IconButton>
            <IconButton
              onClick={handleNextTrack}
              className="p-1 text-customSilver drop-shadow-text transition-all md:hover:text-customGold"
            >
              <SkipForward weight="thin" />
            </IconButton>
            <IconButton
              onClick={togglePlaylist}
              className="transform p-1 text-customSilver drop-shadow-text transition-all md:hover:rotate-[360deg] md:hover:text-customGold"
            >
              {playlistVisible ? (
                <X weight="thin" />
              ) : (
                <VinylRecord weight="thin" />
              )}
            </IconButton>
          </div>
        </div>
      </div>
      <div
        id="playlist"
        className="z-10 mb-[70px] rounded-sm px-3 md:fixed md:bottom-0 md:left-[255px] md:mb-0 md:px-0 md:pb-6"
      >
        <Collapse in={playlistVisible}>
          <div
            className="aspect-square w-full rounded-sm drop-shadow-recordPlayer md:h-[425px] md:w-auto"
            style={{
              backgroundImage: "url('/images/album-cover.jpg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="h-full w-full rounded-sm">
              <Image
                className="h-auto w-24 p-3 drop-shadow-text md:w-28"
                src="/images/alt-logo.png"
                alt="Alt Logo"
                height={96}
                width={96}
              />
              <div className="h-fit">
                {tracks.map((track, index) => (
                  <div key={index} className="flex h-full flex-row p-1 md:px-3">
                    <div className="mr-3 flex flex-col justify-between px-1 font-bigola text-customCream drop-shadow-text md:px-0">
                      <p className="text-2xl leading-none">{index + 1}.</p>
                      <p className="text-xl leading-none">by</p>
                    </div>
                    <div className="flex w-full flex-col justify-between px-1 font-bigola text-customCream drop-shadow-text md:px-0">
                      <p className="text-2xl leading-none">{track.title}</p>
                      <p className="text-xl leading-none">{track.artist}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      {index == currentTrackIndex ? (
                        <Equalizer playing={playing} />
                      ) : (
                        <IconButton
                          id="player-button"
                          className="m-0 flex p-1 text-customCream drop-shadow-text md:px-0 md:hover:text-customGold"
                        >
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
