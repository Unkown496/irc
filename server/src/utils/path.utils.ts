/**
 * @description Build path for http requests (delete all '' or undefined paths)
 * @example buildPath('api', 'users') // returns '/api/users'
 */
export const buildPath = (...pathsSegments: Array<string | number>) =>
  pathsSegments
    .filter(Boolean)
    .map(path =>
      path.toString().startsWith('/') ? path.toString().substring(1) : path,
    )
    .join('/');
