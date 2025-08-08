---
applyTo: '**'
---
# TruckRent Customer Portal - Development Instructions

## 📁 Project Structure & Architecture

This Next.js 15 application follows a structured approach with clear separation of concerns, role-based access control, and consistent patterns throughout the codebase.

### 🏗️ Folder Structure

```
app/
├── (auth)/                    # Authentication routes group
│   ├── login/
│   │   ├── page.tsx          # Login page component
│   │   ├── components/       # Login-specific components ONLY
│   │   │   ├── login-form.tsx
│   │   │   ├── social-login.tsx
│   │   │   └── password-toggle.tsx
│   │   └── server/
│   │       └── actions/
│   │           └── auth.ts   # Authentication server actions
│   ├── signup/
│   │   ├── page.tsx          # Signup page component
│   │   ├── components/       # Signup-specific components ONLY
│   │   │   ├── signup-form.tsx
│   │   │   ├── terms-checkbox.tsx
│   │   │   └── verification-step.tsx
│   │   └── server/
│   │       └── actions/
│   │           └── signup.ts # Signup server actions
│   └── forgot-password/
│       ├── page.tsx
│       ├── components/       # Forgot password-specific components ONLY
│       │   └── reset-form.tsx
│       └── server/
│           └── actions/
│               └── forgot-password.ts
├── (dash)/                   # Dashboard routes group (protected)
│   ├── layout.tsx           # Dashboard layout with sidebar
│   ├── loading.tsx          # Loading component
│   ├── not-found.tsx        # 404 component
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── components/       # Dashboard-specific components ONLY
│   │   │   ├── stats-card.tsx
│   │   │   ├── activity-feed.tsx
│   │   │   └── quick-actions.tsx
│   │   └── server/
│   │       └── actions/
│   │           └── dashboard.ts
│   ├── vehicle/
│   │   ├── page.tsx         # Vehicle listing page
│   │   ├── components/       # Vehicle-specific components ONLY
│   │   │   ├── vehicle-data-table.tsx
│   │   │   ├── vehicle-filters.tsx
│   │   │   ├── add-vehicle-modal.tsx
│   │   │   └── vehicle-stats.tsx
│   │   └── server/
│   │       └── actions/
│   │           └── vehicle.ts # Vehicle server actions
│   ├── driver/
│   │   ├── page.tsx         # Driver listing page
│   │   ├── components/       # Driver-specific components ONLY
│   │   │   ├── driver-data-table.tsx
│   │   │   ├── driver-form.tsx
│   │   │   └── driver-assignment.tsx
│   │   └── server/
│   │       └── actions/
│   │           └── driver.ts # Driver server actions
│   └── [other-features]/
│       ├── page.tsx
│       ├── components/       # Feature-specific components ONLY
│       └── server/
│           └── actions/
├── (search)/                 # Search functionality group
│   └── results/
│       ├── page.tsx         # Search results page
│       ├── components/       # Search results-specific components ONLY
│       │   ├── search-filters.tsx
│       │   ├── result-card.tsx
│       │   └── pagination.tsx
│       └── server/
│           └── actions/
│               └── search.ts
├── layout.tsx               # Root layout
├── page.tsx                 # Home page
├── globals.css              # Global styles
└── not-found.tsx           # Global 404 page

components/                   # SHARED components used across multiple pages
├── ui/                      # Shadcn/UI base components
├── app-sidebar.tsx          # Dynamic role-based sidebar
├── quotation-summary.tsx    # Quotation management component
├── vendor-switch-dialog.tsx # Vendor switching confirmation
├── vehicle-card.tsx         # Reusable vehicle display component
├── data-table.tsx           # Generic data table component
├── loading-spinner.tsx      # Loading states
├── error-boundary.tsx       # Error handling component
└── [other-shared-components]/
├── app-sidebar.tsx          # Dynamic role-based sidebar
├── quotation-summary.tsx    # Quotation management component
├── vendor-switch-dialog.tsx # Vendor switching confirmation
├── vehicle-card.tsx         # Vehicle display component
└── [other-components]/

contexts/
├── auth-context.tsx         # Authentication context
└── quotation-context.tsx    # Quotation management context

lib/
├── auth-manager.ts          # Authentication management
├── api.ts                   # API request handler
├── types.ts                 # TypeScript type definitions
└── utils.ts                 # Utility functions

middleware.ts                # Route protection & role-based access
```

