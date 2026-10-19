"""
ml/model.py

CNN Model definition for Dog vs Cat Binary Image Classification.
Architecture:
  Input (224 × 224 × 3)
  ↓ Rescaling (1./255)
  ↓ Conv2D (32, 3×3) + ReLU
  ↓ MaxPooling2D (2×2)
  ↓ Conv2D (64, 3×3) + ReLU
  ↓ MaxPooling2D (2×2)
  ↓ Conv2D (128, 3×3) + ReLU
  ↓ MaxPooling2D (2×2)
  ↓ Flatten
  ↓ Dense (256) + ReLU
  ↓ Dropout (0.5)
  ↓ Dense (1, Sigmoid)
"""

import os
from pathlib import Path

MODEL_DIR = Path(__file__).resolve().parent.parent / "models"
MODEL_PATH = MODEL_DIR / "dog_cat_cnn.keras"


def build_dog_cat_cnn(input_shape=(224, 224, 3), learning_rate=1e-4):
    """
    Constructs and compiles the Convolutional Neural Network for binary classification.
    """
    import tensorflow as tf
    from tensorflow.keras import layers, models, optimizers, losses, metrics

    model = models.Sequential([
        # Input specification & Rescaling
        layers.Input(shape=input_shape, name="input_tensor"),
        layers.Rescaling(1.0 / 255.0, name="normalization_rescale"),

        # Conv Block 1
        layers.Conv2D(32, (3, 3), padding="same", activation="relu", name="conv2d_block1"),
        layers.MaxPooling2D(pool_size=(2, 2), name="max_pool1"),

        # Conv Block 2
        layers.Conv2D(64, (3, 3), padding="same", activation="relu", name="conv2d_block2"),
        layers.MaxPooling2D(pool_size=(2, 2), name="max_pool2"),

        # Conv Block 3
        layers.Conv2D(128, (3, 3), padding="same", activation="relu", name="conv2d_block3"),
        layers.MaxPooling2D(pool_size=(2, 2), name="max_pool3"),

        # Vectorization & Classification
        layers.Flatten(name="flatten"),
        layers.Dense(256, activation="relu", name="dense_features"),
        layers.Dropout(0.5, name="dropout_regularization"),
        layers.Dense(1, activation="sigmoid", name="binary_output")
    ], name="DogCat_CNN_Classifier")

    model.compile(
        optimizer=optimizers.Adam(learning_rate=learning_rate),
        loss=losses.BinaryCrossentropy(),
        metrics=[
            metrics.BinaryAccuracy(name="accuracy"),
            metrics.Precision(name="precision"),
            metrics.Recall(name="recall")
        ]
    )

    return model


