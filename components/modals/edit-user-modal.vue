<script setup lang="ts">

import ModalItem from '~/components/modals/modal-item.vue';
import type { UserAdmin } from '~/models/userAdmin';
import { z } from 'zod';
import type { UserEdit } from '~/models/userEdit';

const props = defineProps<{
  user: UserAdmin,
}>();

const emit = defineEmits<{
  close: [UserEdit]
}>();

const roleItems = ref(['Admin', 'User']);

const formUserSchema = z.object({
  pseudo: z.string({required_error: "Le pseudo est obligatoire"})
    .min(3, 'Le pseudo doit faire minimum 3 caractères')
    .max(50, 'Le pseudo doit faire maximum 50 caractères'),
  password: z.string().optional(),
  role: z.string()
});

type FormData = z.output<typeof formUserSchema>;

const state = reactive<Partial<FormData>>({
  pseudo:  props.user.pseudo || '',
  password: '*****',
  role: props.user.role || 'User',
});

const handleSaveClick =() => {
  const {pseudo, password, role} = state;
  const user: UserEdit = {
    id: props.user.id,
    pseudo: pseudo,
    role: role,
    password: password !== '*****' ? password : undefined,
  };

  emit('close', user);
}

const generatePassword = () => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specials = "@$!%*?&";
  const all = lower + upper + digits + specials;

  const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];

  const length = 12; // tu peux changer (minimum 8)
  let passwordChars = [];

  passwordChars.push(getRandomChar(lower));
  passwordChars.push(getRandomChar(upper));
  passwordChars.push(getRandomChar(digits));
  passwordChars.push(getRandomChar(specials));


  while (passwordChars.length < length) {
    passwordChars.push(getRandomChar(all));
  }

  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  state.password = passwordChars.join("");
};
</script>

<template>
  <modal-item title="Modifier un utilisateur"
        description="Créer ou modifier un utilisateur">
    <template #content>
      <UForm :schema="formUserSchema"
             :state="state"
      class="space-y-5">
        <UFormField label="Pseudo" name="pseudo" >
          <UInput v-model="state.pseudo" class="w-full"/>
        </UFormField>

        <UFormField label="Mot de passe" name="password" >
          <div class="flex gap-2">
            <UInput v-model="state.password" class="w-8/12"/>
            <UButton color="info"
                     class="grow text-center flex flex-row justify-center"
            @click="generatePassword">Générer nouveau</UButton>
          </div>

        </UFormField>

        <UFormField label="Role" name="role">
          <USelect v-model="state.role" :items="roleItems" class="w-full" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="ml-auto space-x-2">
        <UButton color="neutral" variant="outline" label="Annuler" @click="() => emit('close', null)" class="cursor-pointer"/>
        <UButton color="info" label="Sauvegarder" @click="handleSaveClick" class="cursor-pointer" />
      </div>
    </template>
  </modal-item>
</template>

<style scoped>

</style>