---

## 📦 Component Isolation Strategy

### Core Principle: Page-Specific Isolation
Each page maintains its own isolated ecosystem of components and server actions to ensure maintainability and prevent cross-dependencies.

### 🏗️ Component Organization Rules

#### 1. Page-Specific Components
```
app/(route-group)/feature/
├── page.tsx                 # Main page component
├── components/              # Feature-specific components ONLY
│   ├── feature-form.tsx
│   ├── feature-table.tsx
│   ├── feature-modal.tsx
│   └── feature-filters.tsx
└── server/
    └── actions/
        └── feature.ts       # Feature-specific server actions
```

**Rules:**
- ✅ Components in `components/` folder are ONLY used within that specific page
- ✅ No importing of page-specific components from other pages
- ✅ Server actions are isolated to their respective page functionality
- ❌ Never reference page-specific components outside their page directory

#### 2. Shared Components
```
components/                  # Root-level shared components
├── ui/                     # Base UI components (buttons, inputs, etc.)
├── layout/                 # Layout-related components
├── common/                 # Commonly used business components
└── providers/              # Context providers
```

**Rules:**
- ✅ Used across multiple pages/features
- ✅ Generic and reusable
- ✅ No business logic specific to one page
- ✅ Well-documented with clear interfaces

### 🔄 Component Classification Guide

#### Page-Specific Components (app/*/components/)
```typescript
// ✅ CORRECT - Page-specific component
// app/(dash)/vehicle/components/vehicle-form.tsx
'use client';

import { Button } from '@/components/ui/button'; // ✅ Shared UI component
import { Input } from '@/components/ui/input';   // ✅ Shared UI component

export function VehicleForm() {
  // Vehicle-specific form logic
}
```

#### Shared Components (components/)
```typescript
// ✅ CORRECT - Shared component
// components/data-table.tsx
'use client';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  // Generic table interface
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  // Generic table implementation
}
```

#### ❌ Anti-Pattern Examples
```typescript
// ❌ WRONG - Importing page-specific component from another page
// app/(dash)/driver/page.tsx
import { VehicleForm } from '../vehicle/components/vehicle-form'; // ❌ NO!

// ❌ WRONG - Page-specific component with dependencies on other pages
// app/(dash)/vehicle/components/vehicle-form.tsx
import { DriverList } from '../../driver/components/driver-list'; // ❌ NO!
```

### 📁 Directory Structure Examples

#### Authentication Pages
```
app/(auth)/login/
├── page.tsx
├── components/
│   ├── login-form.tsx       # Only for login page
│   ├── social-buttons.tsx   # Only for login page
│   └── remember-me.tsx      # Only for login page
└── server/actions/auth.ts

app/(auth)/signup/
├── page.tsx
├── components/
│   ├── signup-form.tsx      # Only for signup page
│   ├── terms-agreement.tsx  # Only for signup page
│   └── verification.tsx     # Only for signup page
└── server/actions/signup.ts
```

#### Dashboard Features
```
app/(dash)/vehicle/
├── page.tsx
├── components/
│   ├── vehicle-data-table.tsx    # Only for vehicle page
│   ├── add-vehicle-modal.tsx     # Only for vehicle page
│   ├── vehicle-filters.tsx       # Only for vehicle page
│   └── vehicle-stats-card.tsx    # Only for vehicle page
└── server/actions/vehicle.ts

app/(dash)/driver/
├── page.tsx
├── components/
│   ├── driver-data-table.tsx     # Only for driver page
│   ├── driver-assignment.tsx     # Only for driver page
│   └── driver-form.tsx           # Only for driver page
└── server/actions/driver.ts
```

### 🔧 Implementation Guidelines

#### 1. Creating Page-Specific Components
```typescript
// app/(dash)/vehicle/components/vehicle-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';        // ✅ Shared UI
import { Input } from '@/components/ui/input';          // ✅ Shared UI
import { createVehicle } from '../server/actions/vehicle'; // ✅ Same page action

interface VehicleFormProps {
  onSuccess?: () => void;
}

export function VehicleForm({ onSuccess }: VehicleFormProps) {
  const [formData, setFormData] = useState({});
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await createVehicle(formData);
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Vehicle-specific form fields */}
    </form>
  );
}
```

