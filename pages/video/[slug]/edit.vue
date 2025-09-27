<script setup lang="ts">
import { useDetailVideo, useUpdateVideo } from '~/composables/query/video.query';
import { z } from 'zod';
import { useAllCategories } from '~/composables/query/category.query';
import { useDebounce } from '@vueuse/shared';
import type { Video } from '~/models/video';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';

const route = useRoute();
const config = useRuntimeConfig();
const slug = computed(() => route.params.slug);
const { video, isVideoSuccess } = useDetailVideo(slug);

const categoriesSearched = ref<string>('');
const debouncedSearch = useDebounce(categoriesSearched, 400);

const { allCategories } = useAllCategories(0,100,debouncedSearch);

const { updateVideoAsync } = useUpdateVideo();

const videoRef = ref<HTMLVideoElement | null>(null)
const currentTime = ref(0);


const formDataSchema = z.object({
  title: z
    .string({required_error: 'Le titre est obligatoire'})
    .min(6, 'Le titre doit faire plus que 6 caractères')
    .max(50, 'Le titre doit faire moins de 50 caractères'),
  description: z
    .string({ required_error: 'La description est obligatoire' })
    .min(6, { message: 'La description doit contenir 6 caractères minimum' })
    .max(500),
  tags: z.array(z.string()).optional(),
  categoryName: z.string({ required_error: 'La catégorie est obligatoire' }),
});
type FormData = z.output<typeof formDataSchema>;

const state = reactive<Partial<FormData>>({
  title: '',
  description: '',
  categoryName: video?.value?.category === 'No category' ? undefined : video.value?.category,
  tags: [],
});


async function handleClickSave(event: FormSubmitEvent<FormData>) {
  const videoToUpdate = {
    title: state.title,
    id: video.value?.id,
    category: state.categoryName,
    description: state.description,
    tags: state.tags,
  } as Video;

  try {
    await updateVideoAsync(videoToUpdate);
    navigateTo('/');
  } catch (error) {
    console.log(error);
  }
}

function onFormError(event: FormErrorEvent) {
  console.log('Formulaire invalide ❌', event);
}

watch(video, (newVideo) => {
  if (newVideo) {
    state.title = newVideo.title;
    state.description = newVideo.description;
    state.categoryName =
      newVideo.category === 'No category' ? undefined : newVideo.category;
    state.tags = newVideo.tags ?? [];
  }
},{immediate: true});
</script>

<template>
  <main class="mx-2 xl:mx-16 font-inter w-full">
    <h2 class="font-poppins text-2xl xl:text-4xl xl:my-10 my-2">
      Édition <i class="italic">"{{ video?.title }}"</i>
    </h2>
    <section class="flex flex-col xl:flex-row justify-between gap-10">
      <video
        ref="videoRef"
        controls
        class="max-h-[49vh] max-w-[40rem] basis-1/2 bg-black rounded-lg w-full aspect-video"
        v-if="video"
      >
        <source
          :src="`${config.public.apiBaseUrl}/api/video/GetVideo?slug=${video?.slug}`"
          type="video/mp4"
        />
        Votre navigateur ne supporte pas la vidéo HTML5.
      </video>
      <UForm
        :schema="formDataSchema"
        :state="state"
        class="basis-full xl:basis-1/2 space-y-6 grow"
        @submit="handleClickSave"
        @error="onFormError"
      >
        <UFormField name="title">
          <label class="text-sm">Titre</label>
          <UInput v-model="state.title" class="font-poppins w-full" size="xl" />
        </UFormField>
        <UFormField label="Description" name="description">
          <UTextarea v-model="state.description" class="field-sizing-content w-full font-inter" />
        </UFormField>
        <div class="flex flex-col xl:flex-row w-full xl:gap-10 space-y-6">
          <UFormField name="categoryName" label="Catégorie" class="basis-1/4">
            <UInputMenu
              class="w-full"
              :items="allCategories.categories"
              v-model="state.categoryName"
              value-key="name"
              label-key="name"
            />
          </UFormField>
          <fieldset class="grow">
            <label class="text-sm">Tags</label>
            <UInputTags v-model="state.tags" add-on-tab :delimiter="','" class="w-full" />
          </fieldset>
        </div>
        <fieldset>
          <UFileUpload
            icon="i-lucide-image"
            label="Drop your image here"
            description="JPG (max. 2MB)"
            class="w-full max-h-40"
            disabled
          />
        </fieldset>
        <div class="flex justify-end my-5">
          <UButton color="info" size="xl" type="submit">Sauvegarder</UButton>
        </div>
      </UForm>
    </section>
  </main>
</template>
