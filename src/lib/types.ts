export type UserRole = "admin" | "head" | "ambassador" | "agent" | "client";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  city: string;
  avatar?: string;
  walletBalance: number;
  ambassadorId?: string;
  canCloseDeals?: boolean;
  canCreateTasks?: boolean;
  isVerified?: boolean;
  isApproved?: boolean;
  whatsapp?: string;
}

export type PropertyType = "house" | "land" | "flat" | "commercial" | "other";
export type ListingType = "sale" | "rent" | "outsourcing";
export type RentTier = "rent_only" | "rent_management" | "rent_full";
export type ListingStatus = "available" | "reserved" | "taken" | "ongoing";
export type ListingCategory = "portfolio" | "partnership";
export type PaymentOption = "reservation" | "instalment" | "full";
export type DealStatus = "successful" | "unsuccessful" | "ongoing";

export interface ListingPhoto {
  id: string;
  url: string;
  alt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  rentTier?: RentTier;
  annualRent?: number;
  managementFee?: number;
  inspectionFee?: number;
  damageDeposit?: number;
  maintenanceCharge?: number;
  salePrice?: number;
  price: number;
  paymentOption?: PaymentOption;
  priceLabel: string;
  status: ListingStatus;
  dealStatus?: DealStatus;
  category: ListingCategory;
  partnerCompany?: string;
  outsourcer?: User;
  photos: ListingPhoto[];
  lat: number;
  lng: number;
  address: string;
  city: string;
  postedBy: User;
  assignedAgent?: User;
  createdAt: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  features?: string[];
}

export type TaskStatus = "open" | "in_progress" | "fulfilled" | "closed";
export type TaskSource = "internal" | "client_request";

export interface Task {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  area: string;
  budget: number;
  deadline: string;
  notes: string;
  createdBy: User;
  assignedTo: User;
  status: TaskStatus;
  source: TaskSource;
  submittedListingId?: string;
  comments: TaskComment[];
  createdAt: string;
}

export interface TaskComment {
  id: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface Commission {
  id: string;
  dealId: string;
  dealTitle: string;
  dealType: string;
  totalAmount: number;
  ambassadorRate: number;
  ambassadorCut: number;
  agentRate: number;
  agentCut: number;
  companyCut: number;
  ambassador: User;
  agent: User;
  paidAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "top_up" | "payment" | "commission_payout" | "withdrawal";
  amount: number;
  reference: string;
  method: "wallet" | "card" | "transfer";
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface Inquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  clientName: string;
  clientContact: string;
  message: string;
  assignedAgent?: User;
  status: "new" | "read" | "responded";
  createdAt: string;
}

export interface Reservation {
  id: string;
  listingId: string;
  listingTitle: string;
  clientName: string;
  holdingDeposit: number;
  status: "pending" | "confirmed" | "expired";
  expiresAt: string;
  createdAt: string;
}

export interface CustomOrder {
  id: string;
  propertyType: PropertyType;
  area: string;
  budget: number;
  notes: string;
  clientName: string;
  clientContact: string;
  status: "pending" | "routed" | "fulfilled";
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  listingCount: number;
  agentCount: number;
}
