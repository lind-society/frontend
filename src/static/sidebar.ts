interface sidebarMenuTypes {
  title: string;
  link: string;
}

export const sideBarMenu: sidebarMenuTypes[] = [
  { title: "Main", link: "/main" },
  { title: "Buy Management", link: "/management/buy" },
  { title: "Home & Villa Management", link: "/management/home-villa" },
  { title: "Rent Management", link: "/management/rent" },
  { title: "Activity Management", link: "/management/activity" },
  { title: "Order Management", link: "/management/order" },
  { title: "Property Management", link: "/management/property" },
  { title: "Owner Management", link: "/management/owner" },
];
