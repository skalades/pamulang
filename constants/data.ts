
import { ControlPoint, LandParcel, AreaHistoryData } from '../types';
import { convertUtmToLatLng } from '../utils/projection';

const rawControlPoints = [
  { id: 1, name: "CP1", northing: 9300061.111, easting: 692698.629, elevation: 72.050, description: "patok 1 (brimob)" },
  { id: 2, name: "CP2", northing: 9299966.575, easting: 692700.167, elevation: 72.069, description: "patok 1 (brimob) 2" },
  { id: 3, name: "CP3", northing: 9299930.841, easting: 692741.713, elevation: 71.523, description: "patok 1 (brimob) 3" },
  { id: 4, name: "CP4", northing: 9299785.324, easting: 692886.232, elevation: 71.373, description: "patok 1 (brimob) 4" },
  { id: 5, name: "CP5", northing: 9299690.043, easting: 693045.123, elevation: 69.951, description: "patok 1 (brimob) 5" },
  { id: 6, name: "CP6", northing: 9299710.052, easting: 693054.961, elevation: 75.442, description: "Pt10" },
  { id: 7, name: "CP7", northing: 9299687.300, easting: 693110.603, elevation: 72.500, description: "Pt9" },
  { id: 8, name: "CP8", northing: 9299664.824, easting: 693147.898, elevation: 74.431, description: "Pt8" },
  { id: 9, name: "CP9", northing: 9299569.938, easting: 693125.557, elevation: 71.807, description: "Pt11" },
  { id: 10, name: "CP10", northing: 9299517.570, easting: 693142.626, elevation: 71.519, description: "Pt12" },
  { id: 11, name: "CP11", northing: 9299496.531, easting: 693071.178, elevation: 70.094, description: "Pt13" },
  { id: 12, name: "CP12", northing: 9299444.544, easting: 693070.092, elevation: 70.821, description: "Pt14" },
  { id: 13, name: "CP13", northing: 9299377.472, easting: 693058.793, elevation: 70.202, description: "Pt15" },
  { id: 14, name: "CP14", northing: 9299380.495, easting: 693030.374, elevation: 70.826, description: "Pt16" },
  { id: 15, name: "CP15", northing: 9299378.671, easting: 692966.190, elevation: 70.201, description: "Pt17" },
  { id: 16, name: "CP16", northing: 9299404.504, easting: 692935.083, elevation: 70.041, description: "patok pamulang barat 10" },
  { id: 17, name: "CP17", northing: 9299460.257, easting: 692909.754, elevation: 71.031, description: "patok pamulang barat 9" },
  { id: 18, name: "CP18", northing: 9299510.076, easting: 692905.256, elevation: 70.705, description: "patok pamulang barat 8" },
  { id: 19, name: "CP19", northing: 9299542.870, easting: 692906.213, elevation: 70.759, description: "patok pamulang barat 7" },
  { id: 20, name: "CP20", northing: 9299554.125, easting: 692889.695, elevation: 70.499, description: "patok 6 pamulang barat" },
  { id: 21, name: "CP21", northing: 9299571.637, easting: 692842.735, elevation: 71.154, description: "Pt7" },
  { id: 22, name: "CP22", northing: 9299596.548, easting: 692772.408, elevation: 72.989, description: "Pt6" },
  { id: 23, name: "CP23", northing: 9299657.146, easting: 692729.046, elevation: 73.176, description: "Pt5" },
  { id: 24, name: "CP24", northing: 9299707.204, easting: 692681.647, elevation: 73.904, description: "Pt4" },
  { id: 25, name: "CP25", northing: 9299748.975, easting: 692626.401, elevation: 74.371, description: "Pt3" },
  { id: 26, name: "CP26", northing: 9299779.408, easting: 692569.044, elevation: 74.611, description: "Pt2" },
  { id: 27, name: "CP27", northing: 9299843.299, easting: 692524.843, elevation: 72.808, description: "Pt1" },
  { id: 28, name: "CP28", northing: 9299852.514, easting: 692564.899, elevation: 72.592, description: "Pt18" },
  { id: 29, name: "CP29", northing: 9299961.987, easting: 692536.961, elevation: 69.552, description: "Pt19" },
  { id: 30, name: "CP30", northing: 9300048.615, easting: 692500.777, elevation: 71.000, description: "Pt21" },
  { id: 31, name: "CP31", northing: 9300044.876, easting: 692542.908, elevation: 69.386, description: "Pt22" },
  { id: 32, name: "CP32", northing: 9300260.481, easting: 692533.495, elevation: 70.018, description: "Pt23" },
  { id: 33, name: "CP33", northing: 9300259.100, easting: 692546.828, elevation: 69.608, description: "patok ciputat 8" },
  { id: 34, name: "CP34", northing: 9300246.722, easting: 692594.330, elevation: 69.290, description: "patok ciputat 9" },
  { id: 35, name: "CP35", northing: 9300230.560, easting: 692621.611, elevation: 69.963, description: "patok ciputat 1" },
  { id: 36, name: "CP36", northing: 9300212.882, easting: 692645.361, elevation: 70.235, description: "patok ciputat 2" },
  { id: 37, name: "CP37", northing: 9300190.268, easting: 692653.322, elevation: 70.517, description: "patok ciputat 3" },
  { id: 38, name: "CP38", northing: 9300190.518, easting: 692670.064, elevation: 71.577, description: "patok ciputat 4" },
  { id: 39, name: "CP39", northing: 9300144.443, easting: 692647.533, elevation: 70.209, description: "patok ciputat 6" },
  { id: 40, name: "CP40", northing: 9300104.734, easting: 692624.128, elevation: 69.360, description: "patok ciputat 7" },
  { id: 41, name: "CP41", northing: 9300080.866, easting: 692654.530, elevation: 69.184, description: "patok ciputat 5" },
  { id: 42, name: "CP42", northing: 9299318.021, easting: 693054.220, elevation: 70.338, description: "Pamulang Timur" },
  { id: 43, name: "CP43", northing: 9299301.801, easting: 693073.106, elevation: 70.497, description: "Pamulang Timur" },
  { id: 44, name: "CP44", northing: 9299256.947, easting: 693075.390, elevation: 70.189, description: "Pamulang Timur" },
  { id: 45, name: "CP45", northing: 9299255.832, easting: 693119.233, elevation: 70.683, description: "Pamulang Timur" },
  { id: 46, name: "CP46", northing: 9299242.132, easting: 693140.601, elevation: 75.312, description: "Pamulang Timur" },
  { id: 47, name: "CP47", northing: 9299166.454, easting: 693135.528, elevation: 71.004, description: "Pamulang Timur" },
  { id: 48, name: "CP48", northing: 9299126.098, easting: 693184.958, elevation: 70.340, description: "Pamulang Timur" },
  { id: 49, name: "CP49", northing: 9299085.401, easting: 693168.293, elevation: 73.036, description: "Pamulang Timur" },
  { id: 50, name: "CP50", northing: 9299080.099, easting: 693189.049, elevation: 71.562, description: "Pamulang Timur" },
  { id: 51, name: "CP51", northing: 9299051.519, easting: 693187.446, elevation: 69.920, description: "Pamulang Timur" },
  { id: 52, name: "CP52", northing: 9299051.394, easting: 693208.035, elevation: 70.044, description: "Pamulang Timur" },
  { id: 53, name: "CP53", northing: 9299086.497, easting: 693255.966, elevation: 69.968, description: "Pamulang Timur" },
  { id: 54, name: "CP54", northing: 9299074.576, easting: 693285.089, elevation: 71.287, description: "Pamulang Timur" },
  { id: 55, name: "CP55", northing: 9299177.708, easting: 693305.810, elevation: 69.905, description: "Pamulang Timur" },
  { id: 56, name: "CP56", northing: 9299198.747, easting: 693317.282, elevation: 70.000, description: "Pamulang Timur" },
  { id: 57, name: "CP57", northing: 9299247.434, easting: 693299.211, elevation: 70.204, description: "Pamulang Timur" },
  { id: 58, name: "CP58", northing: 9299264.057, easting: 693280.102, elevation: 70.335, description: "Pamulang Timur" },
  { id: 59, name: "CP59", northing: 9299260.891, easting: 693223.647, elevation: 69.323, description: "Pamulang Timur" },
  { id: 60, name: "CP60", northing: 9299396.238, easting: 693229.817, elevation: 70.635, description: "Pamulang Timur" },
  { id: 61, name: "CP61", northing: 9299388.992, easting: 693182.067, elevation: 69.904, description: "Pamulang Timur" },
  { id: 62, name: "CP62", northing: 9299479.049, easting: 693186.813, elevation: 70.810, description: "Pamulang Timur" },
  { id: 63, name: "CP63", northing: 9299480.361, easting: 693148.753, elevation: 70.681, description: "Pamulang Timur" }
];

