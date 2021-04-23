export const truncateString = (string, max) => (
  string.length >= max
    ? (
      `${
        string
          .substring(0, max)
          .trim()
          .replace(/([&])$/, '')
          .trim()}...`
    ) : (
      string
    )
)
