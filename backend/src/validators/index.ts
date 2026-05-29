import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(["ambassador", "agent"]),
  city: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createListingSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(5000),
  propertyType: z.enum(["house", "land", "flat", "commercial", "other"]),
  listingType: z.enum(["sale", "rent"]),
  rentTier: z.enum(["normal", "damages", "full"]).optional(),
  annualRent: z.number().int().positive().optional(),
  damageDeposit: z.number().int().min(0).optional(),
  maintenanceCharge: z.number().int().min(0).optional(),
  salePrice: z.number().int().positive().optional(),
  category: z.enum(["portfolio", "partnership"]),
  partnerCompany: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  sqft: z.number().int().min(0).optional(),
  assignedAgentId: z.string().uuid().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  propertyType: z.enum(["house", "land", "flat", "commercial", "other"]),
  area: z.string().min(2),
  budget: z.number().int().positive(),
  deadline: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
  notes: z.string().max(2000).optional(),
  assignedToId: z.string().uuid(),
});

export const createInquirySchema = z.object({
  clientName: z.string().min(2).max(100),
  clientContact: z.string().min(5).max(50),
  message: z.string().min(10).max(1000),
});

export const createCustomOrderSchema = z.object({
  propertyType: z.enum(["house", "land", "flat", "commercial", "other"]),
  area: z.string().min(2),
  budget: z.number().int().positive(),
  notes: z.string().max(2000).optional(),
  clientName: z.string().min(2).max(100),
  clientContact: z.string().min(5).max(50),
});

export const topUpSchema = z.object({
  amount: z.number().int().positive().max(10_000_000),
});

export const withdrawSchema = z.object({
  amount: z.number().int().positive(),
  bankName: z.string().min(2).max(100),
  accountNumber: z.string().min(10).max(10),
  accountName: z.string().min(2).max(100),
});

export const setCommissionRateSchema = z.object({
  dealType: z.string().min(2),
  totalRate: z.number().min(0).max(100),
  ambassadorRate: z.number().min(0).max(100),
  agentRate: z.number().min(0).max(100),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  city: z.string().optional(),
  role: z.enum(["ambassador", "agent"]).optional(),
  canCreateTasks: z.boolean().optional(),
  canCloseDeals: z.boolean().optional(),
  isApproved: z.boolean().optional(),
  ambassadorId: z.string().uuid().optional().nullable(),
});
