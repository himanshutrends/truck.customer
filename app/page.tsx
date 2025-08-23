import React from 'react';
import { getTruckTypes } from './server/actions/home';
import { AuthManager } from '@/lib/auth-manager';
import { HomePageClient } from '@/app/components/home-page-client';

// Server component for initial data fetching
export default async function HomePage() {
  // Get initial data
  const [truckTypes, currentUser] = await Promise.all([
    getTruckTypes(),
    AuthManager.getCurrentUser(),
  ]);

  return (
    <HomePageClient 
      initialTruckTypes={truckTypes} 
      initialUser={currentUser} 
    />
  );
}
