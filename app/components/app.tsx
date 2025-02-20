"use client";
import React, { useEffect, useRef, useState } from "react";
import { ForwardIcon, Upload, Pause, PlayIcon, RewindIcon } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  src: string;
}

const App = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newTracks: Track[] = Array.from(files).map((file) => ({
        title: file.name,
        artist: "Unknown",
        src: URL.createObjectURL(file),
      }));
      setTracks((prevTracks) => [...prevTracks, ...newTracks]); // Fixed track update issue
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prevIndex) =>
      prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
    );
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (audioRef.current && tracks[currentTrackIndex]) {
      audioRef.current.src = tracks[currentTrackIndex].src;
      audioRef.current.load();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex, tracks, isPlaying]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-semibold mb-4">🎵 Audio Player</h1>

      {/* Upload Button */}
      <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2">
        <Upload size={20} />
        <span>Upload Audio</span>
        <input
          type="file"
          accept="audio/*"
          onChange={handleUpload}
          className="hidden"
          multiple
        />
      </label>

      {/* Audio Player */}
      {tracks.length > 0 && (
        <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-lg font-semibold">{tracks[currentTrackIndex]?.title}</h2>
          <p className="text-gray-400">{tracks[currentTrackIndex]?.artist}</p>

          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          />

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Time Display */}
          <div className="flex justify-between text-gray-400 text-sm mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <button onClick={handlePrevTrack} className="p-2 bg-gray-700 rounded-lg">
              <RewindIcon size={24} />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full"
            >
              {isPlaying ? <Pause size={24} /> : <PlayIcon size={24} />}
            </button>
            <button onClick={handleNextTrack} className="p-2 bg-gray-700 rounded-lg">
              <ForwardIcon size={24} />
            </button>
          </div>
        </div>
      )}

      {tracks.length === 0 && <p className="text-gray-400 mt-4">No audio uploaded yet.</p>}
    </div>
  );
};

export default App;
