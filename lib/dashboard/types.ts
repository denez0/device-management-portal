export type Device = {
  id: number;
  name: string;
  model: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type SupportRequest = {
  id: number;
  deviceId: number;
  requestType: string;
  description: string;
  status: string;
  createdAt: string;
};

export const REQUEST_TYPES = ["order", "repair", "support"] as const;
