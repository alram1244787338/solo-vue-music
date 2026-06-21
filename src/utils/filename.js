export const extractTitleFromFilename = (filename) => {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  let result = nameWithoutExt

  result = result.replace(/^[\s【\[（(]?\d+[\s】\])）.．\-_、·]+/, '')
  result = result.replace(/^[\s\d.．\-_、·]+/, '')

  result = result.replace(/\[[^\]]*\]/g, ' ')
  result = result.replace(/【[^】]*】/g, ' ')
  result = result.replace(/\([^)]*\)/g, ' ')
  result = result.replace(/（[^）]*）/g, ' ')

  result = result.replace(/[\-_、·]+/g, ' ')
  result = result.replace(/\s+/g, ' ')

  result = result.trim()

  if (!result) {
    const fallback = nameWithoutExt
      .replace(/[\-_、·]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    result = fallback
  }

  return result
}
