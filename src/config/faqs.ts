import { newcastle, harrogate } from "./locations";

export interface FaqItem { question: string; answer: string; link?: { label: string; href: string } }
export const newcastleFaqs: FaqItem[] = [
  { question: "What is NIPO Newcastle?", answer: "NIPO Newcastle is a Japanese-Brazilian restaurant on Newcastle Quayside, shaped by sushi craft, cooking over fire and warm hospitality." },
  { question: "Where can I find NIPO Newcastle?", answer: `${newcastle.address.street}, ${newcastle.address.city} ${newcastle.address.postcode}.` },
  { question: "Has RIO closed?", answer: "No, RIO is open as usual and nothing has changed. You’ll still find RIO above us on the first floor at 95 Quayside. NIPO has replaced the former Tomahawk Steakhouse restaurant at this address." },
  { question: "What food will I find at NIPO Newcastle?", answer: "Sushi, small plates, robata-style cooking, picanha and plant-led dishes. Explore our main and dessert menus, with prices and downloadable PDFs." },
  { question: "How do I book a table in Newcastle?", answer: "Choose Book a table on this page to see availability and make your reservation with SevenRooms.", link: { label: "Book your Newcastle table", href: newcastle.bookingUrl } },
  { question: "What are Newcastle’s opening hours?", answer: "NIPO Newcastle is open: " + newcastle.hours.map(hours => hours.label).join("; ") + "." },
  { question: "How do I contact NIPO Newcastle?", answer: `Call ${newcastle.telephoneDisplay} or email ${newcastle.email}.` },
];
export const harrogateFaqs: FaqItem[] = [
  { question: "What is NIPO Harrogate?", answer: "A new Japanese-Brazilian steakhouse coming to Parliament Street. Steak and robata-style cooking take centre stage, alongside sushi craft and warm Brazilian hospitality." },
  { question: "Where will NIPO Harrogate be?", answer: `NIPO Harrogate is coming to ${harrogate.address.street}, ${harrogate.address.city} ${harrogate.address.postcode}. Opening date to be announced.` },
  { question: "Was Tomahawk Steakhouse opening here?", answer: "Tomahawk Steakhouse was originally planned for this location. Those plans have changed, and the team behind its sister brand, Rio Brazilian Steakhouse, will now bring NIPO to Harrogate." },
  { question: "When will NIPO Harrogate open?", answer: "Opening date to be announced. Join the Harrogate VIP list for news as plans take shape." },
  { question: "Can I book a table in Harrogate?", answer: "Reservations are not available yet. Join our Harrogate VIP list to hear when bookings open.", link: { label: "Join the Harrogate VIP list", href: "#newsletter" } },
];
