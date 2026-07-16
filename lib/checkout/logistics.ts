export type NairobiDeliveryLocation = {
  code: string;
  label: string;
  fee: number;
  eta: string;
};

export const NAIROBI_DELIVERY_LOCATIONS: NairobiDeliveryLocation[] = [
  { code: "kilimani", label: "Kilimani / Yaya", fee: 250, eta: "45-75 min" },
  { code: "kileleshwa", label: "Kileleshwa", fee: 300, eta: "50-80 min" },
  { code: "lavington", label: "Lavington", fee: 350, eta: "60-90 min" },
  { code: "westlands", label: "Westlands / Parklands", fee: 400, eta: "60-90 min" },
  { code: "ngong-road", label: "Ngong Road / Adams", fee: 320, eta: "50-80 min" },
  { code: "upperhill", label: "Upper Hill", fee: 350, eta: "55-85 min" },
  { code: "south-b", label: "South B", fee: 420, eta: "65-95 min" },
  { code: "south-c", label: "South C", fee: 450, eta: "70-100 min" },
  { code: "langata", label: "Lang'ata", fee: 500, eta: "75-110 min" },
  { code: "kasarani", label: "Kasarani / Roysambu", fee: 650, eta: "90-130 min" },
];

export function getDeliveryLocationByCode(code: string) {
  return NAIROBI_DELIVERY_LOCATIONS.find((location) => location.code === code) ?? null;
}

export function getDeliveryFeeByCode(code: string) {
  return getDeliveryLocationByCode(code)?.fee ?? 0;
}
