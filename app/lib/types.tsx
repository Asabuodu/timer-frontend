export type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

export type Category = {
  id: string;
  name: string;
  duration: {
    hours: number;
    minutes: number;
    seconds: number;
  };
};

export type Schedule = {
  _id: string;
  id: string; // For compatibility with Zustand store
  title: string;
  categories: Category[];
  duration: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  createdAt: string;
  updatedAt: string;
};
