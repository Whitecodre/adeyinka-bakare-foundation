import { createClient } from "../supabase/server";
import type { Database, TestimonialInsert, TestimonialUpdate } from "../types/database.types";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export async function findAllTestimonials() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*, beneficiaries(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findPublishedTestimonials() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*, beneficiaries(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function findTestimonialById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*, beneficiaries(*)")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createTestimonial(data: TestimonialInsert) {
  const supabase = await createClient();

  const { data: testimonial, error } = await supabase
    .from("testimonials")
    .insert(data)
    .select()
    .single();

  if (error) throw error;

  return testimonial;
}

export async function updateTestimonial(id: string, data: TestimonialUpdate) {
  const supabase = await createClient();

  const { data: testimonial, error } = await supabase
    .from("testimonials")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return testimonial;
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) throw error;
}
