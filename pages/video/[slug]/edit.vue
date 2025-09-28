<script setup lang="ts">
import { useDetailVideo, useUpdateVideo } from '~/composables/query/video.query';
import { z } from 'zod';
import { useAllCategories } from '~/composables/query/category.query';
import { useDebounce } from '@vueuse/shared';
import type { VideoEdit } from '~/models/video';
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
const useTimecode:Ref<"none" | "timecode" | "img"> = ref("none")

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg']

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
  timecode: z.string().optional(),
  img:  z.preprocess(
    (val) => {
      if (val instanceof FileList) {
        return val.length > 0 ? val[0] : undefined; // prendre le 1er fichier ou rien
      }
      if (val === "" || val === null) return undefined;
      return val;
    },
    z.instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "L'image est trop lourde (2MB)",
      })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
        message: 'Please upload a valid image file (JPEG, PNG, or WebP).',
      })
      .optional()
  ),
});
type FormData = z.output<typeof formDataSchema>;

const state = reactive<Partial<FormData>>({
  title: '',
  description: '',
  categoryName: video?.value?.category === 'No category' ? undefined : video.value?.category,
  tags: [],
  timecode: '',
  img: '',
});


async function handleClickSave(event: FormSubmitEvent<FormData>) {
  const videoToUpdate = {
    title: state.title,
    id: video.value?.id,
    category: state.categoryName,
    description: state.description,
    tags: state.tags,
    timecode: useTimecode.value === 'timecode' ? state.timecode : undefined,
    img: useTimecode.value === 'img' ? state.img : undefined,
  } as VideoEdit;

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


const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time% 60)
  const milliseconds = Math.floor((time % 1) * 1000) // partie décimale
  return `${hours}:${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds
    .toString()
    .padStart(3, '0')}`
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

watch(videoRef, (newVideo) => {
  videoRef.value.addEventListener('timeupdate', () => {
    state.timecode = formatTime(videoRef.value?.currentTime)
  })
})
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
        <div>
          <h2 class="text-sm">Thumbnail</h2>
          <div class="flex gap-5">
            <button type="button" @click="useTimecode='none'">Pas de mise à jour</button>
            <button type="button" @click="useTimecode='timecode'">Utiliser un timecode</button>
            <button type="button" @click="useTimecode='img'">Utiliser une image</button>
          </div>

          <fieldset v-if="useTimecode=== 'img'">
            <UFileUpload
              v-model="state.img"
              icon="i-lucide-image"
              label="Drop your image here"
              description="JPG (max. 2MB)"
              class="w-full max-h-40"
            />
          </fieldset>
          <fieldset v-else-if="useTimecode === 'timecode'">
            Timecode actuel : {{state.timecode}}
          </fieldset>
          <fieldset v-else>
            Pas de mise à jour de thumbnail
          </fieldset>
        </div>

        <div class="flex justify-end my-5">
          <UButton color="info" size="xl" type="submit">Sauvegarder</UButton>
        </div>
      </UForm>
    </section>
  </main>
</template>
