import { TrucksResultsClient } from '@/app/components/trucks-results-client';
import { getTruckTypes } from '@/app/server/actions/trucks';
import { TruckType } from '@/lib/types';
import { AuthManager } from '@/lib/auth-manager';

export default async function HomePage() {
  // Get current user for authentication status
  const currentUser = await AuthManager.getCurrentUser();
  
  // Get truck types for the search form
  let truckTypes: TruckType[] = [];
  try {
    truckTypes = await getTruckTypes();
  } catch (error) {
    console.error('Failed to fetch truck types:', error);
  }

  // Don't fetch trucks initially - wait for user to provide required parameters
  return <TrucksResultsClient initialVehicles={[]} truckTypes={truckTypes} initialUser={currentUser} />;
}
