<template>
  <div class="signup-form">
    <h2 class="signup-form__title">Create an account</h2>
    <form @submit.prevent="submit">
      <provet-stack>
        <provet-input
          :value="form.email"
          name="email"
          type="email"
          label="Email"
          data-cy="email"
          class="signup-form__input"
          :placeholder="form.email"
          expand
          required
          @input="(e) => form.email = e.target.value" 
        />
        <PasswordField v-model:password="form.password" />
        <provet-checkbox
          :checked="form.accepted"
          label="I accept the Terms of Service"
          required
          data-cy="terms" 
          @change="onAcceptChange"
          
        />

        <provet-button
          class="n-button n-button-primary n-color-text-weak n-inline-size-100p"
          type="submit"
          variant="primary"
          name="signup-form__button"
          label="Register"
          data-cy="register"
        >
          Register
        </provet-button>
      </provet-stack>
      <provet-toast-group ref="toastGroup" />
    </form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted } from "vue";
import { SignupService  } from "@/composables/useSignup";
import type { SignupPayload } from "@/types/index";

const router = useRouter();

const signupService = new SignupService()

const form = reactive<SignupPayload & { accepted: boolean }>({
  email: "",
  password: "",
  accepted: false,
});

const onAcceptChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  form.accepted = target?.checked || false;
};
const toastGroup = ref<HTMLElement | null>(null);

const addToast = (_notifMsg: string) => {
  if (toastGroup.value && "addToast" in toastGroup.value) {
    (toastGroup.value as any).addToast(_notifMsg, { autoDismiss: 30000 });
  }
};

onMounted(() => {
  if (!toastGroup.value) return;
  toastGroup.value.addEventListener("dismiss", (e: Event) => {
    const target = e.target as HTMLElement;
    target?.remove();
  });
});
const submit = async () => {
  if (!form.accepted) {
    addToast("You must accept the terms.");
    return;
  }

  try {
    await signupService.signup({
      email: form.email,
      password: form.password,
    });
    addToast("Registration successful!");
    router.push("/breweries");
  } catch (err: any) {
    addToast(err?.response?.data?.error || "Something went wrong");

  }
};
</script>
<style lang="scss"></style>
