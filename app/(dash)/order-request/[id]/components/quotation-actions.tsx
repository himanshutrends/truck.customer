'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconDots, IconCheck, IconX } from '@tabler/icons-react';
import { acceptQuotation, rejectQuotation } from '../server/actions/order-request-detail';
import { useRouter } from 'next/navigation';

interface QuotationActionsProps {
  quotationId: number;
  currentStatus: string;
}

export function QuotationActions({ quotationId, currentStatus }: QuotationActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const result = await acceptQuotation(quotationId);
      if (result.success) {
        router.refresh(); // Refresh the page to show updated data
      } else {
        console.error('Failed to accept quotation:', result.error);
      }
    } catch (error) {
      console.error('Error accepting quotation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const result = await rejectQuotation(quotationId);
      if (result.success) {
        router.refresh(); // Refresh the page to show updated data
      } else {
        console.error('Failed to reject quotation:', result.error);
      }
    } catch (error) {
      console.error('Error rejecting quotation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || currentStatus.toLowerCase() === 'accepted' || currentStatus.toLowerCase() === 'rejected';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
          <IconDots className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={handleAccept}
          disabled={isDisabled}
          className="text-green-600"
        >
          <IconCheck className="h-4 w-4 mr-2" />
          Accept Quotation
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleReject}
          disabled={isDisabled}
          className="text-red-600"
        >
          <IconX className="h-4 w-4 mr-2" />
          Reject Quotation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
