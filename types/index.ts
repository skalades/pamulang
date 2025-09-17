
export interface ControlPoint {
  id: number;
  name: string;
  northing: number;
  easting: number;
  elevation: number;
  description: string;
  lat: number;
  lng: number;
}

export interface LandParcel {
  id: number;
  kodeWilayah: string;
  kecamatan: string;
  desaKel: string;
  nib: string;
  tipeHak: string;
  luas: number;
  penggunaan: string;
  namaPemilik: string;
  buktiKepemilikan: boolean;
  patokIds: string[];
}

export interface AreaHistoryData {
  year: string;
  area: number;
  source: string;
}
