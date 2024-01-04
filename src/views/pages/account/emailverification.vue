<template>
<div>
    <div>
        <!-- Container for the authentication page content -->
        <div class="container-fluid p-0">
            <div class="row no-gutters">
                <div class="col-lg-4">
                    <!-- Left side with authentication content -->
                    <div class="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                        <div class="w-100">
                            <div class="row justify-content-center">
                                <div class="col-lg-9">
                                    <div>
                                        <div class="text-center">
                                            <!-- Title and welcome message -->
                                            <h4 class="font-size-18 mt-4">Welcome !</h4>
                                            <p class="text-muted">
                                                Verify to continue to metR User.
                                            </p>
                                        </div>
                                        <!-- Alert for token expiration -->
                                        <b-alert v-if="isVerify == false" show variant="danger">
                                            Token Expired! If you want to get another link, you need to contact
                                            administrator using this email..
                                            <a href="mailto:techsupport@metr.com" class="text-decoration-underline">techsupport@metr.com</a>
                                        </b-alert>
                                        <!-- Alert for successful verification -->
                                        <b-alert v-else show variant="success">Your account is verified successfully and
                                            instructions will be sent to you on email!</b-alert>
                                        <div class="mt-5 text-center">
                                            <p>
                                                <!-- Copyright notice with current year -->
                                                {{ currentYear }} © ALL RIGHTS RESERVED BY metR TECHNOLOGY
                                                PRIVATE LIMITED
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8">
                    <!-- Right side with background image -->
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
        };
    },
    computed: {
        currentYear() {
            return new Date().getFullYear();
        }
    },
    mounted() {
        // Call the tokenVerify method when the component is mounted
        this.tokenVerify()
    },
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        async tokenVerify() {
            // Show a loader while verifying the token
            let loader = this.$loading.show({
                loader: "dots",
            });
            // Perform token verification
            this.$store.getters.client.put(`orguser/emailverification?token=${this.$route.params.token}`).then((response) => {
                    if (response.data.message === 'User Verified') {
                        this.isVerify = true
                    }
                    // Hide the loader
                    loader.hide();
                })
                .catch(() => {
                    // Hide the loader in case of an error
                    loader.hide();
                });
        },
    },
};
</script>
