<template>
    <!-- Container for a project card -->
    <div>
        <!-- Bootstrap Card component with project details -->
        <b-card class="p-0 org-card">
            <!-- Header section with project name -->
            <div class="media">
                <div class=" media-body overflow-hidden bg-primary card-header bg-card">
                    <h5 class="custom-title d-flex align-items-center mb-0">
                        <!-- File icon and project name -->
                        <i class="d-inline-block mdi cmh-icon mdi-file-document-outline"></i> {{ items.projectName }}
                    </h5>
                </div>
            </div>
            <!-- Footer details displaying user count and roles -->
            <div class="  mx-5 my-3 ">
                <div class="custom-headlines mb-2">
                    <span class="mr-2 text-primary">Total User :</span><span>{{ userList.length }}</span>
                </div>
                <div class="custom-headlines ">
                    <span class=" mr-2 text-primary">Role :</span><span>
                        <!-- Display user roles as a comma-separated list -->
                        <span>{{ items.userRole.join(", ") }}</span>
                    </span>
                </div>
            </div>
            <hr />
            <!-- Button to get project details -->
            <div>
                <button class="btn card-btn  text-primary view-details-btn btn-sm m-0 "
                    v-on:click="setdata(items.owner, items.projectName)">
                    <span class="mdi mdi-eye-outline mr-1"></span> View details
                </button>
            </div>
        </b-card>
    </div>
</template>

<script>
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";
import cryptoJs from "crypto-js";
import {
    secretKey
} from "../../../../api/global.env";

export default {
    props: {
        items: Object, // Project details passed as a prop
    },
    data() {
        return {
            item: [{
                text: "Dashboard",
                href: "/",
            },
            {
                text: "Projects",
                active: true,
            },
            ],
            modalShow: false,
            projectList: [],
            userList: [
                {
                    "userRole": [
                        "Author"
                    ],
                    "projectId": "632d977fcefee633c876e6c5",
                    "userId": "632c06e0f7b16423848d7764",
                    "githubUsername": "Pritica-DITAxPresso",
                    "githubEmail": "pritica.d@ditaxpresso.com",
                    "githubUserId": "1234598",
                    "acceptInvitation": true,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2022-09-23T11:37:16.914Z",
                    "updatedAt": "2022-09-23T11:39:32.534Z",
                    "id": "632d9a6ccefee633c876e6c7"
                },
                {
                    "userRole": [
                        "Author"
                    ],
                    "projectId": "632d977fcefee633c876e6c5",
                    "userId": "632c06e1f7b16423848d7765",
                    "githubUsername": "Vedantika-DITAxPresso",
                    "githubEmail": "vedantika.g@ditaxpresso.com",
                    "githubUserId": "12345",
                    "acceptInvitation": false,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2022-09-23T11:52:40.089Z",
                    "updatedAt": "2022-09-23T11:52:40.089Z",
                    "id": "632d9e08cefee633c876e6c8"
                }
            ]
            ,
            userRole: {},
            projectOwner: null,
            projectName: null,
        };
    },
    created() {
        this.userId = this.$store.state.Auth.userId;
    },

    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },

        setdata(owner, projectName) {
            // Set data in local storage and commit to the store
            localStorage.setItem(
                "repouser",
                cryptoJs.AES.encrypt(owner, secretKey).toString()
            );
            localStorage.setItem(
                "reponame",
                cryptoJs.AES.encrypt(projectName, secretKey).toString()
            );
            this.$store.commit("setRepoUser", owner);
            this.$store.commit("setRepoName", projectName);
            this.redirectProject(owner, projectName);
        },
        async redirectProject(repouser, reponame) {
            // Redirect to DocManager or display an error message
            if (this.items.userRole.includes("DocManager")) {
                const encryptedRepouser = CryptoJS.AES.encrypt(
                    repouser,
                    secretKey
                ).toString();
                const encryptedReponame = CryptoJS.AES.encrypt(
                    reponame,
                    secretKey
                ).toString();
                const encodedRepouser = encodeURIComponent(encryptedRepouser);
                const encodedReponame = encodeURIComponent(encryptedReponame);
                this.$router.push({
                    path: `/docmanager/${encodedRepouser}/${encodedReponame}`,
                });
            } else {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-primary btn-sm mr-2",
                        cancelButton: "btn btn-light btn-sm"
                    },
                    buttonsStyling: false
                });
                swalWithBootstrapButtons.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Sorry, you do not have access to DocManager. Please contact your administrator if you would like to access this feature. Thank you.",
                });
            }
        },
    },
};
</script>

<style lang="scss">
.custom-headlines {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;

}

.custom-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: center;
}

hr {
    margin-bottom: 0rem !important;
}

body {
    .bg-primary {
        background-color: rgba(207, 222, 233, 1) !important;
        color: #0f3460;

        h5 {
            color: #0f3460;
        }

        .cmh-icon {
            color: #0f3460;
        }
    }

    .btn-primary {
        background-color: #0f3460 !important;
        // color: #0f3460;
        font-weight: 500;
        border: none;
    }
}

body .org-card {
    overflow: hidden;

    .card-body {
        padding: 0;
    }

    .header {
        background: rgba(23, 37, 146, 0.85);
        color: #fff;

        .title {
            font-weight: 500;
            font-size: 15px;
        }
    }

    .details {
        color: #000;
        font-weight: 700;
    }

    .b-dropdown {
        button {
            border: 0;
            padding: 0;
            background: transparent;
            box-shadow: none;

            &:active {
                background: transparent !important;
                box-shadow: none !important;
            }
        }
    }

    .b-dropdown.show {
        button {
            border: 0;
            padding: 0;
            background: transparent;
            box-shadow: none;

            &:active {
                background: transparent !important;
                box-shadow: none !important;
            }
        }
    }

    &.deActive {
        .header {
            background: rgba(23, 37, 146, 0.45);
        }

        .details,
        .footer-details {
            opacity: 0.4;
            background: #f1f1f1;
        }
    }

    &.warningCard {
        .header {
            background-color: rgba(#fcb92c, 1);
        }
    }

    &.dangerCard {
        .header {
            background-color: rgba(#ff3d60, 1);
        }
    }

    .gap-y-3 div {
        margin-bottom: 0.75rem !important;
    }

    .mdi-eye-outline {
        font-size: 25px;
    }

    .card-btn {
        // margin: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        float: right;
    }
}
</style>
