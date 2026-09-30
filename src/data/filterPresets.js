/**
 * 3x3 Convolution Kernels for Interactive Canvas Demonstration
 * Allows real-time mathematical convolution on image pixels to show
 * exactly what convolutional filters extract (edges, textures, gradients).
 */

export const CONVOLUTION_FILTERS = [
  {
    id: 'sobel_horizontal',
    name: 'Sobel Horizontal (Edge)',
    category: 'Edge Detection',
    description: 'Detects sharp horizontal transitions in pixel brightness, highlighting horizontal contours like eye lines, muzzle boundaries, and whiskers.',
    kernel: [
      [-1, -2, -1],
      [ 0,  0,  0],
      [ 1,  2,  1]
    ],
    divisor: 1,
    offset: 128
  },
  {
    id: 'sobel_vertical',
    name: 'Sobel Vertical (Edge)',
    category: 'Edge Detection',
    description: 'Calculates vertical luminance gradients, accentuating vertical boundaries such as pointed ears, nose bridges, and vertical slit pupils.',
    kernel: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ],
    divisor: 1,
    offset: 128
  },
  {
    id: 'laplacian',
    name: 'Laplacian Ridge (Shape)',
    category: 'Shape & Contour',
    description: 'Measures second-order spatial derivatives, isolating high-frequency boundaries and structural outlines irrespective of direction.',
    kernel: [
      [ 0,  1,  0],
      [ 1, -4,  1],
      [ 0,  1,  0]
    ],
    divisor: 1,
    offset: 128
  },
  {
    id: 'sharpen',
    name: 'Sharpen (Texture)',
    category: 'Texture Extraction',
    description: 'Amplifies differences between adjacent pixels, bringing out fine fur textures, whisker filaments, and pupil catchlights.',
    kernel: [
      [ 0, -1,  0],
      [-1,  5, -1],
      [ 0, -1,  0]
    ],
    divisor: 1,
    offset: 0
  },
  {
    id: 'gaussian',
    name: 'Gaussian Blur (Smoothing)',
    category: 'Low-pass Filtering',
    description: 'Weights neighboring pixels according to a bell curve, eliminating high-frequency sensor noise while preserving macroscopic morphology.',
    kernel: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ],
    divisor: 16,
    offset: 0
  },
  {
    id: 'emboss',
    name: 'Directional Emboss (Relief)',
    category: 'Morphological Relief',
    description: 'Produces a three-dimensional depth appearance by emphasizing light-to-dark transitions along a diagonal trajectory.',
    kernel: [
      [-2, -1,  0],
      [-1,  1,  1],
      [ 0,  1,  2]
    ],
    divisor: 1,
    offset: 128
  }
];
