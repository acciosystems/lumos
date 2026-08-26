export async function reconcileSingleWriteUpload(
  upload: () => Promise<unknown>,
  confirm: () => Promise<unknown>,
) {
  let uploadError: unknown;
  try {
    await upload();
  } catch (error) {
    uploadError = error;
  }

  try {
    // Confirmation performs the authoritative storage check. A successful
    // confirmation reconciles a browser response that was lost after upload.
    await confirm();
  } catch (confirmationError) {
    throw uploadError ?? confirmationError;
  }
}
