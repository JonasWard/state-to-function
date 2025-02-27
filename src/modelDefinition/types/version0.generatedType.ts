import { DataType } from 'url-safe-bitpacking'
import { AttributeNames } from '../enums/attributeNames'

export type ColorType = {
  ['R']: {
    value: number
    name: 'R'
    type: DataType.INT
    min: 0
    max: 255
    bits: 8
  }
  ['G']: {
    value: number
    name: 'G'
    type: DataType.INT
    min: 0
    max: 255
    bits: 8
  }
  ['B']: {
    value: number
    name: 'B'
    type: DataType.INT
    min: 0
    max: 255
    bits: 8
  }
}

export type ExtrusionSquareValue = {
  ['Upper Inset']: {
    value: number
    name: 'Upper Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Bottom Inset']: {
    value: number
    name: 'Bottom Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Side Inset']: {
    value: number
    name: 'Side Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
}

export type ExtrusionArcValue = {
  ['Upper Radius']: {
    value: number
    name: 'Upper Radius'
    type: DataType.FLOAT
    min: 0.2
    max: 1
    precision: 2
    significand: 7
  }
  ['Upper Inset']: {
    value: number
    name: 'Upper Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Bottom Inset']: {
    value: number
    name: 'Bottom Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Side Inset']: {
    value: number
    name: 'Side Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
}

export type ExtrusionEllipseValue = {
  ['Upper Radius']: {
    value: number
    name: 'Upper Radius'
    type: DataType.FLOAT
    min: 0.2
    max: 1
    precision: 2
    significand: 7
  }
  ['Upper Inset']: {
    value: number
    name: 'Upper Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Bottom Inset']: {
    value: number
    name: 'Bottom Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Side Inset']: {
    value: number
    name: 'Side Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
}

export type ExtrusionGothicValue = {
  ['Upper Radius']: {
    value: number
    name: 'Upper Radius'
    type: DataType.FLOAT
    min: 0.2
    max: 1
    precision: 2
    significand: 7
  }
  ['Upper Inset']: {
    value: number
    name: 'Upper Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Bottom Inset']: {
    value: number
    name: 'Bottom Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Side Inset']: {
    value: number
    name: 'Side Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Pointedness']: {
    value: number
    name: 'Pointedness'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
}

export type ExtrusionNestedValue = {
  ['Upper Radius']: {
    value: number
    name: 'Upper Radius'
    type: DataType.FLOAT
    min: 0.2
    max: 1
    precision: 2
    significand: 7
  }
  ['Upper Inset']: {
    value: number
    name: 'Upper Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Bottom Inset']: {
    value: number
    name: 'Bottom Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Side Inset']: {
    value: number
    name: 'Side Inset'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Pointedness']: {
    value: number
    name: 'Pointedness'
    type: DataType.FLOAT
    min: 0.1
    max: 0.5
    precision: 2
    significand: 6
  }
  ['Arch Resolution']: {
    value: number
    name: 'Arch Resolution'
    type: DataType.FLOAT
    min: 0
    max: 1
    precision: 2
    significand: 7
  }
  ['Divisons']: {
    value: number
    name: 'Divisons'
    type: DataType.INT
    min: 1
    max: 10
    bits: 4
  }
  ['Division Resolution']: {
    value: number
    name: 'Division Resolution'
    type: DataType.INT
    min: 1
    max: 32
    bits: 5
  }
}

export type FootprintSquare = {
  ['Size']: {
    value: number
    name: 'Size'
    type: DataType.FLOAT
    min: 40
    max: 120
    precision: 0
    significand: 7
  }
}

export type FootprintGridType = {
  ['Size']: {
    value: number
    name: 'Size'
    type: DataType.FLOAT
    min: 8
    max: 120
    precision: 0
    significand: 7
  }
  ['X Count']: {
    value: number
    name: 'X Count'
    type: DataType.INT
    min: 1
    max: 16
    bits: 4
  }
  ['Y Count']: {
    value: number
    name: 'Y Count'
    type: DataType.INT
    min: 1
    max: 16
    bits: 4
  }
  ['Shell Thickness']: {
    value: number
    name: 'Shell Thickness'
    type: DataType.ENUM
    max: 3
    bits: 2
  }
  ['Inner Buffer']: {
    value: number
    name: 'Inner Buffer'
    type: DataType.FLOAT
    min: 0
    max: 10
    precision: 1
    significand: 7
  }
  ['Outer Buffer']: {
    value: number
    name: 'Outer Buffer'
    type: DataType.FLOAT
    min: 0
    max: 10
    precision: 1
    significand: 7
  }
}

export type FootprintCylinderType = {
  ['Inner Buffer']: {
    value: number
    name: 'Inner Buffer'
    type: DataType.FLOAT
    min: 0
    max: 10
    precision: 1
    significand: 7
  }
  ['Outer Buffer']: {
    value: number
    name: 'Outer Buffer'
    type: DataType.FLOAT
    min: 0
    max: 10
    precision: 1
    significand: 7
  }
  ['Segments']: {
    value: number
    name: 'Segments'
    type: DataType.INT
    min: 3
    max: 20
    bits: 5
  }
  ['Radii']:
    | {
        s: {
          value: 1
          name: 'Radii'
          type: DataType.INT
          min: 1
          max: 10
          bits: 4
        }
        v: [
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          }
        ]
      }
    | {
        s: {
          value: 2
          name: 'Radii'
          type: DataType.INT
          min: 1
          max: 10
          bits: 4
        }
        v: [
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          }
        ]
      }
    | {
        s: {
          value: 3
          name: 'Radii'
          type: DataType.INT
          min: 1
          max: 10
          bits: 4
        }
        v: [
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          }
        ]
      }
    | {
        s: {
          value: 4
          name: 'Radii'
          type: DataType.INT
          min: 1
          max: 10
          bits: 4
        }
        v: [
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          }
        ]
      }
    | {
        s: {
          value: 5
          name: 'Radii'
          type: DataType.INT
          min: 1
          max: 10
          bits: 4
        }
        v: [
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          }
        ]
      }
    | {
        s: {
          value: 6
          name: 'Radii'
          type: DataType.INT
          min: 1
          max: 10
          bits: 4
        }
        v: [
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          }
        ]
      }
    | {
        s: {
          value: 7
          name: 'Radii'
          type: DataType.INT
          min: 1
          max: 10
          bits: 4
        }
        v: [
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          }
        ]
      }
    | {
        s: {
          value: 8
          name: 'Radii'
          type: DataType.INT
          min: 1
          max: 10
          bits: 4
        }
        v: [
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          }
        ]
      }
    | {
        s: {
          value: 9
          name: 'Radii'
          type: DataType.INT
          min: 1
          max: 10
          bits: 4
        }
        v: [
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          },
          {
            ['Radii']: {
              value: number
              name: 'Radii'
              type: DataType.FLOAT
              min: 1
              max: 20
              precision: 1
              significand: 8
            }
          }
        ]
      }
}

