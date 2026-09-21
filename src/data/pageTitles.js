export const pageTitles = {
  '/': 'id HAIR | 아이디헤어',
  '/about': 'ABOUT id HAIR',
  '/academy': 'id ACADEMY',
  '/recruit': 'RECRUIT',
  '/magazine': 'id MAGAZINE',
  '/magazine/our-picks': 'id MAGAZINE',
  '/magazine/id-news': 'id NEWS',
  '/magazine/id-event': 'id EVENT',
  '/magazine/id-family': 'id FAMILY',
  '/magazine/id-gallery': 'id GALLERY',
  '/magazine/id-play': 'id PLAY',
};

export function getPageTitle(pathname) {
  const path = pathname.replace(/\/$/, '') || '/';
  return pageTitles[path] ||
    (path.startsWith('/magazine/') ? pageTitles[path.split('/').slice(0, 3).join('/')] || 'id MAGAZINE' : '아이디헤어');
}
