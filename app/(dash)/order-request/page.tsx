import * as React from "react";
import { getOrderRequests } from './server/actions/order-request';
import { OrderRequestsClient } from './components/order-requests-client';

export default async function OrderRequestPage() {
  const response = await getOrderRequests();
  
  const orderRequests = response.success ? response.data || [] : [];
  
  if (!response.success) {
    console.error('Failed to fetch order requests:', response.error);
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <OrderRequestsClient initialData={orderRequests} />
    </div>
  );
}
