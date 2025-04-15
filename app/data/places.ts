import { getImagePath } from "../utils/getImagePath";

export interface Place {
  id: number;
  name: string;
  image: string;
  mapsLink: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  features: string[];
  priceRange: string;
  openingHours?: string;
  address?: string;
  featured?: boolean;
}

export const places: Place[] = [
  {
    id: 1,
    name: "The Breeze BSD",
    image: getImagePath("/images/breeze.jpg"),
    mapsLink: "https://maps.app.goo.gl/HeGoPoKg3dhJuSFXA",
    category: "park",
    description: "Taman hiburan outdoor yang nyaman dengan berbagai aktivitas untuk pasangan dan keluarga. Cocok untuk bersantai dan menikmati suasana.",
    rating: 4.5,
    reviewCount: 128,
    features: ["Outdoor", "Family Friendly", "Food Court", "Shopping"],
    priceRange: "Rp. 120.000",
    openingHours: "10:00 - 22:00",
    address: "BSD City, Tangerang Selatan",
    featured: true
  },
  {
    id: 2,
    name: "Happy Puppy Karaoke",
    image: getImagePath("/images/karaoke.jpg"),
    mapsLink: "https://maps.app.goo.gl/nvWQFFjTdtx5yYxe7",
    category: "karaoke",
    description: "Tempat karaoke keluarga dengan ruangan yang nyaman dan koleksi lagu terlengkap. Nikmati waktu bernyanyi bersama pasangan atau teman.",
    rating: 4.3,
    reviewCount: 87,
    features: ["Private Room", "Food & Beverages", "Song Collection"],
    priceRange: "Rp. 120.000",
    openingHours: "11:00 - 02:00",
    address: "Jl. Raya Serpong, Tangerang Selatan"
  },
  {
    id: 3,
    name: "Nako Cafe",
    image: getImagePath("/images/nako.jpg"),
    mapsLink: "https://maps.app.goo.gl/MnxJLDm8wQDUkGY27",
    category: "cafe",
    description: "Cafe dengan suasana cozy yang sempurna untuk kencan. Menyajikan kopi premium dan makanan ringan yang lezat dengan desain interior yang instagramable.",
    rating: 4.7,
    reviewCount: 156,
    features: ["Instagramable", "Outdoor Seating", "Wifi", "Coffee Specialist"],
    priceRange: "Rp. 120.000",
    openingHours: "08:00 - 22:00",
    address: "Jl. Bintaro Utama, Jakarta Selatan",
    featured: true
  },
  {
    id: 4,
    name: "Food Festival",
    image: getImagePath("/images/makan.jpg"),
    mapsLink: "https://goo.gl/maps/L4c8Vt8zoQYoUqWb7",
    category: "food",
    description: "Festival kuliner dengan beragam pilihan makanan lokal dan internasional. Tempat yang sempurna untuk mencoba berbagai macam hidangan bersama pasangan.",
    rating: 4.6,
    reviewCount: 210,
    features: ["Various Cuisines", "Live Music", "Weekend Special", "Local Delicacies"],
    priceRange: "Rp. 120.000",
    openingHours: "11:00 - 22:00",
    address: "Senayan City, Jakarta Pusat"
  }
]; 