def build_mobilenet_v2_classifier(input_shape=(224, 224, 3), learning_rate=1e-4):
    """
    Constructs a transfer-learning classifier using pretrained MobileNetV2.
    Pretrained on ImageNet (which includes rich feline and canine feature representations).
    Input: (224, 224, 3) RGB values in [0, 255].
    Includes internal preprocessing Rescaling(scale=1./127.5, offset=-1) to match MobileNetV2 requirements.
    """
    import tensorflow as tf
    from tensorflow.keras import layers, models, optimizers, losses, metrics

    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False

    inputs = layers.Input(shape=input_shape, name="input_tensor")
    x = layers.Rescaling(scale=1.0 / 127.5, offset=-1.0, name="mobilenet_rescaling")(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = layers.Dropout(0.3, name="dropout_regularization")(x)
    x = layers.Dense(128, activation="relu", name="dense_features")(x)
    x = layers.Dropout(0.2, name="dropout_head")(x)
    outputs = layers.Dense(1, activation="sigmoid", name="binary_output")(x)

    model = models.Model(inputs=inputs, outputs=outputs, name="DogCat_MobileNetV2_Classifier")

    model.compile(
        optimizer=optimizers.Adam(learning_rate=learning_rate),
        loss=losses.BinaryCrossentropy(),
        metrics=[
            metrics.BinaryAccuracy(name="accuracy"),
            metrics.Precision(name="precision"),
            metrics.Recall(name="recall")
        ]
    )
    return model


def get_architecture_metadata(model=None, input_shape=(224, 224, 3)) -> dict:
    """
    Extracts structured architecture metadata from the CNN model.
    Used by the FastAPI endpoint and the frontend to display the ACTUAL model architecture.
    """
    if model is None:
        try:
            model = load_model_if_exists()
        except Exception:
            pass

    if model is None:
        # If model is not instantiated or loaded, report awaiting status
        return {
            "status": "AWAITING_TRAINED_MODEL",
            "model_loaded": False,
            "architecture_name": "DogCat_CNN_Classifier",
            "input_shape": list(input_shape),
            "layers": [
                {"name": "input_tensor", "type": "InputLayer", "output_shape": list(input_shape), "params": 0},
                {"name": "normalization_rescale", "type": "Rescaling", "output_shape": list(input_shape), "params": 0},
                {"name": "conv2d_block1", "type": "Conv2D", "filters": 32, "kernel_size": [3, 3], "activation": "relu", "params": 896},
                {"name": "max_pool1", "type": "MaxPooling2D", "pool_size": [2, 2], "output_shape": [112, 112, 32], "params": 0},
                {"name": "conv2d_block2", "type": "Conv2D", "filters": 64, "kernel_size": [3, 3], "activation": "relu", "params": 18496},
                {"name": "max_pool2", "type": "MaxPooling2D", "pool_size": [2, 2], "output_shape": [56, 56, 64], "params": 0},
                {"name": "conv2d_block3", "type": "Conv2D", "filters": 128, "kernel_size": [3, 3], "activation": "relu", "params": 73856},
                {"name": "max_pool3", "type": "MaxPooling2D", "pool_size": [2, 2], "output_shape": [28, 28, 128], "params": 0},
                {"name": "flatten", "type": "Flatten", "output_shape": [100352], "params": 0},
                {"name": "dense_features", "type": "Dense", "units": 256, "activation": "relu", "params": 25690368},
                {"name": "dropout_regularization", "type": "Dropout", "rate": 0.5, "params": 0},
                {"name": "binary_output", "type": "Dense", "units": 1, "activation": "sigmoid", "params": 257}
            ],
            "total_params": 25783873,
            "trainable_params": 25783873,
            "loss_function": "BinaryCrossentropy",
            "optimizer": "Adam (lr=1e-4)",
            "output_classes": ["cat (0)", "dog (1)"]
        }

    # Extract directly from real model object
    layer_list = []
    for l in model.layers:
        config = l.get_config()
        layer_info = {
            "name": l.name,
            "type": l.__class__.__name__,
            "output_shape": list(l.output_shape) if hasattr(l, "output_shape") else None,
            "params": l.count_params()
        }
        if "activation" in config:
            layer_info["activation"] = config["activation"]
        if "filters" in config:
            layer_info["filters"] = config["filters"]
        if "kernel_size" in config:
            layer_info["kernel_size"] = config["kernel_size"]
        if "units" in config:
            layer_info["units"] = config["units"]
        layer_list.append(layer_info)

    return {
        "status": "TRAINED_MODEL_CONNECTED",
        "model_loaded": True,
        "architecture_name": model.name,
        "input_shape": list(input_shape),
        "layers": layer_list,
        "total_params": model.count_params(),
        "trainable_params": sum(p.numpy().size for p in model.trainable_weights),
        "loss_function": "BinaryCrossentropy",
        "optimizer": "Adam",
        "output_classes": ["cat (0)", "dog (1)"]
    }


def load_model_if_exists(filepath=MODEL_PATH):
    """Loads saved model weights if available on disk."""
    if not Path(filepath).exists():
        return None
    import tensorflow as tf
    return tf.keras.models.load_model(str(filepath))
