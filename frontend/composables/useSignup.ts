import { ref } from "vue";
import { validatePassword } from "@/composables/usePasswordValidator";
import { AxiosService } from "@/composables/useAxios";
import { useAuthStore } from "@/stores/auth";
import type { SignupPayload, SignupResponse, PasswordErr } from "@/types/index";
import type { AxiosResponse } from "axios";

export class SignupService {
  passwordErrors = ref<PasswordErr>({
    minLength: false,
    containsUppercase: false,
    containsLowercase: false,
    containsNumber: false,
    containsSpecialChar: false,
  });
  public data;
  public error;
  public loading;
  private axiosService = new AxiosService<SignupResponse>();

  constructor(private readonly authStore = useAuthStore()) {
    this.data = this.axiosService.data;
    this.error = this.axiosService.error;
    this.loading = this.axiosService.loading;
  }

  updatePasswordErrors(password: string) {
    this.passwordErrors.value = validatePassword(password);
  }

  async signup(
    payload: SignupPayload
  ): Promise<AxiosResponse<SignupResponse> | undefined> {
    if (!payload.email || !payload.password) {
      throw new Error("All fields are required");
    }

    this.updatePasswordErrors(payload.password);

    const isValid = Object.values(this.passwordErrors.value).every(Boolean);

    if (!isValid) {
      throw new Error("Password does not meet the requirements");
    }

    const response = await this.axiosService.fetch(
      "/api/users/signup/",
      "POST",
      {
        requestData: payload as unknown as Record<string, unknown>,
      }
    );

    if (response?.data?.token) {
      this.authStore.setAuth(response.data.token, response.data.user.email);
    }
    return response;
  }
}
