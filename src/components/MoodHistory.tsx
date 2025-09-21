import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, MessageSquare } from 'lucide-react';
import { MoodType } from './CheckInForm';

interface MoodEntry {
  id: string;
  mood: MoodType;
  note?: string;
  timestamp: Date;
  aiResponse?: string;
}

interface MoodHistoryProps {
  entries: MoodEntry[];
}

const moodConfig = {
  happy: { emoji: '🌻', color: 'text-mood-happy', label: 'Happy' },
  calm: { emoji: '🌳', color: 'text-mood-calm', label: 'Calm' },
  sad: { emoji: '🥀', color: 'text-mood-sad', label: 'Sad' },
  stressed: { emoji: '🌱', color: 'text-mood-stressed', label: 'Stressed' },
  angry: { emoji: '🌵', color: 'text-mood-angry', label: 'Angry' },
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const MoodHistory = ({ entries }: MoodHistoryProps) => {
  if (entries.length === 0) {
    return (
      <Card className="h-full shadow-soft bg-card/95 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Your Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <div className="text-4xl opacity-50">🌱</div>
            <p className="text-muted-foreground">
              Your emotional journey will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-soft bg-card/95 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Your Journey
          <span className="text-sm font-normal text-muted-foreground">
            ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] lg:h-[600px]">
          <div className="space-y-3 p-4">
            {entries.map((entry, index) => {
              const config = moodConfig[entry.mood];
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-border/30 rounded-lg p-4 space-y-3 bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.emoji}</span>
                      <div>
                        <div className={`font-semibold ${config.color}`}>
                          {config.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTimeAgo(entry.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Note */}
                  {entry.note && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        Your thoughts:
                      </div>
                      <p className="text-sm bg-background/50 rounded-md p-3 border border-border/30">
                        "{entry.note}"
                      </p>
                    </div>
                  )}

                  {/* AI Response */}
                  {entry.aiResponse && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-accent">
                        <span className="text-xs">🤖</span>
                        Gentle reminder:
                      </div>
                      <p className="text-sm bg-accent/10 text-accent-foreground rounded-md p-3 border border-accent/20 leading-relaxed">
                        {entry.aiResponse}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};