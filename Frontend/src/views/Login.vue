<template>
  <div class="login-container card">
    <h3>Login</h3>
    <form
      @submit.prevent="handleSubmit(!v$.$invalid)"
      class="p-fluid login-form"
    >
      <div class="p-field login-field">
        <label
          for="email"
          :class="{ 'p-invalid': v$.email.$invalid && submitted }"
        >
          Email</label
        >
        <div class="p-float-label p-input-icon-right">
          <i class="pi pi-envelope" />

          <InputText
            id="email"
            v-model="v$.email.$model"
            :class="{ 'p-invalid': v$.email.$invalid && submitted }"
            aria-describedby="email-error"
          />
        </div>
        <span v-if="v$.email.$error && submitted">
          <span
            id="email-error"
            v-for="(error, index) of v$.email.$errors"
            :key="index"
          >
            <small class="p-error">{{ error.$message }}</small>
          </span>
        </span>
        <small
          v-else-if="
            (v$.email.$invalid && submitted) || v$.email.$pending.$response
          "
          class="p-error"
          >{{ v$.email.required.$message.replace("Value", "Email") }}</small
        >
      </div>
      <div class="p-field login-field">
        <label
          for="password"
          :class="{ 'p-error': v$.password.$invalid && submitted }"
        >
          Password</label
        >
        <div class="p-float-label">
          <Password
            id="password"
            v-model="v$.password.$model"
            :feedback="false"
            :indicator="false"
            toggleMask
            :class="{ 'p-invalid': v$.password.$invalid && submitted }"
          >
          </Password>
        </div>
        <small
          v-if="
            (v$.password.$invalid && submitted) ||
              v$.password.$pending.$response
          "
          class="p-error"
          >{{
            v$.password.required.$message.replace("Value", "Password")
          }}</small
        >
      </div>
      <Button type="submit" label="Prijava" />

      <Toast
        position="bottom-center"
        group="bc"
        :breakpoints="{ '700px': { width: '85vw' } }"
        :closable="false"
      >
        <template #message="slotProps">
          <div class="p-d-flex p-flex-column">
            <div class="p-text-center">
              <h4>{{ slotProps.message.summary }}</h4>
              <p>{{ slotProps.message.detail }}</p>
            </div>
          </div>
        </template>
      </Toast>
    </form>
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { mapActions } from "vuex";
import api from "@/api/api";

export default {
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      submitted: false,
    };
  },
  validations() {
    return {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    };
  },
  mounted() {},
  methods: {
    ...mapActions(["setCookie"]),
    async handleSubmit(isFormValid) {
      this.submitted = true;
      if (!isFormValid) {
        this.resetForm();
        return;
      } else {
        this.loading = true;
        let data = await api.login(this.email, this.password);
        if (data.security_token == "0" || !data.security_token) {
          this.resetForm();
          this.showToast();
          this.setCookie(null);
          // redirect
        } else {
          this.setCookie(data.security_token);
          this.$router.push({ name: "dashboard" });
        }
        this.loading = false;
      }
    },
    resetForm() {
      this.password = "";
      this.submitted = false;
    },
    showToast() {
      this.$toast.add({
        severity: "error",
        summary: "Incorrect email or password",
        detail: "Try again",
        group: "bc",
        life: 3000,
        closable: false,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.login-container {
  padding: 0 20px 0 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.login-form {
  max-width: 350px;
  width: 100%;
}
.login-field {
  margin-bottom: 20px;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.p-d-flex {
  flex: 1;
}

label {
  width: 100%;
  text-align: left;
}
</style>
