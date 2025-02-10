import { getImagePath } from "../utils/getImagePath";

export interface Place {
  id: number;
  name: string;
  image: string;
  description: string;
  mapsLink: string;
}

export const places: Place[] = [
  {
    id: 1,
    name: "Borobudur Temple",
    image: getImagePath("/images/borobudur.jpg"),
    description: "The largest Buddhist temple in the world, located in Magelang, Central Java.",
    mapsLink: "https://goo.gl/maps/QKQYYZqx6YdNgzjZ6"
  },
  {
    id: 2,
    name: "Raja Ampat",
    image: getImagePath("/images/borobudur.jpg"),
    description: "Beautiful archipelago known for its rich marine biodiversity in West Papua.",
    mapsLink: "https://goo.gl/maps/xMHQgGZ8qH8LFNRP6"
  },
  {
    id: 3,
    name: "Mount Bromo",
    image: getImagePath("/images/borobudur.jpg"),
    description: "An active volcano in East Java known for its spectacular sunrise views.",
    mapsLink: "https://goo.gl/maps/L4c8Vt8zoQYoUqWb7"
  },
  {
    id: 4,
    name: "Tanah Lot",
    image: getImagePath("/images/borobudur.jpg"),
    description: "Ancient Hindu temple perched on a rock formation in Bali.",
    mapsLink: "https://goo.gl/maps/YQxYyZH8xvYKFDFR9"
  },
  {
    id: 5,
    name: "Pink Beach",
    image: getImagePath("/images/borobudur.jpg"),
    description: "Unique pink-sand beach in Komodo National Park.",
    mapsLink: "https://goo.gl/maps/xX3vX8TQQkqhJ7Lz8"
  }
]; 