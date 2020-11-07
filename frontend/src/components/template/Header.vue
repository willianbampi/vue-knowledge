<template>
    <header class="header">
        <a class="toggle" @click="toggleMenu" v-if="!hiddeToggle">
            <i class="fa fa-bars" :class="icon"></i>
        </a>
        <h1 class="title">
            <router-link to="/">{{ title }}</router-link>
        </h1>
        <UserDropdown v-if="!hideUserDropdown"></UserDropdown>
    </header>
</template>

<script>

    import UserDropdown from './UserDropdown'

    export default {
        name: 'Header',
        components: { UserDropdown },
        props: {
            title: String,
            hiddeToggle: Boolean,
            hideUserDropdown: Boolean
        },
        computed: {
            icon() {
                return this.$store.state.isMenuVisible ? "fa fa-bars" : "fa fa-bars"
            }
        },
        methods: {
            toggleMenu() {
                this.$store.commit('toggleMenu')
            }
        }
    }
</script>

<style>
    .header {
        grid-area: header;
        background-color: #C75C5C;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title {
        font-size: 1.2rem;
        color: #DDD;
        font-weight: 100;
        flex-grow: 1;
        text-align: center;
    }

    .title a {
        color: #DDD;
        text-decoration: none;
    }

    header.header a.toggle {
        width: 60px;
        height: 100%;
        color: #DDD;
        justify-self: flex-start;
        text-decoration: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    header.header a.toggle:hover {
        color: #DDD;
        background-color: rgba(79, 93, 115, 0.2);
    }

    .title a:hover {
        color: #DDD;
        text-decoration: none;
    }

</style>