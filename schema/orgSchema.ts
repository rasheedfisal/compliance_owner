import { object, string, z } from "zod";

export const createOrgSchema = object({
  name: string().min(1, "Name is required"),
  code: string().min(1, "Code is required"),
  email_domain: string()
    .min(1, "Email is required")
    .email("Email Address is invalid"),
  org_type: z.object({
    label: z.string(),
    value: z.string(),
  }),
  logo: z.custom<File>(),
});

export const updateOrgSchema = object({
  name: string().min(1, "Name is required"),
  code: string().min(1, "Code is required"),
  email_domain: string()
    .min(1, "Email is required")
    .email("Email Address is invalid"),
  org_type: z.object({
    label: z.string(),
    value: z.string(),
  }),
  logo: z.custom<File>().optional(),
}).partial();

export const createRegulatorSchema = object({
  name: string().min(1, "Name is required"),
  email_domain: string()
    .min(1, "Email is required")
    .email("Email Address is invalid"),
  logo: z.custom<File>().optional(),
});

export const updateRegulatorSchema = object({
  name: string().min(1, "Name is required"),
  email_domain: string()
    .min(1, "Email is required")
    .email("Email Address is invalid"),
  logo: z.custom<File>().optional(),
}).partial();
