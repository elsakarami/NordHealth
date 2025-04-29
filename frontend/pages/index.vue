<template>
  <div class="sign-up-wrapper">
    <div class="sign-up-wrapper__inner">
      <div class="sign-up-wrapper__inner__img">
        <img src="/assets/images/signup-img.png" alt="signup" loading="eager" >
      </div>
      <SignupForm />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: "default" });
</script>
