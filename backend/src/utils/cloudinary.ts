import cloudinary from "../config/cloudinary";

/**
 * Delete an image from Cloudinary using its public_id
 * @param public_id The public_id of the image to delete
 * @returns Promise with result of deletion
 */
export const deleteImage = async (public_id: string) => {
  if (!public_id) return null;
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error(`Error deleting image from Cloudinary: ${public_id}`, error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param public_ids Array of public_ids to delete
 */
export const deleteMultipleImages = async (public_ids: string[]) => {
  if (!public_ids || public_ids.length === 0) return;
  try {
    const deletePromises = public_ids.map((id) => deleteImage(id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting multiple images from Cloudinary", error);
    // We don't throw here to allow the rest of the process to continue,
    // but in a real app you might want to handle partial failures.
  }
};
