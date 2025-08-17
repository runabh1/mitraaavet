
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Mic, CalendarClock, Wheat, Video, ShoppingCart, LineChart, Droplets, Leaf, CloudSun, MessageSquare, Siren } from 'lucide-react';
import { Button } from './ui/button';

interface FeatureGridProps {
  petType: string;
}

export default function FeatureGrid({ petType }: FeatureGridProps) {
  const router = useRouter();
  const isFarming = petType === 'Farming';
  const isPoultryOrFish = ['Fish', 'Poultry'].includes(petType);

  const baseFeatures = [
    { name: 'Voice Chat', icon: <Mic className="h-8 w-8 mb-2" />, path: '/voice-chat', available: true },
    { name: 'Marketplace', icon: <ShoppingCart className="h-8 w-8 mb-2" />, path: '/marketplace', available: true },
    { name: 'Early Warning System', icon: <Siren className="h-8 w-8 mb-2" />, path: '/regional-alerts', available: true },
  ];

  const animalFeatures = [
    { name: 'AI Doctor', icon: <Stethoscope className="h-8 w-8 mb-2" />, path: '/ai-doctor', available: true },
    { name: 'Health Tracker', icon: <LineChart className="h-8 w-8 mb-2" />, path: '/health-tracker', available: true },
    { name: 'Care Reminders', icon: <CalendarClock className="h-8 w-8 mb-2" />, path: '/reminders', available: true },
    { name: 'Feed Advice', icon: <Wheat className="h-8 w-8 mb-2" />, path: '/feed-advice', available: true },
    { name: 'Vet Connect', icon: <Video className="h-8 w-8 mb-2" />, path: '/vet-connect', available: true },
    { name: 'Fish/Poultry Monitor', icon: <Droplets className="h-8 w-8 mb-2" />, path: '/monitor', available: isPoultryOrFish },
  ];

  const farmingFeatures = [
      { name: 'AI Crop Doctor', icon: <Leaf className="h-8 w-8 mb-2" />, path: '/crop-doctor', available: true },
      { name: 'Crop Tracker', icon: <LineChart className="h-8 w-8 mb-2" />, path: '/health-tracker', available: true },
      { name: 'Farming Reminders', icon: <CalendarClock className="h-8 w-8 mb-2" />, path: '/reminders', available: true },
      { name: 'Weather Advisory', icon: <CloudSun className="h-8 w-8 mb-2" />, path: '/weather-advisory', available: true },
      { name: 'Community Forum', icon: <MessageSquare className="h-8 w-8 mb-2" />, path: '/community-forum', available: true },
  ];

  const features = isFarming ? [...baseFeatures, ...farmingFeatures] : [...baseFeatures, ...animalFeatures];


  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {features.map(feature => (
        <Card
          key={feature.name}
          className={`text-center transition-all hover:shadow-lg hover:-translate-y-1 ${
            feature.available ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={() => feature.available && router.push(feature.path)}
        >
          <CardHeader>
            <div className="mx-auto text-primary">
                {feature.icon}
            </div>
            <CardTitle className="text-base font-semibold">{feature.name}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
