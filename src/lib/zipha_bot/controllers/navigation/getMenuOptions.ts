import {
  vipSignalOptions,
  generateMenu,
  paymentMethod,
  brokerOptions,
  mentorshipOption,
  partnershipOption,
  fundManagementOption,
  fundManagementTermsOne,
  fundManagementTermsTwo,
  fundManagementOptionDocs,
  propFirmOptions,
  settingsOptions,
  vipSignalDiscount,
  bootCampBtn,
  vipPrice,
} from "../callback_handlers/menuButtons";
import { settingsClass } from "../callback_handlers/settings/settingsClass";

const USER_ID: number = Number(process.env.USER_ID);

interface MenuButton {
  name: string;
  price?: number;
  options: any[][];
}

const menuButtons = (
  userId: number,
  settingsDoc: any,
  discountPrices: any
): MenuButton[] => {
  const { oneMonth, threeMonths, sixMonths, oneYear } = discountPrices;

  return [
    {
      name: "Main Menu",
      options: generateMenu(USER_ID, userId),
    },
    {
      name: "Vip Signal",
      options: vipSignalOptions(settingsDoc),
    },
    {
      name: "1 Month",
      price: oneMonth,
      options: paymentMethod,
    },
    {
      name: "3 Months",
      price: threeMonths,
      options: paymentMethod,
    },
    {
      name: "6 Months",
      price: sixMonths,
      options: paymentMethod,
    },
    {
      name: "12 Months",
      price: oneYear,
      options: paymentMethod,
    },
    {
      name: "Group Mentorship Fee - $300",
      options: paymentMethod,
    },
    {
      name: "1 - On - 1     Fee - $1100",
      options: paymentMethod,
    },
    {
      name: "$10,000 - $49,000",
      options: fundManagementTermsOne,
    },
    {
      name: "$50,000 - $1 million",
      options: fundManagementTermsTwo,
    },
    {
      name: "Agree One $1000",
      options: paymentMethod,
    },
    {
      name: "Agree Two",
      options: fundManagementOptionDocs,
    },
    {
      name: "Prop Firm",
      options: propFirmOptions,
    },
    {
      name: "Fund Management",
      options: fundManagementOption,
    },
    {
      name: "Vip Discount Price",
      options: vipSignalDiscount,
    },
    {
      name: "Vip Prices",
      options: vipPrice,
    },
    {
      name: "Mentorship",
      options: mentorshipOption,
    },
    {
      name: "Partnership",
      options: partnershipOption,
    },
    {
      name: "Broker",
      options: brokerOptions,
    },
    {
      name: "Pay Fee: $79.99",
      options: paymentMethod,
    },
    {
      name: "3 Days BootCamp",
      options: bootCampBtn,
    },
    {
      name: "Settings",
      options: settingsOptions,
    },
  ];
};

const menuOptions = (userId: number): { [key: string]: any[][] } => {
  const settings = settingsClass();
  const settingsDoc = settings.settings;
  const discountPrices = settingsDoc?.vipDiscountPrice;

  return menuButtons(userId, settingsDoc, discountPrices).reduce(
    (menuAcc: { [key: string]: any[][] }, button: MenuButton) => {
      if (button.price) {
        menuAcc[`${button.name} - $${button.price}`] = button.options;
      } else {
        menuAcc[button.name] = button.options;
        
      }
      return menuAcc;
    },
    {}
  );
};

export function getMenuOptions(option: string, userId: number): any[][] {
  const menuResult = menuOptions(userId);
  return menuResult[option] || []; // Return an empty array by default if option is not found
}