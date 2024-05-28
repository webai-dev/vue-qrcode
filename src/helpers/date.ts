export const humanDate = (date: string, outputFormat = "de-DE") => {
  const dateObject = new Date(date)
  return dateObject.toLocaleDateString(outputFormat)
}

export const machineDate = (date: Date) => {
  const dateObject = new Date(date)
  return dateObject.toISOString()
}
