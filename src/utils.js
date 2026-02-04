/**
 * Utility functions for the application
 */

/**
 * Creates a URL for a given page name
 * @param {string} pageName 
 * @returns {string}
 */
export const createPageUrl = (pageName) => {
  switch (pageName) {
    case 'ManagerZadan':
      return '/tasks';
    case 'ZadaniaApi':
      return '/api-tasks';
    default:
      return '/';
  }
};
