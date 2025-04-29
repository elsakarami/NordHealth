<template>
  <provet-stack class="passowrd-field">
    <provet-input
      :value="localPassword"
      label="Password"
      class="password-field__input"
      :type="showPassword ? 'text' : 'password'"
      expand
      name="password"
      data-cy="password"
      required
      @input="(e) => localPassword = e.target.value" 
    >
      <provet-button
        slot="end"
        label="showPassword"
        square
        name="password-tooltip"
        @click.prevent="togglePassword"
      >
        <provet-icon v-if="!showPassword" name="interface-edit-on" />
        <provet-icon v-else name="interface-edit-off" />
      </provet-button>
    </provet-input>
    <provet-tooltip id="password-tooltip">Show / hide password</provet-tooltip>
    <provet-progress-bar :value="passwordScore" :style="progressBarStyle" />
    <ul class="password-field__errors-list errors-list">
      <li
        v-for="(passed, key) in passwordErrors"
        :key="key"
        class="errors-list__item"
      >
        <provet-icon
          size="s"
          :name="passed ? 'interface-checked' : 'interface-close'"
          :label="passwordMessages[key]"
          :style="{ color: getColor(passed) }"
        />
        <span :style="{ color: getColor(passed) }">
          {{ passwordMessages[key] }}
        </span>
      </li>
    </ul>
  </provet-stack>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { PasswordValidator } from "@/composables/usePasswordValidator";
import { SignupService } from "@/composables/useSignup";

const props = defineProps<{ password: string }>();
const emit = defineEmits<{
  (e: "update:password", value: string): void;
}>();

const showPassword = ref(false);
const localPassword = ref(props.password);

const signupService = new SignupService();

watch(localPassword, (val) => {
  emit("update:password", val);
});

watch(
  () => props.password,
  (val) => {
    if (val !== localPassword.value) {
      localPassword.value = val;
    }
  }
);

watch(localPassword, (val) => {
  signupService.updatePasswordErrors(val);
});
const validator = computed(() => new PasswordValidator(localPassword.value));
const passwordScore = computed(() => validator.value.strength);
const progressBarStyle = computed(
  () => `
  --n-progress-color: ${validator.value.statusColor};
  --n-progress-border-radius: var(--n-border-radius-round);
  --n-progress-size: var(--n-space-small);
`
);

const passwordMessages: Record<string, string> = {
  minLength: "At least 8 characters",
  containsUppercase: "Must include an uppercase letter",
  containsLowercase: "Must include a lowercase letter",
  containsNumber: "Must include a number",
  containsSpecialChar: "Must include a special character",
};

const getColor = (passed: boolean) =>
  passed ? "var(--n-color-text-success)" : "var(--n-color-text-error)";

const passwordErrors = signupService.passwordErrors;

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>
