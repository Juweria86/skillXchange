/**
 * Utility functions for handling images
 */

/**
 * Gets a complete image URL regardless of whether it's a data URL, absolute URL, or relative path
 * @param imagePath The image path or URL
 * @returns A usable image URL
 */
export function getImageUrl(imagePath: string | null): string {
  if (!imagePath) {
    return "https://via.placeholder.com/300?text=Profile"
  }

  // If it's already a data URL or absolute URL, return as is
  if (imagePath.startsWith("data:") || imagePath.startsWith("http")) {
    return imagePath
  }

  // For relative paths, use as is (the browser will resolve relative to current origin)
  return imagePath
}

/**
 * Gets the first letter of a name for avatar fallback
 * @param name The user's name
 * @returns The first letter of the name, or "?" if no name
 */
export function getNameInitial(name: string | null): string {
  if (!name || name.length === 0) {
    return "?"
  }
  return name.charAt(0).toUpperCase()
}

/**
 * Creates a placeholder image URL with the user's initial
 * @param name The user's name
 * @returns A placeholder image URL with the user's initial
 */
export function getInitialAvatar(name: string | null): string {
  const initial = getNameInitial(name)
  return `https://via.placeholder.com/300/FBEAA0/4a3630?text=${initial}`
}
