import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, X, Sparkles } from 'lucide-react';

interface GrowthStoryProps {
  story: string;
  isVisible: boolean;
  onClose: () => void;
}

export const GrowthStory = ({ story, isVisible, onClose }: GrowthStoryProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg"
          >
            <Card className="shadow-plant bg-card/95 backdrop-blur-sm border-border/50 overflow-hidden">
              <CardContent className="p-0">
                {/* Header */}
                <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-6 border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/20 rounded-lg">
                        <BookOpen className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary">
                          Your Garden Story
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          A reflection on your emotional journey
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Story Content */}
                <div className="p-6 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    <div className="absolute -top-2 -left-2 text-accent/30">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <blockquote className="text-base leading-relaxed text-foreground bg-muted/30 rounded-lg p-4 border-l-4 border-accent">
                      {story}
                    </blockquote>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center pt-2"
                  >
                    <p className="text-sm text-muted-foreground italic">
                      Keep nurturing your emotional garden. Every feeling helps it grow. 🌱
                    </p>
                  </motion.div>
                </div>

                {/* Footer */}
                <div className="bg-muted/20 p-4 border-t border-border/30">
                  <Button
                    onClick={onClose}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Continue Growing
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};