#### 2. Creating Shared Components
```typescript
// components/modal.tsx
'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <h2>{title}</h2>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

#### 3. Page Implementation Pattern
```typescript
// app/(dash)/vehicle/page.tsx
import { getVehicles } from './server/actions/vehicle';
import { VehicleDataTable } from './components/vehicle-data-table';
import { VehicleFilters } from './components/vehicle-filters';

export default async function VehiclePage() {
  const response = await getVehicles();
  
  return (
    <div>
      <h1>Vehicle Management</h1>
      <VehicleFilters />
      <VehicleDataTable vehicles={response.data || []} />
    </div>
  );
}
```

### 🚨 Debugging Benefits

#### 1. Isolated Debugging
- Issues are contained within specific page directories
- Easy to identify which page a component belongs to
- Clear separation of concerns

#### 2. Safe Refactoring
- Changes to page-specific components don't affect other pages
- Server actions are isolated to their feature domain
- Reduced risk of breaking changes

#### 3. Team Collaboration
- Multiple developers can work on different pages without conflicts
- Clear ownership boundaries
- Easier code reviews

### 📋 Migration Guidelines

#### Converting Existing Structure
1. **Identify Page-Specific Components**
   - Move components used by only one page to that page's `components/` folder
   - Keep truly shared components in root `components/` folder

2. **Update Import Paths**
   ```typescript
   // Before
   import { VehicleForm } from '@/components/vehicle-form';
   
   // After
   import { VehicleForm } from './components/vehicle-form';
   ```

3. **Isolate Server Actions**
   - Move feature-specific actions to `page/server/actions/`
   - Keep cross-feature actions in shared locations

### ✅ Checklist for New Features

When creating a new page/feature:

- [ ] Create `page/components/` directory for page-specific components
- [ ] Create `page/server/actions/` directory for page-specific server actions
- [ ] Ensure no cross-page component dependencies
- [ ] Use shared components from root `components/` for common functionality
- [ ] Document component purpose and usage
- [ ] Test component isolation (no external page dependencies)

---

## 🔐 Authentication & Authorization

### AuthManager Class
The `AuthManager` class handles all authentication operations:

```typescript
// Key methods:
AuthManager.login(email, password)          // Login user
AuthManager.logout()                        // Logout user
AuthManager.getCurrentUser()                // Get current session user
AuthManager.getAccessToken()                // Get access token
AuthManager.setTokens(access, refresh, user) // Store tokens
```

### Middleware-Based Route Protection
The `middleware.ts` file provides:

1. **Route-Based Access Control**
2. **Role-Based Permissions**
3. **Authentication State Management**
4. **Automatic Redirects**

**Route Permission Configuration:**
```typescript
const routePermissions: Record<string, UserRole[]> = {
  '/dashboard': ['admin', 'manager', 'customer', 'vendor'],
  '/vehicle': ['admin', 'manager', 'vendor'],
  '/search-shipments': ['admin', 'manager'],
  '/customer': ['admin', 'manager'],
};
```

---

## 🚀 Server Actions Best Practices

### 1. File Structure & Isolation
All server actions follow the page-specific isolation pattern:
```
app/(route-group)/feature/server/actions/feature.ts
```

**Key Rules:**
- ✅ Server actions are isolated within their page directory
- ✅ No cross-page server action dependencies
- ✅ Each page manages its own data operations
- ❌ Never import server actions from other pages

### 2. Page-Specific Server Action Template
```typescript
'use server';

import { AuthManager } from '@/lib/auth-manager';
import { ApiResponse } from '@/lib/types';

export interface FeatureData {
  // Define your data interface specific to this feature
  id: string;
  name: string;
  // ... other feature-specific fields
}

/**
 * Get feature data - specific to this page only
 */
