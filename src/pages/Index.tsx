import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OnboardingScreen } from '@/components/OnboardingScreen';
import { GardenScene } from '@/components/GardenScene';
import { CheckInForm, MoodType } from '@/components/CheckInForm';
import { MoodHistory } from '@/components/MoodHistory';
import { GrowthStory } from '@/components/GrowthStory';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MoodEntry {
  id: string;
  mood: MoodType;
  note?: string;
  timestamp: Date;
  aiResponse?: string;
}

interface Plant {
  id: string;
  type: MoodType;
  position: [number, number, number];
  timestamp: Date;
}

const Index = () => {
  const [user, setUser] = useState<{ nickname: string } | null>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoadingMood, setIsLoadingMood] = useState(false);
  const [currentStory, setCurrentStory] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(false);
  const { toast } = useToast();

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('emotionalGarden_user');
    const savedEntries = localStorage.getItem('emotionalGarden_entries');
    const savedPlants = localStorage.getItem('emotionalGarden_plants');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedEntries) {
      const entries = JSON.parse(savedEntries).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setMoodEntries(entries);
    }
    if (savedPlants) {
      const plantData = JSON.parse(savedPlants).map((plant: any) => ({
        ...plant,
        timestamp: new Date(plant.timestamp)
      }));
      setPlants(plantData);
    }
  }, []);

  const handleOnboardingComplete = (nickname: string) => {
    const userData = { nickname };
    setUser(userData);
    localStorage.setItem('emotionalGarden_user', JSON.stringify(userData));
    
    toast({
      title: "Welcome to your garden! 🌱",
      description: `Hello ${nickname}! Ready to start growing?`,
    });
  };

  const generatePlantPosition = (index: number): [number, number, number] => {
    const radius = 2 + (index * 0.5);
    const angle = (index * 137.5) * (Math.PI / 180); // Golden angle for natural spacing
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    return [x, 0, z];
  };

  const generateAIResponse = async (mood: MoodType, note?: string): Promise<string> => {
    // Simulated AI responses for demo (in real app, this would call Supabase Edge Function with Gemini API)
    const responses = {
      happy: [
        "Your joy is like sunshine nurturing your garden! Let this positive energy ripple outward to brighten others' days too. 🌻",
        "Beautiful! Happiness planted today grows into lasting memories. Take a moment to appreciate this wonderful feeling.",
        "Your bright mood is contagious! Share this beautiful energy and watch your emotional garden flourish even more."
      ],
      calm: [
        "This peaceful moment is precious. Like a strong tree, your calmness provides stability in life's storms. 🌳",
        "Wonderful! Inner peace is the soil where all other positive emotions can grow. Cherish this centered feeling.",
        "Your tranquility is a gift. This calm energy will support you through challenging times ahead."
      ],
      sad: [
        "It's okay to feel blue sometimes. Even wilted flowers can bloom again with care and time. You're stronger than you know. 💙",
        "Sadness is part of growth. Like rain nourishes a garden, these feelings can help you develop compassion and resilience.",
        "This too shall pass. Your feelings are valid, and taking time to process them shows great emotional wisdom."
      ],
      stressed: [
        "Feeling overwhelmed is human. Remember, even small sprouts need time to grow. Take things one step at a time. 🌱",
        "Stress shows you care deeply. Channel this energy mindfully - like a gardener who tends plants with gentle attention.",
        "You're handling more than you realize. Be kind to yourself and remember that growth often happens in challenging times."
      ],
      angry: [
        "Your anger is valid energy. Like a cactus survives harsh conditions, you can transform this intensity into positive change. 🌵",
        "Strong emotions show your passionate heart. Channel this fire into actions that align with your values and wellbeing.",
        "Anger often masks hurt or frustration. Acknowledge these feelings - they're pointing toward something that matters to you."
      ]
    };

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    const moodResponses = responses[mood];
    return moodResponses[Math.floor(Math.random() * moodResponses.length)];
  };

  const generateGrowthStory = (entries: MoodEntry[]): string => {
    const stories = [
      "Your garden tells a story of resilience - through sunshine and storms, each emotion has added depth to your inner landscape. Like seasons changing, you're learning to embrace all feelings as part of your beautiful growth.",
      "In your emotional garden, diversity creates beauty. Happy sunflowers dance with contemplative trees, showing that every feeling has its place in your journey of self-discovery.",
      "Your garden grows stronger with each feeling you've planted. From tiny sprouts of vulnerability to mighty trees of joy, you're creating a sanctuary of emotional wisdom.",
      "Like a master gardener, you're learning that both gentle rains and bright sunshine help gardens flourish. Your emotional journey shows beautiful balance and growth.",
      "Your garden reflects a brave heart willing to feel deeply. Each plant represents a moment of courage - the strength to acknowledge, process, and grow from every emotion."
    ];
    
    return stories[Math.floor(Math.random() * stories.length)];
  };

  const handleMoodSubmit = async (mood: MoodType, note: string) => {
    setIsLoadingMood(true);
    
    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(mood, note);
      
      // Create new entry
      const newEntry: MoodEntry = {
        id: `entry_${Date.now()}`,
        mood,
        note: note || undefined,
        timestamp: new Date(),
        aiResponse
      };

      // Create new plant
      const newPlant: Plant = {
        id: `plant_${Date.now()}`,
        type: mood,
        position: generatePlantPosition(plants.length),
        timestamp: new Date()
      };

      // Update state
      const updatedEntries = [newEntry, ...moodEntries];
      const updatedPlants = [...plants, newPlant];
      
      setMoodEntries(updatedEntries);
      setPlants(updatedPlants);

      // Save to localStorage
      localStorage.setItem('emotionalGarden_entries', JSON.stringify(updatedEntries));
      localStorage.setItem('emotionalGarden_plants', JSON.stringify(updatedPlants));

      // Check if should show growth story
      const milestones = [3, 5, 7, 10, 15, 20];
      if (milestones.includes(updatedEntries.length)) {
        const story = generateGrowthStory(updatedEntries);
        setCurrentStory(story);
        setShowStory(true);
      }

      toast({
        title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} planted! 🌱`,
        description: "Your emotion has been added to your garden.",
      });

    } catch (error) {
      console.error('Error submitting mood:', error);
      toast({
        title: "Oops! Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMood(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('emotionalGarden_user');
    localStorage.removeItem('emotionalGarden_entries');
    localStorage.removeItem('emotionalGarden_plants');
    setUser(null);
    setMoodEntries([]);
    setPlants([]);
    toast({
      title: "Garden reset 🌱",
      description: "Your session has been cleared. Thank you for visiting!",
    });
  };

  if (!user) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-card/95 backdrop-blur-sm border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Leaf className="h-6 w-6 text-accent" />
            <div>
              <h1 className="font-bold text-lg text-primary">Emotional Garden</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.nickname}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="text-4xl">🌱</div>
                    <h3 className="font-bold text-lg">{user.nickname}'s Garden</h3>
                    <p className="text-sm text-muted-foreground">
                      {moodEntries.length} emotions planted
                    </p>
                  </div>
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="w-full"
                  >
                    Reset Garden
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 lg:p-6 lg:h-screen">
        {/* Left Sidebar - Mood History */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3 xl:col-span-3"
        >
          <MoodHistory entries={moodEntries} />
        </motion.div>

        {/* Center - 3D Garden */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-6 xl:col-span-6 relative"
        >
          <div className="h-full relative">
            <GardenScene plants={plants} isLoading={isLoadingMood} />
            
            {/* Garden Header */}
            <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border/50 shadow-soft">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-accent" />
                <div>
                  <div className="font-semibold text-primary">{user.nickname}'s Garden</div>
                  <div className="text-sm text-muted-foreground">
                    {plants.length} plants growing
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="absolute top-4 right-4">
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="bg-card/90 backdrop-blur-sm border-border/50"
              >
                <User className="h-4 w-4 mr-2" />
                Reset Garden
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Sidebar - Check-in Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-3 xl:col-span-3"
        >
          <CheckInForm onSubmit={handleMoodSubmit} isLoading={isLoadingMood} />
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* 3D Garden */}
        <div className="h-[60vh] relative">
          <GardenScene plants={plants} isLoading={isLoadingMood} />
        </div>

        {/* Bottom Sheet for Check-in */}
        <div className="p-4 space-y-4">
          <CheckInForm onSubmit={handleMoodSubmit} isLoading={isLoadingMood} />
          
          {/* History Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Menu className="h-4 w-4 mr-2" />
                View Your Journey ({moodEntries.length})
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <MoodHistory entries={moodEntries} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Growth Story Modal */}
      <GrowthStory
        story={currentStory || ''}
        isVisible={showStory}
        onClose={() => setShowStory(false)}
      />
    </div>
  );
};

export default Index;