import z from "zod";

// Project schemas
export const ProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  theme: z.string().optional(),
  project_type: z.string().optional(),
  user_id: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  theme: z.string().optional(),
  project_type: z.string().optional(),
});

// Content Item schemas
export const ContentItemSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  title: z.string(),
  content_type: z.enum(["post", "video", "landing_page", "image"]),
  platform: z.enum(["instagram", "facebook", "twitter", "youtube", "linkedin"]).optional(),
  content_data: z.string().optional(),
  scheduled_at: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published", "archived"]).default("draft"),
  engagement_estimate: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateContentItemSchema = z.object({
  project_id: z.number().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  content_type: z.enum(["post", "video", "landing_page", "image"]),
  platform: z.enum(["instagram", "facebook", "twitter", "youtube", "linkedin"]).optional(),
  content_data: z.string().optional(),
  scheduled_at: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published", "archived"]).default("draft"),
  engagement_estimate: z.string().optional(),
});

// Template schemas
export const TemplateSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string().optional(),
  template_type: z.string().optional(),
  dimensions: z.string().optional(),
  template_data: z.string().optional(),
  is_premium: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateTemplateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().optional(),
  template_type: z.string().optional(),
  dimensions: z.string().optional(),
  template_data: z.string().optional(),
  is_premium: z.boolean().default(false),
});

// Content generation schemas
export const GenerateContentSchema = z.object({
  themes: z.array(z.string()).min(1, "Pelo menos um tema é obrigatório"),
  content_types: z.array(z.enum(["post", "video", "landing_page", "image"])).optional(),
  platforms: z.array(z.enum(["instagram", "facebook", "twitter", "youtube", "linkedin"])).optional(),
});

// Calendar/Scheduling schemas
export const SchedulePostSchema = z.object({
  content_item_id: z.number(),
  scheduled_at: z.string(),
  platform: z.enum(["instagram", "facebook", "twitter", "youtube", "linkedin"]),
  auto_optimize_time: z.boolean().default(false),
});

// Analytics schemas
export const AnalyticsSchema = z.object({
  period: z.enum(["day", "week", "month", "year"]).default("month"),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  platforms: z.array(z.enum(["instagram", "facebook", "twitter", "youtube", "linkedin"])).optional(),
});

// Type exports
export type ProjectType = z.infer<typeof ProjectSchema>;
export type CreateProjectType = z.infer<typeof CreateProjectSchema>;
export type ContentItemType = z.infer<typeof ContentItemSchema>;
export type CreateContentItemType = z.infer<typeof CreateContentItemSchema>;
export type TemplateType = z.infer<typeof TemplateSchema>;
export type CreateTemplateType = z.infer<typeof CreateTemplateSchema>;
export type GenerateContentType = z.infer<typeof GenerateContentSchema>;
export type SchedulePostType = z.infer<typeof SchedulePostSchema>;
export type AnalyticsType = z.infer<typeof AnalyticsSchema>;

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponseType = z.infer<typeof ApiResponseSchema>;

// Platform configuration
export const PLATFORMS = {
  instagram: {
    name: "Instagram",
    color: "from-pink-500 to-purple-500",
    optimal_times: ["09:00", "18:00", "21:00"],
    max_content_length: 2200,
    supports_video: true,
    supports_carousel: true,
  },
  facebook: {
    name: "Facebook", 
    color: "from-blue-500 to-blue-600",
    optimal_times: ["09:00", "13:00", "15:00"],
    max_content_length: 63206,
    supports_video: true,
    supports_carousel: true,
  },
  twitter: {
    name: "Twitter/X",
    color: "from-blue-400 to-blue-500", 
    optimal_times: ["09:00", "12:00", "18:00"],
    max_content_length: 280,
    supports_video: true,
    supports_carousel: false,
  },
  youtube: {
    name: "YouTube",
    color: "from-red-500 to-red-600",
    optimal_times: ["14:00", "15:00", "20:00"],
    max_content_length: 5000,
    supports_video: true,
    supports_carousel: false,
  },
  linkedin: {
    name: "LinkedIn",
    color: "from-blue-600 to-blue-700",
    optimal_times: ["08:00", "12:00", "17:00"],
    max_content_length: 3000,
    supports_video: true,
    supports_carousel: true,
  },
} as const;

// Content themes
export const CONTENT_THEMES = [
  "Marketing Digital",
  "E-commerce", 
  "Saúde e Bem-estar",
  "Tecnologia",
  "Educação",
  "Imobiliário",
  "Alimentação",
  "Moda e Beleza",
  "Fitness",
  "Finanças",
  "Viagens",
  "Sustentabilidade",
] as const;
