export type Role = "admin" | "member";

export interface Workshop {
  _id: string;
  name: string;
  description: string;
  instructor: string;
  workshopDate: string;
  location: string;
  capacity: number;
  isActive: boolean;
  registrationCount?: number;
}

export interface WorkshopInput {
  name: string;
  description: string;
  instructor: string;
  workshopDate: string;
  location: string;
  capacity: number;
}

export interface UserSummary {
  _id: string;
  name: string;
  email: string;
  tel?: string;
}

export interface Registration {
  _id: string;
  user: UserSummary | string;
  workshop: Workshop | string;
  createdAt: string;
}

export interface ApiList<T> {
  success: boolean;
  count: number;
  data: T[];
}

export interface ApiOne<T> {
  success: boolean;
  data: T;
}

export interface RegisterInput {
  name: string;
  email: string;
  tel: string;
  password: string;
  role: Role;
}
