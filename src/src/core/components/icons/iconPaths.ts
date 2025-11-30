// سیستم کلی آیکون‌ها - همه در یک جا
export const IconRegistry = {
  // Homepage Icons
  amount: '/icons/homepage/light/amount.svg',
  bankbalance: '/icons/homepage/light/bankbalance.svg',
  creditbalanceamounts: '/icons/homepage/light/creditbalanceamounts.svg',
  currencyrate: '/icons/homepage/light/currencyrate.svg',
  customers: '/icons/homepage/light/customers.svg',
  debitbalanceamounts: '/icons/homepage/light/debitbalanceamounts.svg',
  fundbalance: '/icons/homepage/light/fundbalance.svg',
  infodialoghome: '/icons/homepage/light/infodialoghome.svg',
  payablecheques: '/icons/homepage/light/payablecheques.svg',
  price: '/icons/homepage/light/price.svg',
  receivablecheques: '/icons/homepage/light/receivablecheques.svg',
  salechart: '/icons/homepage/light/salechart.svg',
  salesRevenue: '/icons/homepage/light/salesRevenue.svg',
  soldproducts: '/icons/homepage/light/soldproducts.svg',
  unsettledinvoices: '/icons/homepage/light/unsettledinvoice.svg',
  setting: '/icons/homepage/light/setting.svg',
  lighttheme: '/icons/homepage/light/lighttheme.svg',
  darktheme: '/icons/homepage/light/darktheme.svg',
  arrowLeft: '/icons/homepage/light/arrow-left.svg',
 

  // Sidebar Icons
  home: '/icons/sidebar/light/home.svg',
  sales: '/icons/sidebar/light/sales.svg',
  cheque: '/icons/sidebar/light/cheque.svg',
  availablefunds: '/icons/sidebar/light/availablefunds.svg',
  currencyrates: '/icons/sidebar/light/currencyrates.svg',
  warebalance: '/icons/sidebar/light/warebalance.svg',
  exist: '/icons/sidebar/light/exist.svg',
  user: '/icons/sidebar/light/user.svg',
  password: '/icons/sidebar/light/password.svg',
  falsecheckbox: '/icons/sidebar/light/falsecheckbox.svg',
  truecheckbox: '/icons/sidebar/light/truecheckbox.svg',
  supports: '/icons/sidebar/light/support.svg',
  phone: '/icons/sidebar/light/phone.svg',
  message: '/icons/sidebar/light/message.svg',
  
  // Appbar Icons (آینده)
  notification: '/icons/appbar/light/notification.svg',
  calendar: '/icons/appbar/light/calendar.svg',
  time: '/icons/appbar/light/time.svg',
  sidebar: '/icons/appbar/light/sidebar.svg',
  infodialogdetail: '/icons/appbar/light/infodialogdetail.svg',
  holoo: '/icons/appbar/light/holoo.svg',
  holoodark: '/icons/appbar/dark/holoodark.svg',
  infopopup: '/icons/appbar/light/infopopup.svg',

  
  // Other Icons (آینده)
  backroute: '/icons/other/light/backroute.svg',
  download: '/icons/other/light/download.svg',
  logo: '/icons/other/light/logo.svg',



  // Personality Icons
  MarketBoy: '/icons/other/light/MarketBoy.svg',
  PoliticalCalculator: '/icons/other/light/PoliticalCalculator.svg',
  MasterMind: '/icons/other/light/MasterMind.svg',
  MarketNovator: '/icons/other/light/MarketNovator.svg',
  MarketSavvy: '/icons/other/light/MarketSavvy.svg',
} as const;

// Helper function کلی برای همه آیکون‌ها
export const getIconPath = (iconName: keyof typeof IconRegistry, isDarkMode: boolean = false): string => {
  const basePath = IconRegistry[iconName];
  if (!basePath) return '/icons/default.svg';
  
  return isDarkMode ? basePath.replace('/light/', '/dark/') : basePath;
};

// Type برای TypeScript
export type IconName = keyof typeof IconRegistry;