export async function getFeatureData(): Promise<ApiResponse<FeatureData[]>> {
  try {
    // 1. Authentication check
    const user = await AuthManager.getCurrentUser();
    if (!user) {
      return {
        success: false,
        error: 'User not authenticated'
      };
    }

    // 2. Authorization check (page-specific permissions)
    if (!['admin', 'manager', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    // 3. API call (feature-specific endpoint)
    const response = await authGet<FeatureData[]>('api/feature-endpoint');

    // 4. Return response
    return response;
  } catch (error) {
    console.error('getFeatureData error:', error);
    return {
      success: false,
      error: 'Failed to fetch feature data'
    };
  }
}

/**
 * Create feature data - specific to this page only
 */
export async function createFeatureData(data: Partial<FeatureData>): Promise<ApiResponse<FeatureData>> {
  try {
    // 1. Authentication & Authorization
    const user = await AuthManager.getCurrentUser();
    if (!user || !['admin', 'manager', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    // 2. Data validation (feature-specific Zod schema)
    // const validatedData = featureSchema.parse(data);

    // 3. API call (feature-specific endpoint)
    const response = await authPost<FeatureData>('api/feature-endpoint', data);

    return response;
  } catch (error) {
    console.error('createFeatureData error:', error);
    return {
      success: false,
      error: 'Failed to create feature data'
    };
  }
}

/**
 * Update feature data - specific to this page only
 */
export async function updateFeatureData(id: string, data: Partial<FeatureData>): Promise<ApiResponse<FeatureData>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user || !['admin', 'manager', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    const response = await authPut<FeatureData>(`api/feature-endpoint/${id}`, data);
    return response;
  } catch (error) {
    console.error('updateFeatureData error:', error);
    return {
      success: false,
      error: 'Failed to update feature data'
    };
  }
}

/**
 * Delete feature data - specific to this page only
 */
export async function deleteFeatureData(id: string): Promise<ApiResponse<{ message: string }>> {
  try {
    const user = await AuthManager.getCurrentUser();
    if (!user || !['admin', 'manager', 'vendor'].includes(user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    const response = await authDelete<{ message: string }>(`api/feature-endpoint/${id}`);
    return response;
  } catch (error) {
    console.error('deleteFeatureData error:', error);
    return {
      success: false,
      error: 'Failed to delete feature data'
    };
  }
}
```

### 3. Authentication Server Actions
Authentication actions in `app/(auth)/login/server/actions/auth.ts`:

```typescript
'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { AuthManager } from '@/lib/auth-manager';

// Always include schema validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    // 1. Parse and validate form data
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const validatedData = loginSchema.parse(rawData);

    // 2. Attempt login
    const response = await AuthManager.login(validatedData.email, validatedData.password);

    if (!response.success || !response.data) {
      return {
        success: false,
        message: response.error || 'Login failed',
      };
    }

    // 3. Redirect on success
    redirect('/dashboard');
  } catch (error) {
    // 4. Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: formatZodErrors(error),
      };
    }
    
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}
```

---

## 🔌 API Integration

### ApiHandlers
Centralized API request handling with authentication:

```typescript
// Authenticated requests
authGet<T>(endpoint)
authPost<T>(endpoint, data)
authPut<T>(endpoint, data)
authDelete<T>(endpoint)

// Public requests
apiGet<T>(endpoint)
apiPost<T>(endpoint, data)
apiPut<T>(endpoint, data)
apiDelete<T>(endpoint)
```

---

## 🎭 Role-Based UI Components

### Dynamic Sidebar
The `app-sidebar.tsx` component provides role-based navigation:

```typescript
const getNavigationData = (userRole: UserRole): { navGroups: NavGroup[] } => {
  const navGroups: NavGroup[] = [
    {
      label: "MAIN MENU",
      items: [
        {
          title: userRole === 'customer' ? "My Orders" : "Orders",
          url: "/order",
          icon: IconBox,
        },
        {
          title: "Search Shipments",
          url: "/search-shipments",
          icon: IconSearch,
          roles: ['admin', 'manager'], // Only specific roles
        },
      ],
    },
  ];

  // Filter based on user role
  return {
    navGroups: navGroups
      .filter(group => !group.roles || group.roles.includes(userRole))
      .map(group => ({
        ...group,
        items: group.items.filter(item => !item.roles || item.roles.includes(userRole))
      }))
  };
};
```

---

## 📋 Context Management

### Authentication Context
Provides user state management across the application:

```typescript
// Usage in components
const { user, loading, logout, updateUser } = useAuth();
```

### Quotation Context
Manages complex quotation state with vendor switching logic:

```typescript
// Usage in components
const { 
  addVehicleToQuotation, 
  removeVehicleFromQuotation,
  isVehicleSelected,
  canSelectVehicle 
} = useQuotation();
```

**Key Features:**
- Vendor-based quotation grouping
- Automatic vendor switch detection
- Confirmation dialogs for vendor changes
- Quotation history management

---

## 🚧 Component Development Guidelines

### 1. Server vs Client Components with Isolation

**Server Components** (Default) - Page Level:
- Used for data fetching at page level
- No interactivity required
- Better performance
- Imports page-specific server actions

```typescript
// app/(dash)/vehicle/page.tsx
import { getVehicles } from './server/actions/vehicle';  // ✅ Same page action
import { VehicleDataTable } from './components/vehicle-data-table'; // ✅ Same page component
import { VehicleFilters } from './components/vehicle-filters';       // ✅ Same page component

export default async function VehiclePage() {
  const response = await getVehicles(); // ✅ Page-specific server action
  
  return (
    <div>
      <h1>Vehicle Management</h1>
      <VehicleFilters />
      <VehicleDataTable vehicles={response.data || []} />
    </div>
  );
}
```

**Client Components** ('use client') - Page-Specific:
- Interactive features within the page
- State management for that specific page
- Event handlers for page-specific actions

```typescript
// app/(dash)/vehicle/components/vehicle-form.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';          // ✅ Shared UI component
import { Input } from '@/components/ui/input';            // ✅ Shared UI component
import { createVehicle } from '../server/actions/vehicle'; // ✅ Same page server action

interface VehicleFormProps {
  onSuccess?: () => void;
}

export function VehicleForm({ onSuccess }: VehicleFormProps) {
  const [formData, setFormData] = useState({});
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await createVehicle(formData); // ✅ Page-specific action
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Vehicle-specific form fields */}
    </form>
  );
}
```

### 2. Data Table Pattern with Isolation
Each page has its own data table implementation:

```typescript
// app/(dash)/vehicle/page.tsx - Server component for data fetching
import { getVehicles } from './server/actions/vehicle';
import { VehicleDataTableWrapper } from './components/vehicle-data-table-wrapper';

