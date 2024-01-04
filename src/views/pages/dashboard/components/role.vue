<template>
    <!-- Card component for displaying user roles in projects -->
    <div>
        <div class="card">
            <div class="custom-notifications d-flex justify-content-between align-items-center flex-wrap">
                <div class="custom-title mb-0">
                    Roles
                </div>
                <div>
                    <button class="btn text-primary view-details-btn btn-sm m-0" @click="viewMore">
                        <span class="mdi mdi-eye-outline mr-2"></span> View details
                    </button>
                </div>
            </div>
            <div data-simplebar class="card-body border-top py-2 mb-3 ">
                <div class="custom-height">
                    <!-- Show skeleton loading table when 'showSpinner' is true -->
                    <b-skeleton-table v-if="showSpinner" :rows="5" :columns="2"
                        :table-props="{ bordered: true, striped: true }"></b-skeleton-table>
                    <!-- Render project roles when data is available and not loading -->
                    <div v-else-if="projectsWithRole.length > 0 && !showSpinner">
                        <div class="table-responsive">
                            <table class="table table-hover font-size-14 mb-0">
                                <thead>
                                    <tr>
                                        <th>
                                            <div class="font-weight-bold font-size-16">Project</div>
                                        </th>
                                        <th>
                                            <div class="font-weight-bold font-size-16">Role</div>
                                        </th>
                                    </tr>
                                    <!-- Display "View More" button -->
                                </thead>
                                <tbody>
                                    <!-- Loop through projects and their associated roles -->
                                    <tr v-for="projectId in projectsWithRole" :key="projectId.id">
                                        <td>
                                            <h5
                                                class="font-size-13 text-uppercase ptitle-cust-cls mb-0 custom-project-name">
                                                {{ projectId.projectName }}
                                            </h5>
                                        </td>
                                        <td>
                                            {{ projectId.userRole.join(', ') }}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <!-- Display a message when no projects are added -->
                    <li v-else class="list-unstyled activity-wid">
                        <div class="d-flex justify-content-center align-items-center m-0 p-0">
                            <div class="text-center">
                                <img class="custom-image" src="../../../../assets/placeholder.png" />
                                <div class="custom-text">
                                    No projects added
                                </div>
                            </div>
                        </div>
                    </li>
                </div>
            </div>
        </div>
    </div>
</template>
  <!-- Rest of your script and style tags remain unchanged -->
<script>
export default {
    data() {
        return {
            showSpinner: true,
            modalShow: false,
            projectsWithRole: [
                {
                    "userRole": [
                        "DocManager",
                        "DocPublisher",
                        "DocEditor",
                        "DocMigration"
                    ],
                    "_id": "6595132d7883623234585dba",
                    "projectId": "65950c567883623234585db8",
                    "projectName": "learning",
                    "userId": "6595087f7883623234585d6f",
                    "githubUsername": "Jyoti-Metapercept",
                    "githubEmail": "jyotikamal.s@metapercept.com",
                    "githubUserId": "124129047",
                    "acceptInvitation": false,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2024-01-03T06:13:10.000Z",
                    "updatedAt": "2024-01-03T07:56:29.087Z",
                    "__v": 0,
                    "owner": "pranav-metapercept"
                },
                {
                    "userRole": [
                        "DocManager",
                        "DocPublisher",
                        "DocEditor",
                        "DocMigration"
                    ],
                    "_id": "6595132f7883623234585dbb",
                    "projectId": "65950c557883623234585db6",
                    "projectName": "ditamap-01",
                    "userId": "6595087f7883623234585d6f",
                    "githubUsername": "Jyoti-Metapercept",
                    "githubEmail": "jyotikamal.s@metapercept.com",
                    "githubUserId": "124129047",
                    "acceptInvitation": false,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2024-01-03T06:09:05.000Z",
                    "updatedAt": "2024-01-03T07:56:31.467Z",
                    "__v": 0,
                    "owner": "pranav-metapercept"
                },
                {
                    "userRole": [
                        "DocManager",
                        "DocPublisher",
                        "DocEditor",
                        "DocMigration"
                    ],
                    "_id": "659513297883623234585db9",
                    "projectId": "65950c557883623234585db5",
                    "projectName": "it-book",
                    "userId": "6595087f7883623234585d6f",
                    "githubUsername": "Jyoti-Metapercept",
                    "githubEmail": "jyotikamal.s@metapercept.com",
                    "githubUserId": "124129047",
                    "acceptInvitation": false,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2024-01-03T05:34:46.000Z",
                    "updatedAt": "2024-01-03T07:56:25.394Z",
                    "__v": 0,
                    "owner": "pranav-metapercept"
                },
                {
                    "userRole": [
                        "DocManager",
                        "DocPublisher",
                        "DocEditor",
                        "DocMigration"
                    ],
                    "_id": "659513327883623234585dbc",
                    "projectId": "65950c547883623234585db3",
                    "projectName": "EnableXSmoothDoc",
                    "userId": "6595087f7883623234585d6f",
                    "githubUsername": "Jyoti-Metapercept",
                    "githubEmail": "jyotikamal.s@metapercept.com",
                    "githubUserId": "124129047",
                    "acceptInvitation": false,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2023-09-25T05:15:25.000Z",
                    "updatedAt": "2024-01-03T07:56:34.467Z",
                    "__v": 0,
                    "owner": "gurupawar05"
                },
                {
                    "userRole": [
                        "DocManager",
                        "DocPublisher",
                        "DocEditor",
                        "DocMigration"
                    ],
                    "_id": "659513357883623234585dbd",
                    "projectId": "65950c527883623234585da7",
                    "projectName": "DocEditorResearech",
                    "userId": "6595087f7883623234585d6f",
                    "githubUsername": "Jyoti-Metapercept",
                    "githubEmail": "jyotikamal.s@metapercept.com",
                    "githubUserId": "124129047",
                    "acceptInvitation": false,
                    "isActive": true,
                    "isDeleted": false,
                    "createdAt": "2023-06-28T12:13:14.000Z",
                    "updatedAt": "2024-01-03T07:56:37.837Z",
                    "__v": 0,
                    "owner": "Jyoti-Metapercept"
                }
            ], // List of projects with user roles
            userId: null,
        };
    },
    mounted() {

        this.showSpinner = false;

    },
    methods: {
        viewMore() {
            this.$router.push({
                name: 'userrole'
            });
        },

    },
};
</script>
<style scoped>
.custom-notifications {
    padding: 14px;
    gap: 24px;
}

.custom-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0.5px;
    text-align: left;
    color: rgba(23, 35, 61, 1);
}

.view-details-btn {
    background-color: rgba(113, 165, 203, 0.2);
}

.card {
    height: 40vh;
}

.custom-card-header {
    background-color: #3F979B;
}

.custom-height {
    height: 40vh;
}

.custom-project-name {
    font-size: 13px;
    text-transform: uppercase;
}

.custom-image {
    height: 200px;
}

.custom-text {
    color: #666;
    font-size: 16px;
}
</style>
