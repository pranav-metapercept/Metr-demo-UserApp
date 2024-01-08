<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
import appConfig from "@/app.config";
export default {
    name: "app",
    page: {
        titleTemplate(title) {
            title = typeof title === "function" ? title(this.$store) : title;
            return title ? `${title} | ${appConfig.title}` : appConfig.title;
        }
    },
   
    methods: {
        messageToast(messageToastTitle, messageToastVariant, messageToastContent) {
            this.$bvToast.toast(messageToastContent, {
                title: messageToastTitle,
                variant: messageToastVariant,
                solid: true,
            });
        },
    }
};
</script>
<style>
.position-reletive {
    position: relative;
}

.cmh-icon {
    color: #ffffff;
    font-size: 30px;
    margin-right: 5px;
}

.card-header {
    height: 7vh;
    display: flex;
    align-items: center;
}

.text-center {
    text-align: center;
}

.view-detail {
    background: unset !important;
    font-size: 12px;
    border: none !important;
    color: #117C5C !important;
    font-weight: bold;
}

.inputbox {
    display: flex;
    flex-direction: column;
}

.input {
    padding: 6px 8px;
    border-radius: 3px;
    border: 1px solid rgb(193, 189, 189);
}

.text-truncate {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-icons-btn {
    background: none;
    border: none;
    font-size: 16px;
}

.card-icons-btn:nth-child(1) {
    color: #5864D2;
}

.iconBox {
    text-align: right;
}

.card-icons-btn:nth-child(2) {
    color: red;
}

.card-body {
    position: relative;
}

.Card-img {
    width: 80px;
}

.Card-img img {
    width: 100%;
}

.title {
    font-weight: 500;
    font-size: 15px;
}</style>
