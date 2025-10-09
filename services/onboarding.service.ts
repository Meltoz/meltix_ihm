import type { UserAdmin } from '~/models/userAdmin';

const endpoint  = "onboarding";

export const checkOnBoarding = async ():Promise<boolean> => {
  return await useFetchCustom<boolean>(`${endpoint}/checkonboarding`, {
    method: HTTP_METHODS.GET
  });
}

export const createFirstAdmin = async (pseudo: string, password: string):Promise<void> => {
  const user = {pseudo, password};

  return await useFetchCustom(`${endpoint}/createFirstAdmin`, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(user),
  });
}