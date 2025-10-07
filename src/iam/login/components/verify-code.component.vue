<template>
  <div class="verify-container">
    <pv-card class="verify-card">
      <template #title>
        <div class="card-title">
          <h2>Verify Your Identity</h2>
        </div>
      </template>
      <template #content>
        <p>
          We have sent a verification code to your email address. Please enter it below.
        </p>
        <div class="code-inputs">
          <pv-input-text
              v-for="i in 6"
              :key="i"
              v-model="code[i-1]"
              @input="handleInput(i, $event)"
              @keydown="handleKeyDown(i, $event)"
              :ref="`codeInput${i}`"
              class="code-input"
              maxlength="1"
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </template>
      <template #footer>
        <pv-button label="Verify" @click="submitCode" :disabled="isVerifying" class="verify-button" />
      </template>
    </pv-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "verify-code",
  data() {
    return {
      code: new Array(6).fill(''),
      errorMessage: '',
      isVerifying: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.codeInput1[0].$el.focus();
    });
  },
  computed: {
    ...mapGetters("user", ["userRole"])
  },
  methods: {
    ...mapActions("user", ["verifyCodeAndLogin"]),

    handleInput(index, event) {
      const value = event.target.value;
      if (value.length === 1 && index < 6) {
        const nextInputRef = this.$refs[`codeInput${index + 1}`];
        if (nextInputRef && nextInputRef[0]) {
          nextInputRef[0].$el.focus();
        }
      }
    },
    handleKeyDown(index, event) {
      if (event.key === 'Backspace' && index > 1 && !this.code[index - 1]) {
        const prevInputRef = this.$refs[`codeInput${index - 1}`];
        if (prevInputRef && prevInputRef[0]) {
          prevInputRef[0].$el.focus();
        }
      }
    },
    async submitCode() {
      this.isVerifying = true;
      this.errorMessage = '';
      const fullCode = this.code.join('');

      if (fullCode.length !== 6) {
        this.errorMessage = 'Please enter the complete code.';
        this.isVerifying = false;
        return;
      }

      try {
        const username = this.$route.query.email;
        const payload = { username: username, code: fullCode };

        console.log("Sending to backend for verification:", payload);

        await this.verifyCodeAndLogin(payload);

        if (this.userRole === "RoleAdmin") {
          this.$router.push("/dashboard-admin/home-admin");
        } else if (this.userRole === "RoleTeacher") {
          this.$router.push("/dashboard-teacher/home-teacher");
        } else {
          this.$router.push({ name: 'home' });
        }

      } catch (error) {
        console.error("Backend error:", error);
        this.errorMessage = 'The code is incorrect or has expired. Please try again.';
      } finally {
        this.isVerifying = false;
      }
    },
  },
};
</script>

<style scoped>
.verify-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.verify-card {
  width: 400px;
  text-align: center;
}
.code-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}
.code-input {
  width: 40px;
  text-align: center;
  font-size: 1.5rem;
}
.error-message {
  color: red;
  margin-top: 10px;
}
.verify-button {
  width: 100%;
}
</style>