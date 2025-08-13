"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import Image from "next/image";
import { MusicPlayerProps } from "@/data/music-player";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import ReactHowler from "react-howler";
import { Howl } from "howler";

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
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [mute, setMute] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [playlistVisible, setPlaylistVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const howlerRef = useRef<Howl | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const recordTl = useRef<gsap.core.Timeline | null>(null);
  const recordPlayerTl = useRef<gsap.core.Timeline | null>(null);
  const playlistTl = useRef<gsap.core.Timeline | null>(null);
  const armTl = useRef<gsap.core.Timeline | null>(null);
  const [buttonColor, setButtonColor] = useState<string>("text-customNavy");
  const pathName = usePathname();

  // Track the current rotation state
  const currentRotation = useRef<number>(0);
  const isAnimating = useRef<boolean>(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setVisible(true);
    }
    if (pathName === "/") {
      setButtonColor("text-customCream");
    } else {
      setButtonColor("text-customNavy");
    }
  }, [pathName]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setVisible(true);
        if (playing && recordTl.current) {
          // Resume animation from current rotation
          resumeRecordAnimation();
        }
      } else {
        setVisible(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [playing]);

  // Function to resume record animation from current rotation
  const resumeRecordAnimation = () => {
    if (recordTl.current) {
      recordTl.current.play();
    }
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    tl.current = gsap.timeline().to(containerRef.current, {
      delay: 0.5,
      duration: 0.25,
      opacity: 1,
      ease: "sine.in",
      onComplete: () => {
        setTimeout(() => {
          setPlaying(true);
        }, 150);
      },
    });

    armTl.current = gsap.timeline().to("#arm", {
      duration: 0.5,
      ease: "sine.inOut",
      rotation: 30,
      transformOrigin: "top center",
      x: 12,
    });

    // Initialize record animation with continuous rotation
    // Start it immediately since we want it to spin from the beginning
    recordTl.current = gsap.timeline().to("#now-playing", {
      duration: 1.8,
      rotation: "+=360",
      ease: "linear",
      repeat: -1,
      onUpdate: function () {
        // Update current rotation state
        const target = this.targets()[0];
        if (target) {
          currentRotation.current = gsap.getProperty(
            target,
            "rotation",
          ) as number;
        }
      },
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
    if (howlerRef.current) {
      if (playing) {
        howlerRef.current.pause();
      } else {
        howlerRef.current.play();
      }
    }
    setPlaying(!playing);
  };

  const handleMute = () => {
    if (howlerRef.current) {
      howlerRef.current.mute(!mute);
    }
    setMute(!mute);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (howlerRef.current) {
      howlerRef.current.volume(newVolume);
    }
    setVolume(newVolume);
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
    setPlaying(false); // Reset playing state for new track
  };

  useGSAP(() => {
    if (visible && playing) {
      // Resume animation from current rotation
      resumeRecordAnimation();
      armTl.current?.play();
    } else {
      // Pause animation and store current rotation
      if (recordTl.current) {
        const target = document.getElementById("now-playing");
        if (target) {
          currentRotation.current = gsap.getProperty(
            target,
            "rotation",
          ) as number;
        }
        recordTl.current.pause();
      }
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
          <div className="buttons-container z-[11] flex justify-between rounded-sm bg-opacity-5 py-2 md:gap-2 md:bg-opacity-0 md:py-1">
            <button
              className={`player-button p-1 ${buttonColor} rounded-full border border-neutral-400/20 bg-neutral-300/15 p-1 shadow-sm backdrop-blur-[1px] md:shadow-md`}
              aria-label={mute ? "Unmute" : "Mute"}
            >
              {mute ? (
                <SpeakerSlash
                  weight="regular"
                  onClick={handleMute}
                  className="transition-all text-shadow-custom md:hover:text-customGold"
                  aria-hidden="true"
                  size={visible ? 24 : 30}
                />
              ) : (
                <SpeakerSimpleHigh
                  weight="regular"
                  onClick={handleMute}
                  className="transition-all text-shadow-custom md:hover:text-customGold"
                  aria-hidden="true"
                  size={visible ? 24 : 30}
                />
              )}
            </button>
            <button
              onClick={handlePreviousTrack}
              className={`player-button p-1 ${buttonColor} rounded-full border border-neutral-400/20 bg-neutral-300/15 p-1 shadow-sm backdrop-blur-[1px] md:shadow-md`}
              aria-label="Previous track"
            >
              <SkipBack
                weight="regular"
                className="transition-all text-shadow-custom md:hover:text-customGold"
                aria-hidden="true"
                size={visible ? 24 : 30}
              />
            </button>

            <button
              onClick={handlePlayPauseRounded}
              className={`player-button p-1 ${buttonColor} rounded-full border border-neutral-400/20 bg-neutral-300/15 p-1 shadow-sm backdrop-blur-[1px] md:shadow-md`}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause
                  weight="regular"
                  className="transition-all text-shadow-custom md:hover:text-customGold"
                  aria-hidden="true"
                  size={visible ? 24 : 30}
                />
              ) : (
                <Play
                  weight="regular"
                  className="transition-all text-shadow-custom md:hover:text-customGold"
                  aria-hidden="true"
                  size={visible ? 24 : 30}
                />
              )}
            </button>
            <button
              onClick={handleNextTrack}
              className={`player-button p-1 ${buttonColor} rounded-full border border-neutral-400/20 bg-neutral-300/15 p-1 shadow-sm backdrop-blur-[1px] md:shadow-md`}
              aria-label="Next track"
            >
              <SkipForward
                weight="regular"
                className="transition-all text-shadow-custom md:hover:text-customGold"
                aria-hidden="true"
                size={visible ? 24 : 30}
              />
            </button>
            <button
              onClick={togglePlaylist}
              className={`player-button transform p-1 ${buttonColor} rounded-full border border-neutral-400/20 bg-neutral-300/15 p-1 shadow-sm backdrop-blur-[1px] md:shadow-md`}
              aria-label={playlistVisible ? "Close playlist" : "Open playlist"}
              aria-expanded={playlistVisible}
            >
              {playlistVisible ? (
                <X
                  weight="regular"
                  className="transition-all text-shadow-custom md:hover:text-customGold"
                  aria-hidden="true"
                  size={visible ? 24 : 30}
                />
              ) : (
                <VinylRecord
                  weight="regular"
                  className="transition-all text-shadow-custom md:hover:text-customGold"
                  aria-hidden="true"
                  size={visible ? 24 : 30}
                />
              )}
            </button>
          </div>
          <div
            className="relative mt-2 hidden h-auto w-full opacity-0 text-shadow-custom md:block"
            id="record-player"
          >
            <Image
              id="now-playing"
              height={152}
              width={152}
              style={{
                height: "152px",
                width: "152px",
              }}
              className="absolute left-[4px] top-[1.75px] z-[3]"
              src="/images/record.png"
              alt="Record"
              priority={true}
              loading="eager"
            />
            <div className="absolute left-[4px] top-[1.05px] z-[3] h-[144px] w-[144px] rounded-full bg-gradient-to-tr from-customWhite/20 to-transparent blur-3xl">
              &nbsp;
            </div>
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
        </div>
      </div>
      <div
        id="playlist"
        className="z-10 mb-[70px] px-3 drop-shadow-recordPlayer md:fixed md:bottom-0 md:left-[255px] md:mb-0 md:px-0 md:pb-6"
      >
        <Collapse in={playlistVisible}>
          <div
            className="aspect-square w-full rounded-sm md:h-[425px] md:w-auto"
            style={{
              backgroundImage: "url('/images/album-cover.jpg')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="h-full w-full rounded-sm">
              <Image
                className="h-auto w-24 p-3 text-shadow-custom md:w-28"
                src="/images/alt-logo.png"
                alt="Alt Logo"
                height={96}
                width={96}
              />
              <div className="h-fit">
                {tracks.map((track, index) => (
                  <div key={index} className="flex h-full flex-row p-1 md:px-3">
                    <div className="mr-3 flex flex-col justify-between px-1 font-bigola text-customCream text-shadow-custom md:px-0">
                      <p className="text-2xl leading-none">{index + 1}.</p>
                      <p className="text-xl leading-none">by</p>
                    </div>
                    <div className="flex w-full flex-col justify-between px-1 font-bigola text-customCream text-shadow-custom md:px-0">
                      <p className="text-2xl leading-none">{track.title}</p>
                      <p className="text-xl leading-none">{track.artist}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      {index == currentTrackIndex ? (
                        <div className="flex w-8 items-center justify-center">
                          <Equalizer playing={playing} />
                        </div>
                      ) : (
                        <IconButton
                          id="player-button"
                          className="m-0 flex p-1"
                          aria-label={`Play ${track.title} by ${track.artist}`}
                        >
                          <Play
                            weight="regular"
                            onClick={() => handleTrackChange(index)}
                            aria-hidden="true"
                            className="text-customCream transition-all duration-300 text-shadow-custom md:hover:text-customGold"
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

      {/* Error display */}
      {error && (
        <div className="fixed bottom-20 left-4 z-[160] rounded bg-red-500 p-2 text-sm text-white">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="fixed bottom-20 left-4 z-[160] rounded bg-blue-500 p-2 text-sm text-white">
          Loading audio...
        </div>
      )}

      <ReactHowler
        ref={howlerRef}
        src={tracks[currentTrackIndex].url}
        playing={playing}
        mute={mute}
        volume={volume}
        loop={true}
        onLoad={() => {
          setLoading(false);
          setError(null);
        }}
        onLoadError={(id: number, error: string) => {
          setLoading(false);
          setError(`Failed to load audio: ${error}`);
          console.error("Audio loading error:", error);
        }}
        onPlay={() => {
          setPlaying(true);
          setError(null);
        }}
        onPause={() => {
          setPlaying(false);
        }}
        onEnd={() => {
          // Auto-advance to next track when current one ends
          handleNextTrack();
        }}
        onStop={() => {
          setPlaying(false);
        }}
        html5={true} // Better mobile support
        preload={true} // Preload audio for better performance
      />
    </div>
  );
};

export default MusicPlayer;
