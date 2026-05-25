import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(10000, "Content too long"),
  category: z.string().min(1, "Category is required").max(50),
  date: z.string().min(1, "Date is required"),
  image: z.string().nullable().optional().default(null),
  is_pinned: z.boolean().default(false),
  is_published: z.boolean().default(true),
});

export const sermonSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  pastor: z.string().min(1, "Pastor name is required").max(100),
  scripture: z.string().max(200).optional().default(""),
  youtube_url: z.string().max(500).optional().default(""),
  description: z.string().max(5000, "Description too long").optional().default(""),
  thumbnail: z.string().nullable().optional().default(null),
  date: z.string().min(1, "Date is required"),
  is_published: z.boolean().default(true),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(5000, "Description too long").optional().default(""),
  flyer: z.string().nullable().optional().default(null),
  date: z.string().min(1, "Date is required"),
  time: z.string().max(50).optional().default(""),
  location: z.string().max(200).optional().default(""),
  is_published: z.boolean().default(true),
});

export const gallerySchema = z.object({
  caption: z.string().max(500).optional().default(""),
  category: z.string().min(1, "Category is required").max(50),
});

export const homepageContentSchema = z.object({
  section_key: z.string().min(1).max(100),
  title: z.string().min(1, "Title is required").max(200),
  subtitle: z.string().max(500).optional().default(""),
  content: z.string().max(10000).optional().default(""),
  image_url: z.string().optional().nullable().default(null),
  is_active: z.boolean().default(true),
});

export const homepageSettingsSchema = z.object({
  hero_title: z.string().max(500).optional().default(""),
  hero_subtitle: z.string().max(500).optional().default(""),
  weekly_scripture: z.string().max(1000).optional().default(""),
  weekly_scripture_ref: z.string().max(200).optional().default(""),
  pastor_message: z.string().max(10000).optional().default(""),
  announcement_banner: z.string().max(500).optional().default(""),
  announcement_banner_active: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
export type SermonInput = z.infer<typeof sermonSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type HomepageContentInput = z.infer<typeof homepageContentSchema>;
export type HomepageSettingsInput = z.infer<typeof homepageSettingsSchema>;
