export type GuestType = "Individual" | "Couple" | "Family" | "Entourage";

export type PublicWeddingGuest = {
  id: string;
  displayName: string;
  greeting: string;
  reservedSeats: number;
  guestType: GuestType;
  entourageRole?: string;
  childrenPermitted: boolean | null;
};
