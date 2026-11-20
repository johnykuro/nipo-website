import { blackFridayPromotion } from "../config/promotions";
import { isSetMenuPromoAllowed } from "./set-menu-schedule";

const campaignEnd = Date.parse(blackFridayPromotion.endsAt);

export function isBlackFridayActive(now = new Date()): boolean {
  return now.getTime() < campaignEnd;
}

export function homepagePromotion(now = new Date()): "black-friday" | "set-menu" | null {
  if (isBlackFridayActive(now)) return "black-friday";
  return isSetMenuPromoAllowed(now) ? "set-menu" : null;
}
