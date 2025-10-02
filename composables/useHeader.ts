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

  const {isAdmin, isLoginIn} = useAuth();


  const desktopLinks = computed(() => {
    const links = [
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
    ];

    if(isAdmin.value){
      links.push( {
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
      });
    }

    if(isLoginIn.value){
      links.push( {
        label: 'Mon compte',
        icon: 'i-lucide-circle-user-round',
        to: '/myaccount',
      })
    }

    return links;
  });

  const mobileLinks = computed(() => {
    const links = [
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
    ];

    if(isAdmin.value){
      links.push({
        label: 'Administrations',
        icon: 'i-lucide-shield',
        to: '/admin',
      });
    }


    if(isLoginIn.value){
      links.push( {
        label: 'Mon compte',
        icon: 'i-lucide-circle-user-round',
        to: '/myaccount',
      })
    };

    return links;
  })

  return {
    desktopLinks,
    mobileLinks,
  };
};
