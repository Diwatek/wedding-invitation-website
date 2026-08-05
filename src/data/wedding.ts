export const wedding = {
  couple: {
    firstNames: "Miguel & Camille",
    groom: "Miguel Andres Villanueva",
    bride: "Camille Sofia Reyes",
  },
  date: {
    display: "January 16, 2027",
    weekday: "Saturday",
    ceremonyIsoManila: "2027-01-16T15:00:00+08:00",
    ceremonyTime: "3:00 PM",
    ceremonyFormalTime: "Three o'clock in the afternoon",
    receptionTime: "5:30 PM",
  },
  ceremony: {
    venue: "Grace Covenant Church",
    city: "Iloilo City, Philippines",
  },
  reception: {
    venue: "Garden of Grace Events Hall",
    city: "Iloilo City, Philippines",
  },
  theme: "Modern Filipino Christian garden wedding",
  dressCode:
    "Formal attire in muted earth tones, sage, champagne, dusty blue, or navy",
  dressCodeShort: "Formal attire in muted earth tones",
  tagline: "With joyful hearts, we invite you to celebrate our beginning.",
  memoriesPublished: true,
  disclosure:
    "Miguel and Camille are fictional characters. This wedding website is an independent concept project created by Diwatek.",
} as const;

export const eventTimeline = [
  ["1:30 PM", "Guest arrival"],
  ["2:30 PM", "Ceremony seating"],
  ["3:00 PM", "Wedding ceremony"],
  ["4:30 PM", "Family and entourage pictorial"],
  ["5:30 PM", "Reception and dinner"],
  ["7:00 PM", "Toasts, dances, and program"],
  ["8:30 PM", "Celebration and send-off"],
] as const;

export const guestNotes = [
  "Arrive approximately 30 minutes before the ceremony",
  "Keep mobile devices silent during the wedding rites",
  "Follow the venue's photography guidance",
  "Bring a digital or printed invitation copy",
] as const;

export const weddingEntourage = [
  {
    category: "Parents of the Groom",
    names: ["Mr. and Mrs. Antonio Villanueva"],
  },
  {
    category: "Parents of the Bride",
    names: ["Mr. and Mrs. Eduardo Reyes"],
  },
  {
    category: "Principal Sponsors",
    names: [
      "Mr. Gabriel Ramos and Mrs. Lucia Ramos",
      "Mr. Victor Lim and Mrs. Teresa Lim",
      "Mr. Paolo Herrera and Mrs. Nina Herrera",
      "Mr. Samuel Dizon and Mrs. Corazon Dizon",
    ],
  },
  { category: "Best Man", names: ["Rafael Villanueva"] },
  { category: "Maid of Honor", names: ["Bianca Reyes"] },
  {
    category: "Groomsmen",
    names: ["Marco Santos", "Luis Navarro", "Enrico Del Rosario"],
  },
  {
    category: "Bridesmaids",
    names: ["Patricia Cruz", "Elena Mendoza", "Sophia Alcantara"],
  },
  { category: "Ring Bearer", names: ["Nico Reyes"] },
  { category: "Bible Bearer", names: ["Lucas Villanueva"] },
  { category: "Coin Bearer", names: ["Mateo Garcia"] },
  { category: "Flower Girls", names: ["Amelia Flores", "Isla Ramos"] },
] as const;

export const imageScenes = [
  ["prenup-heritage", "Fictional couple posing in a heritage-inspired Iloilo setting"],
  ["prenup-garden", "Fictional couple posing during a garden prenup portrait"],
  ["prenup-coastal", "Fictional couple during a coastal golden-hour prenup portrait"],
  ["prenup-formal", "Fictional couple in a formal indoor prenup portrait"],
  ["bride-preparation", "Fictional bride preparing before the wedding ceremony"],
  ["groom-preparation", "Fictional groom adjusting his suit before the ceremony"],
  ["wedding-details", "Fictional wedding details with rings, Bible, veil, bouquet, shoes, and suit accents"],
  ["church-exterior", "Fictional church entrance prepared for a Christian wedding ceremony"],
  ["church-aisle", "Fictional bride walking down a church aisle"],
  ["prayer-worship", "Fictional Christian wedding prayer and worship moment"],
  ["exchange-vows", "Fictional couple exchanging vows during a Christian wedding ceremony"],
  ["ring-exchange", "Fictional couple exchanging rings during the ceremony"],
  ["veil-cord-candle", "Fictional Filipino Christian wedding candle, veil, cord, and Bible details"],
  ["couple-pictorial", "Fictional couple posing for a wedding-day garden portrait"],
  ["family-pictorial", "Fictional immediate family wedding portrait"],
  ["entourage-pictorial", "Fictional wedding entourage portrait"],
  ["reception-entrance", "Fictional couple entering a warm garden wedding reception"],
  ["first-dance", "Fictional couple during their first dance at the reception"],
  ["cake-cutting", "Fictional couple cutting a simple wedding cake"],
  ["evening-sendoff", "Fictional couple during an evening wedding send-off"],
  ["wedding-film-poster", "Wedding film preview poster for a fictional Filipino Christian wedding"],
] as const;

export type ImageSceneSlug = (typeof imageScenes)[number][0];

export function imagePath(slug: ImageSceneSlug) {
  return `/images/wedding/${slug}.svg`;
}
