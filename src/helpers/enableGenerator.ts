export const enableGenerator = import.meta.env.VITE_ENABLE_GENERATOR
  ? Boolean(
      JSON.parse(
        (import.meta.env.VITE_ENABLE_GENERATOR as string).toLowerCase(),
      ),
    )
  : false
