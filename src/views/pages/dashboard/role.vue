<template>
    <!-- Card component for displaying user roles in projects -->
    <div>
        <div class="card">
            <div class="custom-notifications d-flex justify-content-between align-items-center flex-wrap">
                <div class="custom-title mb-0">
                    Roles
                </div>
                <!-- <div>
                    <button class="btn text-primary view-details-btn btn-sm m-0" @click="viewMore">
                        <span class="mdi mdi-eye-outline mr-2"></span> View details
                    </button>
                </div> -->
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
                                <img class="custom-image" src="../../../assets/placeholder.png" />
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
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"6595132d7883623234585dba",
         "projectId":"65950c567883623234585db8",
         "projectName":"Flowers",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User1-Metapercept",
         "githubEmail":"user1@metapercept.com",
         "githubUserId":"123456789",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2024-01-03T06:13:10.000Z",
         "updatedAt":"2024-01-03T07:56:29.087Z",
         "__v":0,
         "owner":"owner1-metapercept"
      },
      {
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"6595132f7883623234585dbb",
         "projectId":"65950c557883623234585db6",
         "projectName":"It-Book",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User2-Metapercept",
         "githubEmail":"user2@metapercept.com",
         "githubUserId":"987654321",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2024-01-03T06:09:05.000Z",
         "updatedAt":"2024-01-03T07:56:31.467Z",
         "__v":0,
         "owner":"owner2-metapercept"
      },
      {
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"659513297883623234585db9",
         "projectId":"65950c557883623234585db5",
         "projectName":"QuantumQuill",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User3-Metapercept",
         "githubEmail":"user3@metapercept.com",
         "githubUserId":"135792468",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2024-01-03T05:34:46.000Z",
         "updatedAt":"2024-01-03T07:56:25.394Z",
         "__v":0,
         "owner":"owner3-metapercept"
      },
      {
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"659513327883623234585dbc",
         "projectId":"65950c547883623234585db3",
         "projectName":"SynthWave",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User4-Metapercept",
         "githubEmail":"user4@metapercept.com",
         "githubUserId":"246813579",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2023-09-25T05:15:25.000Z",
         "updatedAt":"2024-01-03T07:56:34.467Z",
         "__v":0,
         "owner":"owner4-metapercept"
      },
      {
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"659513357883623234585dbd",
         "projectId":"65950c527883623234585da7",
         "projectName":"DataDynamo",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User5-Metapercept",
         "githubEmail":"user5@metapercept.com",
         "githubUserId":"369258147",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2023-06-28T12:13:14.000Z",
         "updatedAt":"2024-01-03T07:56:37.837Z",
         "__v":0,
         "owner":"owner5-metapercept"
      },
      {
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"6595132d7883623234585dba",
         "projectId":"65950c567883623234585db8",
         "projectName":"PulseForge",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User6-Metapercept",
         "githubEmail":"user6@metapercept.com",
         "githubUserId":"987654321",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2024-01-03T06:13:10.000Z",
         "updatedAt":"2024-01-03T07:56:29.087Z",
         "__v":0,
         "owner":"owner6-metapercept"
      },
      {
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"6595132f7883623234585dbb",
         "projectId":"65950c557883623234585db6",
         "projectName":"InfinityForge",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User7-Metapercept",
         "githubEmail":"user7@metapercept.com",
         "githubUserId":"123456789",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2024-01-03T06:09:05.000Z",
         "updatedAt":"2024-01-03T07:56:31.467Z",
         "__v":0,
         "owner":"owner7-metapercept"
      },
      {
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"659513297883623234585db9",
         "projectId":"65950c557883623234585db5",
         "projectName":"MysticMinds",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User8-Metapercept",
         "githubEmail":"user8@metapercept.com",
         "githubUserId":"135792468",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2024-01-03T05:34:46.000Z",
         "updatedAt":"2024-01-03T07:56:25.394Z",
         "__v":0,
         "owner":"owner8-metapercept"
      },
      {
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"659513327883623234585dbc",
         "projectId":"65950c547883623234585db3",
         "projectName":"TechTrove",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User9-Metapercept",
         "githubEmail":"user9@metapercept.com",
         "githubUserId":"246813579",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2023-09-25T05:15:25.000Z",
         "updatedAt":"2024-01-03T07:56:34.467Z",
         "__v":0,
         "owner":"owner9-metapercept"
      },
      {
         "userRole":[
            "DocManager",
            "DocPublisher",
            "DocEditor",
            "DocMigration"
         ],
         "_id":"659513357883623234585dbd",
         "projectId":"65950c527883623234585da7",
         "projectName":"NebulaNexus",
         "userId":"6595087f7883623234585d6f",
         "githubUsername":"User10-Metapercept",
         "githubEmail":"user10@metapercept.com",
         "githubUserId":"369258147",
         "acceptInvitation":false,
         "isActive":true,
         "isDeleted":false,
         "createdAt":"2023-06-28T12:13:14.000Z",
         "updatedAt":"2024-01-03T07:56:37.837Z",
         "__v":0,
         "owner":"owner10-metapercept"
      },
            ], // List of user projects
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
