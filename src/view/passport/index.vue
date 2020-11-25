<template>
    <div class="passport">
        <div class="background">
            <img
                class="top"
                src="../../assets/images/passport/round-t.png"
                alt=""
            >
            <img
                class="right"
                src="../../assets/images/passport/round-r.png"
                alt=""
            >
            <img
                class="bottom"
                src="../../assets/images/passport/round-l.png"
                alt=""
            >
            <img
                class="left"
                src="../../assets/images/passport/round-b.png"
                alt=""
            >
        </div>
        <div class="content">
            <div class="logo">
                <!--<img src="../../assets/images/passport/logo.png" alt="">-->
            </div>
            <router-view />
        </div>
    </div>
</template>
<script>
import './index.less';

export default {};
</script>
