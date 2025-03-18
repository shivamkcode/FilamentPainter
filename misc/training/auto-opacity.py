# Filament opacity training script
# This script takes in as input a file in the form of
#
# #hexvalue
# opacity
#
# #hexvalue
# opacity
#
# such as
#
# #a3a3a3
# 2
#
# #2f4f1a
# 5
#
# and trains a linear fit (pseudo interpolation) model using gaussian weighted nearest neighbour for each
# of the interpolation points that span [0, 1] in increments of 0.1

import numpy as np
import matplotlib.pyplot as plt
import json

# Step 1: Parse the file
def parse_file(filename):
    with open(filename, 'r') as file:
        lines = file.readlines()

    rgb_values = []
    target_values = []

    for i in range(0, len(lines), 3):
        line = lines[i]

        hex_color = line.strip()[1:]
        rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        rgb_values.append(rgb)

        line = lines[i + 1]
        # Extract target value
        target_values.append(float(line.strip()) / 10.0)

    return np.array(rgb_values), np.array(target_values)

# Step 2: Normalize RGB values to [0, 1]
def normalize_rgb(rgb_values):
    return rgb_values / 255.0

# Step 3: Generate interpolation points spanning [0, 1]^3 with increments of 0.1
def generate_interpolation_points():
    x = np.arange(0, 1.1, 0.1)
    y = np.arange(0, 1.1, 0.1)
    z = np.arange(0, 1.1, 0.1)
    return np.array(np.meshgrid(x, y, z)).T.reshape(-1, 3)

def gaussian_weighted_interpolation(points, values, query_points, sigma):
    """
    Perform Gaussian-weighted interpolation in 3D space.

    Args:
        points (np.array): Known points (n_samples, 3).
        values (np.array): Known values at the points (n_samples,).
        query_points (np.array): Points to interpolate (n_query, 3).
        sigma (float): Bandwidth of the Gaussian kernel.

    Returns:
        np.array: Interpolated values at query_points.
    """
    interpolated_values = np.zeros(query_points.shape[0])

    for i, query in enumerate(query_points):
        # Compute distances to all known points
        distances = np.linalg.norm(points - query, axis=1)

        # Apply Gaussian weights
        weights = np.exp(-distances**2 / (2 * sigma**2))

        # Normalize weights
        weights /= np.sum(weights)

        # Compute weighted sum of values
        interpolated_values[i] = np.dot(weights, values)

    return interpolated_values

def evaluate_training_error(points, values, interpolated_values):
    """
    Evaluate the training error using MAE, MSE, and RMSE.

    Args:
        points (np.array): Known points (n_samples, 3).
        values (np.array): Known values at the points (n_samples,).
        interpolated_values (np.array): Predicted values at the points (n_samples,).

    Returns:
        dict: Dictionary containing MAE, MSE, and RMSE.
    """
    errors = values - interpolated_values
    mae = np.mean(np.abs(errors))
    mse = np.mean(errors**2)
    rmse = np.sqrt(mse)

    return {
        "MAE": mae,
        "MSE": mse,
        "RMSE": rmse
    }

# Step 4: Reshape interpolation points into an 11x11x11 grid
def reshape_to_grid(interpolation_points):
    """
    Reshape the interpolation points into an 11x11x11 grid.

    Args:
        interpolation_points (np.array): Interpolation points (n_points, 3).

    Returns:
        np.array: 11x11x11 grid of interpolation points.
    """
    grid_size = 11
    return interpolation_points.reshape((grid_size, grid_size, grid_size, 1))

# Main function
def main():
    # Parse the file
    rgb_values, target_values = parse_file('training.txt')

    # Normalize RGB values
    normalized_rgb = normalize_rgb(rgb_values)

    # Generate interpolation points
    interpolation_points = generate_interpolation_points()

    # Perform Gaussian-weighted interpolation for the interpolation points
    sigma = 0.02  # Bandwidth of the Gaussian kernel
    interpolated_values = gaussian_weighted_interpolation(normalized_rgb, target_values, interpolation_points, sigma)

    # Evaluate training error on the known points
    predicted_values_at_known_points = gaussian_weighted_interpolation(normalized_rgb, target_values, normalized_rgb, sigma)
    training_error = evaluate_training_error(normalized_rgb, target_values, predicted_values_at_known_points)

    print("Training Error:")
    print(f"MAE: {training_error['MAE']}")
    print(f"MSE: {training_error['MSE']}")
    print(f"RMSE: {training_error['RMSE']}")

    grid = reshape_to_grid(interpolated_values)
    print(grid.shape)

    # Convert the 3D NumPy array to a nested Python list
    array_3d_list = grid.squeeze(-1).tolist()

    # Export the nested list as a JSON file
    with open('../../src/tools/AutoOpacityData.ts', 'w') as f:
        json_string = json.dumps(array_3d_list, separators=(',', ':'))
        f.write(f"export const interpValues: number[][][] = {json_string}")


    # # Remove the last dimension (size 1) using squeeze
    # array = np.squeeze(grid)
    #
    # # Fixed [2] index values to plot
    # fixed_z_indices = [0, 2, 4, 6, 8, 10]  # Example indices
    #
    # # Plot [0] vs [1] for each fixed [2] index
    # for z in fixed_z_indices:
    #     plt.figure()
    #     plt.imshow(array[:, :, z], cmap='viridis', origin='lower')
    #     plt.colorbar(label='Intensity')
    #     plt.title(f'Slice at z = {z}')
    #     plt.xlabel('x')
    #     plt.ylabel('y')
    #     plt.show()

if __name__ == "__main__":
    main()