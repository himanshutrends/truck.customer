import React from 'react';
import { TrucksResultsClient } from '@/app/components/trucks-results-client';
import { getTruckTypes } from '@/app/server/actions/trucks';
import { TruckType } from '@/lib/types';

export default async function ResultsPage() {
  // Get truck types for the search form
  let truckTypes: TruckType[] = [];
  try {
    truckTypes = await getTruckTypes();
  } catch (error) {
    console.error('Failed to fetch truck types:', error);
  }

  // Don't fetch trucks initially - wait for user to provide required parameters
  return <TrucksResultsClient initialVehicles={[]} truckTypes={truckTypes} />;
}
