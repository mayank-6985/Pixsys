// 1. MAIN CATEGORIES (For the initial Products grid view)
export const mainCategories = [
  {
    title: "Control Technology",
    subtitle:
      "Open | Flexible | Easy to use | High performance | High integration",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
  },
  {
    title: "HMI",
    subtitle: "Stable | Safe | Easy to use | Efficient",
    img: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&q=80",
  },
  {
    title: "Servo Drive",
    subtitle: "Automation solution core competitive products",
    img: "https://images.unsplash.com/photo-1622322304918-05240bc1d3a6?auto=format&fit=crop&q=80",
  },
  {
    title: "Servo Motor",
    subtitle: "10 years of stable application with millions of axles",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
  },
  {
    title: "VFDs",
    subtitle:
      "High Performance | High reliability | Vector frequency converter",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
  },
];

export const productMenu = [
  {
    title: "Control Technology",
    sections: [
      {
        subtitle: "PAC/IPC",
        description:
          "Based on an open, compatible, and easy to deploy software and hardware ecosystem, the high-precision and high-speed motion control capabilities are organically combined with efficient information processing capabilities to empower complex industrial scenarios.",
        bannerImg:
          "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80",
        links: [{ name: "Q series", path: "q-series" }],
      },
      {
        subtitle: "PLC",
        description:
          "New generation of autonomous small and medium-sized PLC. Domestic core, independently controllable. Efficient and fast flexible expansion.",
        bannerImg:
          "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80",
        links: [{ name: "M series", path: "m-series" }],
      },
      {
        subtitle: "IO",
        description:
          "Comprehensive input/output modules supporting flexible topology for various industrial automation needs.",
        bannerImg:
          "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80",
        links: [
          { name: "Q series module", path: "q-module" },
          { name: "Q0P/Q1P expansion card", path: "q-expansion" },
          { name: "M series module", path: "m-module" },
          { name: "M series expansion card", path: "m-expansion" },
          { name: "NXE series remote IO", path: "nxe-io" },
        ],
      },
    ],
  },
  {
    title: "HMI",
    sections: [
      {
        subtitle: "V series",
        description:
          "High-definition, responsive human-machine interfaces designed for harsh industrial environments with smart connectivity.",
        bannerImg:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
        links: [
          { name: "V100 series", path: "v100" },
          { name: "V300 series", path: "v300" },
        ],
      },
    ],
  },
];

