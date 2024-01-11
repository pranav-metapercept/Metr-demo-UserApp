<template>
    <div>
        <!-- Notification card component -->
        <div class="card">
            <div class="custom-notifications d-flex justify-content-between align-items-center flex-wrap">
                <div class="custom-title mb-0">
                    Notifications
                </div>
            </div>
            <div data-simplebar class="card-body border-top py-2 mb-3 ">
                <ul class="list-unstyled activity-wid">

                    <div>
                        <li class="activity-list publication-list-cust-cls" v-for="data in notificationData" :key="data.id">
                            <div class="d-flex justify-content-between">
                                <div class="activity-icon avatar-xs">
                                    <!-- Notification icon -->
                                    <span
                                        class="avatar-title bg-soft-primary text-primary rounded-circle font-size-24 avatar-title-cust-cls">
                                        <i class="ri-price-tag-3-fill"></i>
                                    </span>
                                </div>
                                <div>
                                    <div>
                                        <!-- Project name -->
                                        <h5 class="font-size-13 ptitle-cust-cls">
                                            {{ data.projectName }}
                                        </h5>
                                    </div>
                                    <div>
                                        <!-- Notification message -->
                                        <p class="text-muted mb-0">{{ data.message }}</p>
                                    </div>
                                </div>
                                <div>
                                    <!-- Time ago since notification -->
                                    <p class="text-muted mb-0  font-smaller">{{ getTimeAgo(data.committer.date) }}</p>
                                </div>
                            </div>
                        </li>
                    </div>
                    <!-- Display a message when no notifications are available -->

                </ul>
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
            showSpinner: true,

            notificationData: [
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-03-21T07:04:19Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "created api ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2023-09-20T10:46:14Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "test commit",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-01-04T08:42:51Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "added word ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-03-21T07:04:19Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "created api ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2023-09-20T10:46:14Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "test commit",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-01-04T08:42:51Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "added word ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-03-21T07:04:19Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "created api ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2023-09-20T10:46:14Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "test commit",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-01-04T08:42:51Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "added word ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-03-21T07:04:19Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "created api ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2023-09-20T10:46:14Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "test commit",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-01-04T08:42:51Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "added word ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-03-21T07:04:19Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "created api ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2023-09-20T10:46:14Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "test commit",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-01-04T08:42:51Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "added word ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-03-21T07:04:19Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "created api ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2023-09-20T10:46:14Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "test commit",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-01-04T08:42:51Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "added word ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-03-21T07:04:19Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "created api ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2023-09-20T10:46:14Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "test commit",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-01-04T08:42:51Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "added word ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-03-21T07:04:19Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "created api ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2023-09-20T10:46:14Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "test commit",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-01-04T08:42:51Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "added word ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-03-21T07:04:19Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "created api ",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2023-09-20T10:46:14Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "test commit",
                    "comment_count": 0
                },
                {
                    "committer": {
                        "name": "Jyoti-Metapercept",
                        "email": "jyotikamal.s@metapercept.com",
                        "date": "2024-01-04T08:42:51Z"
                    },
                    "projectName": "DITAxPressoBackend",
                    "message": "added word ",
                    "comment_count": 0
                },
            ]
            , // List of recent notifications
            userProjects: null
        };
    },
    mounted() {
        this.showSpinner = false;

    },

    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },


        // Function to calculate the time ago since a given timestamp
        getTimeAgo(timestamp) {
            const now = new Date();
            const timeDiff = now.getTime() - new Date(timestamp).getTime();
            const minuteDiff = Math.floor(timeDiff / 60000); // 60000 milliseconds in a minute
            if (minuteDiff < 1) {
                return 'just now';
            } else if (minuteDiff < 60) {
                return `${minuteDiff} minute${minuteDiff > 1 ? 's' : ''} ago`;
            } else {
                const hourDiff = Math.floor(minuteDiff / 60);
                if (hourDiff < 24) {
                    return `${hourDiff} hour${hourDiff > 1 ? 's' : ''} ago`;
                } else {
                    const dayDiff = Math.floor(hourDiff / 24);
                    if (dayDiff < 30) {
                        return `${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`;
                    } else {
                        const monthDiff = Math.floor(dayDiff / 30);
                        if (monthDiff < 12) {
                            return `${monthDiff} month${monthDiff > 1 ? 's' : ''} ago`;
                        } else {
                            const yearDiff = Math.floor(monthDiff / 12);
                            return `${yearDiff} year${yearDiff > 1 ? 's' : ''} ago`;
                        }
                    }
                }
            }
        },

    }
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
    height: 85vh;

}

.custom-image {
    height: 200px;
}

.custom-text {
    color: #666;
    font-size: 16px;
}
</style>
