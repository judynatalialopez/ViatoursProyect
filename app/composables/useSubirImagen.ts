export async function useSubirImagen(file: File): Promise<string> {
  const CLOUD_NAME = 'h6h7m5bi'
  const UPLOAD_PRESET = 'viatours'

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData },
  )

  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Error al subir la imagen')
  return data.secure_url
}