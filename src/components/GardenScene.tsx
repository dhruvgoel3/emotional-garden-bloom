import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Box, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Plant {
  id: string;
  type: 'happy' | 'calm' | 'sad' | 'stressed' | 'angry';
  position: [number, number, number];
  timestamp: Date;
}

interface GardenSceneProps {
  plants: Plant[];
  isLoading?: boolean;
}

// Plant components for different moods
const SunflowerPlant = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Stem */}
    <Cylinder args={[0.05, 0.08, 1.5]} position={[0, 0.75, 0]}>
      <meshLambertMaterial color="#4ade80" />
    </Cylinder>
    {/* Flower center */}
    <Sphere args={[0.3]} position={[0, 1.8, 0]}>
      <meshLambertMaterial color="#a16207" />
    </Sphere>
    {/* Petals */}
    {Array.from({ length: 8 }, (_, i) => (
      <Box 
        key={i} 
        args={[0.4, 0.2, 0.05]} 
        position={[
          Math.cos((i * Math.PI * 2) / 8) * 0.5, 
          1.8, 
          Math.sin((i * Math.PI * 2) / 8) * 0.5
        ]}
        rotation={[0, (i * Math.PI * 2) / 8, 0]}
      >
        <meshLambertMaterial color="#fbbf24" />
      </Box>
    ))}
  </group>
);

const TreePlant = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Trunk */}
    <Cylinder args={[0.2, 0.3, 2]} position={[0, 1, 0]}>
      <meshLambertMaterial color="#92400e" />
    </Cylinder>
    {/* Leaves/Crown */}
    <Sphere args={[0.8]} position={[0, 2.5, 0]}>
      <meshLambertMaterial color="#16a34a" />
    </Sphere>
    <Sphere args={[0.6]} position={[0.3, 2.8, 0.2]}>
      <meshLambertMaterial color="#22c55e" />
    </Sphere>
    <Sphere args={[0.5]} position={[-0.4, 2.6, -0.1]}>
      <meshLambertMaterial color="#15803d" />
    </Sphere>
  </group>
);

const DroopingFlower = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Stem (drooping) */}
    <Cylinder args={[0.03, 0.05, 0.8]} position={[0.2, 0.4, 0]} rotation={[0, 0, 0.3]}>
      <meshLambertMaterial color="#4ade80" />
    </Cylinder>
    {/* Flower head (drooping) */}
    <Sphere args={[0.15]} position={[0.4, 0.6, 0]}>
      <meshLambertMaterial color="#3b82f6" />
    </Sphere>
    {/* Small petals */}
    {Array.from({ length: 5 }, (_, i) => (
      <Box 
        key={i} 
        args={[0.2, 0.1, 0.02]} 
        position={[
          0.4 + Math.cos((i * Math.PI * 2) / 5) * 0.2, 
          0.6, 
          Math.sin((i * Math.PI * 2) / 5) * 0.2
        ]}
        rotation={[0.3, (i * Math.PI * 2) / 5, 0]}
      >
        <meshLambertMaterial color="#60a5fa" />
      </Box>
    ))}
  </group>
);

const Sprout = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Small stem */}
    <Cylinder args={[0.02, 0.03, 0.3]} position={[0, 0.15, 0]}>
      <meshLambertMaterial color="#65a30d" />
    </Cylinder>
    {/* Small leaves */}
    <Box args={[0.15, 0.08, 0.02]} position={[-0.08, 0.25, 0]} rotation={[0, 0, -0.3]}>
      <meshLambertMaterial color="#84cc16" />
    </Box>
    <Box args={[0.12, 0.06, 0.02]} position={[0.06, 0.22, 0]} rotation={[0, 0, 0.2]}>
      <meshLambertMaterial color="#a3e635" />
    </Box>
  </group>
);

const CactusPlant = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Main body */}
    <Cylinder args={[0.15, 0.18, 1.2]} position={[0, 0.6, 0]}>
      <meshLambertMaterial color="#166534" />
    </Cylinder>
    {/* Side arms */}
    <Cylinder args={[0.08, 0.1, 0.6]} position={[-0.25, 0.8, 0]} rotation={[0, 0, 1.2]}>
      <meshLambertMaterial color="#15803d" />
    </Cylinder>
    <Cylinder args={[0.06, 0.08, 0.4]} position={[0.2, 0.9, 0]} rotation={[0, 0, -0.8]}>
      <meshLambertMaterial color="#166534" />
    </Cylinder>
    {/* Small spikes */}
    {Array.from({ length: 12 }, (_, i) => (
      <Box 
        key={i} 
        args={[0.02, 0.08, 0.02]} 
        position={[
          Math.cos((i * Math.PI * 2) / 12) * 0.18, 
          0.3 + (i * 0.1), 
          Math.sin((i * Math.PI * 2) / 12) * 0.18
        ]}
      >
        <meshLambertMaterial color="#dc2626" />
      </Box>
    ))}
  </group>
);

const PlantComponent = ({ plant }: { plant: Plant }) => {
  const PlantType = useMemo(() => {
    switch (plant.type) {
      case 'happy': return SunflowerPlant;
      case 'calm': return TreePlant;
      case 'sad': return DroopingFlower;
      case 'stressed': return Sprout;
      case 'angry': return CactusPlant;
      default: return Sprout;
    }
  }, [plant.type]);

  return <PlantType position={plant.position} />;
};

const GardenGround = () => (
  <group>
    {/* Soil base */}
    <Box args={[20, 0.1, 20]} position={[0, -0.05, 0]}>
      <meshLambertMaterial color="#92400e" />
    </Box>
    {/* Grass patches */}
    {Array.from({ length: 50 }, (_, i) => (
      <Box 
        key={i}
        args={[0.1, 0.1, 0.1]} 
        position={[
          (Math.random() - 0.5) * 18, 
          0.05, 
          (Math.random() - 0.5) * 18
        ]}
      >
        <meshLambertMaterial color="#16a34a" />
      </Box>
    ))}
  </group>
);

const FallbackLoading = () => (
  <Box args={[1, 1, 1]}>
    <meshStandardMaterial color="#6b7280" />
  </Box>
);

export const GardenScene = ({ plants, isLoading }: GardenSceneProps) => {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden bg-garden-sky shadow-soft">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 60 }}
        shadows
        className="bg-gradient-to-b from-garden-sky to-garden-grass"
      >
        <Suspense fallback={<FallbackLoading />}>
          {/* Lighting */}
          <ambientLight intensity={0.6} color="#fef3c7" />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            color="#f59e0b"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[0, 5, 0]} intensity={0.3} color="#a3e635" />

          {/* Environment */}
          <Environment preset="park" />
          
          {/* Garden ground */}
          <GardenGround />
          
          {/* Plants */}
          {plants.map((plant, index) => (
            <group key={plant.id}>
              <PlantComponent plant={plant} />
            </group>
          ))}

          {/* Empty state message */}
          {plants.length === 0 && !isLoading && (
            <Text
              position={[0, 2, 0]}
              fontSize={0.8}
              color="#6b7280"
              anchorX="center"
              anchorY="middle"
              font="/fonts/inter-medium.woff"
            >
              Your garden awaits...{'\n'}Check in with your mood to plant your first seed!
            </Text>
          )}

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            autoRotate={plants.length === 0}
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-2"
          >
            <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full mx-auto" />
            <p className="text-foreground font-medium">Planting your emotion...</p>
          </motion.div>
        </div>
      )}
    </div>
  );
};