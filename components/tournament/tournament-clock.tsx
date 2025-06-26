'use client';

import { useState, useEffect } from 'react';
import { Tournament, formatTime, formatChips } from '@/lib/tournament';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, Clock, TrendingUp } from 'lucide-react';

interface TournamentClockProps {
  tournament: Tournament;
  onUpdateClock: (currentLevel: number, timeRemaining: number) => void;
  onUpdateStatus: (status: Tournament['status']) => void;
  isDirector?: boolean;
}

export default function TournamentClock({
  tournament,
  onUpdateClock,
  onUpdateStatus,
  isDirector = false,
}: TournamentClockProps) {
  const [timeRemaining, setTimeRemaining] = useState(tournament.timeRemaining);
  const [currentLevel, setCurrentLevel] = useState(tournament.currentLevel);
  const [isRunning, setIsRunning] = useState(tournament.status === 'running');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          onUpdateClock(currentLevel, newTime);
          
          if (newTime <= 0) {
            // Move to next level
            const nextLevel = currentLevel + 1;
            if (nextLevel < tournament.blindLevels.length) {
              setCurrentLevel(nextLevel);
              const nextLevelTime = tournament.blindLevels[nextLevel].duration * 60;
              setTimeRemaining(nextLevelTime);
              onUpdateClock(nextLevel, nextLevelTime);
              return nextLevelTime;
            } else {
              // Tournament finished
              onUpdateStatus('finished');
              setIsRunning(false);
              return 0;
            }
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, currentLevel, tournament.blindLevels, onUpdateClock, onUpdateStatus]);

  const handlePlayPause = () => {
    const newStatus = isRunning ? 'paused' : 'running';
    setIsRunning(!isRunning);
    onUpdateStatus(newStatus);
  };

  const handleNextLevel = () => {
    if (currentLevel < tournament.blindLevels.length - 1) {
      const nextLevel = currentLevel + 1;
      const nextLevelTime = tournament.blindLevels[nextLevel].duration * 60;
      setCurrentLevel(nextLevel);
      setTimeRemaining(nextLevelTime);
      onUpdateClock(nextLevel, nextLevelTime);
    }
  };

  const currentBlindLevel = tournament.blindLevels[currentLevel];
  const nextBlindLevel = tournament.blindLevels[currentLevel + 1];

  if (!currentBlindLevel) return null;

  return (
    <div className="space-y-6">
      {/* Main Clock Display */}
      <Card className="bg-black text-white">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-sm text-gray-400">LEVEL {currentBlindLevel.level}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-6xl font-bold clock-display mb-4 text-green-400">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-2xl mb-4">
            <span className="text-yellow-400">{formatChips(currentBlindLevel.smallBlind)}</span>
            <span className="text-white mx-2">/</span>
            <span className="text-yellow-400">{formatChips(currentBlindLevel.bigBlind)}</span>
            {currentBlindLevel.ante && (
              <>
                <span className="text-white mx-2">•</span>
                <span className="text-gray-400">Ante: {formatChips(currentBlindLevel.ante)}</span>
              </>
            )}
          </div>
          <Badge variant="outline" className="text-lg px-4 py-1">
            {tournament.registeredPlayers.length} Players
          </Badge>
        </CardContent>
      </Card>

      {/* Tournament Controls */}
      {isDirector && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tournament Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button 
                onClick={handlePlayPause}
                variant={isRunning ? "destructive" : "default"}
                className="flex-1"
              >
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button 
                onClick={handleNextLevel}
                variant="outline"
                disabled={currentLevel >= tournament.blindLevels.length - 1}
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Next Level
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blind Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Blind Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {tournament.blindLevels.map((level, index) => (
              <div
                key={level.level}
                className={`flex justify-between items-center p-2 rounded ${
                  index === currentLevel 
                    ? 'bg-primary text-primary-foreground' 
                    : index < currentLevel 
                      ? 'bg-muted text-muted-foreground' 
                      : ''
                }`}
              >
                <span className="font-medium">Level {level.level}</span>
                <span>
                  {formatChips(level.smallBlind)} / {formatChips(level.bigBlind)}
                  {level.ante && ` (${formatChips(level.ante)})`}
                </span>
                <span className="text-sm">{level.duration}min</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Level Preview */}
      {nextBlindLevel && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Next Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">
              <span className="font-semibold">Level {nextBlindLevel.level}:</span>
              <span className="ml-2">
                {formatChips(nextBlindLevel.smallBlind)} / {formatChips(nextBlindLevel.bigBlind)}
                {nextBlindLevel.ante && ` (${formatChips(nextBlindLevel.ante)})`}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}