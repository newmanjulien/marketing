export type ConversionRow = {
  label: string;
  count: string;
  rate: string;
  curve: string; // decorative sparkline path, drawn in the graphic's 300×70 viewBox
};

export const conversions = [
  {
    label: "Invite → Accepted",
    count: "37",
    rate: "74%",
    curve: "M0 64 C 55 60, 95 30, 150 22 C 205 14, 250 8, 300 3",
  },
  {
    label: "Data connected",
    count: "31",
    rate: "62%",
    curve: "M0 58 C 60 56, 100 48, 150 38 C 205 27, 255 20, 300 12",
  },
  {
    label: "New clients referred",
    count: "28",
    rate: "41%",
    curve:
      "M0 60 C 60 58, 90 44, 140 40 C 175 37, 190 46, 210 42 C 245 35, 270 12, 300 4",
  },
] as const satisfies readonly ConversionRow[];