export default async function VehiclePage() {
  const response = await getVehicles();
  return <VehicleDataTableWrapper vehicles={response.data || []} />;
}

// app/(dash)/vehicle/components/vehicle-data-table-wrapper.tsx - Client wrapper
'use client';

import { VehicleDataTable } from './vehicle-data-table';
import { Vehicle } from '../server/actions/vehicle';

interface VehicleDataTableWrapperProps {
  vehicles: Vehicle[];
}

export function VehicleDataTableWrapper({ vehicles }: VehicleDataTableWrapperProps) {
  return <VehicleDataTable data={vehicles} columns={vehicleColumns} />;
}

// app/(dash)/vehicle/components/vehicle-data-table.tsx - Actual table
import { DataTable } from '@/components/data-table'; // ✅ Shared generic component
import { vehicleColumns } from './vehicle-columns';

export function VehicleDataTable({ data, columns }) {
  // Vehicle-specific table logic
  return <DataTable data={data} columns={columns} />;
}
```

### 3. Page-Specific vs Shared Component Decision Matrix

| Component Type | Location | Usage | Examples |
|---|---|---|---|
| **Page-Specific Forms** | `app/*/components/` | Single page only | `login-form.tsx`, `vehicle-form.tsx` |
| **Page-Specific Tables** | `app/*/components/` | Single page only | `vehicle-data-table.tsx`, `driver-table.tsx` |
| **Page-Specific Modals** | `app/*/components/` | Single page only | `add-vehicle-modal.tsx`, `edit-driver-modal.tsx` |
| **Generic UI Components** | `components/ui/` | Multiple pages | `button.tsx`, `input.tsx`, `dialog.tsx` |
| **Business Components** | `components/` | Multiple pages | `data-table.tsx`, `search-input.tsx` |
| **Layout Components** | `components/` | Multiple pages | `sidebar.tsx`, `header.tsx`, `footer.tsx` |

### 4. Import Path Rules

#### ✅ Correct Import Patterns
```typescript
// Page component importing its own components
import { VehicleForm } from './components/vehicle-form';
import { VehicleTable } from './components/vehicle-table';

// Page component importing its own server actions
import { getVehicles, createVehicle } from './server/actions/vehicle';

// Any component importing shared components
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';

// Page component importing shared contexts
import { useAuth } from '@/contexts/auth-context';
import { useQuotation } from '@/contexts/quotation-context';
```

#### ❌ Incorrect Import Patterns
```typescript
// Page component importing from other pages
import { DriverForm } from '../driver/components/driver-form'; // ❌ NO!

// Page component importing other page's server actions
import { getDrivers } from '../driver/server/actions/driver'; // ❌ NO!

// Cross-page component dependencies
import { VehicleList } from '../../vehicle/components/vehicle-list'; // ❌ NO!
```

### 5. Component Communication Patterns

#### When Pages Need to Share Data
Use shared contexts or parent component state:

```typescript
// ✅ CORRECT - Using shared context
// app/(dash)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <QuotationProvider>
      <div className="dashboard-layout">
        <Sidebar />
        <main>{children}</main>
      </div>
    </QuotationProvider>
  );
}

// app/(dash)/vehicle/components/vehicle-card.tsx
import { useQuotation } from '@/contexts/quotation-context'; // ✅ Shared context

export function VehicleCard({ vehicle }) {
  const { addToQuotation } = useQuotation();
  // Component logic
}
```

#### When Pages Need to Navigate with Data
Use URL parameters, search params, or global state:

```typescript
// ✅ CORRECT - Using URL navigation
// app/(dash)/vehicle/components/vehicle-actions.tsx
import { useRouter } from 'next/navigation';

export function VehicleActions({ vehicleId }) {
  const router = useRouter();
  
  const handleEdit = () => {
    router.push(`/vehicle/edit/${vehicleId}`); // ✅ URL-based navigation
  };
}
```

---

## 🔒 Security Best Practices

### 1. Server Action Security
- Always authenticate users before data access
- Implement role-based authorization
- Validate all input data with Zod schemas
- Use TypeScript for type safety

### 2. Token Management
- Secure token storage in HTTP-only cookies
- Automatic token refresh
- Encryption of sensitive data
- Proper session cleanup on logout

### 3. Route Protection
- Middleware-based route protection
- Role-based access control
- Automatic redirects for unauthorized access
- Public route handling

---

## 🧪 Testing Guidelines

### 1. Server Actions Testing
```typescript
// Test authentication
expect(await getFeatureData()).toEqual({
  success: false,
  error: 'User not authenticated'
});

// Test authorization
mockUser({ role: 'customer' });
expect(await getAdminOnlyData()).toEqual({
  success: false,
  error: 'Insufficient permissions'
});
```

### 2. Component Testing
- Test role-based rendering
- Test context integration
- Test user interactions

---

## 📝 Error Handling

### 1. Consistent Error Responses
```typescript
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}
```

### 2. Error Boundary Implementation
- Global error handling
- User-friendly error messages
- Proper error logging

---

## 🔄 State Management Patterns

### 1. Server State
- Use server actions for data fetching
- Implement optimistic updates where appropriate
- Cache management with Next.js

### 2. Client State
- React Context for global state
- Local component state for UI state
- Form state with server actions

---

## 📚 Type Definitions

### Core Types
```typescript
// lib/types.ts
export type UserRole = 'admin' | 'customer' | 'driver' | 'manager' | 'vendor';

export interface User {
  email: string;
  role: string;
  phone_number: string;
}

export interface SessionUser extends User {
  isAuthenticated: boolean;
}
```

---

## 🚀 Deployment Considerations

### Environment Variables
```bash
# Required environment variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
JWT_SECRET=your-secret-key
TOKEN_ENCRYPTION_KEY=your-encryption-key
NODE_ENV=production
```

### Build Optimization
- Static generation where possible
- Dynamic imports for large components
- Image optimization with Next.js Image component

---

## 📋 Code Review Checklist

### Before Submitting Code:
- [ ] Server actions include proper authentication/authorization
- [ ] Components follow server/client pattern correctly
- [ ] TypeScript types are properly defined
- [ ] Error handling is implemented
- [ ] Role-based access is respected
- [ ] API responses follow standard format
- [ ] No sensitive data exposed to client
- [ ] Console logs removed from production code
- [ ] Loading states implemented where needed
- [ ] Form validation with Zod schemas

### Architecture Compliance:
- [ ] Follows established folder structure
- [ ] Uses existing contexts appropriately
- [ ] Implements consistent error handling
- [ ] Maintains type safety throughout
- [ ] Respects authentication patterns
- [ ] Uses established API patterns

---

## 🔄 Common Patterns

### 1. Adding a New Feature with Isolation
Follow this step-by-step process for creating isolated features:

#### Step 1: Create Directory Structure
```bash
mkdir -p app/(dash)/feature-name/components
mkdir -p app/(dash)/feature-name/server/actions
mkdir -p app/(dash)/feature-name/server/helpers
```

#### Step 2: Implement Server Actions
```typescript
// app/(dash)/feature-name/server/actions/feature.ts
'use server';

// for authenticated API requests
import { authAPIGet, authAPIPost, authAPIPut, authAPIPatch, authAPIDelete } from '@/lib/api';
// for public API requests
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '@/lib/api';


export interface FeatureData {
  id: string;
  name: string;
  // ... feature-specific fields
}

export async function getFeatureData(): Promise<ApiResponse<FeatureData[]>> {
  // Implementation following the server action template
}

export async function createFeatureData(data: Partial<FeatureData>): Promise<ApiResponse<FeatureData>> {
  // Implementation following the server action template
}
```

#### Step 3: Create Page-Specific Components
```typescript
// app/(dash)/feature-name/components/feature-form.tsx
'use client';

import { Button } from '@/components/ui/button';  // ✅ Shared UI
import { createFeatureData } from '../server/actions/feature'; // ✅ Same page action

export function FeatureForm() {
  // Feature-specific form logic
}

// app/(dash)/feature-name/components/feature-table.tsx
'use client';

import { DataTable } from '@/components/data-table'; // ✅ Shared component
import { FeatureData } from '../server/actions/feature';

export function FeatureTable({ data }: { data: FeatureData[] }) {
  // Feature-specific table logic
}
```

#### Step 4: Implement Main Page
```typescript
// app/(dash)/feature-name/page.tsx
import { getFeatureData } from './server/actions/feature';
import { FeatureForm } from './components/feature-form';
import { FeatureTable } from './components/feature-table';

export default async function FeaturePage() {
  const response = await getFeatureData();
  
  return (
    <div>
      <h1>Feature Management</h1>
      <FeatureForm />
      <FeatureTable data={response.data || []} />
    </div>
  );
}
```

#### Step 5: Add Route Permissions
```typescript
// middleware.ts
const routePermissions: Record<string, UserRole[]> = {
  // ... existing routes
  '/feature-name': ['admin', 'manager', 'vendor'], // Add new route
};
```

#### Step 6: Update Navigation (if needed)
```typescript
// components/app-sidebar.tsx - Only if it's a main navigation item
const navGroups: NavGroup[] = [
  {
    label: "MAIN MENU",
    items: [
      // ... existing items
      {
        title: "Feature Name",
        url: "/feature-name",
        icon: IconFeature,
        roles: ['admin', 'manager', 'vendor'],
      },
    ],
  },
];
```

### 2. Adding Role-Based Features with Isolation

#### Step 1: Define Role-Specific Permissions
```typescript
// app/(dash)/feature-name/server/actions/feature.ts
export async function getFeatureData(): Promise<ApiResponse<FeatureData[]>> {
  const user = await AuthManager.getCurrentUser();
  
  // Role-specific logic
  if (user.role === 'vendor') {
    // Return only vendor's data
    const response = await authGet<FeatureData[]>('api/vendor/features');
  } else if (['admin', 'manager'].includes(user.role)) {
    // Return all data
    const response = await authGet<FeatureData[]>('api/admin/features');
  }
  
  return response;
}
```

#### Step 2: Implement Role-Based UI
```typescript
// app/(dash)/feature-name/components/feature-header.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';

export function FeatureHeader() {
  const { user } = useAuth();
  
  return (
    <div>
      <h1>
        {user?.role === 'vendor' ? 'My Features' : 'All Features'}
      </h1>
      
      {['admin', 'manager'].includes(user?.role) && (
        <AdminOnlyActions />
      )}
    </div>
  );
}
```

### 3. Context Integration with Isolation

#### Using Shared Context in Page-Specific Components
```typescript
// app/(dash)/feature-name/components/feature-card.tsx
'use client';

import { useQuotation } from '@/contexts/quotation-context'; // ✅ Shared context
import { FeatureData } from '../server/actions/feature';        // ✅ Same page types

export function FeatureCard({ feature }: { feature: FeatureData }) {
  const { addToQuotation, isSelected } = useQuotation();
  
  // Component logic using shared context but page-specific data
}
```

### 4. Data Flow Patterns

#### Page-to-Page Communication
```typescript
// ✅ CORRECT - Through shared context
// app/(dash)/quotation/page.tsx
import { useQuotation } from '@/contexts/quotation-context';

export function QuotationPage() {
  const { currentQuotation } = useQuotation(); // Data from other pages
}

// ✅ CORRECT - Through URL parameters
// app/(dash)/feature/edit/[id]/page.tsx
export default async function EditFeaturePage({ params }: { params: { id: string } }) {
  const response = await getFeatureById(params.id);
  // Use URL parameter to get specific data
}
```

#### Parent-Child Communication Within Page
```typescript
// app/(dash)/feature/page.tsx
import { FeatureList } from './components/feature-list';
import { FeatureFilters } from './components/feature-filters';

export default function FeaturePage() {
  return (
    <div>
      <FeatureFilters /> {/* Child component */}
      <FeatureList />    {/* Child component */}
    </div>
  );
}

