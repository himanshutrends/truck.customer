'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  IconEye, 
  IconSearch,
  IconCurrencyRupee,
  IconTruck,
  IconCalendar,
  IconBuilding
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { Quotation } from '../server/actions/quotation';
import { QuotationModal } from './quotation-modal';

interface QuotationContainerProps {
  quotations: Quotation[];
  userRole: string;
}

export function QuotationContainer({ quotations, userRole }: QuotationContainerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredQuotations = quotations.filter(quotation =>
    quotation.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <IconSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by vendor name or quotation ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quotations Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuotations.map((quotation) => (
          <Card key={quotation.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    #{quotation.id}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Request #{quotation.quotation_request_id}
                  </p>
                </div>
                <Badge className={getStatusColor(quotation.status)}>
                  {quotation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vendor Info */}
              <div className="flex items-center gap-2">
                <IconBuilding className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{quotation.vendor_name}</span>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-2">
                <IconCurrencyRupee className="h-4 w-4 text-gray-500" />
                <span className="text-lg font-bold">
                  ₹{parseFloat(quotation.total_amount).toLocaleString()}
                </span>
                {quotation.current_negotiated_amount && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{parseFloat(quotation.current_negotiated_amount).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Items Count */}
              <div className="flex items-center gap-2">
                <IconTruck className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {quotation.items?.length || 0} vehicle(s)
                </span>
              </div>

              {/* Validity */}
              <div className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Valid for {quotation.validity_hours}h
                </span>
              </div>

              {/* Created Date */}
              <div className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(new Date(quotation.created_at))} ago
              </div>

              {/* Negotiation Info */}
              {quotation.total_negotiations && quotation.total_negotiations > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {quotation.total_negotiations} negotiation(s)
                  </Badge>
                  {quotation.next_negotiator && (
                    <Badge variant="secondary" className="text-xs">
                      {quotation.next_negotiator === userRole.toLowerCase() ? 'Your turn' : 'Waiting'}
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <Button 
                onClick={() => handleViewQuotation(quotation)}
                className="w-full"
                variant="outline"
              >
                <IconEye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuotations.length === 0 && searchTerm && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              No quotations found matching &ldquo;{searchTerm}&rdquo;
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quotation Modal */}
      {selectedQuotation && (
        <QuotationModal
          quotation={selectedQuotation}
          userRole={userRole}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onQuotationUpdated={() => {
            // You could refresh the data here
            setIsModalOpen(false);
            setSelectedQuotation(null);
          }}
        />
      )}
    </div>
  );
}
