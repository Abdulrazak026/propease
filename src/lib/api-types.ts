export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "head" | "ambassador" | "agent";
  city: string | null;
  walletBalance: number;
  canCreateTasks: boolean;
  canCloseDeals: boolean;
  canCreateListings?: boolean;
  canManageUsers?: boolean;
  canManageContent?: boolean;
  canViewAnalytics?: boolean;
  canManageAgreements?: boolean;
  ambassadorId: string | null;
  isApproved: boolean;
  isVerified: boolean;
  whatsapp?: string;
}

export interface ApiAuthResponse {
  accessToken: string;
  user: ApiUser;
  error?: string;
}

export interface ApiListing {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  rentTier?: string;
  annualRent?: number;
  damageDeposit?: number;
  maintenanceCharge?: number;
  price: number;
  status: string;
  category: string;
  address: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  features?: string[];
  lat: number;
  lng: number;
  photos: { id: string; url: string; alt: string }[];
  postedBy: { id: string; name: string };
  assignedAgent?: { id: string; name: string };
  createdAt: string;
}

export interface ApiTask {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  area: string;
  budget: number;
  deadline: string;
  status: string;
  createdBy: { id: string; name: string };
  assignedTo: { id: string; name: string };
  createdAt: string;
}

export interface ApiCommission {
  id: string;
  dealId: string;
  dealTitle: string;
  dealType: string;
  totalAmount: number;
  ambassadorCut: number;
  agentCut: number;
  companyCut: number;
  ambassador: { id: string; name: string };
  agent: { id: string; name: string };
  paidAt: string;
}

export interface ApiInquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  clientName: string;
  clientContact: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface ApiReservation {
  id: string;
  listingId: string;
  listingTitle: string;
  clientName: string;
  holdingDeposit: number;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface ApiCustomOrder {
  id: string;
  propertyType: string;
  area: string;
  budget: number;
  notes: string;
  clientName: string;
  clientContact: string;
  status: string;
  createdAt: string;
}

export interface ApiCity {
  id: string;
  name: string;
  state: string;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiJob {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ApiJobApplication {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  coverNote?: string;
  cvUrl?: string;
  createdAt: string;
}

export interface ApiSoldProperty {
  id: string;
  listingId?: string;
  title: string;
  city: string;
  salePrice: number;
  coverPhoto?: string;
  soldAt: string;
  agentId?: string;
  agentName?: string;
}

export interface ApiAgentDashboard {
  stats: { total: number; inReview: number; live: number; closed: number };
  recent: ApiListing[];
}