// app/(dash)/feature/components/feature-list.tsx
'use client';

import { useState } from 'react';

export function FeatureList() {
  const [filters, setFilters] = useState({});
  // Local state management within page scope
}
```

### 5. Testing Patterns with Isolation

#### Page-Specific Component Testing
```typescript
// app/(dash)/feature/components/__tests__/feature-form.test.tsx
import { render, screen } from '@testing-library/react';
import { FeatureForm } from '../feature-form';

describe('FeatureForm', () => {
  it('renders feature form correctly', () => {
    render(<FeatureForm />);
    // Test page-specific component in isolation
  });
});
```

#### Server Action Testing
```typescript
// app/(dash)/feature/server/actions/__tests__/feature.test.ts
import { getFeatureData } from '../feature';

describe('Feature Server Actions', () => {
  it('requires authentication', async () => {
    const result = await getFeatureData();
    expect(result.success).toBe(false);
    expect(result.error).toBe('User not authenticated');
  });
});
```

### 6. Migration Pattern for Existing Code

#### Converting to Isolated Structure
```typescript
// Before: Mixed components
components/
├── vehicle-form.tsx
├── driver-form.tsx
└── shared-table.tsx

// After: Isolated structure
app/(dash)/vehicle/
├── components/
│   └── vehicle-form.tsx
app/(dash)/driver/
├── components/
│   └── driver-form.tsx
components/
└── data-table.tsx  // Renamed and made generic
```

#### Update Import Paths
```typescript
// Before
import { VehicleForm } from '@/components/vehicle-form';

// After  
import { VehicleForm } from './components/vehicle-form';
```

---

## 🆘 Troubleshooting

### Common Issues:
1. **Authentication Errors**: Check token expiration and refresh logic
2. **Role Access Issues**: Verify middleware permissions and server action authorization
3. **Type Errors**: Ensure proper interface definitions and imports
4. **Context Issues**: Check provider hierarchy and context usage
5. **Server Action Errors**: Verify 'use server' directive and import paths

### Debug Tools:
- Browser developer tools for client-side debugging
- Server logs for server action debugging
- Network tab for API request inspection
- React Developer Tools for context inspection

---

This documentation should be updated as the project evolves. Always maintain consistency with established patterns and practices.
