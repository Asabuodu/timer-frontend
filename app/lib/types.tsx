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
   _id?: string; 
  id: string;
  title: string;
  duration: Time;
  categories: Category[];
  createdAt: string;
  updatedAt?: string;
};
