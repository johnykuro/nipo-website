import { newcastle } from "./locations";

// Campaign contacts do not change Harrogate's general opening or reservation status.
export const christmasVenues = [
  { id: "newcastle", name: "Newcastle Quayside", email: newcastle.email,
    telephone: newcastle.telephone, telephoneDisplay: newcastle.telephoneDisplay,
    bookingUrl: newcastle.bookingUrl },
  { id: "harrogate", name: "Harrogate", email: "harrogate@nipobraza.co.uk",
    telephone: undefined, telephoneDisplay: undefined, bookingUrl: undefined },
];

export function christmasEnquiryHref(venue: typeof christmasVenues[number], occasion: "dining" | "party" = "dining"): string {
  const subject = `${occasion === "party" ? "Christmas party" : "Festive dining"} enquiry — NIPO ${venue.name}`;
  const body = `Hello NIPO,\r\n\r\nI'd like to enquire about ${occasion === "party" ? "a Christmas party or group meal" : "festive dining"}.\r\n\r\nLocation: ${venue.name}\r\nPreferred date: \r\nPreferred time: \r\nNumber of guests: \r\nName: \r\nContact phone/email: \r\nAnything else you'd like us to know: \r\n\r\nThank you`;
  return `mailto:${venue.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
