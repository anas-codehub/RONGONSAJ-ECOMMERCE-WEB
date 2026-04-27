export const DELIVERY_ZONES = {
  dhaka: {
    label: "Dhaka",
    districts: ["Dhaka"],
  },
  subDhaka: {
    label: "Sub Dhaka",
    districts: [
      "Gazipur",
      "Narayanganj",
      "Manikganj",
      "Munshiganj",
      "Narsingdi",
      "Savar"
    ],
  },
  outsideDhaka: {
    label: "Outside Dhaka",
    districts: [
      // Chittagong Division
      "Chittagong",
      "Cox's Bazar",
      "Comilla",
      "Noakhali",
      "Feni",
      "Lakshmipur",
      "Chandpur",
      "Brahmanbaria",
      // Sylhet Division
      "Sylhet",
      "Moulvibazar",
      "Habiganj",
      "Sunamganj",
      // Rajshahi Division
      "Rajshahi",
      "Bogura",
      "Pabna",
      "Sirajganj",
      "Natore",
      "Naogaon",
      "Chapai Nawabganj",
      "Joypurhat",
      // Khulna Division
      "Khulna",
      "Jessore",
      "Satkhira",
      "Bagerhat",
      "Narail",
      "Magura",
      "Jhenaidah",
      "Kushtia",
      "Chuadanga",
      "Meherpur",
      // Barishal Division
      "Barishal",
      "Patuakhali",
      "Pirojpur",
      "Jhalokati",
      "Bhola",
      "Barguna",
      // Rangpur Division
      "Rangpur",
      "Dinajpur",
      "Kurigram",
      "Gaibandha",
      "Nilphamari",
      "Lalmonirhat",
      "Thakurgaon",
      "Panchagarh",
      // Mymensingh Division
      "Mymensingh",
      "Jamalpur",
      "Sherpur",
      "Netrokona",
      // Dhaka Division (outside main Dhaka)
      "Faridpur",
      "Gopalganj",
      "Madaripur",
      "Shariatpur",
      "Rajbari",
      "Kishoreganj",
      "Tangail",
    ],
  },
};

export const ALL_DISTRICTS = [
  ...DELIVERY_ZONES.dhaka.districts,
  ...DELIVERY_ZONES.subDhaka.districts,
  ...DELIVERY_ZONES.outsideDhaka.districts,
].sort();

export function getDeliveryZone(district: string): "dhaka" | "subDhaka" | "outsideDhaka" {
  if (DELIVERY_ZONES.dhaka.districts.includes(district)) return "dhaka";
  if (DELIVERY_ZONES.subDhaka.districts.includes(district)) return "subDhaka";
  return "outsideDhaka";
}

export function getDeliveryCharge(
  district: string,
  settings: { insideDhaka: number; subDhaka: number; outsideDhaka: number }
): number {
  const zone = getDeliveryZone(district);
  if (zone === "dhaka") return settings.insideDhaka;
  if (zone === "subDhaka") return settings.subDhaka;
  return settings.outsideDhaka;
}

export function getZoneLabel(district: string): string {
  const zone = getDeliveryZone(district);
  if (zone === "dhaka") return "Dhaka";
  if (zone === "subDhaka") return "Sub Dhaka";
  return "Outside Dhaka";
}