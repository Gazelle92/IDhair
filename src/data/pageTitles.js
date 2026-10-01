export const pageTitles = {
  '/': '아이디헤어 | id HAIR',
  '/en': 'id HAIR | 아이디헤어',
  '/about': 'ABOUT id HAIR | 아이디헤어',
  '/academy': 'id ACADEMY | 아이디헤어',
  '/recruit': 'RECRUIT | 아이디헤어',
  '/magazine': 'id MAGAZINE | 아이디헤어',
  '/magazine/our-picks': 'id MAGAZINE | 아이디헤어',
  '/magazine/id-news': 'id NEWS | 아이디헤어',
  '/magazine/id-event': 'id EVENT | 아이디헤어',
  '/magazine/id-family': 'id FAMILY | 아이디헤어',
  '/magazine/id-gallery': 'id GALLERY | 아이디헤어',
  '/magazine/id-play': 'id PLAY | 아이디헤어',
};

Object.entries(pageTitles).forEach(([path, title]) => {
  if (path !== '/' && !path.startsWith('/en')) pageTitles['/en' + path] = title;
});

export function getPageTitle(pathname) {
  const path = pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
  return pageTitles[path] ||
    (path.startsWith('/magazine/') ? pageTitles[path.split('/').slice(0, 3).join('/')] || 'id MAGAZINE | 아이디헤어' : '아이디헤어');
}
