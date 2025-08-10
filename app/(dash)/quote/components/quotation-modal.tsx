'use client';

import { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  IconTruck,
  IconCurrencyRupee,
  IconBuilding,
  IconFileText,
  IconHistory,
  IconMessageCircle,
  IconLoader2,
  IconX,
  IconCheck,
  IconUsers
} from '@tabler/icons-react';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Quotation,
  NegotiationHistory,
  getNegotiationHistory,
  acceptQuotation,
  rejectQuotation,
  createNegotiation,
  acceptNegotiation
} from '../server/actions/quotation';

interface QuotationModalProps {
  quotation: Quotation;
  userRole: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuotationUpdated: () => void;
}

export function QuotationModal({ 
  quotation, 
  userRole, 
  open, 
  onOpenChange,
  onQuotationUpdated
}: QuotationModalProps) {
  const [negotiationHistory, setNegotiationHistory] = useState<NegotiationHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [negotiationForm, setNegotiationForm] = useState({
    amount: '',
    message: '',
    showBreakdown: false,
    basePrice: '',
    fuelCharges: '',
    tollCharges: '',
    loadingCharges: '',
    unloadingCharges: '',
    additionalCharges: ''
  });

  const loadNegotiationHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getNegotiationHistory(quotation.id);
      if (response.success && response.data) {
        setNegotiationHistory(response.data);
      }
    } catch {
      console.error('Failed to load negotiation history');
    } finally {
      setIsLoading(false);
    }
  }, [quotation.id]);

  useEffect(() => {
    if (open) {
      loadNegotiationHistory();
    }
  }, [open, loadNegotiationHistory]);

  const handleAcceptQuotation = async () => {
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    try {
      const response = await acceptQuotation(quotation.id);
      if (response.success) {
        toast.success('Quotation accepted successfully!');
        onQuotationUpdated();
      } else {
        toast.error(response.error || 'Failed to accept quotation');
      }
    } catch {
      toast.error('Failed to accept quotation');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRejectQuotation = async () => {
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    try {
      const response = await rejectQuotation(quotation.id);
      if (response.success) {
        toast.success('Quotation rejected');
        onQuotationUpdated();
      } else {
        toast.error(response.error || 'Failed to reject quotation');
      }
    } catch {
      toast.error('Failed to reject quotation');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCreateNegotiation = async () => {
    if (isActionLoading || !negotiationForm.amount || !negotiationForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsActionLoading(true);
    try {
      const breakdown = negotiationForm.showBreakdown ? {
        proposed_base_price: parseFloat(negotiationForm.basePrice) || undefined,
        proposed_fuel_charges: parseFloat(negotiationForm.fuelCharges) || undefined,
        proposed_toll_charges: parseFloat(negotiationForm.tollCharges) || undefined,
        proposed_loading_charges: parseFloat(negotiationForm.loadingCharges) || undefined,
        proposed_unloading_charges: parseFloat(negotiationForm.unloadingCharges) || undefined,
        proposed_additional_charges: parseFloat(negotiationForm.additionalCharges) || undefined,
      } : undefined;

      const response = await createNegotiation(
        quotation.id,
        parseFloat(negotiationForm.amount),
        negotiationForm.message,
        breakdown
      );

      if (response.success) {
        toast.success('Negotiation offer created successfully!');
        setNegotiationForm({
          amount: '',
          message: '',
          showBreakdown: false,
          basePrice: '',
          fuelCharges: '',
          tollCharges: '',
          loadingCharges: '',
          unloadingCharges: '',
          additionalCharges: ''
        });
        loadNegotiationHistory();
      } else {
        toast.error(response.error || 'Failed to create negotiation');
      }
    } catch {
      toast.error('Failed to create negotiation');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAcceptNegotiation = async (negotiationId: string) => {
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    try {
      const response = await acceptNegotiation(negotiationId);
      if (response.success) {
        toast.success('Negotiation accepted successfully!');
        onQuotationUpdated();
      } else {
        toast.error(response.error || 'Failed to accept negotiation');
      }
    } catch {
      toast.error('Failed to accept negotiation');
    } finally {
      setIsActionLoading(false);
    }
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

  const canTakeAction = () => {
    // Only customers can take action on quotations
    if (userRole !== 'customer') return false;
    
    // Can't take action on completed quotations
    if (['accepted', 'rejected', 'expired'].includes(quotation.status)) return false;
    
    // If there are negotiations, check if it's the customer's turn
    if (negotiationHistory && negotiationHistory.negotiations && negotiationHistory.negotiations.length > 0) {
      return negotiationHistory.next_negotiator === 'customer';
    }
    
    // If no negotiations yet, customer can take action on pending quotations
    return quotation.status === 'pending';
  };

  const canNegotiate = () => {
    if (!canTakeAction()) return false;
    
    // Can negotiate if it's pending or negotiating status
    if (!['pending', 'negotiating'].includes(quotation.status)) return false;
    
    // If there are negotiations, check if it's the customer's turn
    if (negotiationHistory && negotiationHistory.negotiations && negotiationHistory.negotiations.length > 0) {
      return negotiationHistory.next_negotiator === 'customer';
    }
    
    // If no negotiations yet, customer can start negotiating
    return true;
  };

  const isWaitingForVendor = () => {
    if (userRole !== 'customer') return false;
    if (negotiationHistory && negotiationHistory.negotiations && negotiationHistory.negotiations.length > 0) {
      return negotiationHistory.next_negotiator === 'vendor';
    }
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Quotation #{quotation.id}</span>
            <Badge className={getStatusColor(quotation.status)}>
              {quotation.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="negotiate" disabled={!canNegotiate()}>Negotiate</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <div className="h-[60vh] overflow-y-auto mt-4">
            <TabsContent value="details" className="space-y-4">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconBuilding className="h-5 w-5" />
                    Vendor Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Vendor:</strong> {quotation.vendor_name}</div>
                  <div><strong>Request ID:</strong> #{quotation.quotation_request_id}</div>
                  <div><strong>Validity:</strong> {quotation.validity_hours} hours</div>
                  <div><strong>Created:</strong> {format(new Date(quotation.created_at), 'PPp')}</div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconCurrencyRupee className="h-5 w-5" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{parseFloat(quotation.total_amount).toLocaleString()}
                  </div>
                  {quotation.current_negotiated_amount && (
                    <div className="text-sm text-muted-foreground">
                      Negotiated from: ₹{parseFloat(quotation.current_negotiated_amount).toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconTruck className="h-5 w-5" />
                    Vehicles ({quotation.items?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotation.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {item.vehicle_details ? (
                              <div>
                                <div className="font-medium">
                                  {item.vehicle_details.make} {item.vehicle_details.model}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {item.vehicle_details.registration_number} • {item.vehicle_details.truck_type}
                                </div>
                              </div>
                            ) : (
                              `Vehicle ${item.vehicle_id}`
                            )}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{parseFloat(item.unit_price).toLocaleString()}</TableCell>
                          <TableCell>₹{parseFloat(item.total_price).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Terms */}
              {quotation.terms_and_conditions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <IconFileText className="h-5 w-5" />
                      Terms & Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{quotation.terms_and_conditions}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <IconLoader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : negotiationHistory?.negotiations?.length ? (
                <div className="space-y-4">
                  {negotiationHistory.negotiations.map((negotiation, index) => (
                    <Card key={negotiation.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant={negotiation.initiated_by === 'customer' ? 'default' : 'secondary'}>
                              {negotiation.initiated_by}
                            </Badge>
                            <span className="ml-2 text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(negotiation.created_at))} ago
                            </span>
                          </div>
                          <div className="text-lg font-bold">
                            ₹{parseFloat(negotiation.proposed_amount).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-sm">{negotiation.message}</p>
                        
                        {/* Show accept button for latest negotiation if it's the other party's turn */}
                        {index === 0 && 
                         negotiationHistory.next_negotiator === userRole.toLowerCase() && 
                         negotiation.initiated_by !== userRole.toLowerCase() && (
                          <div className="mt-4">
                            <Button 
                              onClick={() => handleAcceptNegotiation(negotiation.id)}
                              disabled={isActionLoading}
                              className="w-full"
                            >
                              {isActionLoading ? <IconLoader2 className="h-4 w-4 animate-spin mr-2" /> : <IconCheck className="h-4 w-4 mr-2" />}
                              Accept This Offer
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center py-8">
                  <CardContent>
                    <IconHistory className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No negotiation history</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="negotiate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconUsers className="h-5 w-5" />
                    Make Counter Offer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Proposed Amount *</label>
                    <div className="relative">
                      <IconCurrencyRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        value={negotiationForm.amount}
                        onChange={(e) => setNegotiationForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                        placeholder="Enter your proposed amount"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      value={negotiationForm.message}
                      onChange={(e) => setNegotiationForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full p-3 border rounded-md h-24"
                      placeholder="Explain your counter offer..."
                    />
                  </div>

                  <Button 
                    onClick={handleCreateNegotiation}
                    disabled={isActionLoading || !negotiationForm.amount || !negotiationForm.message}
                    className="w-full"
                  >
                    {isActionLoading ? <IconLoader2 className="h-4 w-4 animate-spin mr-2" /> : <IconMessageCircle className="h-4 w-4 mr-2" />}
                    Send Counter Offer
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              {canTakeAction() ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quotation Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold mb-2">
                        ₹{parseFloat(quotation.total_amount).toLocaleString()}
                      </div>
                      <p className="text-muted-foreground">Current quotation amount</p>
                    </div>

                    <Button 
                      onClick={handleAcceptQuotation}
                      disabled={isActionLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isActionLoading ? <IconLoader2 className="h-4 w-4 animate-spin mr-2" /> : <IconCheck className="h-4 w-4 mr-2" />}
                      Accept Quotation
                    </Button>

                    <Button 
                      onClick={handleRejectQuotation}
                      disabled={isActionLoading}
                      variant="destructive"
                      className="w-full"
                    >
                      {isActionLoading ? <IconLoader2 className="h-4 w-4 animate-spin mr-2" /> : <IconX className="h-4 w-4 mr-2" />}
                      Reject Quotation
                    </Button>

                    <div className="text-xs text-muted-foreground text-center mt-4">
                      <p>• &ldquo;Accept&rdquo; will finalize this quotation</p>
                      <p>• &ldquo;Reject&rdquo; will decline and end the negotiation</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quotation Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-8">
                      {isWaitingForVendor() ? (
                        <>
                          <IconLoader2 className="h-12 w-12 mx-auto mb-4 text-blue-500 animate-spin" />
                          <h3 className="text-lg font-semibold mb-2">Waiting for Vendor Response</h3>
                          <p className="text-muted-foreground">
                            The vendor is reviewing your latest negotiation. You&apos;ll be able to take action once they respond.
                          </p>
                        </>
                      ) : quotation.status === 'accepted' ? (
                        <>
                          <IconCheck className="h-12 w-12 mx-auto mb-4 text-green-500" />
                          <h3 className="text-lg font-semibold mb-2">Quotation Accepted</h3>
                          <p className="text-muted-foreground">
                            This quotation has been finalized and accepted.
                          </p>
                        </>
                      ) : quotation.status === 'rejected' ? (
                        <>
                          <IconX className="h-12 w-12 mx-auto mb-4 text-red-500" />
                          <h3 className="text-lg font-semibold mb-2">Quotation Rejected</h3>
                          <p className="text-muted-foreground">
                            This quotation has been declined and the negotiation has ended.
                          </p>
                        </>
                      ) : quotation.status === 'expired' ? (
                        <>
                          <IconX className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                          <h3 className="text-lg font-semibold mb-2">Quotation Expired</h3>
                          <p className="text-muted-foreground">
                            This quotation has expired and is no longer valid.
                          </p>
                        </>
                      ) : (
                        <>
                          <IconLoader2 className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                          <h3 className="text-lg font-semibold mb-2">No Actions Available</h3>
                          <p className="text-muted-foreground">
                            You cannot take action on this quotation at this time.
                          </p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