export const controlPointsData: ControlPoint[] = rawControlPoints.map(p => {
    const [lat, lng] = convertUtmToLatLng(p.easting, p.northing);
    return { ...p, lat, lng };
});

export const landParcelsData: LandParcel[] = [
    { id: 1, kodeWilayah: "3674061017", kecamatan: "Pamulang", desaKel: "Bambu Apus", nib: "00255", tipeHak: "Hak Milik", luas: 448, penggunaan: "Bangunan", namaPemilik: "Unknown", buktiKepemilikan: false, patokIds: ["CP29"] },
    { id: 2, kodeWilayah: "3674061018", kecamatan: "Pamulang", desaKel: "Bambu Apus", nib: "00698", tipeHak: "Hak Milik", luas: 2150, penggunaan: "Bangunan", namaPemilik: "Unknown", buktiKepemilikan: false, patokIds: ["CP30", "CP31"] },
    { id: 3, kodeWilayah: "3674041007", kecamatan: "Ciputat", desaKel: "Cipayung", nib: "", tipeHak: "Hak Milik", luas: 4165, penggunaan: "Lahan", namaPemilik: "Unknown", buktiKepemilikan: false, patokIds: ["CP08"] },
    { id: 4, kodeWilayah: "3674041007", kecamatan: "Ciputat", desaKel: "Cipayung", nib: "11842", tipeHak: "Hak Milik", luas: 4995, penggunaan: "Lahan", namaPemilik: "PT. Abdi Duta Karya", buktiKepemilikan: true, patokIds: ["CP09", "CP10"] },
    { id: 5, kodeWilayah: "3674041007", kecamatan: "Ciputat", desaKel: "Cipayung", nib: "02001", tipeHak: "Hak Milik", luas: 1830, penggunaan: "Lahan", namaPemilik: "PT. Abdi Duta Karya", buktiKepemilikan: true, patokIds: ["CP09", "CP10"] },
    { id: 17, kodeWilayah: "3674041001", kecamatan: "Ciputat", desaKel: "Ciputat", nib: "11941", tipeHak: "Hak Guna Bangunan", luas: 52875, penggunaan: "Lahan", namaPemilik: "Unknown", buktiKepemilikan: false, patokIds: ["CP05", "CP06", "CP07", "CP08"] },
    { id: 18, kodeWilayah: "3674041002", kecamatan: "Ciputat", desaKel: "Ciputat", nib: "", tipeHak: "Hak Milik", luas: 535, penggunaan: "Bangunan", namaPemilik: "Setiawan Tanusaputra", buktiKepemilikan: true, patokIds: [] },
    { id: 20, kodeWilayah: "3674061001", kecamatan: "Pamulang", desaKel: "Pamulang Barat", nib: "13843", tipeHak: "Hak Milik", luas: 2089, penggunaan: "Lahan", namaPemilik: "Eddy. AR", buktiKepemilikan: true, patokIds: [] },
    { id: 21, kodeWilayah: "3674061001", kecamatan: "Pamulang", desaKel: "Pamulang Barat", nib: "11712", tipeHak: "Hak Milik", luas: 2670, penggunaan: "Lahan", namaPemilik: "Unknown", buktiKepemilikan: false, patokIds: ["CP39", "CP40", "CP41"] },
    { id: 22, kodeWilayah: "3674061001", kecamatan: "Pamulang", desaKel: "Pamulang Barat", nib: "10192", tipeHak: "Hak Milik", luas: 70000, penggunaan: "Lahan", namaPemilik: "Unknown", buktiKepemilikan: false, patokIds: ["CP22", "CP23", "CP24"] },
    { id: 23, kodeWilayah: "3674061001", kecamatan: "Pamulang", desaKel: "Pamulang Barat", nib: "", tipeHak: "Hak Milik", luas: 1730, penggunaan: "Lahan", namaPemilik: "Eddy. AR", buktiKepemilikan: true, patokIds: ["CP22", "CP23", "CP24"] },
    { id: 24, kodeWilayah: "3674061001", kecamatan: "Pamulang", desaKel: "Pamulang Barat", nib: "13846", tipeHak: "Hak Milik", luas: 1385, penggunaan: "Lahan", namaPemilik: "Eddy. AR", buktiKepemilikan: true, patokIds: ["CP22", "CP23", "CP24"] }
];

export const areaHistoryData: AreaHistoryData[] = [
  { year: '2015', area: 7.6, source: 'Citra Google Earth + Overlay RBI BIG' },
  { year: '2016', area: 13.05, source: 'Citra Google Earth (delineasi manual)' },
  { year: '2020 (awal)', area: 25.02, source: 'Overlay Citra Google Earth + Data SDEW V1.0' },
  { year: '2020 (update)', area: 14.71, source: 'Overlay Citra Google Earth + Update SDEW (Perpres No. 60)' },
  { year: '2023/2024', area: 22, source: 'Overlay Citra Google Earth 2024 + Badan Air RTRWP Banten 2023' },
  { year: '2024', area: 22, source: 'Keputusan Menteri PU No. 3101 Tahun 2024' },
];
