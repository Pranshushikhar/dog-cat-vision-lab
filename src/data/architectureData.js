/**
 * Illustrative CNN Architecture Specification
 * 
 * DISCLAIMER:
 * These dimensions and layers are illustrative of standard binary CNN pipelines
 * for 224x224 RGB inputs unless specific trained model weights are connected.
 */

export const ARCHITECTURE_NOTE = "Illustrative CNN pipeline";

export const CNN_LAYERS = [
  {
    id: 'input',
    name: 'Input Layer',
    type: 'Tensor Input',
    shape: '224 × 224 × 3',
    color: '#4DA3FF',
    description: 'Raw RGB pixel matrix rescaled to uniform spatial dimensions. 3 channels represent Red, Green, and Blue intensity values.',
    math: 'X ∈ ℝ^(224 × 224 × 3), values normalized to [0, 1]'
  },
  {
    id: 'conv1',
    name: 'Convolution Block 1',
    type: 'Conv2D (32 filters, 3×3)',
    shape: '224 × 224 × 32',
    color: '#6C63FF',
    description: 'Slides 32 spatial filters across the input tensor to detect localized elementary primitives: vertical/horizontal edges, high-contrast borders, and color transitions.',
    math: 'F_1 = ReLU(W_1 * X + b_1)'
  },
  {
    id: 'act1',
    name: 'Activation (ReLU)',
    type: 'Non-linear Activation',
    shape: '224 × 224 × 32',
    color: '#9B94FF',
    description: 'Rectified Linear Unit zeroes out negative responses, introducing essential non-linearity to allow the network to model complex non-linear decision boundaries.',
    math: 'f(z) = max(0, z)'
  },
  {
    id: 'pool1',
    name: 'Max Pooling 1',
    type: 'Spatial Downsampling (2×2)',
    shape: '112 × 112 × 32',
    color: '#55E6D0',
    description: 'Takes the maximum value within 2×2 non-overlapping spatial windows. Reduces dimensional footprint by 75% while providing translational invariance.',
    math: 'P_(i,j) = max_{(m,n) ∈ window} (A_(2i+m, 2j+n))'
  },
  {
    id: 'conv2',
    name: 'Convolution Block 2',
    type: 'Conv2D (64 filters, 3×3)',
    shape: '112 × 112 × 64',
    color: '#6C63FF',
    description: 'Combines low-level edge features into intermediate structural motifs: fur textures, corner curves, whisker arcs, and eye contours.',
    math: 'F_2 = ReLU(W_2 * P_1 + b_2)'
  },
  {
    id: 'act2',
    name: 'Activation (ReLU)',
    type: 'Non-linear Activation',
    shape: '112 × 112 × 64',
    color: '#9B94FF',
    description: 'Applies threshold non-linearity to intermediate feature activations.',
    math: 'f(z) = max(0, z)'
  },
  {
    id: 'pool2',
    name: 'Max Pooling 2',
    type: 'Spatial Downsampling (2×2)',
    shape: '56 × 56 × 64',
    color: '#55E6D0',
    description: 'Halves spatial width and height again, expanding the effective receptive field of subsequent deeper kernels.',
    math: 'P_(i,j) = max_{(m,n) ∈ window} (A_(2i+m, 2j+n))'
  },
  {
    id: 'flatten',
    name: 'Flatten',
    type: 'Vectorization',
    shape: '200,704 elements',
    color: '#A8B0BE',
    description: 'Reshapes the multi-channel 2D spatial feature volume into a single continuous 1-dimensional numerical vector for dense classification.',
    math: 'v = vec(P_2) ∈ ℝ^(56 × 56 × 64)'
  },
  {
    id: 'dense',
    name: 'Dense (Fully Connected)',
    type: 'FC Layer (512 units + Dropout)',
    shape: '512 units',
    color: '#4DA3FF',
    description: 'Every neuron connects to all prior features, synthesizing holistic semantic abstractions (e.g. floppy ear + long snout vs pointed ear + slit eye). Dropout (0.5) mitigates overfitting.',
    math: 'h = ReLU(W_d * v + b_d) ⊙ Mask_dropout'
  },
  {
    id: 'output',
    name: 'Output Layer',
    type: 'Binary Classifier (Sigmoid)',
    shape: '1 probability scalar (or 2-class Softmax)',
    color: '#55E6D0',
    description: 'Produces final probability output score between 0.0 (Cat) and 1.0 (Dog) via Sigmoid / Softmax function.',
    math: 'P(y = Dog | x) = σ(W_o * h + b_o) = 1 / (1 + e^(-z))'
  }
];
