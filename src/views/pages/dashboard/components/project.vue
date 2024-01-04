<template>
    <div>
        <!-- Card component for displaying a list of projects -->
        <div class="card">
            <div class="custom-notifications d-flex justify-content-between align-items-center flex-wrap">
                <div class="custom-title mb-0">
                    Projects
                </div>
                <div>
                    <button class="btn text-primary view-details-btn btn-sm m-0" @click="viewMore">
                        <span class="mdi mdi-eye-outline mr-2"></span> View details
                    </button>
                </div>
            </div>
            <div data-simplebar class="card-body border-top py-2 mb-3">
                <div class="table-responsive table-size">
                    <table class="table table-hover font-size-14 mb-0">
                        <tbody>
                            <!-- Skeleton loading table when 'showSpinner' is true -->
                            <b-skeleton-table v-if="showSpinner" :rows="5" :columns="2"
                                :table-props="{ bordered: true, striped: true }"></b-skeleton-table>
                            <!-- Render project list when available and not loading -->
                            <template v-else-if="projectList && projectList.length > 0 && !showSpinner">
                                <tr v-for="(item, index) in displayedProjects" :key="item.id">
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="mr-3">
                                                <span class="avatar rounded-circle">
                                                    <i class="ri-folder-fill ri-lg text-primary"></i>
                                                </span>
                                            </div>
                                            <div>
                                                <h5 class="font-size-13 mb-1 text-uppercase">{{
                                                    projectList[index].projectName }}</h5>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                            </template>
                            <!-- Display a message when no projects are available -->
                            <template v-else>
                                <tr>
                                    <td colspan="2" class="text-center font-size-14 custom-margin">
                                        <div class="custom-container">
                                            <img class="custom-image" src="../../../../assets/placeholder.png" />
                                            <div class="custom-text">
                                                No Projects added
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props: {
        items: Object,
    },
    data() {
        return {
          
            projectList: [
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
            ], // List of user projects
            showSpinner: true, // Show a loading spinner initially
            displayedProjects: 5,
        };
    },
    mounted() {
        this.showSpinner = false;

    },
    methods: {

        viewMore() {
            this.$router.push({
                name: 'DocManager'
            });
        },

        // Redirect to the project page
        async redirectProject() {
            this.$router.push({
                path: `/docmanager`
            });
            // location.reload();
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

.card {
    min-height: 85vh;
}

.custom-margin {
    margin-top: 10px;
}

.custom-container {
    position: relative;
    display: inline-block;
}

.view-details-btn {
    background-color: rgba(113, 165, 203, 0.2);
}

.custom-image {
    height: 200px;
    /* margin-bottom: 30px; */
}

.custom-text {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: #666;
    padding-top: 0px;
    font-size: 16px;
}

.btn {
    white-space: nowrap;
}
</style>
