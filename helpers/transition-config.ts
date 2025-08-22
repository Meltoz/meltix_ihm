import gsap from 'gsap';

import { useTransitionComposable } from '~/composables/transition-composable';
import type { TransitionProps } from 'vue';

const { toggleTransitionComplete } = useTransitionComposable();

const pageTransition: TransitionProps = {
  name: 'page-transition',
  mode: 'out-in',
  onEnter: (el: any, done: any) => {
    gsap
      .timeline({
        paused: true,
        onComplete() {
          toggleTransitionComplete(true);
          done();
        },
      })
      .fromTo(el, { alpha: 0 }, { alpha: 1, duration: 0.2 })
      .play();
  },
  onLeave: (el: any, done: any) => {
    toggleTransitionComplete(false);
    gsap.timeline({ paused: true, onComplete: done }).to(el, { alpha: 0, duration: 0.2 }).play();
  },
};

export default pageTransition;
