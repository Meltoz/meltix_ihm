import { useAllCategories } from '~/composables/query/category.query';

export const useHeader = () => {
  const { allCategories, isAllCategoriesLoading, isAllCategoriesError } = useAllCategories(
    0,
    200,
    ''
  );

  const categoryChildren = computed(
    () =>
      allCategories.value?.categories?.map((cat) => ({
        label: cat.name,
        to: `/?q=${encodeURIComponent(cat.name)}`,
      })) || []
  );

  const desktopLinks = computed(() => [
    {
      label: 'Videos',
      icon: 'i-lucide-square-play',
      to: '/',
    },
    {
      label: 'Categories',
      icon: 'i-lucide-chart-bar-stacked',
      to: '/categories',
      children: categoryChildren.value,
    },
    {
      label: 'Administrations',
      icon: 'i-lucide-shield',
      to: '/admin',
      children: [
        {
          label: 'Videos',
          icon: 'i-lucide-image-play',
          to: '/admin/videos',
        },
        {
          label: 'Catégories',
          icon: 'i-lucide-chart-bar-stacked',
          to: '/admin/categories',
        },
        {
          label: 'Tags',
          icon: 'i-lucide-tag',
          to: '/admin/tags',
        },
        {
          label: 'Comptes',
          icon: 'i-lucide-user-round-cog',
          to: '/admin/accounts',
        },
      ],
    },
    {
      label: 'My account',
      icon: 'i-lucide-circle-user-round',
      to: '/myaccount',
    },
  ]);

  const mobileLinks = [
    {
      label: 'Videos',
      icon: 'i-lucide-square-play',
      to: '/',
    },
    {
      label: 'Categories',
      icon: 'i-lucide-chart-bar-stacked',
      to: '/categories',
    },
    {
      label: 'Administrations',
      icon: 'i-lucide-shield',
      to: '/admin',
      children: [
        {
          label: 'Videos',
          icon: 'i-lucide-file-text',
          to: '/admin/videos',
        },
        {
          label: 'Categories',
          icon: 'i-lucide-file-text',
          to: '/admin/categories',
        },
        {
          label: 'Tags',
          icon: 'i-lucide-file-text',
          to: '/admin/tags',
        },
        {
          label: 'Accounts',
          icon: 'i-lucide-file-text',
          to: '/admin/accounts',
        },
      ],
    },
    {
      label: 'My account',
      icon: 'i-lucide-circle-user-round',
      to: '/myaccount',
    },
  ];

  return {
    desktopLinks,
    mobileLinks,
  };
};
