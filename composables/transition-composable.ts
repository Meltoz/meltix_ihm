import { reactive } from 'vue';

const transitionState = reactive({
  transitionComplete: false,
});

export const useTransitionComposable = () => {
  const toggleTransitionComplete = (value: any) => {
    transitionState.transitionComplete = value;
  };

  return { transitionState, toggleTransitionComplete };
};
