# Quotations Feature Documentation

## 📋 Overview
The quotations page allows customers and vendors to manage quotations following the project's component isolation architecture.

## 🏗️ Architecture Implementation

### Directory Structure
```
app/(dash)/quote/
├── page.tsx                           # Main page component (server component)
├── components/                        # Page-specific components (isolated)
│   ├── quotation-data-table.tsx      # Quotations table with search
│   ├── quotation-details-modal.tsx   # Detailed quotation view modal
│   ├── quotation-stats.tsx           # Statistics overview cards
│   └── quotation-wrapper.tsx         # Client-side state management wrapper
└── server/
    └── actions/
        └── quotation.ts               # Server actions for quotation operations
```

## 🔧 Features Implemented

### ✅ Role-Based Access Control
- **Customer**: View received quotations, accept/reject pending ones
- **Vendor**: View created quotations, see quotation status
- **Admin/Manager**: View all quotations in the system

### ✅ Server Actions
- `getQuotations()` - Fetch quotations based on user role
- `getQuotationById(id)` - Get specific quotation details
- `updateQuotationStatus(id, status)` - Accept/reject quotations (customer only)
- `getQuotationStats()` - Get quotation statistics

### ✅ UI Components (Page-Specific)
- **QuotationDataTable**: Responsive table with search functionality
- **QuotationDetailsModal**: Comprehensive quotation details with action buttons
- **QuotationStats**: Overview cards showing quotation statistics
- **QuotationWrapper**: Client-side state management and toast notifications

### ✅ API Integration
- Customer endpoint: `customer/quotations/customer/quotations`
- Vendor endpoint: `customer/quotations/vendor/quotations/`
- Status update endpoint: `customer/quotations/{id}/status`
- Statistics endpoint: `customer/quotations/{role}/stats`

## 🎯 Response Fields Handled
All backend response fields are properly typed and displayed:
- `id`, `quotation_request_id`, `vendor`, `vendor_name`
- `items` (with vehicle details), `total_amount`
- `terms_and_conditions`, `validity_hours`
- `customer_suggested_price`, `vendor_response_to_suggestion`
- `status`, `is_active`, `created_at`, `updated_at`

## 🔒 Security Features
- Authentication required for all operations
- Role-based authorization for different views
- Input validation with TypeScript interfaces
- Error handling with user-friendly messages

## 📱 User Experience
- **Responsive Design**: Works on mobile and desktop
- **Search Functionality**: Search by vendor name, quotation ID
- **Status Badges**: Visual status indicators with icons
- **Toast Notifications**: Success/error feedback
- **Loading States**: Proper loading indicators
- **Empty States**: Helpful empty state messages

## 🧪 Component Isolation Benefits
- ✅ Page-specific components in dedicated directory
- ✅ No cross-page dependencies
- ✅ Server actions isolated to quotation functionality
- ✅ Easy to test and maintain
- ✅ Clear ownership boundaries
- ✅ Safe refactoring capabilities

## 🚀 Usage Example

### For Customers:
1. View received quotations from vendors
2. Search and filter quotations
3. Click "View" to see detailed quotation information
4. Accept or reject pending quotations
5. Track quotation status and history

### For Vendors:
1. View created quotations
2. Monitor quotation status (pending, accepted, rejected)
3. See quotation details and customer responses
4. Track quotation statistics

## 🔄 State Management
- Server state managed via server actions
- Client state for UI interactions (modals, search)
- Optimistic updates for quotation status changes
- Real-time statistics refresh after status updates

## 📊 Error Handling
- Graceful error states for API failures
- User-friendly error messages
- Loading states during async operations
- Proper error logging for debugging

## 🎨 Design System Compliance
- Uses project's UI component library
- Consistent styling with shadcn/ui
- Proper spacing and typography
- Accessible color schemes and icons

This implementation fully follows the project's architecture guidelines while providing a comprehensive quotations management system for both customers and vendors.
