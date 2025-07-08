export interface InlineButton {
  text: string;
  callback_data?: string;
  url?: string;
}

// BootCamp Button
const bootCampBtn: InlineButton[][] = [
  [{ text: "Pay Fee: $79.99", callback_data: "bootcamp_payment" }],
];

// settingsOptions
const settingsOptions: InlineButton[][] = [
  [{ text: "Naira Price", callback_data: "nairaPrice" }],
  [{ text: "Vip Price (Discount Price)", callback_data: "vipDiscountPrice" }],
  [{ text: "Vip price (Update Price)", callback_data: "vipPrice" }],
  [{ text: "Generate Coupon", callback_data: "generate_coupon" }],
  [
    { text: "Go Back", callback_data: "goback" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

// vipSignalDiscount
const vipSignalDiscount: InlineButton[][] = [
  [{ text: "10 % off", callback_data: "vip_10_%_off" }],
  [{ text: "20 % off", callback_data: "vip_20_%_off" }],
  [{ text: "30 % off", callback_data: "vip_30_%_off" }],
  [{ text: "50 % off", callback_data: "vip_50_%_off" }],
  [{ text: "Reset All", callback_data: "vip_reset_all" }],
  [
    { text: "Go Back", callback_data: "goback" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

// vipSignalOptions function
const vipSignalOptions = (data: any): InlineButton[][] => {
  const { oneMonth, threeMonths, sixMonths, oneYear } = data?.vipDiscountPrice;
  return [
    [
      { text: "VIP Report", callback_data: "vip_report", url: process.env.VIP_REPORT },
    ],
    [{ text: "Check Subscription Status", callback_data: "check_subscription_status" }],
    [
      { text: `Monthly - $${oneMonth}`, callback_data: "one_month" },
      { text: `3 Months - $${threeMonths}`, callback_data: "three_months" },
    ],
    [
      { text: `6 Months - $${sixMonths}`, callback_data: "six_months" },
      { text: `12 Months - $${oneYear}`, callback_data: "twelve_months" },
    ],
    [
      { text: "Go Back", callback_data: "goback" },
      { text: "Main Menu", callback_data: "mainmenu" },
    ],
  ];
};

// generateMenu function
const generateMenu = (adminUserId: number, userId: number): InlineButton[][] => {
  const mainMenuOptions: InlineButton[][] = [
    [{ text: "Vip Signal", callback_data: "vip_signal" }],
    [{ text: "Mentorship", callback_data: "mentorship" }],
    // [{ text: "Fund Management", callback_data: "fund_management" }],
    // [{ text: "3 Days BootCamp", callback_data: "bootcamp" }],
    [{ text: "Partnership", callback_data: "partnership" }],
    [{ text: "Gift", callback_data: "gift_coupon" }],
    [{ text: "FAQ", callback_data: "faq" }],
    [{ text: "Contact Support", url: process.env.CONTACT_SUPPORT }],
  ];
  if (userId === adminUserId) {
    mainMenuOptions.push([{ text: "Settings", callback_data: "settings" }]);
  }
  return mainMenuOptions;
};

// vipPrice
const vipPrice: InlineButton[][] = [
  [
    { text: "1 Month", callback_data: "oneMonth" },
    { text: "3 Months", callback_data: "threeMonth" },
  ],
  [
    { text: "6 Months", callback_data: "sixMonth" },
    { text: "12 Months", callback_data: "oneYear" },
  ],
  [
    { text: "Go Back", callback_data: "goback" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

// paymentMethod
const paymentMethod: InlineButton[][] = [
  [{ text: "USDT", callback_data: "usdt" }],
  [{ text: "BTC", callback_data: "btc" }],
  // [{ text: "Ethereum Payment", callback_data: "erc" }],
  [{ text: "Naira Payment", callback_data: "naira" }],
  // [{ text: "Skrill Payment", callback_data: "skrill" }],
  [{ text: "Foreign Payment", callback_data: "foreign_payment" }],
  [
    { text: "Go Back", callback_data: "goback" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

// mentorshipOption
const mentorshipOption: InlineButton[][] = [
  [
    { text: "Group Mentorship Fee - $300", callback_data: "mentorship_price_list" },
  ],
  [
    { text: "1 - On - 1     Fee - $1100", callback_data: "one_on_one_price_list" },
  ],
  [{ text: "Main Menu", callback_data: "mainmenu" }],
];

// partnershipOption
const partnershipOption: InlineButton[][] = [
  [{ text: "BROKERS", callback_data:"broker" }],
  [{ text: "PROP FIRMS (Comming Soon)", callback_data: "prop_firms" }],
  [{ text: "AFFILIATE (Comming Soon)", callback_data:"affiliate" }],
  [{ text: "Contact Support", url: process.env.CONTACT_SUPPORT }],
  [
    { text: "Go Back", callback_data: "goback" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

// brokerOptions
const brokerOptions: InlineButton[][] = [
  [{ text: "XM", url: process.env.XM_BROKER_URL }],
  [{ text: "EXNESS BROKER", url: process.env.EXNESS_BROKER_URL }],
  [
    { text: "Go Back", callback_data: "goback" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

// propFirmOptions
const propFirmOptions: InlineButton[][] = [
  [{ text: "GOAT FUNDED TRADER", url: process.env.PROP_FIRM_URL }],
  [
    { text: "Go Back", callback_data: "goback" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

// fundManagementTermsOne
const fundManagementTermsOne: InlineButton[][] = [
  [
    { text: "Agree", callback_data: "agree_one" },
    { text: "Disagree", callback_data: "mainmenu" },
  ],
  [
    { text: "Go Back", callback_data: "mainmenu" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

// fundManagementTermsTwo
const fundManagementTermsTwo: InlineButton[][] = [
  [
    { text: "Agree", callback_data: "agree_two" },
    { text: "Disagree", callback_data: "mainmenu" },
  ],
  [
    { text: "Go Back", callback_data: "mainmenu" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

// fundManagementOptionDocs
const fundManagementOptionDocs: InlineButton[][] = [
  [{ text: "Access Fund Management", url: process.env.GOOGLE_DRIVE_LINK }],
  [{ text: "Go Back to Menu", callback_data: "mainmenu" }],
];

// fundManagementOption
const fundManagementOption: InlineButton[][] = [
  [{ text: "$10,000 - $49,000", callback_data:"$10,000 - $49,000" }],
  [{ text: "$50,000 - $1 million", callback_data:"$50,000 - $1 million" }],
  [
    { text: "Go Back", callback_data: "goback" },
    { text: "Main Menu", callback_data: "mainmenu" },
  ],
];

export {
  vipSignalOptions,
  paymentMethod,
  mentorshipOption,
  partnershipOption,
  brokerOptions,
  propFirmOptions,
  fundManagementOption,
  fundManagementTermsOne,
  fundManagementTermsTwo,
  fundManagementOptionDocs,
  bootCampBtn,
  settingsOptions,
  vipSignalDiscount,
  generateMenu,
  vipPrice,
}; 