<script setup lang="ts">
import type { StepperItem } from '#ui/components/Stepper.vue';
import { z } from 'zod';
import { checkOnBoarding, createFirstAdmin } from '~/services/onboarding.service';

definePageMeta({
  layout: 'fullscreen',
});

useHead({
  title: 'Meltix | Embarquement',
});

const active = ref(0);
const stepper = useTemplateRef('stepper');
const hasCreated = ref(false);
const {fetchUser} = useAuth();
const items = [
  {
    title: 'Bienvenue',
    description: 'Découvrez Meltix',
    icon: 'i-lucide-house',
    slot: 'welcome' as const,
  },
  {
    title: 'Création de compte',
    description: 'Créer votre premier compte',
    icon: 'i-lucide-user',
    slot: 'account' as const,
  },
  {
    title: 'Explorer',
    description: 'Apprenez Meltix',
    icon: 'i-lucide-user',
    slot: 'explore' as const,
  },
] satisfies StepperItem[];

const formSchema = z.object({
  pseudo: z
    .string()
    .min(3, 'Le pseudo doit faire minimum 3 caractères')
    .max(50, 'Le pseudo doit faire moins de 50 caractères'),
  password: z.string().min(8, 'Le mot de passe doit faire 8 caractères'),
});

type FormData = z.output<typeof formSchema>;

const state = reactive<Partial<FormData>>({
  pseudo: '',
  password: '',
});

const handleCreateAccountAdmin = async () => {
  try {
    await createFirstAdmin(state.pseudo, state.password);
    await fetchUser();
    active.value++;
    hasCreated.value = true;
  } catch (error) {}
};

const handleRecheck = async () => {
  try{
    const t = await checkOnBoarding();
    localStorage.setItem('onboarding', t.toString());
    navigateTo('/');
  } catch(error){
    console.log(error);
  }
}
</script>

