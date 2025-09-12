export function useHeader() {
  const links = [
    {
      label: 'Videos',
      icon: 'i-lucide-square-play',
      to: '/',
      children: [{
        label: 'Most recents',
        to: '/recent'
      }]
    },
    {
      label: 'Categories',
      icon: 'i-lucide-chart-bar-stacked',
      to: '/categories'
    },
    {
      label: 'Administrations',
      icon: 'i-lucide-shield',
      to:'/admin',
      children: [{
        label: 'Videos',
        icon: 'i-lucide-file-text',
        to: '/admin/videos'
      },{
        label: 'Categories',
        icon: 'i-lucide-file-text',
        to: '/admin/categories'
      }, {
        label: 'Tags',
        icon: 'i-lucide-file-text',
        to: '/admin/tags'
      }, {
        label: 'Accounts',
        icon: 'i-lucide-file-text',
        to: '/admin/accounts'
      }]
    },{
      label: 'My account',
      icon: 'i-lucide-circle-user-round',
      to: '/myaccount'
    }
  ];

  return {
    links
  }
}