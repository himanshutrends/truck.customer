import { AuthManager } from "@/lib/auth-manager";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileText } from "lucide-react";
import { getQuotations } from "./server/actions/quotation";
import { QuotationContainer } from "./components/quotation-container";

export default async function QuotePage() {
  const user = await AuthManager.getCurrentUser();
  
  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to view your quotations.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const quotationsResponse = await getQuotations();

  if (!quotationsResponse.success) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Quotations</h1>
          <p className="text-muted-foreground mt-2">
            {user.role === 'customer' 
              ? "View and manage quotations from vendors" 
              : "Manage your quotations"}
          </p>
        </div>
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Error Loading Quotations</CardTitle>
            <CardDescription>
              {quotationsResponse.error || "Failed to load quotations. Please try again."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const quotations = quotationsResponse.data || [];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quotations</h1>
        <p className="text-muted-foreground mt-2">
          {user.role === 'customer' 
            ? "View and manage quotations from vendors" 
            : "Manage your quotations"}
        </p>
      </div>

      {quotations.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>No quotations found</CardTitle>
            <CardDescription>
              {user.role === 'customer'
                ? "You don't have any quotations yet. Create a shipment request to receive quotations from vendors."
                : "You haven't created any quotations yet."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <QuotationContainer quotations={quotations} userRole={user.role} />
      )}
    </div>
  );
}
