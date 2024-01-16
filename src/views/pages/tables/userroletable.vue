<template>
    <div>
        <PageHeader :icon="'ri-dashboard-line h3'" :title="title" :items="items" />
        <!-- Main Card -->
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <!-- Filter and Per Page Options -->
                        <div class="row mt-4">
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_length" class="dataTables_length">
                                    <label class="d-inline-flex align-items-center">
                                        Show&nbsp;
                                        <b-form-select v-model="perPage" size="sm"
                                            :options="pageOptions"></b-form-select>&nbsp;entries
                                    </label>
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6">
                                <div id="tickets-table_filter" class="dataTables_filter text-md-right">
                                    <label class="d-inline-flex align-items-center">
                                        Search:
                                        <b-form-input v-model="filter" type="search" placeholder="Search Name..."
                                            class="form-control form-control-sm ml-2"></b-form-input>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <!-- Data Table -->
                        <div class="table-responsive mb-0">
                            <b-table :items="activityData" :fields="colfields" responsive="sm" :per-page="perPage"
                                :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                                :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered"
                                :filter-function="filterTable" ref="adminTable" show-empty>
                                <!-- Custom cell rendering for createdAt -->
                                <template #cell(createdAt)="row">
                                    {{ moment(row.item.createdAt).format("YYYY-MM-DD") }}
                                </template>
                                <!-- Custom cell rendering for userRole -->
                                <template #cell(userRole)="row">
                                    {{ formatUserRoles(row.item.userRole) }}
                                </template>
                            </b-table>
                        </div>
                        <!-- Pagination and Total Rows Count -->
                        <div class="row">
                            <div
                                class="dataTables_paginate paging_simple_numbers col justify-content-center row-count-cust-cls">
                                <ul class="pagination pagination-rounded mb-0">
                                    <span class="py-2"> Total Rows: {{ this.activityData.length }}</span>
                                </ul>
                            </div>
                            <div class="row-pagination-cust-cls">
                                <ul class="pagination-rounded mb-0">
                                    <!-- pagination -->
                                    <b-pagination v-model="currentPage" :total-rows="rows"
                                        :per-page="perPage"></b-pagination>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import _ from "lodash";
export default {
    data() {
        return {
            activityData: [
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
            ],
            userId: this.$store.state.Auth.userId,
            userRoleMap: {
                DocManager: 'DocManager',
                DocPublisher: 'DocPublisher',
                DocEditor: 'DocEditor',
                DocMigration: 'DocMigration',
            },
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 25, 50, 100],
            filter: null,
            filterOn: [],
            sortBy: "",
            sortDesc: true,
            colfields: this.generateTableColumns(),
            title: "User Role ",
            items: [{
                text: "Dashboard",
                href: `/dashboard`,
            },
            {
                text: "User Role",
                active: true
            }
            ],

        };
    },
    computed: {
        rows() {
            return this.activityData.length;
        },
        _() {
            return _;
        },
    },

    methods: {
        moment,
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        generateTableColumns() {
            return [{
                key: "projectName",
                label: "Project Name",
                sortable: false
            },
            {
                key: "userRole",
                label: "User role",
                sortable: false,
                formatter: (value, key, item) => {
                    return this.formatUserRoles(item.userRole);
                }
            },
            {
                key: "createdAt",
                label: "Created At",
                sortable: false
            },
            ];
        },
        // This method is use to generate error or success message
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
        formatUserRoles(userRoles) {
            return userRoles.map(role => this.userRoleMap[role]).join(', ');
        },
        getProjectsWithUserRole() {
            this.$store.getters.client
                .get(`/projectuser/byuserid?userId=${this.userId}`)
                .then((response) => {
                    if (response.data) {
                        console.log(response.data);
                        this.activityData = response.data;
                        this.$store.commit('setProjectsData', response.data);
                    } else {
                        this.messageToast("Invalid request", "danger", "No data received from the server");
                    }
                })
                .catch((err) => {
                    this.messageToast("Invalid request", "danger", err.response ? err.response.data.message : "An error occurred");
                    this.showSpinner = false;
                });
        },
        filterTable(row, filter) {
            const filterUpperCase = filter.toUpperCase();
            const hasNameMatch = row.projectName.toUpperCase().startsWith(filterUpperCase);
            return hasNameMatch;
        },
    },
};
</script>
<style>
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
    .row-count-cust-cls {
        /* float: right !important; */
        margin-bottom: 10px;
    }

    .row-pagination-cust-cls {
        margin-top: 20px;
    }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
    .row-count-cust-cls ul {
        /* float: right !important; */
        margin-bottom: 10px;
        text-align: left !important;
    }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {}
</style>
