import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Sparkles } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (nickname: string) => void;
}

export const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateNickname = (value: string) => {
    const regex = /^[a-zA-Z0-9\s]{3,20}$/;
    const valid = regex.test(value) && value.trim().length >= 3;
    setIsValid(valid);
    return valid;
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);
    validateNickname(value);
  };

  const handleStart = () => {
    if (isValid) {
      onComplete(nickname.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-sky">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-plant backdrop-blur-sm bg-card/95 border-border/50">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative">
                <Leaf className="h-16 w-16 text-accent" />
                <Sparkles className="h-6 w-6 text-mood-happy absolute -top-1 -right-1 animate-float" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold text-primary">
                Welcome to Emotional Garden
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Watch your feelings bloom into a beautiful 3D garden
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="space-y-3"
            >
              <Label htmlFor="nickname" className="text-base font-medium">
                Choose your garden name
              </Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Enter 3-20 characters..."
                value={nickname}
                onChange={handleNicknameChange}
                className={`text-lg h-12 ${
                  nickname && !isValid 
                    ? 'border-destructive focus-visible:ring-destructive' 
                    : 'border-border focus-visible:ring-accent'
                }`}
                maxLength={20}
              />
              {nickname && !isValid && (
                <p className="text-sm text-destructive">
                  Please enter 3-20 characters (letters, numbers, and spaces only)
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="p-4 rounded-lg bg-muted/50 border border-border/30"
            >
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                <strong className="text-foreground">Wellness Disclaimer:</strong> This app is designed for personal reflection and emotional awareness. It is not a substitute for professional mental health advice, diagnosis, or treatment.
              </p>
            </motion.div>
          </CardContent>

          <CardFooter>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="w-full"
            >
              <Button
                onClick={handleStart}
                disabled={!isValid}
                className="w-full h-12 text-lg font-semibold bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                Start Growing Your Garden
                <Leaf className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};