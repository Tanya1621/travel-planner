export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "planning" | "upcoming" | "completed";
};
