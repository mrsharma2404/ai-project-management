export type Pod = {
  id: string;
  name: string;
  description: string;
  epics: number;
  stories: number;
  tickets: number;
};

export const pods: Pod[] = [
  {
    id: "snd",
    name: "SND",
    description: "Search & Discovery",
    epics: 4,
    stories: 18,
    tickets: 52,
  },
  {
    id: "checkout",
    name: "Checkout",
    description: "Cart, payments & order placement",
    epics: 3,
    stories: 14,
    tickets: 41,
  },
  {
    id: "consumer-post-order",
    name: "Consumer Post Order",
    description: "Order tracking, returns & support",
    epics: 5,
    stories: 21,
    tickets: 63,
  },
  {
    id: "supply-chain",
    name: "Supply Chain",
    description: "Inventory, fulfillment & logistics",
    epics: 4,
    stories: 16,
    tickets: 47,
  },
];