export type FootprintMalculmiusOne = {
  ['Circle Radius']: {
    value: number
    name: 'Circle Radius'
    type: DataType.FLOAT
    min: 10
    max: 55
    precision: 1
    significand: 9
  }
  ['Circle Divisions']: {
    value: number
    name: 'Circle Divisions'
    type: DataType.INT
    min: 3
    max: 20
    bits: 5
  }
  ['Split Angle']: {
    value: number
    name: 'Split Angle'
    type: DataType.FLOAT
    min: 0.1
    max: 0.9
    precision: 2
    significand: 7
  }
  ['Offset A']: {
    value: number
    name: 'Offset A'
    type: DataType.FLOAT
    min: -20
    max: 20
    precision: 1
    significand: 9
  }
  ['Offset B']: {
    value: number
    name: 'Offset B'
    type: DataType.FLOAT
    min: -20
    max: 20
    precision: 1
    significand: 9
  }
  ['Inner Radius']: {
    value: number
    name: 'Inner Radius'
    type: DataType.FLOAT
    min: 4
    max: 40
    precision: 1
    significand: 9
  }
}

export type HeightsSineType = {
  ['Maximum Amplitude']: {
    value: number
    name: 'Maximum Amplitude'
    type: DataType.FLOAT
    min: 0
    max: 15
    precision: 1
    significand: 8
  }
  ['Minimum Amplitude']: {
    value: number
    name: 'Minimum Amplitude'
    type: DataType.FLOAT
    min: 0
    max: 5
    precision: 2
    significand: 9
  }
  ['Period']: {
    value: number
    name: 'Period'
    type: DataType.FLOAT
    min: 0.2
    max: 200
    precision: 1
    significand: 11
  }
  ['Phase Shift']: {
    value: number
    name: 'Phase Shift'
    type: DataType.FLOAT
    min: 0
    max: 90
    precision: 1
    significand: 10
  }
}

export type HeightsIncrementalType = {
  ['Total']: {
    value: number
    name: 'Total'
    type: DataType.FLOAT
    min: 10
    max: 200
    precision: -1
    significand: 5
  }
  ['Linear Twist']: {
    value: number
    name: 'Linear Twist'
    type: DataType.FLOAT
    min: 0
    max: 15
    precision: 2
    significand: 11
  }
}

