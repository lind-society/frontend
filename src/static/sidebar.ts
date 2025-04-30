interface sidebarMenuTypes {
  title: string;
  link: string;
}

export const sideBarMenu: sidebarMenuTypes[] = [
  { title: "Main", link: "/main" },
  { title: "Rent Management", link: "/management/rent" },
  { title: "Buy Management", link: "/management/buy" },
  { title: "Home & Villa Management", link: "/management/home-villa" },
  // { title: "Activity Management", link: "/management/activity" },
  { title: "Property Management", link: "/management/property" },
  { title: "Owner Management", link: "/management/owner" },
];
