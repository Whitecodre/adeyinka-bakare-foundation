/**
 * Official ABF links and contact details, kept in one place.
 * Empty string = not provided yet. Pages show "coming soon" instead of a dead link.
 * Fill these in when ABF supplies them (the site must not invent contact details).
 */
type ExternalLinkKey = "registrationForm" | "enquiryForm" | "whatsappCommunity" | "email" | "phone";

export const externalLinks: Record<ExternalLinkKey, string> = {
  /** The Fellowship registration link (Constitution, Section 3.2). */
  registrationForm: "",
  /** Existing Google Form for volunteers and enquiries (proposal, section 3.9). */
  enquiryForm: "",
  whatsappCommunity: "",
  email: "",
  phone: "",
};