export type Version0Type = {
  ['Viewport']: {
    ['Orbit Control Target']: {
      ['X']: { value: number; name: 'X'; type: DataType.FLOAT; min: -1; max: 1; precision: 3; significand: 11 }
      ['Y']: { value: number; name: 'Y'; type: DataType.FLOAT; min: -1; max: 1; precision: 3; significand: 11 }
      ['Z']: { value: number; name: 'Z'; type: DataType.FLOAT; min: -1; max: 1; precision: 3; significand: 11 }
      ['W']: { value: number; name: 'W'; type: DataType.FLOAT; min: -1; max: 1; precision: 3; significand: 11 }
    }
    ['Camera Position']: {
      ['X']: { value: number; name: 'X'; type: DataType.FLOAT; min: -1000; max: 1000; precision: 1; significand: 15 }
      ['Y']: { value: number; name: 'Y'; type: DataType.FLOAT; min: -1000; max: 1000; precision: 1; significand: 15 }
      ['Z']: { value: number; name: 'Z'; type: DataType.FLOAT; min: -1000; max: 1000; precision: 1; significand: 15 }
    }
    ['Camera Angle']: {
      value: number
      name: 'Camera Angle'
      type: DataType.FLOAT
      min: -180
      max: 180
      precision: 1
      significand: 12
    }
    ['Radius']: {
      value: number
      name: 'Radius'
      type: DataType.FLOAT
      min: -1000
      max: 1000
      precision: 1
      significand: 15
    }
  }
  ['Global Geometry']: {
    ['subDivisions']: { value: number; name: 'subDivisions'; type: DataType.INT; min: 0; max: 6; bits: 3 }
    ['smoothing']: {
      value: number
      name: 'smoothing'
      type: DataType.FLOAT
      min: 0
      max: 1
      precision: 3
      significand: 10
    }
    ['expression']: {
      value: number
      name: 'expression'
      type: DataType.FLOAT
      min: 0.025
      max: 5
      precision: 3
      significand: 13
    }
  }
  ['Lamp Shades']:
    | {
        s: { value: 0; name: 'Lamp Shades'; type: DataType.ENUM; max: 3; bits: 2 }
        v: {
          ['h']: { value: number; name: 'h'; type: DataType.FLOAT; min: 40; max: 240; precision: 1; significand: 11 }
          ['HasBase']:
            | {
                s: { value: true; name: 'HasBase'; type: DataType.BOOLEAN }
                v: {}
              }
            | {
                s: { value: false; name: 'HasBase'; type: DataType.BOOLEAN }
                v: {
                  ['inset']: { value: number; name: 'inset'; type: DataType.INT; min: 5; max: 50; bits: 6 }
                  ['h-base']: { value: number; name: 'h-base'; type: DataType.INT; min: 5; max: 50; bits: 6 }
                  ['baseAngle']: { value: number; name: 'baseAngle'; type: DataType.INT; min: 25; max: 90; bits: 6 }
                }
              }
          ['w']: { value: number; name: 'w'; type: DataType.FLOAT; min: 30; max: 150; precision: 1; significand: 11 }
          ['d']: { value: number; name: 'd'; type: DataType.FLOAT; min: 30; max: 150; precision: 1; significand: 11 }
          ['edgeSmoothing']: {
            value: number
            name: 'edgeSmoothing'
            type: DataType.FLOAT
            min: 0
            max: 1
            precision: 2
            significand: 7
          }
        }
      }
    | {
        s: { value: 1; name: 'Lamp Shades'; type: DataType.ENUM; max: 3; bits: 2 }
        v: {
          ['h']: { value: number; name: 'h'; type: DataType.FLOAT; min: 50; max: 240; precision: 1; significand: 11 }
          ['inset']: { value: number; name: 'inset'; type: DataType.INT; min: 1; max: 10; bits: 4 }
          ['h-base']: { value: number; name: 'h-base'; type: DataType.INT; min: 1; max: 32; bits: 5 }
          ['r0']: { value: number; name: 'r0'; type: DataType.FLOAT; min: 10; max: 150; precision: 1; significand: 11 }
          ['r1']: { value: number; name: 'r1'; type: DataType.FLOAT; min: 10; max: 150; precision: 1; significand: 11 }
          ['r2']: { value: number; name: 'r2'; type: DataType.FLOAT; min: 10; max: 150; precision: 1; significand: 11 }
        }
      }
    | {
        s: { value: 2; name: 'Lamp Shades'; type: DataType.ENUM; max: 3; bits: 2 }
        v: {
          ['h']: { value: number; name: 'h'; type: DataType.FLOAT; min: 0; max: 1; precision: 2; significand: 7 }
          ['inset']: { value: number; name: 'inset'; type: DataType.INT; min: 1; max: 10; bits: 4 }
          ['h-base']: { value: number; name: 'h-base'; type: DataType.INT; min: 1; max: 32; bits: 5 }
          ['w']: { value: number; name: 'w'; type: DataType.FLOAT; min: 30; max: 150; precision: 1; significand: 11 }
          ['d']: { value: number; name: 'd'; type: DataType.FLOAT; min: 30; max: 150; precision: 1; significand: 11 }
        }
      }
    | {
        s: { value: 3; name: 'Lamp Shades'; type: DataType.ENUM; max: 3; bits: 2 }
        v: {
          ['h']: { value: number; name: 'h'; type: DataType.FLOAT; min: 50; max: 240; precision: 1; significand: 11 }
          ['h-base']: {
            value: number
            name: 'h-base'
            type: DataType.FLOAT
            min: 0
            max: 180
            precision: 1
            significand: 11
          }
          ['sides']: { value: number; name: 'sides'; type: DataType.INT; min: 3; max: 10; bits: 3 }
          ['alcove-percentage']: {
            value: number
            name: 'alcove-percentage'
            type: DataType.FLOAT
            min: -1
            max: 1
            precision: 3
            significand: 11
          }
          ['alcove-expression']: {
            value: number
            name: 'alcove-expression'
            type: DataType.FLOAT
            min: 0
            max: 2
            precision: 2
            significand: 8
          }
          ['w']: { value: number; name: 'w'; type: DataType.FLOAT; min: 30; max: 150; precision: 1; significand: 11 }
        }
      }
  ['Main Methods']:
    | {
        s: { value: 1; name: 'Main Methods'; type: DataType.INT; min: 1; max: 3; bits: 2 }
        v: [
          {
            ['MainMethodEnum']: { value: number; name: 'MainMethodEnum'; type: DataType.ENUM; max: 6; bits: 3 }
            ['MethodScale']: {
              value: number
              name: 'MethodScale'
              type: DataType.FLOAT
              min: 0.001
              max: 1000
              precision: 3
              significand: 20
            }
          },
          {
            ['MainMethodEnum']: { value: number; name: 'MainMethodEnum'; type: DataType.ENUM; max: 6; bits: 3 }
            ['MethodScale']: {
              value: number
              name: 'MethodScale'
              type: DataType.FLOAT
              min: 0.001
              max: 1000
              precision: 3
              significand: 20
            }
          }
        ]
      }
    | {
        s: { value: 2; name: 'Main Methods'; type: DataType.INT; min: 1; max: 3; bits: 2 }
        v: [
          {
            ['MainMethodEnum']: { value: number; name: 'MainMethodEnum'; type: DataType.ENUM; max: 6; bits: 3 }
            ['MethodScale']: {
              value: number
              name: 'MethodScale'
              type: DataType.FLOAT
              min: 0.001
              max: 1000
              precision: 3
              significand: 20
            }
          },
          {
            ['MainMethodEnum']: { value: number; name: 'MainMethodEnum'; type: DataType.ENUM; max: 6; bits: 3 }
            ['MethodScale']: {
              value: number
              name: 'MethodScale'
              type: DataType.FLOAT
              min: 0.001
              max: 1000
              precision: 3
              significand: 20
            }
          },
          {
            ['MainMethodEnum']: { value: number; name: 'MainMethodEnum'; type: DataType.ENUM; max: 6; bits: 3 }
            ['MethodScale']: {
              value: number
              name: 'MethodScale'
              type: DataType.FLOAT
              min: 0.001
              max: 1000
              precision: 3
              significand: 20
            }
          }
        ]
      }
  ['Vertical Profile']:
    | {
        s: { value: true; name: 'Vertical Profile'; type: DataType.BOOLEAN }
        v: {}
      }
    | {
        s: { value: false; name: 'Vertical Profile'; type: DataType.BOOLEAN }
        v: {
          ['reverse']: { value: boolean; name: 'reverse'; type: DataType.BOOLEAN }
          ['edgeSmoothing']: {
            value: number
            name: 'edgeSmoothing'
            type: DataType.FLOAT
            min: 0
            max: 1
            precision: 2
            significand: 7
          }
        }
      }
  ['Material']: {
    ['Normal Material']:
      | {
          s: { value: true; name: 'Normal Material'; type: DataType.BOOLEAN }
          v: {
            ['color']: ColorType
          }
        }
      | {
          s: { value: false; name: 'Normal Material'; type: DataType.BOOLEAN }
          v: {}
        }
  }
  ['Visualization']: {
    ['Wireframe']: { value: boolean; name: 'Wireframe'; type: DataType.BOOLEAN }
    ['Double Sided']: { value: boolean; name: 'Double Sided'; type: DataType.BOOLEAN }
    ['Normals']: { value: boolean; name: 'Normals'; type: DataType.BOOLEAN }
    ['Vertices']: { value: boolean; name: 'Vertices'; type: DataType.BOOLEAN }
  }
}
