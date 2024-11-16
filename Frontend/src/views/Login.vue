<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InputOtp from 'primevue/inputOtp';
import { useRouter } from 'vue-router';
import axios from '../axios';
import type { RefSymbol } from '@vue/reactivity';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import { useUserStore } from '@/stores/user'

const logInObject = ref({
  email: '',
  password: ''
})
const forgetPassword = ref({
  otpValue: '',
  newPinValue: '',
  confirmPinValue: '',
})
const signUpObject = ref({
  firstName: '',
  lastName: '',
  email: '',
  newPassword: '',
  confirmPassword: '',
})
const isSubmitting = ref(false)
const router = useRouter();
const toast = useToast();
const errors = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  newPassword: '',
  confirmPassword: '',
  otp: ''
});

const LOGIN_SCREEN = 'login';
const SIGNUP_SCREEN = 'signup';
const OTP_SCREEN = 'otp';
const SET_PIN_SCREEN = 'setpin';
const CONFIRM_PIN_SCREEN = 'confirmpin';

const loginScreens = [LOGIN_SCREEN, OTP_SCREEN, SET_PIN_SCREEN, CONFIRM_PIN_SCREEN];
const currentActiveScreen = ref(LOGIN_SCREEN);

const userStore = useUserStore()

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleLogin = async () => {
  // Reset errors
  errors.value.email = '';
  errors.value.password = '';

  // Validate
  if (!logInObject.value.email) {
    errors.value.email = 'Email is required';
    return;
  }
  if (!validateEmail(logInObject.value.email)) {
    errors.value.email = 'Please enter a valid email';
    return;
  }
  if (!logInObject.value.password) {
    errors.value.password = 'Password is required';
    return;
  }

  try {
    isSubmitting.value = true;
    const response = await axios.post("/auth/login", {
      email: logInObject.value.email,
      password: logInObject.value.password
    });

    if (response.data) {
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      userStore.setUser(user);
      toast.add({ severity: 'success', summary: 'Success', detail: 'Login successful', life: 3000 });
      router.push('/');
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'Login failed. Please try again.';
    toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};

const handleSignup = async () => {
  // Reset errors
  errors.value = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    newPassword: '',
    confirmPassword: '',
    otp: ''
  };

  // Validate
  if (!signUpObject.value.firstName) errors.value.firstName = 'First name is required';
  if (!signUpObject.value.lastName) errors.value.lastName = 'Last name is required';
  if (!signUpObject.value.email) errors.value.email = 'Email is required';
  if (!validateEmail(signUpObject.value.email)) errors.value.email = 'Please enter a valid email';
  if (!signUpObject.value.newPassword) errors.value.newPassword = 'Password is required';
  if (signUpObject.value.newPassword !== signUpObject.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match';
  }

  // Check if there are any errors
  if (Object.values(errors.value).some(error => error)) {
    return;
  }

  try {
    isSubmitting.value = true;
    const response = await axios.post("/api/users/create", {
      ...signUpObject.value,
      password: signUpObject.value.newPassword
    });

    if (response.data) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Account created successfully', life: 3000 });
      currentActiveScreen.value = LOGIN_SCREEN;
    }
  } catch (error: any) {
    const message = error.response?.data?.message || 'Signup failed. Please try again.';
    toast.add({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
};

const SendOtpToUser = async () => {
  const success = await axios.post("/auth/forgotpassword", { email: logInObject.value.email })
}

const VerifyOTP = async () => {
  const success = await axios.post("/auth/verifyOtp", { email: logInObject.value.email, otp: forgetPassword.value.otpValue })
  currentActiveScreen.value = SET_PIN_SCREEN
}

const UpdatePassword = async () => {
  const successs = await axios.post("/auth/updatePassword", { email: logInObject.value.email, password: forgetPassword.value.newPinValue })
  currentActiveScreen.value = LOGIN_SCREEN
}
</script>

<template>
  <Toast />
  <div class="bg-surface-50 dark:bg-surface-950 px-3 py-12 md:px-12 lg:px-20">
    <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border w-full mx-auto">
      <div class="text-center text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to Book Exchange
        System
      </div>
      <!-- LoginScreen -->
      <div class="w-full mb-6" v-if="currentActiveScreen !== SIGNUP_SCREEN">
        <label for="username" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">Email</label>
        <InputText v-model="logInObject.email!" required id="username" type="email" placeholder="Enter Email"
          :class="{ 'p-invalid': errors.email, 'w-full': true }" />
        <small class="p-error block" v-if="errors.email">{{ errors.email }}</small>
      </div>
      <!-- PasswordScreen -->
      <div v-if="currentActiveScreen === LOGIN_SCREEN" class="flex flex-col gap-4">
        <label class="text-surface-900 dark:text-surface-0 font-medium block">Password</label>
        <InputText v-model="logInObject.password" type="password" placeholder="Password" class="w-full" />
        <Button :label="isSubmitting ? 'Logging in...' : 'Login'" icon="pi pi-user" class="w-full orange-button"
          @click="handleLogin" :disabled="isSubmitting" />
        <div class="flex flex-row justify-between">
          <label for="forgetPassword">Forgot Password? <a class="cursor-pointer"
              @click="currentActiveScreen = OTP_SCREEN">Click here</a></label>
          <label for="signup">SignUp? <a @click="currentActiveScreen = SIGNUP_SCREEN">Click here</a></label>
        </div>
      </div>
      <!-- SIGNUP SCREEN -->
      <div v-if="currentActiveScreen === SIGNUP_SCREEN" class="flex flex-col gap-2">
        <label for="firstName" class="text-surface-900 dark:text-surface-0 font-medium block">First Name</label>
        <InputText v-model="signUpObject.firstName!" required :class="{ 'p-invalid': errors.firstName, 'w-full': true }"
          placeholder="Enter First Name" />
        <small class="p-error block" v-if="errors.firstName">{{ errors.firstName }}</small>
        <label for="lastName" class="text-surface-900 dark:text-surface-0 font-medium  block">Last Name</label>
        <InputText v-model="signUpObject.lastName!" required id="Last Name" type="Last Name"
          placeholder="Enter Last Name" class="w-full" />
        <label for="email" class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">Email</label>
        <InputText v-model="signUpObject.email!" required id="email" type="email" placeholder="Enter Email ID"
          class="w-full" />
        <label class="text-surface-900 dark:text-surface-0 font-medium block">Create Password</label>
        <InputText v-model="signUpObject.newPassword" type="password" placeholder="Password" class="w-full" />
        <label class="text-surface-900 dark:text-surface-0 font-medium block">ConfirmPin Password</label>
        <InputText v-model="signUpObject.confirmPassword" type="password" placeholder="Password" class="w-full" />
        <Button label="Login" icon="pi pi-user" class="w-full orange-button" @click="handleSignup" />
      </div>
      <!-- OTPScreen -->
      <div v-if="currentActiveScreen === OTP_SCREEN" class="flex flex-col gap-4">
        <label class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">Enter your OTP</label>
        <Button label="Send OTP" icon="pi pi-user" class="orange-button" @click.prevent="SendOtpToUser" />
        <InputOtp v-model="forgetPassword.otpValue!" mask integerOnly :length="6" variant="outlined"
          class="w-full inputOtp-otp" />
        <Button label="Continue" icon="pi pi-user" class="w-full orange-button" @click.prevent="VerifyOTP" />
      </div>
      <!-- SetPinScreen -->
      <div v-if="currentActiveScreen === SET_PIN_SCREEN" class="flex flex-col gap-4">
        <label class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">Reset Pin (Password)</label>
        <label> Enter New PIN for accessing the app quickly </label>
        <InputOtp v-model="forgetPassword.newPinValue!" mask integerOnly variant="outlined"
          class="w-full inputOtp-password" />
        <Button label="Continue" icon="pi pi-user" class="w-full orange-button" @click.prevent="UpdatePassword" />
      </div>
      <!-- ConfirmPinScreen -->
      <div v-if="currentActiveScreen === CONFIRM_PIN_SCREEN" class="flex flex-col gap-4">
        <label class="text-surface-900 dark:text-surface-0 font-medium mb-2 block">Almost there!</label>
        <label>One last step, please re-confirm your PIN</label>
        <InputOtp v-model="forgetPassword.confirmPinValue!" mask integerOnly variant="outlined"
          class="w-full inputOtp-password" />
        <Button label="Login" icon="pi pi-user" class="w-full orange-button" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-label {
  font-weight: normal;
  /* Removes bold */
  font-size: 14px;
  /* Reduces the text size */
}

.float-label {
  width: 100%;
  display: flex;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;

  /* Add these new styles */
  .p-inputtext {
    transition: border-color 0.2s;
  }

  .p-inputtext:enabled:focus {
    border-color: #2980b9;
    box-shadow: 0 0 0 1px #2980b9;
  }

  input:focus~label {
    color: #2980b9;
  }

  .p-select.p-focus {
    border-color: #2980b9;
    box-shadow: 0 0 0 1px #2980b9;
  }

  .p-inputtext:focus {
    border-color: #2980b9;
    box-shadow: 0 0 0 1px #2980b9;
  }

  /* Custom style to ensure the label floats only when value > 0 */
  .p-float-label-active .p-float-label label {
    transform: translateY(-1.25rem);
    /* Adjust this to control label position when floating */
    font-size: 0.75rem;
    /* Smaller font when label is floating */
  }

  .p-float-label label {
    font-size: 1rem;
    /* Default size when label is not floating */
    transform: translateY(0);
    /* Normal position */
    transition: transform 0.2s, font-size 0.2s;
    /* Smooth transition */
  }

}

.p-floatlabel:has(.p-inputwrapper-focus) label {
  color: #2980b9;
}

.inputOtp-password {
  display: flex;
  width: 100%;
  gap: 30px;
}

.inputOtp-password :deep(.p-inputotp-input) {
  flex: 1;
}

.inputOtp-otp {
  display: flex;
  width: 100%;
  gap: 6px;
}

.inputOtp-otp :deep(.p-inputotp-input) {
  flex: 1;
}

.orange-button {
  border-color: white;
  background-color: orange;
  /* Set the background color to orange */
  color: white;
  /* Optional: Set text color to white for better contrast */
}

/* Added min-width for the main container */
.bg-surface-0 {
  min-width: 300px;
  max-width: 30%;
  /* Set minimum width to 300px */
}
</style>
