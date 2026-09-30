"""
ml/dataset.py

Dataset loading, preprocessing, and augmentation pipeline using TensorFlow / Keras datasets.
Prepares train and validation data loaders from data/processed/.
"""

import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
TRAIN_DIR = PROCESSED_DIR / "train"
VAL_DIR = PROCESSED_DIR / "val"


def get_data_loaders(
    batch_size: int = 32,
    image_size: tuple[int, int] = (224, 224),
    seed: int = 42
):
    """
    Constructs high-performance batched and prefetched tf.data.Dataset loaders
    for the train and validation splits.
    """
    import tensorflow as tf

    if not TRAIN_DIR.exists() or not any(TRAIN_DIR.glob("*/*.jpg")):
        raise FileNotFoundError(
            f"Processed training data not found in {TRAIN_DIR}. "
            "Please run 'python scripts/setup_dataset.py' first."
        )

    print(f"Loading training data from: {TRAIN_DIR}...")
    train_ds = tf.keras.utils.image_dataset_from_directory(
        directory=str(TRAIN_DIR),
        labels="inferred",
        label_mode="binary",  # 0 for cat, 1 for dog
        class_names=["cats", "dogs"],
        batch_size=batch_size,
        image_size=image_size,
        shuffle=True,
        seed=seed
    )

    val_ds = None
    if VAL_DIR.exists() and any(VAL_DIR.glob("*/*.jpg")):
        print(f"Loading validation data from: {VAL_DIR}...")
        val_ds = tf.keras.utils.image_dataset_from_directory(
            directory=str(VAL_DIR),
            labels="inferred",
            label_mode="binary",
            class_names=["cats", "dogs"],
            batch_size=batch_size,
            image_size=image_size,
            shuffle=True,
            seed=seed
        )

    # Optional augmentation for training pipeline
    data_augmentation = tf.keras.Sequential([
        tf.keras.layers.RandomFlip("horizontal"),
        tf.keras.layers.RandomRotation(0.1),
        tf.keras.layers.RandomZoom(0.1),
    ], name="data_augmentation")

    train_ds = train_ds.map(
        lambda x, y: (data_augmentation(x, training=True), y),
        num_parallel_calls=tf.data.AUTOTUNE
    )

    # Cache & Prefetch for pipeline efficiency
    train_ds = train_ds.prefetch(buffer_size=tf.data.AUTOTUNE)
    if val_ds:
        val_ds = val_ds.prefetch(buffer_size=tf.data.AUTOTUNE)

    return train_ds, val_ds
