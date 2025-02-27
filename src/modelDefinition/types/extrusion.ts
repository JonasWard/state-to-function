export enum ExtrusionCategory {
  Square,
  Arc,
  Ellipse,
  Gothic,
  Nested,
}

export const mapExtrusionCategory = (c: ExtrusionCategory) => {
  switch (c) {
    case ExtrusionCategory.Square:
      return 'Square';
    case ExtrusionCategory.Arc:
      return 'Arc';
    case ExtrusionCategory.Ellipse:
      return 'Ellips';
    case ExtrusionCategory.Gothic:
      return 'Gothic';
    case ExtrusionCategory.Nested:
      return 'Nested';
  }
};
