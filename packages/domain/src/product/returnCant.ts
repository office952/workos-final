export const RETURN_CANT_COMPONENT_ID = "RETURN_CANT";
export const RETURN_CANT_PERIMETER_FIELD = "returnCant.confirmedPerimeterMm";

export function returnCantLinearMeters(perimeterMm: number): number {
  return perimeterMm / 1000;
}
