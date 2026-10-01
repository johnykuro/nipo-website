export interface LocationAddress {
  street: string; city: string; postcode: string;
  directionsUrl?: string; mapEmbedUrl?: string;
}
export interface RestaurantLocation {
  id: "newcastle" | "harrogate";
  name: string; path: string; status: "open" | "coming-soon";
  address: LocationAddress;
  bookingUrl?: string; telephone?: string; telephoneDisplay?: string; email?: string;
  hours?: { days: string[]; opens: string; closes: string; label: string }[];
  opening?: { status: "pre-opening" | "open"; date: string; label: string };
}
export const newcastle = {
  id: "newcastle", name: "Newcastle Quayside", path: "/locations/newcastle/", status: "open",
  bookingUrl: "https://www.sevenrooms.com/app/reservations/nipo/create/search/",
  opening: { status: "open", date: "2026-09-23", label: "23 September 2026" },
  telephone: "+441912221122", telephoneDisplay: "0191 222 1122", email: "newcastle@nipobraza.co.uk",
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "12:00", closes: "21:00", label: "Monday–Thursday, 12 noon–9pm" },
    { days: ["Friday", "Saturday"], opens: "12:00", closes: "22:00", label: "Friday–Saturday, 12 noon–10pm" },
    { days: ["Sunday"], opens: "12:00", closes: "20:00", label: "Sunday, 12 noon–8pm" },
  ],
  address: { street: "95 Quayside", city: "Newcastle upon Tyne", postcode: "NE1 3DH",
    directionsUrl: "https://maps.app.goo.gl/GUKfBrYgQ4VW4P6q8",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8588.484834923209!2d-1.6079837!3d54.9684935!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487e711480fed221%3A0x2d848d4cb06d7693!2sNIPO%20Japanese%20Precision.%20Brazilian%20Fire!5e1!3m2!1sen!2suk!4v1789640284849!5m2!1sen!2suk" },

} satisfies RestaurantLocation;
export const harrogate = {
  id: "harrogate", name: "Harrogate", path: "/locations/harrogate/", status: "coming-soon",
  address: { street: "Parliament St", city: "Harrogate", postcode: "HG1 2RL" },
} satisfies RestaurantLocation;
export const locations: RestaurantLocation[] = [newcastle, harrogate];
export type LocationId = RestaurantLocation["id"];