<template>
  <main>
    <UStepper v-model="active" :items="items" color="info" class="w-full" size="xl" ref="stepper">
      <template #welcome>
        <main class="border border-blue-300 mx-2 md:mx-10 rounded-3xl px-5 md:text-xl">
          <h2 class="text-center text-4xl font-inter italic mt-5 mb-10 font-semibold">
            Bienvenue sur <span class="font-poppins text-blue-300 text-6xl">Meltix</span>
          </h2>
          <p>
            Avec
            <span class="font-poppins italic font-semibold text-2xl text-blue-300">Meltix</span>
            vous pouvez regardé vos vidéos préférés présent sur votre nas. Tous cela gratuitement et
            sans abonnemnet honéreux.
          </p>
          <h3 class="font-bold italic my-5">Comment ca marche ?</h3>
          <p>
            C'est très simple vous avez indiquer un repertoire.
            <span class="font-poppins italic font-semibold text-2xl text-blue-300">Meltix</span>
            scan automatiquement le répertoire toutes les heures. Vous n'avez ensuite qu'a qualifié
            la vidéo et elle apparaîtra dans la page principale
          </p>
          <h3 class="font-bold italic my-5">Suis je le seul a pouvoir voir les vidéos ?</h3>
          <p>
            Bien évidement que non, vous pouvez créer autant de compte que vous le souhaitez et
            chacun pourra regarder ses propres videos en meme temps.
            <span class="text-3xl font-bold">Aucune limite</span>.
          </p>
          <div class="flex justify-end mt-10 mb-5">
            <p>
              L'équipe
              <span class="font-poppins italic font-semibold text-2xl text-blue-300">Meltix</span>
            </p>
          </div>
        </main>
      </template>
      <template #account>
        <main class="border border-blue-300 mx-2 md:mx-10 rounded-3xl md:text-xl">
          <h2 class="text-center text-3xl xl:text-4xl font-inter italic mt-5 mb-10 font-semibold">
            Création d'un compte <span class="font-poppins text-blue-300 text-6xl">Meltix</span>
          </h2>
          <div class="px-2 xl:mx-auto w-full xl:max-w-3/10 mt-5 mb-5 space-y-5">
            <p>
              Créer votre compte pour permettre d'administrer les videos, les catégories et les tags
              de chaque videos
            </p>
            <UForm
              :state="state"
              :schema="formSchema"
              class="w-full space-y-5"
              @submit="handleCreateAccountAdmin"
            >
              <UFormField name="pseudo" label="Votre pseudo" class="w-full" size="xl">
                <UInput v-model="state.pseudo" class="w-full" />
              </UFormField>
              <UFormField name="password" label="Votre mot de passe" class="w-full" size="xl">
                <UInput v-model="state.password" class="w-full" />
              </UFormField>
              <div class="flex justify-end w-full">
                <UButton
                  color="info"
                  size="xl"
                  type="submit"
                  class="w-full md:w-fit md:px-5 flex justify-center cursor-pointer"
                >
                  <p>Créer le compte</p></UButton
                >
              </div>
            </UForm>
          </div>
        </main>
      </template>
      <template #explore>
        <main class="border border-blue-300 mx-10 rounded-3xl">
          <section class="mx-10 space-y-5 mb-10">
            <h2 class="text-center text-4xl font-inter italic mt-5 mb-10 font-semibold">
              Entrer dans <span class="font-poppins text-blue-300 text-6xl">Meltix</span>
            </h2>
            <div>
              <h3 class="text-2xl font-semibold  flex items-center gap-2">
                🎬 <span>Importation de vos vidéos</span>
              </h3>
              <p class="mt-3  leading-relaxed">
                Pour rendre une vidéo accessible à l’ensemble de vos utilisateurs, commencez par
                <strong>l’importer</strong> et <strong>la définir</strong>. Chaque vidéo doit d’abord apparaître
                dans la zone <strong>administration</strong> — pour cela, elle doit être
                <strong>scannée</strong>. Le scan s’effectue automatiquement
                <strong>toutes les heures</strong>, mais vous pouvez aussi le
                <strong>déclencher manuellement</strong>.
              </p>
              <p class="mt-3 ">
                Une fois la vidéo détectée, vous pouvez :
              </p>
              <ul class="mt-2 list-disc list-inside  space-y-1">
                <li>Attribuer une <strong>description</strong> claire</li>
                <li>Choisir une <strong>catégorie</strong></li>
                <li><strong>Modifier le titre</strong></li>
                <li>Ajouter des <strong>tags</strong> pour la retrouver facilement</li>
              </ul>
            </div>

            <div>
              <h3 class="text-2xl font-semibold  flex items-center gap-2">
                🗂️ <span>Catégorisation des vidéos</span>
              </h3>
              <p class="mt-3 leading-relaxed">
                Les <strong>catégories</strong> permettent d’organiser vos vidéos selon leur
                <em>thématique principale</em>. Elles facilitent la navigation et la découverte de contenus similaires —
                par exemple : <em>Action</em>, <em>Aventure</em>, <em>Documentaire</em>.
              </p>
              <p>Une catégorie doit être créer avant de l'utiliser</p>
            </div>

            <div>
              <h3 class="text-2xl font-semiboldflex items-center gap-2">
                🔖 <span>Taguer vos vidéos</span>
              </h3>
              <p class="mt-3 leading-relaxed">
                Les <strong>tags</strong> servent à décrire votre vidéo de manière plus précise. Ajoutez-en autant que
                nécessaire : ils améliorent la <strong>recherche</strong> et aident vos utilisateurs à retrouver rapidement
                les contenus correspondant à leurs centres d’intérêt.
              </p>
            </div>
          </section>
        </main>
      </template>
    </UStepper>
    <div class="flex gap-2 justify-between mt-4 xl:mx-10 mx-2">
      <UButton
        leading-icon="i-lucide-arrow-left"
        color="info"
        :disabled="!stepper?.hasPrev"
        @click="stepper?.prev()"
      >
        Prev
      </UButton>

      <div v-if="stepper?.hasNext">
        <UButton
          trailing-icon="i-lucide-arrow-right"
          color="info"
          :disabled="active === 1 && hasCreated === false"
          @click="stepper?.next()"
        >
          Next
        </UButton>
      </div>
      <div v-else>
        <UButton
          trailing-icon="i-lucide-arrow-right"
          color="info"
          :disabled="hasCreated === false"
          @click="handleRecheck"
        >
          Aller vers Meltix
        </UButton>
      </div>
    </div>
  </main>
</template>
