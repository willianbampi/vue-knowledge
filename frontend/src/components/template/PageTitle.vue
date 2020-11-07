<template>
    <div class="page-title">
        <h1><i v-if="icon" :class="icon"></i> {{ title }}</h1>
        <h2>{{ description }}</h2>
        <hr>
    </div>
</template>

<script>
    export default {
        name: 'PageTitle',
        props: ['icon', 'title', 'description']
    }
</script>

<style>
    .page-title h1 {
        margin: 0px;
        color: #4f5D73;
    }

    .page-title h2 {
        color: #777;
        margin-top: 5px;
        font-size: 1.3rem;
    }
</style>