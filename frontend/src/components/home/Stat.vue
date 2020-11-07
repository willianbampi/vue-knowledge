<template>
    <div class="stat">
        <div class="stat-icon">
            <i :class="icon" :style="style"></i>
        </div>
        <div class="stat-info">
            <span class="stat-title">{{ title }}</span>
            <span class="stat-value">{{ value }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Stat',
        props: ['title', 'value', 'icon', 'color'],
        computed: {
            style() {
                return "color: " + (this.color || "#4f5D73")
            }
        }
    }
</script>

<style>
    .stat {
        flex: 1;
        display: flex;
        border-radius: 8px;
        margin: 0px 20px 20px 0px;
        background-color: #FFF;
        color: #4f5D73;
        box-shadow: 0px 1px 5px rgba(79, 93, 115, 0.2);
        padding: 20px;
    }

    .stat-icon {
        display: flex;
        align-items: center;
    }

    .stat-icon i {
        font-size: 5rem;
    }

    .stat-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .stat-title {
        font-size: 1.2rem;
    }

    .stat-value {
        font-size: 3rem;
    }
</style>