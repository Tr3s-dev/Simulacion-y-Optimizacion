// Define interfaces for RecentCustomerList Component

export interface RecentCustomerListProps {
  title: string;
  description: string;
  data: {
    img: string;
    name: string;
    email: string;
    amount: string;
  }[];
}
