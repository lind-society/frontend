interface sidebarMenuTypes {
  title: string;
  link: string;
}

// Order and names follow the new admin design (Main, Rent, Buy, Home & Villa,
// Property, Activities, Calendar, Customer Reviews); the pages the design does
// not show but the admin still needs come after them.
export const sideBarMenu: sidebarMenuTypes[] = [
  { title: "Main", link: "/main" },
  { title: "Rent Management", link: "/management/rent" },
  { title: "Buy Management", link: "/management/buy" },
  { title: "Home & Villa Management", link: "/management/home-villa" },
  { title: "Property Management", link: "/management/property" },
  { title: "Activities Management", link: "/management/activity" },
  { title: "Calendar", link: "/management/pricing-calendar" },
  { title: "Customer Reviews", link: "/review" },
  { title: "Financial Report", link: "/financial-report" },
  { title: "Order Management", link: "/management/order" },
  { title: "Price Rule Management", link: "/management/price-rule-villa" },
  { title: "Owner Management", link: "/management/owner" },
  { title: "Blog Management", link: "/management/blog" },
  { title: "Inquiries", link: "/inquiries" },
  { title: "WhatsApp", link: "/whatsapp" },
];
