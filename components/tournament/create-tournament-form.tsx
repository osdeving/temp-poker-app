'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlindLevel, defaultBlindStructure } from '@/lib/tournament';
import { CalendarDays, Users, DollarSign, Plus, Trash2 } from 'lucide-react';

interface CreateTournamentFormProps {
  onSubmit: (tournamentData: {
    name: string;
    description: string;
    buyIn: number;
    startTime: Date;
    maxPlayers: number;
    blindLevels: BlindLevel[];
    status: 'upcoming';
    createdBy: string;
  }) => void;
  createdBy: string;
}

export default function CreateTournamentForm({ onSubmit, createdBy }: CreateTournamentFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    buyIn: 50,
    startTime: '',
    maxPlayers: 100,
  });
  
  const [blindLevels, setBlindLevels] = useState<BlindLevel[]>(defaultBlindStructure);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      startTime: new Date(formData.startTime),
      blindLevels,
      status: 'upcoming' as const,
      createdBy,
    });
  };

  const addBlindLevel = () => {
    const lastLevel = blindLevels[blindLevels.length - 1];
    const newLevel: BlindLevel = {
      level: lastLevel.level + 1,
      smallBlind: lastLevel.bigBlind,
      bigBlind: lastLevel.bigBlind * 2,
      duration: 20,
    };
    setBlindLevels([...blindLevels, newLevel]);
  };

  const removeBlindLevel = (index: number) => {
    if (blindLevels.length > 1) {
      setBlindLevels(blindLevels.filter((_, i) => i !== index));
    }
  };

  const updateBlindLevel = (index: number, field: keyof BlindLevel, value: number) => {
    const updated = blindLevels.map((level, i) => 
      i === index ? { ...level, [field]: value } : level
    );
    setBlindLevels(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tournament Details</CardTitle>
          <CardDescription>
            Configure your tournament settings and blind structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Sunday Night Tournament"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="buyIn" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Buy-in Amount
              </Label>
              <Input
                id="buyIn"
                type="number"
                value={formData.buyIn}
                onChange={(e) => setFormData(prev => ({ ...prev, buyIn: Number(e.target.value) }))}
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your tournament..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPlayers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Max Players
              </Label>
              <Select 
                value={formData.maxPlayers.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, maxPlayers: Number(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 Players</SelectItem>
                  <SelectItem value="100">100 Players</SelectItem>
                  <SelectItem value="200">200 Players</SelectItem>
                  <SelectItem value="500">500 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Blind Structure</CardTitle>
              <CardDescription>
                Configure the blind levels for your tournament
              </CardDescription>
            </div>
            <Button type="button" onClick={addBlindLevel} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Level
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {blindLevels.map((level, index) => (
              <div key={index} className="flex items-center gap-2 p-4 border rounded-lg">
                <div className="flex-1 grid grid-cols-4 gap-2">
                  <div>
                    <Label className="text-xs">Level</Label>
                    <Input
                      type="number"
                      value={level.level}
                      onChange={(e) => updateBlindLevel(index, 'level', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Small Blind</Label>
                    <Input
                      type="number"
                      value={level.smallBlind}
                      onChange={(e) => updateBlindLevel(index, 'smallBlind', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Big Blind</Label>
                    <Input
                      type="number"
                      value={level.bigBlind}
                      onChange={(e) => updateBlindLevel(index, 'bigBlind', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Duration (min)</Label>
                    <Input
                      type="number"
                      value={level.duration}
                      onChange={(e) => updateBlindLevel(index, 'duration', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>
                {blindLevels.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeBlindLevel(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg">
        Create Tournament
      </Button>
    </form>
  );
}