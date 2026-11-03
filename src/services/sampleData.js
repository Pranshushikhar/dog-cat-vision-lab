export const SAMPLE_IMAGES = [
  {
    id: 'dog-01',
    name: 'Golden Retriever',
    class: 'dog',
    category: 'dog',
    species: 'Canis familiaris (Retriever)',
    url: '/samples/sample_dog_1.jpg',
    description: 'Golden retriever facial morphology featuring elongated muzzle, warm brown almond eyes, and floppy lateral ears.',
    keyFeatures: ['Elongated snout', 'Floppy lateral ears', 'Warm eye contour', 'Dense coat texture'],
    saliencyRegions: [
      { x: 18, y: 28, label: 'Floppy Lateral Ear', desc: 'Downward-folded ear curvature characteristic of domestic canine breeds.' },
      { x: 82, y: 28, label: 'Contralateral Drooped Ear', desc: 'Bilateral low ear insertion point.' },
      { x: 50, y: 65, label: 'Elongated Muzzle', desc: 'Extended snout and large dark nasal planum drive strong canine activations.' }
    ]
  },
  {
    id: 'dog-02',
    name: 'Siberian Husky',
    class: 'dog',
    category: 'dog',
    species: 'Canis familiaris (Husky)',
    url: '/samples/sample_dog_2.jpg',
    description: 'Arctic husky specimen with erect triangular pinnae, striking ice-blue eyes, and high-contrast facial mask.',
    keyFeatures: ['Erect triangular pinnae', 'Facial mask contrast', 'Slender muzzle', 'Bicolored coat'],
    saliencyRegions: [
      { x: 26, y: 16, label: 'Thick-Furred Pinna', desc: 'Erect canine ear with wider base and interior fur cushioning.' },
      { x: 50, y: 46, label: 'Distinctive Facial Mask', desc: 'Sharp black/white contrast boundary around eyes.' },
      { x: 50, y: 78, label: 'Prominent Black Rhinarium', desc: 'Substantial dark nose pad and extended jaw line.' }
    ]
  },
  {
    id: 'cat-01',
    name: 'Tabby Cat',
    class: 'cat',
    category: 'cat',
    species: 'Felis catus (Tabby)',
    url: '/samples/sample_cat_1.jpg',
    description: 'Domestic shorthair exhibiting agouti tabby stripes, high-set triangular ears, elliptical pupil slits, and tactile vibrissae.',
    keyFeatures: ['Pointed upright pinnae', 'Slit elliptical pupils', 'Tactile whiskers (vibrissae)', 'Triangular nose apex'],
    saliencyRegions: [
      { x: 28, y: 15, label: 'Erect Pinnae (Ears)', desc: 'High-gradient vertical edge filters fire strongly on pointy feline ears.' },
      { x: 72, y: 15, label: 'Contralateral Pinna', desc: 'Symmetric triangular ear outline distinctive of Felidae.' },
      { x: 50, y: 48, label: 'Eye & Pupil Slits', desc: 'Deep-layer receptive fields detect elliptical eye geometry.' },
      { x: 50, y: 72, label: 'Muzzle & Whisker Pad', desc: 'Compact snout and horizontal whisker texture differentiate from canines.' }
    ]
  },
  {
    id: 'cat-02',
    name: 'Siamese Cat',
    class: 'cat',
    category: 'cat',
    species: 'Felis catus (Siamese)',
    url: '/samples/sample_cat_2.jpg',
    description: 'Seal-point oriental feline with high cheekbones, deep cyan almond eyes, and distinct dark auricular pigmentation.',
    keyFeatures: ['Seal-point facial mask', 'Cyan almond eyes', 'Fine whisker filaments', 'Wedge-shaped cranial contour'],
    saliencyRegions: [
      { x: 30, y: 18, label: 'Pigmented Ear Point', desc: 'Distinct dark ear shading contrasting against lighter cranial fur.' },
      { x: 50, y: 45, label: 'Facial Mask & Cyan Eyes', desc: 'Deep convolutional features isolate dark triangular facial mask.' },
      { x: 50, y: 75, label: 'Compact Chin & Snout', desc: 'Flat muzzle profile cleanly separated from elongated canine snouts.' }
    ]
  },
  {
    id: 'ood-01',
    name: 'Sports Car',
    class: 'unsupported',
    category: 'unsupported',
    species: 'Vehicle (Automobile)',
    url: '/samples/sample_car.jpg',
    description: 'Rigid mechanical vehicle chassis with rubber tires and glass windshield. Out-of-distribution benchmark specimen.',
    keyFeatures: ['Straight geometric chassis', 'Rubber wheels & rims', 'Glass windshield', 'Non-biological texture'],
    saliencyRegions: [
      { x: 50, y: 42, label: 'Windshield / Roof', desc: 'Straight geometric angles trigger vehicle/hardware filters.' },
      { x: 28, y: 74, label: 'Tire / Wheel Hub', desc: 'Circular metallic wheel rim lacks organic fur textures.' },
      { x: 74, y: 74, label: 'Rear Tire', desc: 'Zero feline/canine probability mass detected by OOD screening.' }
    ]
  },
  {
    id: 'ood-02',
    name: 'Pepperoni Pizza',
    class: 'unsupported',
    category: 'unsupported',
    species: 'Food (Pizza)',
    url: '/samples/sample_food.jpg',
    description: 'Circular baked dough crust, melted cheese, and pepperoni slices. Used to verify food rejection.',
    keyFeatures: ['Circular pastry crust', 'Melted cheese texture', 'Pepperoni discs', 'Inanimate object'],
    saliencyRegions: [
      { x: 50, y: 30, label: 'Baked Crust Border', desc: 'Homogeneous baked dough curvature matches food ImageNet classes.' },
      { x: 50, y: 55, label: 'Sauce & Cheese Surface', desc: 'No facial landmarks, eyes, or ears detected.' }
    ]
  },
  {
    id: 'ood-03',
    name: 'Skyscraper',
    class: 'unsupported',
    category: 'unsupported',
    species: 'Architecture (Building)',
    url: '/samples/sample_building.jpg',
    description: 'High-rise architectural structure with repetitive window grid. Out-of-distribution structural specimen.',
    keyFeatures: ['Vertical rectilinear facade', 'Window matrix grid', 'Inorganic construction', 'Zero biological landmarks'],
    saliencyRegions: [
      { x: 50, y: 45, label: 'Rectilinear Facade', desc: 'Strict orthogonal lines fire artificial structure filters.' }
    ]
  }
];
