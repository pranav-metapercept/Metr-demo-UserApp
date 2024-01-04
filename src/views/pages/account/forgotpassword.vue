<template>
    <div>
        <div>
            <div class="container-fluid p-0">
                <div class="row no-gutters">
                    <div class="col-lg-4">
                        <div class="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                            <div class="w-100">
                                <div class="row justify-content-center">
                                    <div class="col-lg-9">
                                        <div>
                                            <div class="text-center">
                                                <!-- Title and description -->
                                                <h4 class="font-size-18 mt-4">Reset Password</h4>
                                                <p class="text-muted">Reset your password to metR.</p>
                                            </div>
                                            <!-- Display alert when email is sent for password reset -->
                                            <b-alert v-if="isEmailSend === true" show variant="danger">
                                                Check your email for a link to reset your password. If it doesn’t appear
                                                within a few minutes, check your spam folder.
                                                <br />
                                                <div class="mt-4 text-center">
                                                    <!-- Link to login page -->
                                                    <router-link tag="a" to="/"
                                                        class="btn btn-sm btn-primary w-md waves-effect waves-light">
                                                        Log In
                                                    </router-link>
                                                </div>
                                            </b-alert>
                                            <div v-else class="p-2 mt-5">
                                                <!-- Display error alert if there's a reset error -->
                                                <b-alert v-model="isResetError" class="mb-4" variant="danger" dismissible>{{
                                                    error }}</b-alert>
                                                <!-- Password reset form -->
                                                <form class="form-horizontal" @submit.prevent="forgotpassword">
                                                    <!-- Success message -->
                                                    <div class="alert alert-success mb-4" role="alert">Enter your Email, and
                                                        instructions will be sent to you!</div>
                                                    <!-- Email input -->
                                                    <div class="form-group auth-form-group-custom mb-4">
                                                        <i class="ri-mail-line auti-custom-input-icon"></i>
                                                        <label for="email">Email</label>
                                                        <input v-model="email" class="form-control" id="email"
                                                            v-validate="'required|email'" name="email"
                                                            placeholder="Enter email" :class="{
                                                                'is-invalid': submitted && $v.email.$error,
                                                            }" />
                                                        <p class="text-danger text-sm" v-show="errors.has('email')">
                                                            {{ errors.first("email") }}
                                                        </p>
                                                        <!-- Display error messages -->
                                                        <div v-if="submitted && $v.email.$error" class="invalid-feedback">
                                                            <span v-if="!$v.email.required">Email is required.</span>
                                                            <span v-if="!$v.email.email">Please enter a valid email.</span>
                                                        </div>
                                                    </div>
                                                    <div class="mt-4 text-center">
                                                        <!-- Button to submit the password reset request -->
                                                        <button class="btn btn-sm btn-primary w-md waves-effect waves-light"
                                                            type="submit">
                                                            Send password reset email
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="mt-5 text-center">
                                                <p>
                                                    <!-- Copyright notice -->
                                                    {{ new Date().getFullYear() }} © ALL RIGHTS RESERVED BY METAPERCEPT
                                                    TECHNOLOGY SERVICES
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="authentication-bg">
                            <div class="bg-overlay"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isVerify: false,
            email: "",
            submitted: false,
            error: null,
            tryingToReset: false,
            isResetError: false,
            isEmailSend: false
        };
    },
    created() { },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        forgotpassword() {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    let loader = this.$loading.show({
                        loader: "dots",
                    });
                    this.$store.getters.client
                        .post(`/orguser/forgotpassword`, {
                            email: this.email
                        })
                        .then((res) => {
                            loader.hide();
                            if (res && res.data) {
                                if (res.data.message === "success") {
                                    this.isEmailSend = true;
                                } else {
                                    this.isEmailSend = false;
                                    // Display an error message using a message toast
                                    this.messageToast("Error", "danger", res.data.message);
                                }
                            } else {
                                this.isEmailSend = false;
                                // Handle the case where response or response.data is empty
                                this.messageToast("Error", "danger", "An error occurred");
                            }
                        })
                        .catch((error) => {
                            this.isEmailSend = false;
                            loader.hide();
                            // Handle the error and display an error message using a message toast
                            this.messageToast("Error", "danger", error.response ? error.response.data.message : 'An error occurred');
                        });
                }
            });
        }
    },
};
</script>
<style scoped>
.auth-form-group-custom .auti-custom-input-icon {
    top: 30px;
}
</style>
