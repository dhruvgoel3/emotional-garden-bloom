import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';

export type MoodType = 'happy' | 'calm' | 'sad' | 'stressed' | 'angry';

interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  {
    type: 'happy',
    label: 'Happy',
    emoji: '🌻',
    description: 'Joyful, energetic, optimistic',
    color: 'bg-mood-happy text-amber-900 border-mood-happy',
  },
  {
    type: 'calm',
    label: 'Calm',
    emoji: '🌳',
    description: 'Peaceful, centered, relaxed',
    color: 'bg-mood-calm text-green-900 border-mood-calm',
  },
  {
    type: 'sad',
    label: 'Sad',
    emoji: '🥀',
    description: 'Down, melancholy, reflective',
    color: 'bg-mood-sad text-blue-900 border-mood-sad',
  },
  {
    type: 'stressed',
    label: 'Stressed',
    emoji: '🌱',
    description: 'Overwhelmed, anxious, tense',
    color: 'bg-mood-stressed text-orange-900 border-mood-stressed',
  },
  {
    type: 'angry',
    label: 'Angry',
    emoji: '🌵',
    description: 'Frustrated, irritated, heated',
    color: 'bg-mood-angry text-red-900 border-mood-angry',
  },
];

interface CheckInFormProps {
  onSubmit: (mood: MoodType, note: string) => Promise<void>;
  isLoading?: boolean;
}

export const CheckInForm = ({ onSubmit, isLoading }: CheckInFormProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    try {
      await onSubmit(selectedMood, note.trim());
      // Reset form
      setSelectedMood(null);
      setNote('');
    } catch (error) {
      console.error('Error submitting mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = selectedMood && !isSubmitting && !isLoading;

  return (
    <Card className="w-full shadow-plant bg-card/95 backdrop-blur-sm border-border/50">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Heart className="h-6 w-6" />
          How are you feeling?
        </CardTitle>
        <CardDescription className="text-base">
          Choose your current mood to plant something beautiful in your garden
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Your current mood</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {moodOptions.map((mood) => (
                <motion.button
                  key={mood.type}
                  type="button"
                  onClick={() => setSelectedMood(mood.type)}
                  className={`mood-button p-4 text-center space-y-2 ${
                    selectedMood === mood.type 
                      ? `selected ${mood.color}` 
                      : 'bg-muted hover:bg-muted/80 border-border'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || isLoading}
                >
                  <div className="text-3xl">{mood.emoji}</div>
                  <div className="space-y-1">
                    <div className="font-semibold">{mood.label}</div>
                    <div className="text-xs opacity-80">{mood.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <Label htmlFor="note" className="text-base font-medium">
                  What's on your mind? (optional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="Share what's making you feel this way..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="resize-none text-base"
                  disabled={isSubmitting || isLoading}
                />
                <div className="text-right text-sm text-muted-foreground">
                  {note.length}/200 characters
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <AnimatePresence>
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full h-12 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
                  size="lg"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Planting your emotion...
                    </>
                  ) : (
                    <>
                      Plant in Garden
                      <span className="ml-2 text-xl">
                        {moodOptions.find(m => m.type === selectedMood)?.emoji}
                      </span>
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
    </Card>
  );
};