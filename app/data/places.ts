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
    name: "The Breeze",
    image: getImagePath("/images/breeze.jpg"),
    mapsLink: "https://maps.app.goo.gl/HeGoPoKg3dhJuSFXA"
  },
  {
    id: 2,
    name: "Nyanyi Nyanyi",
    image: getImagePath("/images/karaoke.jpg"),
    mapsLink: "https://maps.app.goo.gl/nvWQFFjTdtx5yYxe7"
  },
  {
    id: 3,
    name: "Cafe",
    image: getImagePath("/images/nako.jpg"),
    mapsLink: "https://maps.app.goo.gl/MnxJLDm8wQDUkGY27"
  },
  {
    id: 4,
    name: "Hunting makannn",
    image: getImagePath("/images/makan.jpg"),
    mapsLink: "https://goo.gl/maps/L4c8Vt8zoQYoUqWb7"
  }
]; 