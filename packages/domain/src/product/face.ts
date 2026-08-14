export const FACE_COMPONENT_ID = "FACE";
export const FACE_AREA_FIELD = "face.confirmedAreaMm2";

export function faceAreaSquareMeters(areaMm2: number): number {
  return areaMm2 / 1_000_000;
}
