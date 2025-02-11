import { getImagePath } from "../utils/getImagePath";

export interface Place {
  id: number;
  name: string;
  image: string;
  mapsLink: string;
}

export const places: Place[] = [
  {
    id: 1,
    name: "Mall",
    image: getImagePath("/images/borobudur.jpg"),
    mapsLink: "https://goo.gl/maps/QKQYYZqx6YdNgzjZ6"
  },
  {
    id: 2,
    name: "Raja Ampat",
    image: getImagePath("/images/borobudur.jpg"),
    mapsLink: "https://goo.gl/maps/xMHQgGZ8qH8LFNRP6"
  },
  {
    id: 3,
    name: "Mount Bromo",
    image: getImagePath("/images/borobudur.jpg"),
    mapsLink: "https://goo.gl/maps/L4c8Vt8zoQYoUqWb7"
  },
  {
    id: 4,
    name: "Tanah Lot",
    image: getImagePath("/images/borobudur.jpg"),
    mapsLink: "https://goo.gl/maps/YQxYyZH8xvYKFDFR9"
  },
  {
    id: 5,
    name: "Pink Beach",
    image: getImagePath("/images/borobudur.jpg"),
    mapsLink: "https://goo.gl/maps/xX3vX8TQQkqhJ7Lz8"
  }
]; 