// ============================================================
//  EDIT THIS FILE to update the whole website.
//  Lines and stations come from your network map.
//  Edit the text below to update the website.
// ============================================================

const SITE = {
  about:
    "Burlington Railways is a fictional railway built in Minecraft, linking the districts of Burlington, Cyanville, Malibou and Centralia.",

  facts: {
    "Founded": "2026",
    "Minecraft version": "1.20.1",
    "Lines": "3",
    "Stations": "10",
    "Districts": "4"
  },

  lines: [
    {
      name: "Centralia",
      color: "#45a039",
      route: "Burlington Union to Centralia",
      length: "",
      type: "Passenger",
      description: "Runs north to south through Burlington and Malibou to the terminus at Centralia.",
      stops: ["Burlington Union", "Grant Ave", "Centralia Street", "Metrodome Plaza", "Malibou", "Centralia"]
    },
    {
      name: "Cyanville",
      color: "#b32b26",
      route: "Station 10 to Cyanville",
      length: "",
      type: "Passenger",
      description: "Heads south through Burlington, then turns west at Metrodome Plaza to serve Cyanville.",
      stops: ["Station 10", "Grant Ave", "Centralia Street", "Metrodome Plaza", "Lincoln Street", "Llama Ave", "Cyanville Street"]
    },
    {
      name: "Malibou",
      color: "#1a9a9a",
      route: "Station 10 to Malibou",
      length: "",
      type: "Passenger",
      description: "Runs from the north end of Burlington down to Malibou.",
      stops: ["Station 10", "Grant Ave", "Centralia Street", "Metrodome Plaza", "Malibou"]
    }
  ],

  stations: [
    { name: "Station 10", lines: ["Cyanville", "Malibou"], district: "Burlington", notes: "Northern terminus for the red and teal lines" },
    { name: "Burlington Union", lines: ["Centralia"], district: "Burlington", notes: "Northern terminus of the Centralia Line" },
    { name: "Grant Ave", lines: ["Centralia", "Cyanville", "Malibou"], district: "Burlington", notes: "" },
    { name: "Centralia Street", lines: ["Centralia", "Cyanville", "Malibou"], district: "Burlington", notes: "" },
    { name: "Metrodome Plaza", lines: ["Centralia", "Cyanville", "Malibou"], district: "Burlington", notes: "Where the Cyanville Line branches west" },
    { name: "Malibou", lines: ["Centralia", "Malibou"], district: "Malibou", notes: "Terminus of the Malibou line" },
    { name: "Centralia", lines: ["Centralia"], district: "Centralia", notes: "Southern terminus" },
    { name: "Lincoln Street", lines: ["Cyanville"], district: "Cyanville", notes: "" },
    { name: "Llama Ave", lines: ["Cyanville"], district: "Cyanville", notes: "" },
    { name: "Cyanville Street", lines: ["Cyanville"], district: "Cyanville", notes: "" }
  ],

  // Fleet
  fleet: [
    {
      name: "Class 423",
      role: "Passenger",
      description: "Comfort and space focused.",
      tags: ["Centralia"]
    },
    {
      name: "Stadler FLIRT",
      role: "Passenger",
      description: "Comfort focused.",
      tags: ["Cyanville", "Malibou"]
    }
  ],

  jobs: {
    intro: "Want to help run Burlington Railways? We're always looking for people to join the team. Fill out the application and we'll get back to you on Discord.",
    applyUrl: "https://forms.gle/sGhKUa3823ztBfed7",
    positions: [
      { title: "Train Operator", description: "Drive passenger trains along the lines and keep services on time.", tags: ["Operations"] },
      { title: "Station Staff", description: "Look after a station, help riders and keep platforms tidy.", tags: ["Stations"] },
      { title: "Builder", description: "Help build and extend track, stations and scenery.", tags: ["Construction"] }
    ]
  },

  ride: [
    "Join our Discord at <a href=\"https://discord.gg/bJqcuM84jG\" target=\"_blank\" rel=\"noopener\">discord.gg/bJqcuM84jG</a> to get the server details and connect with other riders.",
    "Join the server at leightoncounty.play.hosting and head to any station.",
    "Check the line colors on the map: green for Centralia, red for Cyanville, teal for Malibou.",
    "Board at your platform. Metrodome Plaza is the main interchange, and Cyanville riders change there.",
    "Stay in the train until you reach your station.",
    "Keep the tracks clear of items and mobs, and please don't grief the railway."
  ]
};
