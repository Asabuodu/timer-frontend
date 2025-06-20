export type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type Category = {
  id: string;
  name: string;
  duration: Time;
};

export type Schedule = {
  id: string;
  title: string;
  duration: Time;
  categories: Category[];
  createdAt: string;
  updatedAt?: string;
};
