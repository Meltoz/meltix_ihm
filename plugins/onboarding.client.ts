import { checkOnBoarding } from '~/services/onboarding.service';

export default defineNuxtPlugin(async (nuxtApp) => {
  const onboarding = localStorage.getItem('onboarding');
  if (onboarding === null) {
    const checkOnBoardingResult = await checkOnBoarding();
    localStorage.setItem('onboarding', checkOnBoardingResult.toString());
  }
});