export const productsBulkData = [


  // Q-Series (PAC/IPC)
  {
    id: 101,
    series: "q-series",
    title: "Q300 PAC Controller",
    desc: "Standard programmable automation controller with built-in EtherCAT.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 102,
    series: "q-series",
    title: "Q500 High-Speed PAC",
    desc: "Advanced motion control supporting up to 64 axes.",
    img: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 103,
    series: "q-series",
    title: "Q700 Industrial PC",
    desc: "Intel Core i7 powered IPC for demanding machine vision and control tasks.",
    img: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 104,
    series: "q-series",
    title: "Q-Edge Gateway",
    desc: "IoT edge gateway connecting Q-series controllers to the cloud.",
    img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80",
    isNew: true,
  },

  {
    id: 110,
    series: "m-series",
    title: "M100 Micro PLC",
    desc: "Ultra-compact PLC for simple automation tasks.",
    img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 111,
    series: "m-series",
    title: "M200 Standard PLC",
    desc: "Versatile controller with scalable IO options.",
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 112,
    series: "m-series",
    title: "M300 Advanced PLC",
    desc: "High-speed processing logic controller for complex automation.",
    img: "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 113,
    series: "m-series",
    title: "M300 Motion Edition",
    desc: "PLC with integrated multi-axis step and direction outputs.",
    img: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80",
    isNew: true,
  },

  {
    id: 120,
    series: "q-module",
    title: "Q-DI32 Digital Input",
    desc: "32-channel isolated digital input module.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 121,
    series: "q-module",
    title: "Q-DO32 Digital Output",
    desc: "32-channel transistor digital output module.",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 122,
    series: "q-expansion",
    title: "Q1P Communications Card",
    desc: "PROFINET master expansion card.",
    img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 123,
    series: "m-module",
    title: "M-AI04 Analog Input",
    desc: "4-channel 16-bit analog input module.",
    img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 124,
    series: "m-module",
    title: "M-AO04 Analog Output",
    desc: "4-channel high-precision analog output module.",
    img: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 125,
    series: "m-expansion",
    title: "M-ETH Ethernet Board",
    desc: "Gigabit Ethernet expansion board for M-series.",
    img: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 126,
    series: "nxe-io",
    title: "NXE-ECAT Coupler",
    desc: "EtherCAT bus coupler for remote IO stations.",
    img: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 127,
    series: "nxe-io",
    title: "NXE-PN Coupler",
    desc: "PROFINET bus coupler for remote IO stations.",
    img: "https://images.unsplash.com/photo-1580584126903-c17d41830450?auto=format&fit=crop&q=80",
    isNew: true,
  },

  {
    id: 201,
    series: "v100",
    title: 'V104 4.3" HMI',
    desc: "Compact human-machine interface for basic operation.",
    img: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 202,
    series: "v100",
    title: 'V107 7" Touch Panel',
    desc: "Industry standard 7-inch resistive touch panel.",
    img: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 203,
    series: "v100",
    title: 'V110 10.1" Touch Panel',
    desc: "Widescreen HMI with multiple COM ports.",
    img: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?auto=format&fit=crop&q=80",
    isNew: false,
  },

  {
    id: 210,
    series: "v300",
    title: 'V307 7" Smart HMI',
    desc: "Capacitive touch HMI with built-in Wi-Fi and MQTT.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 211,
    series: "v300",
    title: 'V310 10.1" Smart HMI',
    desc: "High-resolution display with aluminum bezel.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 212,
    series: "v300",
    title: 'V315 15" Control Center',
    desc: "Large format capacitive touch interface for complex machinery.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 213,
    series: "v300",
    title: 'V321 21" Master Panel',
    desc: "Ultra-wide format HMI for complete plant overview.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    isNew: true,
  },


  {
    id: 301,
    series: "730",
    title: "730-200W Servo Drive",
    desc: "Standard 200W single axis pulse/analog drive.",
    img: "https://images.unsplash.com/photo-1622322304918-05240bc1d3a6?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 302,
    series: "730",
    title: "730-400W Servo Drive",
    desc: "Standard 400W single axis drive with auto-tuning.",
    img: "https://images.unsplash.com/photo-1622322304918-05240bc1d3a6?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 303,
    series: "730",
    title: "730-750W Servo Drive",
    desc: "Standard 750W drive for packaging machinery.",
    img: "https://images.unsplash.com/photo-1622322304918-05240bc1d3a6?auto=format&fit=crop&q=80",
    isNew: false,
  },

  {
    id: 310,
    series: "x-drive",
    title: "X-EtherCAT 400W",
    desc: "Premium EtherCAT network servo drive (400W).",
    img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 311,
    series: "x-drive",
    title: "X-EtherCAT 1kW",
    desc: "Premium EtherCAT network servo drive (1kW).",
    img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 312,
    series: "x-drive",
    title: "X-PROFINET 2kW",
    desc: "Premium PROFINET network servo drive (2kW).",
    img: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80",
    isNew: true,
  },

  {
    id: 320,
    series: "y7s",
    title: "Y7S High-Response 500W",
    desc: "Ultra-fast response drive for semiconductor equipment.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 321,
    series: "y7s",
    title: "Y7S High-Response 1.5kW",
    desc: "Ultra-fast response drive for laser cutting tools.",
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
    isNew: false,
  },

  {
    id: 330,
    series: "730w",
    title: "730W 2-Axis Module",
    desc: "Dual-axis integrated servo controller.",
    img: "https://images.unsplash.com/photo-1563770660-394463dfb12d?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 331,
    series: "730w",
    title: "730W 3-Axis Module",
    desc: "Three-axis integrated servo controller for robotics.",
    img: "https://images.unsplash.com/photo-1563770660-394463dfb12d?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 332,
    series: "730w",
    title: "730W 4-in-1 System",
    desc: "Highly compact 4-axis integrated servo controller.",
    img: "https://images.unsplash.com/photo-1563770660-394463dfb12d?auto=format&fit=crop&q=80",
    isNew: true,
  },


  {
    id: 401,
    series: "x0-motor",
    title: "X0-050 Micro Motor",
    desc: "50W ultra-low inertia servo motor.",
    img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 402,
    series: "x0-motor",
    title: "X0-100 Micro Motor",
    desc: "100W ultra-low inertia servo motor with brake option.",
    img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 403,
    series: "x0-motor",
    title: "X0-200 Micro Motor",
    desc: "200W low inertia servo motor.",
    img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 404,
    series: "x0-motor",
    title: "X0-400 Micro Motor",
    desc: "400W low inertia servo motor, IP65 rated.",
    img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80",
    isNew: false,
  },

  {
    id: 410,
    series: "x2-motor",
    title: "X2-750 Medium Inertia",
    desc: "750W general purpose servo motor.",
    img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 411,
    series: "x2-motor",
    title: "X2-1000 Medium Inertia",
    desc: "1.0kW general purpose servo motor.",
    img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 412,
    series: "x2-motor",
    title: "X2-1500 Medium Inertia",
    desc: "1.5kW general purpose servo motor with 23-bit encoder.",
    img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 413,
    series: "x2-motor",
    title: "X2-3000 Medium Inertia",
    desc: "3.0kW robust general purpose servo motor.",
    img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80",
    isNew: false,
  },

  {
    id: 420,
    series: "x6-motor",
    title: "X6-2000 Heavy Duty",
    desc: "2.0kW high torque motor for CNC applications.",
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 421,
    series: "x6-motor",
    title: "X6-4500 Heavy Duty",
    desc: "4.5kW high torque motor for injection molding.",
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 422,
    series: "x6-motor",
    title: "X6-7500 Heavy Duty",
    desc: "7.5kW maximum torque motor for heavy industrial loads.",
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80",
    isNew: false,
  },

  // E600 Series
  {
    id: 501,
    series: "e600",
    title: "E600-0.75kW Inverter",
    desc: "0.75kW standard vector control VFD.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 502,
    series: "e600",
    title: "E600-1.5kW Inverter",
    desc: "1.5kW standard vector control VFD.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 503,
    series: "e600",
    title: "E600-4.0kW Inverter",
    desc: "4.0kW standard vector control VFD for pumps/fans.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 504,
    series: "e600",
    title: "E600-7.5kW Inverter",
    desc: "7.5kW standard vector control VFD.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80",
    isNew: false,
  },

  // E610 Series
  {
    id: 510,
    series: "e610",
    title: "E610-1.5kW Compact",
    desc: "1.5kW mini VFD for space-constrained cabinets.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80",
    isNew: true,
  },
  {
    id: 511,
    series: "e610",
    title: "E610-2.2kW Compact",
    desc: "2.2kW mini VFD with DIN rail mounting support.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80",
    isNew: true,
  },

  // E630 Series
  {
    id: 520,
    series: "e630",
    title: "E630-11kW Heavy Duty",
    desc: "11kW high-overload VFD for hoists and cranes.",
    img: "https://images.unsplash.com/photo-1622322304918-05240bc1d3a6?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 521,
    series: "e630",
    title: "E630-22kW Heavy Duty",
    desc: "22kW high-overload VFD with built-in braking unit.",
    img: "https://images.unsplash.com/photo-1622322304918-05240bc1d3a6?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 522,
    series: "e630",
    title: "E630-45kW Heavy Duty",
    desc: "45kW heavy industrial inverter.",
    img: "https://images.unsplash.com/photo-1622322304918-05240bc1d3a6?auto=format&fit=crop&q=80",
    isNew: false,
  },
  {
    id: 523,
    series: "e630",
    title: "E630-90kW Heavy Duty",
    desc: "90kW high-capacity variable frequency drive.",
    img: "https://images.unsplash.com/photo-1622322304918-05240bc1d3a6?auto=format&fit=crop&q=80",
    isNew: true,
  },
];
